export const htmlTemplate = (css: string, script: string, configValues: { [key: string]: string }): string => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Copilot Settings</title>
        <link rel="stylesheet" href="https://microsoft.github.io/vscode-codicons/dist/codicon.css">
        <style>
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
                <label for="apiUrl">API Endpoint <span class="required-asterisk">*</span></label>
                <p>The URL of the API endpoint.</p>
                <input type="text" id="apiUrl" value="${configValues.apiUrl}">
                <span class="error-message" id="apiUrlError"></span>
            </div>
            <div class="form-group">
                <label for="modelName">Model Name <span class="required-asterisk">*</span></label>
                <p>The name of the Copilot model.</p>
                <div class="select-container">
                    <select id="modelName" style="width: 100%;">
                        <option value="gemini" ${configValues.modelName === 'gemini' ? 'selected' : ''}>Gemini</option>
                        <option value="openai" ${configValues.modelName === 'openai' ? 'selected' : ''}>OpenAI</option>
                        <option value="anthropic" ${configValues.modelName === 'anthropic' ? 'selected' : ''}>Anthropic</option>
                        <option value="huggingface" ${configValues.modelName === 'huggingface' ? 'selected' : ''}>Hugging Face</option>
                    </select>
                    <i class="codicon codicon-chevron-down"></i>
                </div> 
                <span class="error-message" id="modelNameError"></span>         
            </div>
            <div class="form-group">
                <label for="maxTokens">Max Tokens</label>
                <p>The maximum number of tokens generated in each completion.</p>
                <input type="number" id="maxTokens" value="${configValues.maxTokens ? `value="${configValues.maxTokens}"` : ''}">
            </div>
            <div class="form-group">
                <label for="temperature">Temperature</label>
                <p>The temperature for sampling from the model.</p>
                <input type="number" step="0.1" id="temperature" value="${configValues.temperature ? `value="${configValues.temperature}"` : ''}">
            </div>
            <div class="form-group">
                <label for="additionalParams">Additional Parameters</label>
                <p>Additional parameters for the model.</p>
                <textarea id="additionalParams">${configValues.additionalParams}</textarea>
            </div>
            <button class="button" onclick="saveSettings()">Save Settings</button>
        </div>
        <script>
            ${script}
        </script>
    </body>
    </html>
`;
