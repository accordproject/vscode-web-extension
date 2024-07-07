import * as vscode from 'vscode';
import { wizardStyle } from './wizardStyle';
import { wizardScript } from './wizardScript';
import { getCommonStyles } from '../../utils/commonStyles';

export function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri): string {
    const scriptUri = wizardScript;
    const styleUri = wizardStyle;

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="https://microsoft.github.io/vscode-codicons/dist/codicon.css">
            <style>
                ${getCommonStyles}
                ${styleUri}
            </style>
            <title>Copilot File Generator</title>
        </head>
        <body>
            <div class="container">
                <h1>Copilot File Generator</h1>
                <h2>Generate Grammar Template</h2>
                <div class="form-group">
                    <label for="sample-file">Select Sample Markdown File:<span class="required-asterisk">*</span></label>
                    <div class="select-container">
                        <select id="sample-file" style="width: 100%;">
                            <option value="">Select a file</option>
                        </select>
                        <i class="codicon codicon-chevron-down"></i>
                    </div>
                </div>
                <div class="form-group">
                    <button class="button blue-button" id="generate-grammar">
                        <span class="button-text">Generate Grammar Markdown File</span>
                    </button>
                    <div id="grammar-spinner" class="spinner hidden"><span class="spinner codicon codicon-loading"></span> Generating file using AI...</div>
                    <div id="grammar-error" class="error hidden"></div>
                </div>
                <hr/>
                <h2>Generate Model Concerto</h2>
                <div class="form-group">
                    <label for="grammar-file">Select Grammar Markdown File:<span class="required-asterisk">*</span></label>
                    <div class="select-container">
                        <select id="grammar-file" style="width: 100%;">
                            <option value="">Select a file</option>
                        </select>
                        <i class="codicon codicon-chevron-down"></i>
                    </div>
                </div>
                <div class="form-group">
                    <label for="package-file">Select Package JSON File:<span class="required-asterisk">*</span></label>
                    <div class="select-container">
                        <select id="package-file" style="width: 100%;">
                            <option value="">Select a file</option>
                        </select>
                        <i class="codicon codicon-chevron-down"></i>
                    </div>
                </div>
                <div class="form-group">
                    <button class="button blue-button" id="generate-model">
                        <span class="button-text">Generate Model Concerto File</span>
                    </button>
                    <div id="model-spinner" class="spinner hidden"><span class="spinner codicon codicon-loading"></span> Generating file using AI...</div>
                    <div id="model-error" class="error hidden"></div>
                </div>
            </div>
            <script>
                ${scriptUri}
            </script>
        </body>
        </html>
    `;
}
