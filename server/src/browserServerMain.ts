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
import { createConnection, BrowserMessageReader, BrowserMessageWriter } from 'vscode-languageserver/browser';
import { DiagnosticSeverity, InitializedParams, InitializeParams, InitializeResult, ServerCapabilities, TextDocumentChangeEvent, TextDocuments, TextDocumentSyncKind } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { URI } from 'vscode-uri';

import { ModelManager } from '@accordproject/concerto-core';
import { Parser } from '@accordproject/concerto-cto';
import { FileType, LanguageServerState, ReadDirectoryRecursiveResponse } from './types';
import { Diagnostics } from './diagnostics';

/* browser specific setup code */
const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

/**
 * Globals maintained by the language server
 */
const GLOBAL_STATE:LanguageServerState = {
	modelManager: new ModelManager({strict: true}),
	diagnostics: new Diagnostics(),
	connection: createConnection(messageReader, messageWriter),
	isLoading: false
};

/**
 * Log a message to the connection, sending it back to the
 * Language Server Client, for display in an output window.
 * @param message 
 */
function log(message:string) {
	if(GLOBAL_STATE.connection) {
		GLOBAL_STATE.connection.console.log(message);
	}
	else {
		console.log(message);
	}
}

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
 GLOBAL_STATE.connection.onInitialized( async (params:InitializedParams) => {
	log('Initialized.');
	GLOBAL_STATE.isLoading = true;
	try {
		const folders = await GLOBAL_STATE.connection.workspace.getWorkspaceFolders();
		log(`Read workspace folders: ${folders !== null ? folders.length : 'null'}`);
		if(folders) {
			for(let n=0; n < folders.length; n++) {
				const folder = folders[n];
				const uri = URI.parse(folder.uri);
				const readDirectoryResponse:ReadDirectoryRecursiveResponse[] = 
					await GLOBAL_STATE.connection.sendRequest("vfs/readDirectoryRecursive", 
						{path: `${uri.scheme}://${uri.authority}/`});
				for(let i=0; i < readDirectoryResponse.length; i++) {
					const res = readDirectoryResponse[i];
					if(res.type === FileType.File && res.path.endsWith('.cto')) {
						await GLOBAL_STATE.connection.sendRequest("vfs/openFile", {path: res.path});
					}
				}
			}
		}
	}
	finally {
		GLOBAL_STATE.isLoading = false;
		// we are done opening documents - let's process all the documents
		// to rebuild our global state
		documents.all().forEach( async document => {
			const change:TextDocumentChangeEvent<TextDocument> = {document};
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
async function handleDocumentChange(change:TextDocumentChangeEvent<TextDocument>) {
	log(`Document changed: ${change.document.uri}`);
	const modelText = change.document.getText();
	try {
		GLOBAL_STATE.diagnostics.clearErrors(change.document.uri, 'model');
		const ast: any = Parser.parse(modelText, change.document.uri);

		if (GLOBAL_STATE.modelManager.getModelFile(ast.namespace)) {
			GLOBAL_STATE.modelManager.updateModelFile(modelText, change.document.uri, true);
			log(`Updated namespace: ${ast.namespace}`);
		}
		else {
			GLOBAL_STATE.modelManager.addCTOModel(modelText, change.document.uri, true);
			log(`Added namespace: ${ast.namespace}`);
		}
		try {
			await GLOBAL_STATE.modelManager.updateExternalModels();
			log(`Models are valid with changes to ${change.document.uri}`);
		}
		catch (error: any) {
			if(!GLOBAL_STATE.isLoading) {
				// we may be offline? Validate without external models
				GLOBAL_STATE.modelManager.validateModelFiles();
				GLOBAL_STATE.diagnostics.pushDiagnostic(DiagnosticSeverity.Warning, change.document, error, 'model');
			}
			else {
				log(`Ignored model validation error while initializing ${change.document.uri}`);
			}
		}
	}
	catch (error: any) {
		if(!GLOBAL_STATE.isLoading) {
			GLOBAL_STATE.diagnostics.pushDiagnostic(DiagnosticSeverity.Error, change.document, error, 'model');	
		}
		else {
			log(`Ignored model validation error while initializing ${change.document.uri}`);
		}
	}

	GLOBAL_STATE.diagnostics.send(GLOBAL_STATE.connection);
}

/**
 * Register our handler for when a document is opened or edited
 */
documents.onDidChangeContent(handleDocumentChange);

log('Language Server listening...');
GLOBAL_STATE.connection.listen();