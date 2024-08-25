import * as vscode from 'vscode';
import { log } from '../../log';
import { getWebviewContent } from './templates/wizardView';
import { LanguageClient } from 'vscode-languageclient/browser';
import { generateGrammarFile, generateModelFile } from './fileGenerators';
import { getFileList } from './fileUtils';
import { ASSETS, FILE_GENERATORS } from '../utils/constants';

let currentPanel: vscode.WebviewPanel | undefined;

export function createFileGeneratorPanel(context: vscode.ExtensionContext, client: LanguageClient) {
    const column = vscode.ViewColumn.Beside;

    if (currentPanel) {
        currentPanel.reveal(column);
        return;
    }

    currentPanel = vscode.window.createWebviewPanel(
        'fileGeneratorPanel',
        'Model Generation Wizard',
        column,
        {
            enableScripts: true,
            localResourceRoots: [context.extensionUri]
        }
    );

    const iconPathDark = vscode.Uri.joinPath(context.extensionUri, ASSETS.ACCORD_LOGO_DARK);
    const iconPathLight = vscode.Uri.joinPath(context.extensionUri, ASSETS.ACCORD_LOGO_LIGHT);
    const iconPath = {
        light: iconPathLight,
        dark: iconPathDark
    };
    
    currentPanel.iconPath = iconPath;

    currentPanel.onDidDispose(() => {
        currentPanel = undefined;
    });

    currentPanel.onDidChangeViewState(e => {
        if (currentPanel.visible) {
            preloadFileLists(currentPanel);
        }
    });

    currentPanel.webview.onDidReceiveMessage(
        async message => {
            switch (message.command) {
                case FILE_GENERATORS.GENERATE_GRAMMAR_FILE:
                    updateGeneratingState('grammar', true);
                    try {
                        await generateGrammarFile(client, message.filePath);
                        updateGeneratingState('grammar', false);
                        vscode.window.showInformationMessage('Grammar file generated successfully');
                    } catch (error) {
                        log(`Error generating grammar file: ${error.message}`);
                        updateGeneratingState('grammar', false, error.message);
                        vscode.window.showErrorMessage('Error generating grammar file');
                    }
                    break;
                case FILE_GENERATORS.GENERATE_MODEL_FILE:
                    updateGeneratingState('model', true);
                    try {
                        await generateModelFile(client, message.packageFile, message.grammarFile);
                        updateGeneratingState('model', false);
                        vscode.window.showInformationMessage('Model file generated successfully');
                    } catch (error) {
                        log(`Error generating model file: ${error.message}`);
                        updateGeneratingState('model', false, error.message);
                        vscode.window.showErrorMessage('Error generating model file');
                    }
                    break;
                case FILE_GENERATORS.REQUEST_FILE_LIST:
                    log(`Received request for file list`);
                    const files = await getFileList(message.extension);
                    currentPanel?.webview.postMessage({ command: 'fileList', files, target: message.target });
                    break;
            }
        }
    );

    currentPanel.webview.html = getWebviewContent(currentPanel.webview, context.extensionUri);
}

async function preloadFileLists(panel: vscode.WebviewPanel) {
    const mdFiles = await getFileList('md');
    const jsonFiles = await getFileList('json');

    panel.webview.postMessage({ command: 'preloadFileLists', mdFiles, jsonFiles });
}

function updateGeneratingState(type: 'grammar' | 'model', isGenerating: boolean, errorMessage: string = '') {
    currentPanel?.webview.postMessage({ command: 'updateGeneratingState', type, isGenerating, errorMessage });
}