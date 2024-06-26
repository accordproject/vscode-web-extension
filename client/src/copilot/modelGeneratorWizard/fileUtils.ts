import * as vscode from 'vscode';
import { log } from '../../log';
import { LanguageClient } from 'vscode-languageclient/browser';
import { getSuggestion } from '../generators/suggestionProvider';
import { DocumentDetails, Documents, PromptConfig } from '../utils/types';

export async function getFileList(extension: string): Promise<string[]> {
    const excludePattern = `{**/node_modules/**,**/.*/**,**/*.!(cto|json|md)}`;
    const uris = await vscode.workspace.findFiles(`**/*.${extension}`, excludePattern);
    log(`Found ${uris.length} ${extension} files`);
    return uris.map(uri => vscode.workspace.asRelativePath(uri, false));
}

export function extractDocumentDetails(documents: { [key: string]: vscode.TextDocument }): DocumentDetails[] {
    const details: DocumentDetails[] = [];

    for (const [key, doc] of Object.entries(documents)) {
        if (doc) {
            let fileName: string;
            let fileExtension: string;

            switch (key) {
                case 'sampleDocument':
                    fileName = 'sample.md';
                    fileExtension = 'md';
                    break;
                case 'grammarDocument':
                    fileName = 'grammar.tem.md';
                    fileExtension = 'md';
                    break;
                case 'sampleRequestDocument':
                    fileName = 'request.json';
                    fileExtension = 'json';
                    break;
                case 'packageDocument':
                    fileName = 'package.json';
                    fileExtension = 'json';
                    break;
                default:
                    fileName = '';
                    fileExtension = '';
            }

            details.push({
                content: doc.getText(),
                fileName: fileName,
                fileExtension: fileExtension
            });
        }
    }

    return details;
}

export async function getSuggestionsFromClient(client: LanguageClient, documents: { [key: string]: vscode.TextDocument }): Promise<string> {
    const documentDetailsArray = extractDocumentDetails(documents);

    const documentsObject: Documents = {
        main: { content: '' },
        contextDocuments: documentDetailsArray
    };

    let requestType: string = 'model';

    if (documentsObject.contextDocuments?.some(doc => doc.fileName === 'sample.md')) {
        requestType = 'grammar';
    }

    const promptConfig: PromptConfig = {
        requestType: requestType,
        language: 'plaintext'
    };

    const suggestion = await getSuggestion(client, documentsObject, promptConfig);
    return suggestion;
}

export async function getFolderPath(folderPattern: string, folderSubPath: string): Promise<string> {
    const excludePattern = '**/node_modules/**';
    const folderUris = await vscode.workspace.findFiles(folderPattern, excludePattern);

    log(`Found ${folderUris.length} folders`);
    if (folderUris.length > 0) {
        let path = folderUris[0].path;
        path = path.substring(0, path.indexOf(folderSubPath) + folderSubPath.length);
        return vscode.workspace.asRelativePath(vscode.Uri.file(path), false);
    } else {
        return '';
    }
}

export function resolveWorkspacePath(relativePath: string): string {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        throw new Error('No workspace folder found');
    }
    return vscode.Uri.joinPath(workspaceFolder.uri, relativePath).fsPath;
}
