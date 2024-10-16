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
import * as YAML from 'yaml';

import { Parser } from '@accordproject/concerto-cto';
import { Vocabulary } from '@accordproject/concerto-vocabulary';

import { DiagnosticSeverity, TextDocumentChangeEvent } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { LanguageServerState } from '../types';
import { log } from '../state';

/**
 * Gets the root file path for a template, by walking up the directory hierarchy 
 * looking for a package.json file that contains the 'accordproject' key. 
 */
export async function findTemplateRoot(state: LanguageServerState, uri: URI): Promise<URI | null> {
	const paths = path.dirname(uri.path).split('/');
	for (let n = paths.length; n >= 0; n--) {
		const curPath = paths.slice(0, n).join('/');
		const rootPath = `${uri.scheme}://${uri.authority}/${curPath}`;
		const packageJson = `${rootPath}/package.json`;
		if (state.connection) {
			const exists = await state.connection.sendRequest('vfs/exists', { path: packageJson });
			if (exists) {
				const fileContents: string = await state.connection.sendRequest('vfs/readFile', { path: packageJson });
				try {
					const json = JSON.parse(fileContents);
					if (json.accordproject) {
						return URI.parse(rootPath);
					}
				}
				catch (error) {
					// ignore
				}
			}
		}
	}
	return null;
}

export function getFileForVocabulary(state: LanguageServerState, namespace: string, locale: string) {
	return state.documents.all().find(doc => {
		if (doc.uri.endsWith('.voc')) {
			const vocText = doc.getText();
			try {
				const voc = new Vocabulary(state.vocabularyManager, YAML.parse(vocText));
				return voc.getNamespace() === namespace && voc.getLocale() === locale;
			}
			catch (err) {
				return false;
			}
		}
		else {
			return false;
		}
	})
}

/**
 * Handles changes to Concerto documents
 * @param change the document change event
 */
export async function handleConcertoDocumentChange(state: LanguageServerState, change: TextDocumentChangeEvent<TextDocument>) {
	if (change.document.uri.endsWith('.cto')) {
		log(`CTO document changed: ${change.document.uri}`);
		const modelText = change.document.getText();
		try {
			state.diagnostics.clearErrors(change.document.uri, 'model');
			log(`Parsing uri: ${change.document.uri}`);
			const ast: any = Parser.parse(modelText, change.document.uri);

			if (state.modelManager.getModelFile(ast.namespace)) {
				state.modelManager.updateModelFile(modelText, change.document.uri, true);
				log(`Updated namespace: ${ast.namespace}`);
			}
			else {
				state.modelManager.addCTOModel(modelText, change.document.uri, true);
				// BUG - this fails to detect when we have edited the namespace within a cto file
				// - it will add the new version of the cto file to the model manager, but keep the old
				// namespace version around, even though there is no longer a file in the workspace that
				// represents that file. The way to recover is to force a "reload project files" which will
				// clear and then rebuild the model manager from the files in the workspace
				log(`Added namespace: ${ast.namespace}`);
			}
			try {
				await state.modelManager.updateExternalModels();
				log(`Models are valid with changes to ${change.document.uri}`);
			}
			catch (error: any) {
				if (!state.isLoading) {
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
			if (!state.isLoading) {
				state.diagnostics.pushDiagnostic(DiagnosticSeverity.Error, change.document, error, 'model');
			}
			else {
				log(`Ignored model validation error while initializing ${change.document.uri}`);
			}
		}
		state.diagnostics.send(state.connection!);
	} else if (change.document.uri.endsWith('.voc')) {
		log(`Vocabulary document changed: ${change.document.uri}`);
		const vocText = change.document.getText();
		try {
			state.diagnostics.clearErrors(change.document.uri, 'vocabulary');
			try {
				const voc = state.vocabularyManager.addVocabulary(vocText);
				log(`Added vocabulary: ${voc.getNamespace()}-${voc.getLocale()}`);
			} catch (err) {
				const voc = new Vocabulary(state.vocabularyManager, YAML.parse(vocText));
				state.vocabularyManager.removeVocabulary(voc.getNamespace(), voc.getLocale());
				const newVoc = state.vocabularyManager.addVocabulary(vocText);
				log(newVoc.getNamespace());
				log(`Updated vocabulary: ${newVoc.getNamespace()}-${newVoc.getLocale()}`);
			}
			// *** TODO ****
			// This should be improved.
			// It is not clear where we should map missing vocs and additional vocs, as they are not associated with a voc file
			// We also do not attempt to implement the detection of a change in CTO which causes issues with the Voc. The only way
			// to currently see those is to manually open and edit the associated voc file after you make the cto change.
			const validationResult = state.vocabularyManager.validate(state.modelManager);
			Object.keys(validationResult.vocabularies).forEach(key => {
				const result = validationResult.vocabularies[key];
				const ns = key.substring(0, key.indexOf('/'));
				const locale = key.substring(key.indexOf('/')+1);
				const vocFile = getFileForVocabulary(state, ns, locale);
				if (vocFile) {
					state.diagnostics.clearErrors(vocFile.uri, 'vocabulary');
					if (result.missingTerms.length > 0) {
						state.diagnostics.pushDiagnostic(DiagnosticSeverity.Warning, vocFile, {message: `Missing terms ${key}: ${JSON.stringify(result.missingTerms)}` }, 'vocabulary');
					}
					if (result.additionalTerms.length > 0) {
						state.diagnostics.pushDiagnostic(DiagnosticSeverity.Warning, vocFile, {message: `Additional terms ${key}: ${JSON.stringify(result.additionalTerms)}` }, 'vocabulary');
					}
				}
			});
			if (validationResult.missingVocabularies.length > 0) {
				state.diagnostics.pushDiagnostic(DiagnosticSeverity.Warning, change.document, { message: `Missing vocabularies: ${JSON.stringify(validationResult.missingVocabularies)}` }, 'vocabulary');
			}
			if (validationResult.additionalVocabularies.length > 0) {
				state.diagnostics.pushDiagnostic(DiagnosticSeverity.Warning, change.document, { message: `Additional vocabularies: ${JSON.stringify(validationResult.additionalVocabularies)}` }, 'vocabulary');
			}
		}
		catch (error: any) {
			if (!state.isLoading) {
				state.diagnostics.pushDiagnostic(DiagnosticSeverity.Error, change.document, error, 'vocabulary');
			}
			else {
				log(`Ignored vocabulary error while initializing ${change.document.uri}`);
			}
		}
		state.diagnostics.send(state.connection!);
	}
}