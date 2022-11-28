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
import { LanguageServerState } from '../types';
import { concertoCompileToTarget } from './concertoCompile';
import { InMemoryWriter } from '@accordproject/concerto-util';

export async function registerCommandHandlers(state:LanguageServerState) {
	state.connection.onRequest('concertoCompile', (event:any) => concertoCompileToTarget(GLOBAL_STATE, event));
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