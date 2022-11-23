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

import { Parser } from '@accordproject/concerto-cto';
import { DiagnosticSeverity, TextDocumentChangeEvent } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { LanguageServerState } from '../types';
import { log } from '../state';

/**
 * Handles changes to Concerto documents
 * @param change the document change event
 */
export async function handleConcertoDocumentChange(state:LanguageServerState, change:TextDocumentChangeEvent<TextDocument>) {
	if(change.document.uri.endsWith('.cto')) {
		const modelText = change.document.getText();
		try {
			state.diagnostics.clearErrors(change.document.uri, 'model');
			const ast: any = Parser.parse(modelText, change.document.uri);
	
			if (state.modelManager.getModelFile(ast.namespace)) {
				state.modelManager.updateModelFile(modelText, change.document.uri, true);
				log(`Updated namespace: ${ast.namespace}`);
			}
			else {
				state.modelManager.addCTOModel(modelText, change.document.uri, true);
				log(`Added namespace: ${ast.namespace}`);
			}
			try {
				await state.modelManager.updateExternalModels();
				log(`Models are valid with changes to ${change.document.uri}`);
			}
			catch (error: any) {
				if(!state.isLoading) {
					// we may be offline? Validate without external models
					state.modelManager.validateModelFiles();
					state.diagnostics.pushDiagnostic(DiagnosticSeverity.Warning, change.document, error, 'model');
				}
				else {
					log(`Ignored model validation error while initializing ${change.document.uri}`);
				}
			}
		}
		catch (error: any) {
			if(!state.isLoading) {
				state.diagnostics.pushDiagnostic(DiagnosticSeverity.Error, change.document, error, 'model');	
			}
			else {
				log(`Ignored model validation error while initializing ${change.document.uri}`);
			}
		}
	
		state.diagnostics.send(state.connection);
	}
}