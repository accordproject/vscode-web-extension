import * as vscode from 'vscode';
import { LanguageClient } from 'vscode-languageclient/browser';

const targetNames = [
	'golang',
	'jsonschema',
	'xmlschema',
	'plantuml',
	'typescript',
	'java',
	'graphql',
	'csharp',
	'odata',
	'mermaid',
	'markdown',
	'protobuf'
];

export async function compileToTarget(client:LanguageClient, file: vscode.Uri) {
	try {
		const target = await vscode.window.showQuickPick(targetNames, { canPickMany: false });
		const response = await client.sendRequest("concertoCompile", {uri:file, target});
		vscode.window.showInformationMessage(`${response}.`);
	} catch (e) {
		vscode.window.showErrorMessage("Compilation error: " + e);
	}
}