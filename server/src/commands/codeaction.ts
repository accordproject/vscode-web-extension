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

import { CodeAction, CodeActionKind, CodeActionParams, Command, TextDocumentEdit, TextEdit, WorkspaceEdit } from 'vscode-languageserver';
import { log } from '../state';
import { LanguageServerState } from '../types';
import * as semver from 'semver';
import { splitLines } from '../utils';

function createIncrementNamespaceVersionWorkspaceEdit(state: LanguageServerState, params: CodeActionParams, namespace: string, oldVersion: string, newVersion: string): WorkspaceEdit {
	const textEdit: TextEdit = {
		range: {
			start: params.range.start,
			end: params.range.end
		},
		newText: `namespace ${namespace}@${newVersion}\n`
	};

	// update the namespace in the current cto
	const textDocumentEdit = TextDocumentEdit.create({
		uri: params.textDocument.uri,
		version: 1
	}, [textEdit]);
	const textDocumentEdits: TextDocumentEdit[] = [];
	textDocumentEdits.push(textDocumentEdit);

	// find all the documents that import this namespace and update their imports
	// import <old versioned ns>.{Foo}
	// import <old versioned ns>.Foo
	state.documents.all().forEach(doc => {
		if (doc.languageId === 'concerto') {
			const text = doc.getText();
			const lines = splitLines(text);
			lines.forEach((line,lineIndex) => {
				const oldImport = `import ${namespace}@${oldVersion}`;
				const importAt = line.indexOf(oldImport);
				if (importAt >= 0) {
					// update the import in the cto
					const textEdit: TextEdit = {
						range: {
							start: {line:lineIndex, character: importAt},
							end: {line:lineIndex, character: importAt + oldImport.length},
						},
						newText: `import ${namespace}@${newVersion}`
					};
					const textDocumentEdit = TextDocumentEdit.create({
						uri: doc.uri,
						version: doc.version
					}, [textEdit]);
					textDocumentEdits.push(textDocumentEdit);
				}
			});
		}
		else if (doc.languageId === 'concerto-vocabulary' && doc.uri.endsWith('.voc')) {
			const text = doc.getText();
			const lines = splitLines(text);
			lines.forEach((line,lineIndex) => {
				const oldNs = `namespace: ${namespace}@${oldVersion}`;
				const oldNsAt = line.indexOf(oldNs);
				if (oldNsAt >= 0) {
					// update the namespace in the voc
					const textEdit: TextEdit = {
						range: {
							start: {line:lineIndex, character: oldNsAt},
							end: {line:lineIndex, character: oldNsAt + oldNs.length},
						},
						newText: `namespace: ${namespace}@${newVersion}`
					};
					const textDocumentEdit = TextDocumentEdit.create({
						uri: doc.uri,
						version: doc.version
					}, [textEdit]);
					textDocumentEdits.push(textDocumentEdit);
				}
			});
		}
	});

	return { documentChanges: textDocumentEdits };
}

export function onCodeAction(state: LanguageServerState, params: CodeActionParams): (Command | CodeAction)[] {
	const textDocument = state.documents.get(params.textDocument.uri);
	const text = textDocument?.getText(params.range);
	if (text && text.startsWith('namespace ')) {
		const atIndex = text.indexOf('@');
		const ns = text.substring(10, atIndex);
		const part = atIndex > 0 && atIndex < text.length - 1 ? text.substring(atIndex + 1) : '';
		const lines = splitLines(part);
		if (lines.length > 0 && semver.valid(lines[0])) {
			const nextMajorVer = semver.inc(lines[0], 'major');
			const nextMinorVer = semver.inc(lines[0], 'minor');
			const nextPatchVer = semver.inc(lines[0], 'patch');
			const result: CodeAction[] = [];
			if (nextMajorVer) {
				const edit = createIncrementNamespaceVersionWorkspaceEdit(state, params, ns, lines[0], nextMajorVer);
				const codeAction: CodeAction = {
					title: 'Increment namespace MAJOR version number',
					edit,
					kind: CodeActionKind.Refactor
				};
				result.push(codeAction);
			}
			if (nextMinorVer) {
				const edit = createIncrementNamespaceVersionWorkspaceEdit(state, params, ns, lines[0], nextMinorVer);
				const codeAction: CodeAction = {
					title: 'Increment namespace MINOR version number',
					edit,
					kind: CodeActionKind.Refactor
				};
				result.push(codeAction);
			}
			if (nextPatchVer) {
				const edit = createIncrementNamespaceVersionWorkspaceEdit(state, params, ns, lines[0], nextPatchVer);
				const codeAction: CodeAction = {
					title: 'Increment namespace PATCH version number',
					edit,
					kind: CodeActionKind.Refactor
				};
				result.push(codeAction);
			}
			return result;
		}
	}
	return [];
}