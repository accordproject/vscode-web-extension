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

import { DiagnosticSeverity, FileChangeType } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import * as ts from 'typescript';
import { LanguageServerState } from '../types';
import { log } from '../state';
import { typecheck } from '../compiler/typescheck';

function compileTypeScript(filename: string, source: string) {
	try {
		typecheck(source);
	}
	catch(err:any) {
		log(err.message);
	}
}

/**
 * Handles changes to watched files
 * @param change the document change event
 */
export async function handleWatchedFileChange(state: LanguageServerState, type: FileChangeType, uri: string, content?: string) {
	
	if(uri.endsWith('.ts') && content) {
		compileTypeScript(uri, content);
		return;
	}
	
	if (uri.endsWith('.ts') && state.scriptManager) {
		try {
			state.diagnostics.clearErrors(uri, 'logic');
			const scriptManager = state.scriptManager;
			switch (type) {
				case FileChangeType.Changed:
				case FileChangeType.Created: {
					if (content) {
						compileTypeScript(uri, content);
						const jsCode = content;
						const script = scriptManager.createScript(uri, '.js', jsCode);
						const existing = scriptManager.getScript(uri);
						if (existing) {
							scriptManager.updateScript(script);
						}
						else {
							scriptManager.addScript(script);
						}
					}
				}
					break;
				case FileChangeType.Deleted: {
					const existing = scriptManager.getScript(uri);
					if (existing) {
						scriptManager.deleteScript(uri);
					}
				}
					break;
			}
			log(scriptManager.getCombinedScripts());
			log('Logical.');
		}
		catch (error: any) {
			state.diagnostics.pushDiagnostic(DiagnosticSeverity.Error, { uri } as TextDocument, error, 'ergo');
		}
		state.diagnostics.send(state.connection);
	}
}