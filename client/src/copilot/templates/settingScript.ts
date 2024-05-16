export const scriptTemplate = `
    const vscode = acquireVsCodeApi();
    function saveSettings() {
        const apiKey = document.getElementById('apiKey').value;
        const apiUrl = document.getElementById('apiUrl').value;
        const modelName = document.getElementById('modelName').value;
        const maxTokens = document.getElementById('maxTokens').value;
        const temperature = document.getElementById('temperature').value;
        const additionalParams = document.getElementById('additionalParams').value;

        vscode.postMessage({
            command: 'saveSettings',
            apiKey,
            apiUrl,
            modelName,
            maxTokens,
            temperature,
            additionalParams
        });
    }
`;
