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

import * as path from 'path-browserify';
import { URI } from 'vscode-uri';

import { Parser } from '@accordproject/concerto-cto';
import { DiagnosticSeverity, TextDocumentChangeEvent } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { LanguageServerState } from '../types';
import { log } from '../state';
// import { concertoCompileToTarget } from '../commands/concertoCompile';

/**
 * Gets the root file path for a template, by walking up the directory hierarchy 
 * looking for a package.json file that contains the 'accordproject' key. 
 */
export async function findTemplateRoot(state:LanguageServerState, uri:URI) : Promise<URI|null> {
	const paths = path.dirname(uri.path).split('/');
	for(let n=paths.length; n>=0; n--) {
		const curPath = paths.slice(0,n).join('/');
		const rootPath = `${uri.scheme}://${uri.authority}/${curPath}`;
		const packageJson = `${rootPath}/package.json`;
		const exists = await state.connection.sendRequest('vfs/exists', {path: packageJson});
		if(exists) {
			const fileContents:string = await state.connection.sendRequest('vfs/readFile', {path: packageJson});
			try {
				const json = JSON.parse(fileContents);
				if(json.accordproject) {
					return URI.parse(rootPath);
				}
			}
			catch(error) {
				// ignore
			}
		}
	}
	return null;
}

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
				// const root = await findTemplateRoot(state,  URI.parse(change.document.uri));
				// if(root) {
				// 	log(JSON.stringify(root));
				// 	const tsOutput = root.with({path: `${root.path}/logic`});
				// 	await concertoCompileToTarget(state, {uri: tsOutput, target: 'typescript'});
				// 	log('Converted template model to Typescript');
				// }
				// else {
				// 	log('Did not convert model to Typescript (outside project folder)');
				// }
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