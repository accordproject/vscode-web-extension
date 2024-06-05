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
        provider: config.get<string>('provider', CONFIG_DEFAULTS.provider),
        llmModel: config.get<string>('llmModel', CONFIG_DEFAULTS.llmModel),
        maxTokens: config.get<number>('maxTokens', CONFIG_DEFAULTS.maxTokens) !== 0 ? config.get<number>('maxTokens', CONFIG_DEFAULTS.maxTokens).toString() : '',
        temperature: config.get<number>('temperature', CONFIG_DEFAULTS.temperature) !== 0 ? config.get<number>('temperature', CONFIG_DEFAULTS.temperature).toString() : '',
        additionalParams: JSON.stringify(config.get<object>('additionalParams', CONFIG_DEFAULTS.additionalParams), null, 2)
    };

    panel.webview.html = htmlTemplate(cssTemplate, scriptTemplate, configValues);

    panel.webview.onDidReceiveMessage(async message => {
        switch (message.command) {
            case 'saveSettings':
                const target = message.scope === 'workspace' ? vscode.ConfigurationTarget.Workspace : vscode.ConfigurationTarget.Global;
                await config.update('apiKey', message.apiKey, target);
                await config.update('apiUrl', message.apiUrl, target);
                await config.update('provider', message.provider, target);
                await config.update('llmModel', message.llmModel, target);
                const maxTokens = message.maxTokens ? Number(message.maxTokens) : null;
                const temperature = message.temperature ? Number(message.temperature) : null;

                if (maxTokens !== null) 
                    await config.update('maxTokens', maxTokens, target);
                else 
                    await config.update('maxTokens', undefined, target);

                if (temperature !== null) 
                    await config.update('temperature', temperature, target);
                else 
                    await config.update('temperature', undefined, target);
                
                await config.update('additionalParams', JSON.parse(message.additionalParams), target);
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

