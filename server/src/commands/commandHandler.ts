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

import { GLOBAL_STATE, log } from '../state';
import { Location, TextDocumentChangeEvent } from 'vscode-languageserver';
import { LanguageServerState, FileType, ReadDirectoryRecursiveResponse } from '../types';
import { concertoCompileToTarget, concertoCompileTargets } from './concertoCompile';
import { InMemoryWriter } from '@accordproject/concerto-util';
import { URI } from 'vscode-uri';
import { handleConcertoDocumentChange } from '../documents/concertoHandler';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { generateContent } from '../copilot/llm/llmManager';
import { getReferences } from './references';
import { onRenameRequest } from './rename';
import { onCodeAction } from './codeaction';

/**
 * This method is used by the language server to request that the language client
 * load all the project files that we care about. It uses an RPF call from the 
 * server to the client, because there is no file system access possible in the server,
 * as the server supports running as a web-extension. Once the client loads the files
 * then changes will be tracked via the GLOBAL_STATE.documents collection, which is
 * automatically synced from the client to the server when documents are created or updated.
 */
export async function loadProjectFiles(fileExtensions:string[]) {
	GLOBAL_STATE.modelManager.clearModelFiles();
	GLOBAL_STATE.vocabularyManager.clear();
	if (GLOBAL_STATE.connection) {
		const folders = await GLOBAL_STATE.connection.workspace.getWorkspaceFolders();
		log(`Read workspace folders: ${folders !== null ? folders.length : 'null'}`);
		if (folders) {
			for (let n = 0; n < folders.length; n++) {
				const folder = folders[n];
				const uri = URI.parse(folder.uri);
				log(`Folder URI: ${JSON.stringify(uri)}`);
				const readDirectoryResponse: ReadDirectoryRecursiveResponse[] =
					await GLOBAL_STATE.connection.sendRequest("vfs/readDirectoryRecursive",
						{ path: uri.toString() });
				log(`Got ${readDirectoryResponse.length} files`);
				for (let i = 0; i < readDirectoryResponse.length; i++) {
					const res = readDirectoryResponse[i];
					if (res.type === FileType.File) {
						const lastDot = res.path.lastIndexOf('.');
						if(lastDot >= 0 && fileExtensions.includes(res.path.substring(lastDot))) {
							log(`Requesting client read ${res.path}`);
							// request that the client open the file
							// which will cause the handleConcertoDocumentChange handler to fire
							await GLOBAL_STATE.connection.sendRequest("vfs/openFile", { path: res.path });	
						}
					}
				}
			}
		}

		// we are done opening documents - let's process all the documents
		// to rebuild our global state
		log(`Document count: ${GLOBAL_STATE.documents.all().length}`);
		GLOBAL_STATE.documents.all().forEach(async document => {
			const change: TextDocumentChangeEvent<TextDocument> = { document };
			await handleConcertoDocumentChange(GLOBAL_STATE, change);
		});
	} else {
		log('GLOBAL_STATE.connection is null');
	}
}

export async function registerCommandHandlers(state: LanguageServerState) {
	if (state.connection) {
		state.connection.onCodeAction((params) => onCodeAction(GLOBAL_STATE, params));		
		state.connection.onRenameRequest((params) => onRenameRequest(GLOBAL_STATE, params));
		state.connection.onReferences((params) => getReferences(GLOBAL_STATE, params));
		state.connection.onRequest('concertoCompile', (event: any) => concertoCompileToTarget(GLOBAL_STATE, event));
		state.connection.onRequest('concertoCompileTargets', (event: any) => concertoCompileTargets());
		state.connection.onRequest('loadProjectFiles', (event: any) => loadProjectFiles(['.cto','.voc']));
		// Register a new command handler for generateContent
		state.connection.onRequest('generateContent', async (params: any) => {
			const { modelConfig, documents, promptConfig } = params;
			return generateContent(modelConfig, documents, promptConfig);
		});
	} else {
		log('state.connection is null');
	}
}

export async function saveInMemoryWriter(state: LanguageServerState, path: string, imw: InMemoryWriter) {
	if (state.connection) {
		const enc = new TextEncoder();
		const keys: string[] = [...imw.getFilesInMemory().keys()];
		const values: string[] = [...imw.getFilesInMemory().values()];
		for (let n = 0; n < keys.length; n++) {
			log(`Saving file ${path}/${keys[n]}`);
			const bytes = Array.from(enc.encode(values[n]));
			await state.connection.sendRequest("vfs/writeFile", { path: `${path}/${keys[n]}`, content: bytes });
		}
	} else {
		log('state.connection is null');
	}
}