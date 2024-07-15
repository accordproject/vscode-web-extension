import * as vscode from 'vscode';
import { ASSETS, CONFIG_DEFAULTS } from '../utils/constants';
import { htmlTemplate } from './templates/settingsView';
import { cssTemplate } from './templates/settingsStyle';
import { scriptTemplate } from './templates/settingScript';
import { checkCopilotHealth, copilotHealthStatus } from '../healthCheck';

export function createSettingsWebview(context: vscode.ExtensionContext, client: any) {
    const column = vscode.ViewColumn.Beside;
    const panel = vscode.window.createWebviewPanel(
        'copilotSettings', 
        'Copilot Settings', 
        column, 
        {
            enableScripts: true
        }
    );

    const iconPathDark = vscode.Uri.joinPath(context.extensionUri, ASSETS.ACCORD_LOGO_DARK);
    const iconPathLight = vscode.Uri.joinPath(context.extensionUri, ASSETS.ACCORD_LOGO_LIGHT);
    const iconPath = {
        light: iconPathLight,
        dark: iconPathDark
    };
    panel.iconPath = iconPath;

    const config = vscode.workspace.getConfiguration('cicero-vscode-extension');
    const configValues = {
        apiKey: config.get<string>('apiKey', CONFIG_DEFAULTS.apiKey),
        apiUrl: config.get<string>('apiUrl', CONFIG_DEFAULTS.apiUrl),
        provider: config.get<string>('provider', CONFIG_DEFAULTS.provider),
        llmModel: config.get<string>('llmModel', CONFIG_DEFAULTS.llmModel),
        additionalParams: JSON.stringify(config.get<object>('additionalParams', CONFIG_DEFAULTS.additionalParams), null, 2)
    };

    panel.webview.html = htmlTemplate(cssTemplate, scriptTemplate, configValues);

    panel.webview.onDidReceiveMessage(async message => {
        switch (message.command) {
            case 'saveSettings':
                const target = message.scope === 'workspace' ? vscode.ConfigurationTarget.Workspace : vscode.ConfigurationTarget.Global;
                await config.update('apiKey', message.apiKey, target);
                await config.update('provider', message.provider, target);
                await config.update('llmModel', message.llmModel, target);
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

