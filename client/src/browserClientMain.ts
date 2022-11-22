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

import * as vscode from 'vscode';
import { LanguageClientOptions } from 'vscode-languageclient';

import { LanguageClient } from 'vscode-languageclient/browser';
import { initVFS } from './VirtualFileSystem';

import { log } from './output';

// this method is called when vs code is activated
export async function activate(context: vscode.ExtensionContext) {

	log('Accord Project Extension activated');

	/* 
	 * all except the code to create the language client in not browser specific
	 * and could be shared with a regular (Node) extension
	 */
	const documentSelector = [{ language: 'concerto' }];

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		documentSelector,
		synchronize: {
			// fileEvents: vscode.workspace.createFileSystemWatcher('**/*.cto')
		},
		initializationOptions: {}
	};

	const client = createWorkerLanguageClient(context, clientOptions);

	const disposable = client.start();
	context.subscriptions.push(disposable);

	await client.onReady();
	log('Accord Project client is ready');

	// initialize client-side handlers that
	// expose the workspace.fs filesystem to the language
	// server over RPC - allowing the language server process
	// to query the workspace from within its process
	initVFS(client);
}

function createWorkerLanguageClient(context: vscode.ExtensionContext, clientOptions: LanguageClientOptions) {
	// Create a worker. The worker main file implements the language server.
	const serverMain = vscode.Uri.joinPath(context.extensionUri, 'server/dist/browserServerMain.js');
	const worker = new Worker(serverMain.toString(true));

	// create the language server client to communicate with the server running in the worker
	return new LanguageClient('cicero-vscode-extension', 'Accord Project - Server', clientOptions, worker);
}
