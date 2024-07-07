import * as vscode from 'vscode';
import { log } from '../../log';
import { LanguageClient } from 'vscode-languageclient/browser';
import { getSuggestionsFromClient, resolveWorkspacePath, getFolderPath } from './fileUtils';

export async function generateGrammarFile(client: LanguageClient, sampleFilePath: string) {
    const fileName = 'grammar-ai-generated.tem.md';

    log(`Generating grammar file from: ${sampleFilePath}`);

    try {
        const sampleDocument = await vscode.workspace.openTextDocument(vscode.Uri.file(resolveWorkspacePath(sampleFilePath)));
        const grammarContent = await getSuggestionsFromClient(client, { sampleDocument });

        const grammarFolderPath = await getFolderPath('**/text/**', '/text/');
        const uri = vscode.Uri.file(resolveWorkspacePath(`${grammarFolderPath}/${fileName}`));
        const edit = new vscode.WorkspaceEdit();

        edit.createFile(uri, { overwrite: true });
        edit.insert(uri, new vscode.Position(0, 0), grammarContent);
        await vscode.workspace.applyEdit(edit);

    } catch (error) {
        log(`Error opening sample file: ${error.message}`);
        throw new Error('Error opening sample file');
    }
}

export async function generateModelFile(client: LanguageClient, packageFilePath: string, grammarFilePath: string) {
    const modelFileName = 'model-ai-generated.cto';

    log(`Generating model file from: ${packageFilePath}, ${grammarFilePath}`);

    try {
        const packageDocument = await vscode.workspace.openTextDocument(vscode.Uri.file(resolveWorkspacePath(packageFilePath)));
        const grammarDocument = await vscode.workspace.openTextDocument(vscode.Uri.file(resolveWorkspacePath(grammarFilePath)));

        const modelContent = await getSuggestionsFromClient(client, { grammarDocument, packageDocument });

        const modelFolderPath = await getFolderPath('**/model/**', '/model/');
        const uri = vscode.Uri.file(resolveWorkspacePath(`${modelFolderPath}/${modelFileName}`));
        const edit = new vscode.WorkspaceEdit();

        edit.createFile(uri, { overwrite: true });
        edit.insert(uri, new vscode.Position(0, 0), modelContent);
        await vscode.workspace.applyEdit(edit);
    } catch (error) {
        log(`Error opening files: ${error.message}`);
        throw new Error('Error opening files');
    }
}
