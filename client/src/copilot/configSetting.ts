import * as vscode from 'vscode';
import { CONFIG_DEFAULTS } from '../constants';
import { htmlTemplate } from './templates/settingsView';
import { cssTemplate } from './templates/settingsStyle';
import { scriptTemplate } from './templates/settingScript';

export function createSettingsWebview(context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel(
        'copilotSettings', 
        'Copilot Settings', 
        vscode.ViewColumn.One, 
        {
            enableScripts: true
        }
    );

    const config = vscode.workspace.getConfiguration('cicero-vscode-extension');
    const configValues = {
        apiKey: config.get('apiKey', CONFIG_DEFAULTS.apiKey),
        apiUrl: config.get('apiUrl', CONFIG_DEFAULTS.apiUrl),
        modelName: config.get('modelName', CONFIG_DEFAULTS.modelName),
        maxTokens: config.get('maxTokens', CONFIG_DEFAULTS.maxTokens).toString(),
        temperature: config.get('temperature', CONFIG_DEFAULTS.temperature).toString(),
        additionalParams: JSON.stringify(config.get('additionalParams', CONFIG_DEFAULTS.additionalParams), null, 2)
    };

    panel.webview.html = htmlTemplate(cssTemplate, scriptTemplate, configValues);

    panel.webview.onDidReceiveMessage(async message => {
        switch (message.command) {
            case 'saveSettings':
                await config.update('apiKey', message.apiKey, vscode.ConfigurationTarget.Global);
                await config.update('apiUrl', message.apiUrl, vscode.ConfigurationTarget.Global);
                await config.update('modelName', message.modelName, vscode.ConfigurationTarget.Global);
                await config.update('maxTokens', message.maxTokens, vscode.ConfigurationTarget.Global);
                await config.update('temperature', message.temperature, vscode.ConfigurationTarget.Global);
                await config.update('additionalParams', JSON.parse(message.additionalParams), vscode.ConfigurationTarget.Global);
                vscode.window.showInformationMessage('Configuration updated successfully!');
                break;
        }
    });
}

