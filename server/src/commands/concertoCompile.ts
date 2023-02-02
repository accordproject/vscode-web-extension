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

import { CodeGen } from '@accordproject/concerto-tools';
import { InMemoryWriter } from '@accordproject/concerto-util';
import { Utils, URI } from 'vscode-uri';

import { log } from '../state';
import { LanguageServerState } from '../types';
import { saveInMemoryWriter } from './commandHandler';

export async function concertoCompileToTarget(state: LanguageServerState, event: any) {
	try {
		const visitorClass = (CodeGen.formats as any)[event.target];
		if (visitorClass) {
			const visitor = new visitorClass();
			const imw = new InMemoryWriter();
			const parameters = {
				fileWriter: imw,
				showCompositionRelationships: true,
				hideBaseModel: true,
			} as any;
			state.modelManager.accept(visitor, parameters);
			const uri = URI.parse(event.uri);
			log(`Compiling CTO file ${uri.toString()}`);
			const dir = Utils.dirname(uri);
			const output = Utils.joinPath(dir, `/output/${event.target}`);
			await saveInMemoryWriter(state, output.toString(), imw);
			return `Saved ${event.target} model to ${output}`;
		}
		else {
			log(`Invalid compilation target ${event.target} to compile model`);
		}
	} catch (e) {
		const ee = (e as Error);
		const stack = ee.stack ? ee.stack : 'missing';
		log(`Failed to compile models to ${event.target} with error ${e} at ${stack}`);
	}
}

export async function concertoCompileTargets() {
	return Object.keys(CodeGen.formats).sort();
}
