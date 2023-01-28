import * as vscode from 'vscode';
import { LanguageClient } from 'vscode-languageclient/browser';

export async function compileToTarget(client:LanguageClient, file: vscode.Uri) {
	try {
		const targetNames:string[] = await client.sendRequest("concertoCompileTargets");
		const target = await vscode.window.showQuickPick(targetNames, { canPickMany: false });
		const response = await client.sendRequest("concertoCompile", {uri:file.toString(), target});
		vscode.window.showInformationMessage(`${response}.`);
	} catch (e) {
		vscode.window.showErrorMessage(`Compilation error: ${e}`);
	}
}