/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
import { InitializedParams, InitializeParams, InitializeResult, ServerCapabilities, TextDocumentChangeEvent, TextDocuments, TextDocumentSyncKind } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { URI } from 'vscode-uri';

import { FileType, ReadDirectoryRecursiveResponse } from './types';
import { GLOBAL_STATE, log } from './state';
import { handleConcertoDocumentChange } from './documents/concertoHandler';
import { registerCommandHandlers } from './commands/commandHandler';

/**
 * Called when the language server is initialized
 */
GLOBAL_STATE.connection.onInitialize((params: InitializeParams): InitializeResult => {

	// Set the process.browser variable so that the Concerto logger 
	// doesn't try to create log files
	(process as any).browser = true;

	// requests that the full contents of opened or modified documents is
	// sent to the language server process, rather than just URIs or diffs
	const serverCapabilities: ServerCapabilities = {
		textDocumentSync: {
			openClose: true,
			change: TextDocumentSyncKind.Full,
			save: true
		},
	};
	return { capabilities: serverCapabilities };
});

/**
 * Called when the extension has been initialized.
 * Requests that the extension client loads all CTO files.
 * The will trigger a call to onDidChangeContent
 * which will populate the model manager.
 */
GLOBAL_STATE.connection.onInitialized(async (params: InitializedParams) => {
	log('Initialized.');
	GLOBAL_STATE.isLoading = true;
	try {
		const folders = await GLOBAL_STATE.connection.workspace.getWorkspaceFolders();
		log(`Read workspace folders: ${folders !== null ? folders.length : 'null'}`);
		if (folders) {
			for (let n = 0; n < folders.length; n++) {
				const folder = folders[n];
				const uri = URI.parse(folder.uri);
				const readDirectoryResponse: ReadDirectoryRecursiveResponse[] =
					await GLOBAL_STATE.connection.sendRequest("vfs/readDirectoryRecursive",
						{ path: `${uri.scheme}://${uri.authority}/` });
				for (let i = 0; i < readDirectoryResponse.length; i++) {
					const res = readDirectoryResponse[i];
					if (res.type === FileType.File && res.path.endsWith('.cto')) {
						await GLOBAL_STATE.connection.sendRequest("vfs/openFile", { path: res.path });
					}
				}
			}
		}
	}
	finally {
		GLOBAL_STATE.isLoading = false;
		// register RPC command handlers, so the client can trigger actions
		// within the language server process
		registerCommandHandlers(GLOBAL_STATE);

		// we are done opening documents - let's process all the documents
		// to rebuild our global state
		documents.all().forEach(async document => {
			const change: TextDocumentChangeEvent<TextDocument> = { document };
			handleDocumentChange(change);
		});
	}
});

// Track open, change and close text document events
const documents = new TextDocuments(TextDocument);
log('Language Server registered for document changes.');
documents.listen(GLOBAL_STATE.connection);

/**
 * Handles changes to documents
 * @param change the document change event
 */
async function handleDocumentChange(change: TextDocumentChangeEvent<TextDocument>) {
	log(`Document changed: ${change.document.uri}`);
	await handleConcertoDocumentChange(GLOBAL_STATE, change);
}

/**
 * Handles changes to watched files
 * @param change the file change event
 */
//  async function handleWatchedFiles(change: DidChangeWatchedFilesParams) {
// 	change.changes.forEach( async fileEvent => {
// 		let file:string|undefined = undefined;
// 		if( fileEvent.type === FileChangeType.Created || FileChangeType.Changed ) {
// 			file = await GLOBAL_STATE.connection.sendRequest('vfs/readFile', {path: fileEvent.uri}); 
// 		}
// 		await handleWatchedFileChange(GLOBAL_STATE, fileEvent.type, fileEvent.uri, file);
// 	});
// }

/**
 * Register our handler for when a document is opened or edited
 */
documents.onDidChangeContent(handleDocumentChange);

/**
 * Register to receive notifications when watched files change
 */
// GLOBAL_STATE.connection.onDidChangeWatchedFiles(handleWatchedFiles);

log('Language Server listening...');
GLOBAL_STATE.connection.listen();