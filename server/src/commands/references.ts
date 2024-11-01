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

import { log } from '../state';
import { LanguageServerState } from '../types';
import { Location, Range, ReferenceParams } from 'vscode-languageserver';
import { ClassDeclaration, Introspector, MapDeclaration, ModelFile, ScalarDeclaration } from '@accordproject/concerto-core';
import Declaration = require('@accordproject/concerto-core/types/lib/introspect/declaration');
import { getLine, getMapValueType, getWordFromPosition, splitLines } from '../utils';

export function getReferences(state: LanguageServerState, params: ReferenceParams): Location[] {
	const textDocument = state.documents.get(params.textDocument.uri);
	const text = textDocument?.getText();
	if (text) {
		const line = getLine(params.position.line, text);
		if (line) {
			const selectedWord = getWordFromPosition(params.position.character, line);
			// the selected word should be a type name in this model file
			if (selectedWord) {
				const model: ModelFile = (state.modelManager as any).getModelFiles().find((model: ModelFile) => model.getName() === params.textDocument.uri);
				if (model) {
					const decl = (model as any).getType(selectedWord);
					const declFqn = decl ? typeof decl === 'string' ? decl : decl.getFullyQualifiedName() : selectedWord; // for primitives
					log(`Getting references to type ${declFqn} in model ${model.getNamespace()}`);
					const allDecls:Declaration[] = (state.modelManager as any).getModelFiles().reduce((prev:ModelFile[], cur:ModelFile) => {
						return prev.concat((cur as any).getAllDeclarations());
					}, []);
					const declarationsThatUseDecl = allDecls
						.filter(d => 
							// it is the type itself
							d.getFullyQualifiedName() === declFqn
							// is a scalar
							|| (d.isScalarDeclaration() && (d as ScalarDeclaration).getType() === declFqn)
							// it extends the type
							|| (d.isClassDeclaration() && (d as ClassDeclaration).getSuperType() === declFqn)
							// it has a property of the type
							|| (d.isClassDeclaration() && !d.isEnum() && (d as ClassDeclaration).getOwnProperties().filter(p => p.getFullyQualifiedTypeName() === declFqn).length > 0)
							// is a map
							|| (d.isMapDeclaration() && (d as unknown as MapDeclaration).getKey().getType() === declFqn)
							|| (d.isMapDeclaration() && getMapValueType(d as any as MapDeclaration) === declFqn)
						);
					return declarationsThatUseDecl.map(d => {
						return {
							uri: (d as any).getModelFile().getName(),
							range: {
								start: {
									line: (d.ast as any).location.start.line - 1,
									character: (d.ast as any).location.start.column - 1,
								},
								end: {
									line: (d.ast as any).location.end.line - 1,
									character: (d.ast as any).location.end.column - 1,
								}
							}
						}
					});
				} // found model
			}
		}
	}
	return [];
}
