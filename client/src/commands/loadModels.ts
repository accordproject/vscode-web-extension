import * as vscode from 'vscode';
import { LanguageClient } from 'vscode-languageclient/browser';

export async function loadModels(client:LanguageClient, file: vscode.Uri) {
	try {
		await client.sendRequest('loadModels', {uri:file.toString()});
	} catch (e) {
		vscode.window.showErrorMessage(`Failed to load models: ${e}`);
	}
}