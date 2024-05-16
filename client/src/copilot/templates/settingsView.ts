export const htmlTemplate = (css: string, script: string, configValues: { [key: string]: string }): string => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Copilot Settings</title>
        <style>
            ${css}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Accord Copilot Settings</h1>
            <div class="form-group">
                <label for="apiKey">API Key</label>
                <p>This is your API key for accessing the service.</p>
                <input type="text" id="apiKey" value="${configValues.apiKey}">
            </div>
            <div class="form-group">
                <label for="apiUrl">API Endpoint</label>
                <p>The URL of the API endpoint.</p>
                <input type="text" id="apiUrl" value="${configValues.apiUrl}">
            </div>
            <div class="form-group">
                <label for="modelName">Model Name</label>
                <p>The name of the Copilot model.</p>
                <input type="text" id="modelName" value="${configValues.modelName}">
            </div>
            <div class="form-group">
                <label for="maxTokens">Max Tokens</label>
                <p>The maximum number of tokens generated in each completion.</p>
                <input type="number" id="maxTokens" value="${configValues.maxTokens}">
            </div>
            <div class="form-group">
                <label for="temperature">Temperature</label>
                <p>The temperature for sampling from the model.</p>
                <input type="number" step="0.1" id="temperature" value="${configValues.temperature}">
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
