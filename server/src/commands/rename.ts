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

import { CreateFile, RenameParams, TextDocumentEdit, TextEdit, WorkspaceEdit } from 'vscode-languageserver';
import { log } from '../state';
import { LanguageServerState } from '../types';
import { getLine, getWordBoundary, getWordFromPosition, splitLines } from '../utils';

export function onRenameRequest(state: LanguageServerState, params: RenameParams): WorkspaceEdit | undefined {
	log(`onRenameRequest: ${JSON.stringify(params)}`);
	const textDocument = state.documents.get(params.textDocument.uri);
	const text = textDocument?.getText();
	if (text) {
		const line = getLine(params.position.line, text);
		if (line) {
			const boundary = getWordBoundary(params.position.character, line)
			const selectedWord = getWordFromPosition(params.position.character, line);
			const textEdit: TextEdit = {
				range: {
					start: {
						line: params.position.line,
						character: boundary.start
					},
					end: {
						line: params.position.line,
						character: boundary.end
					}
				},
				newText: params.newName
			};

			let textDocumentEdit = TextDocumentEdit.create({
				uri: params.textDocument.uri,
				version: 1
			}, [textEdit]);
			let textDocumentEdits: TextDocumentEdit[] = [];
			textDocumentEdits.push(textDocumentEdit);

			const workspaceEdit: WorkspaceEdit = { documentChanges: textDocumentEdits };
			return workspaceEdit;
		}
	}
}