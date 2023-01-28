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
import { TextDocumentChangeEvent } from 'vscode-languageserver';
import { LanguageServerState, FileType, ReadDirectoryRecursiveResponse } from '../types';
import { concertoCompileToTarget, concertoCompileTargets } from './concertoCompile';
import { InMemoryWriter } from '@accordproject/concerto-util';
import { URI } from 'vscode-uri';
import { handleConcertoDocumentChange } from '../documents/concertoHandler';
import { TextDocument } from 'vscode-languageserver-textdocument';

export async function loadModels() {
	const folders = await GLOBAL_STATE.connection.workspace.getWorkspaceFolders();
	log(`Read workspace folders: ${folders !== null ? folders.length : 'null'}`);
	if (folders) {
		for (let n = 0; n < folders.length; n++) {
			const folder = folders[n];
			const uri = URI.parse(folder.uri);
			const readDirectoryResponse: ReadDirectoryRecursiveResponse[] =
				await GLOBAL_STATE.connection.sendRequest("vfs/readDirectoryRecursive",
					{ path: `${uri.scheme}://${uri.authority}/` });
			log(`Got ${readDirectoryResponse.length} files`);
			for (let i = 0; i < readDirectoryResponse.length; i++) {
				const res = readDirectoryResponse[i];
				if (res.type === FileType.File && res.path.endsWith('.cto')) {
					log(`Requesting client read ${res.path}`);
					await GLOBAL_STATE.connection.sendRequest("vfs/openFile", { path: res.path });
				}
			}
		}
	}

	// we are done opening documents - let's process all the documents
	// to rebuild our global state
	GLOBAL_STATE.documents.all().forEach(async document => {
		const change: TextDocumentChangeEvent<TextDocument> = { document };
		handleConcertoDocumentChange(GLOBAL_STATE, change);
	});
}

export async function registerCommandHandlers(state:LanguageServerState) {
	state.connection.onRequest('concertoCompile', (event:any) => concertoCompileToTarget(GLOBAL_STATE, event));
	state.connection.onRequest('concertoCompileTargets', (event:any) => concertoCompileTargets());
	state.connection.onRequest('loadModels', (event:any) => loadModels());
}

export async function saveInMemoryWriter(state:LanguageServerState, path:string, imw:InMemoryWriter) {
	const enc = new TextEncoder();
	const keys:string[] = [...imw.getFilesInMemory().keys()];
	const values:string[] = [...imw.getFilesInMemory().values()];
	for(let n=0; n < keys.length; n++) {
		log(`Saving file ${path}/${keys[n]}`);
		const bytes = Array.from(enc.encode(values[n]));
		await state.connection.sendRequest("vfs/writeFile", {path: `${path}/${keys[n]}`, content:bytes});
	}
}