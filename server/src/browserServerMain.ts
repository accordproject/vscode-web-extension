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
import { InitializedParams, InitializeParams, InitializeResult, ServerCapabilities, TextDocumentChangeEvent, TextDocumentSyncKind } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { GLOBAL_STATE, log } from './state';
import { handleConcertoDocumentChange } from './documents/concertoHandler';
import { loadModels, registerCommandHandlers } from './commands/commandHandler';

/**
 * Called when the language server is initialized
 */
if(GLOBAL_STATE.connection) {
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
		log('Initializing...');

		// Track open, change and close text document events
		if (GLOBAL_STATE.connection) {
			GLOBAL_STATE.documents.listen(GLOBAL_STATE.connection);
			log('Listening for document changes.');
		}

		// register RPC command handlers, so the client can trigger actions
		// within the language server process
		registerCommandHandlers(GLOBAL_STATE);
		log('Listening for client commands.');

		GLOBAL_STATE.isLoading = true;
		try {
			await loadModels();
			log('Loaded workspace models.');
		}
		finally {
			GLOBAL_STATE.isLoading = false;
			log('Initialized.');
		}
	});
}	

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
GLOBAL_STATE.documents.onDidChangeContent(handleDocumentChange);

/**
 * Register to receive notifications when watched files change
 */
// GLOBAL_STATE.connection.onDidChangeWatchedFiles(handleWatchedFiles);

log('Language Server listening.');
GLOBAL_STATE.connection?.listen();
