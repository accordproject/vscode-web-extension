import * as vscode from 'vscode';
import { LanguageClient } from 'vscode-languageclient/browser';

export async function loadProjectFiles(client:LanguageClient, file: vscode.Uri) {
	try {
		await client.sendRequest('loadProjectFiles', {uri:file.toString()});
	} catch (e) {
		vscode.window.showErrorMessage(`Failed to load project files: ${e}`);
	}
}