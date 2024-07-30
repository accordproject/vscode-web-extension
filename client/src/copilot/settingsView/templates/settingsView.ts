import { getCommonStyles } from '../../utils/commonStyles';

export const htmlTemplate = (css: string, script: string, configValues: { [key: string]: string }): string => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Copilot Settings</title>
        <link rel="stylesheet" href="https://microsoft.github.io/vscode-codicons/dist/codicon.css">
        <style>
            ${getCommonStyles}
            ${css}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Accord Copilot Settings</h1>
            <div class="form-group">
                <label for="apiKey">API Key <span class="required-asterisk">*</span></label>
                <p>This is your API key for accessing the service.</p>
                <div class="input-container">
                    <input type="password" id="apiKey" value="${configValues.apiKey}">
                    <span class="codicon codicon-eye toggle-visibility" onclick="toggleVisibility()"></span>
                </div>
                <span class="error-message" id="apiKeyError"></span>
            </div>
            <div class="form-group">
                <label for="provider">Provider <span class="required-asterisk">*</span></label>
                <p>Select the AI provider.</p>
                <div class="select-container">
                    <select id="provider" style="width: 100%;">
                        <option value="gemini" ${configValues.provider === 'gemini' ? 'selected' : ''}>Gemini</option>
                        <option value="openai" ${configValues.provider === 'openai' ? 'selected' : ''}>OpenAI</option>
                        <option value="mistral" ${configValues.provider === 'mistral' ? 'selected' : ''}>MistralAI</option>
                    </select>
                    <i class="codicon codicon-chevron-down"></i>
                </div> 
                <span class="error-message" id="providerError"></span>         
            </div>
            <div class="form-group">
                <label for="llmModel">LLM Model</label>
                <p>The specific language model (default: Gemini - gemini-pro, OpenAI - gpt-3.5-turbo, MistralAI - mistral-large-latest).</p>
                <input type="text" id="llmModel" value="${configValues.llmModel}">
                <span class="error-message" id="llmModelError"></span>
            </div>
            <div class="form-group">
                <label for="additionalParams">Additional Parameters</label>
                <p>Additional parameters for the model in JSON format. Examples of keys include maxTokens, temperature, topP.</p>
                <textarea id="additionalParams">${configValues.additionalParams}</textarea>
            </div>
            <div class="form-group">
                <label for="scope">Settings Scope</label>
                <p>Select whether to save the settings globally (for all projects) or for the current workspace only.</p>
                <div class="select-container">
                    <select id="scope" style="width: 100%;">
                        <option value="workspace" selected>Workspace</option>
                        <option value="global">Global</option>
                    </select>
                    <i class="codicon codicon-chevron-down"></i>
                </div>
            </div>
            <button class="button" onclick="saveSettings()">Save Settings</button>
        </div>
        <script>
            ${script}
        </script>
    </body>
    </html>
`;
