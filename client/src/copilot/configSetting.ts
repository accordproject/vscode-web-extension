import * as vscode from 'vscode';
import { CONFIG_DEFAULTS } from '../constants';
import { htmlTemplate } from './templates/settingsView';
import { cssTemplate } from './templates/settingsStyle';
import { scriptTemplate } from './templates/settingScript';
import { checkCopilotHealth, copilotHealthStatus } from './healthCheck';

export function createSettingsWebview(context: vscode.ExtensionContext, client: any) {
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
        apiKey: config.get<string>('apiKey', CONFIG_DEFAULTS.apiKey),
        apiUrl: config.get<string>('apiUrl', CONFIG_DEFAULTS.apiUrl),
        modelName: config.get<string>('modelName', CONFIG_DEFAULTS.modelName),
        maxTokens: config.get<number>('maxTokens', CONFIG_DEFAULTS.maxTokens).toString(),
        temperature: config.get<number>('temperature', CONFIG_DEFAULTS.temperature).toString(),
        additionalParams: JSON.stringify(config.get<object>('additionalParams', CONFIG_DEFAULTS.additionalParams), null, 2)
    };

    panel.webview.html = htmlTemplate(cssTemplate, scriptTemplate, configValues);

    panel.webview.onDidReceiveMessage(async message => {
        switch (message.command) {
            case 'saveSettings':
                await config.update('apiKey', message.apiKey, vscode.ConfigurationTarget.Global);
                await config.update('apiUrl', message.apiUrl, vscode.ConfigurationTarget.Global);
                await config.update('modelName', message.modelName, vscode.ConfigurationTarget.Global);
                const maxTokens = message.maxTokens ? Number(message.maxTokens) : null;
                const temperature = message.temperature ? Number(message.temperature) : null;

                if (maxTokens !== null) 
                    await config.update('maxTokens', maxTokens, vscode.ConfigurationTarget.Global);
                else 
                    await config.update('maxTokens', undefined, vscode.ConfigurationTarget.Global);

                if (temperature !== null) 
                    await config.update('temperature', temperature, vscode.ConfigurationTarget.Global);
                else 
                    await config.update('temperature', undefined, vscode.ConfigurationTarget.Global);
                
                await config.update('additionalParams', JSON.parse(message.additionalParams), vscode.ConfigurationTarget.Global);
                vscode.window.showInformationMessage('Configuration updated successfully!');

                await checkCopilotHealth(client)
                if (copilotHealthStatus === true) 
                    vscode.window.showInformationMessage('Connection to Copilot established successfully!');
                else
                    vscode.window.showErrorMessage('Connection to Copilot failed!');
                
                break;
        }
    });
}

