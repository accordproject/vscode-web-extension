export const scriptTemplate = `
    const vscode = acquireVsCodeApi();
    function saveSettings() {
        const apiKey = document.getElementById('apiKey').value;
        const apiUrl = document.getElementById('apiUrl').value;
        const modelName = document.getElementById('modelName').value;
        const maxTokens = document.getElementById('maxTokens').value;
        const temperature = document.getElementById('temperature').value;
        const additionalParams = document.getElementById('additionalParams').value;

        // Validation
        let isValid = true;

        if (!apiKey) {
            document.getElementById('apiKeyError').innerText = "API Key is required";
            document.getElementById('apiKeyError').style.display = "block";
            isValid = false;
        } else {
            document.getElementById('apiKeyError').style.display = "none";
        }

        if (!apiUrl) {
            document.getElementById('apiUrlError').innerText = "API Endpoint is required";
            document.getElementById('apiUrlError').style.display = "block";
            isValid = false;
        } else {
            document.getElementById('apiUrlError').style.display = "none";
        }

        if (!modelName) {
            document.getElementById('modelNameError').innerText = "Model Name is required";
            document.getElementById('modelNameError').style.display = "block";
            isValid = false;
        } else {
            document.getElementById('modelNameError').style.display = "none";
        }
        
        const maxTokensValue = maxTokens!=0 ? Number(maxTokens) : null;
        const temperatureValue = temperature!=0 ? Number(temperature) : null;

        if (!isValid) return; // Prevent saving if validation fails

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

    function toggleVisibility() {
        const apiKeyInput = document.getElementById('apiKey');
        const toggleIcon = document.querySelector('.toggle-visibility');
        const type = apiKeyInput.getAttribute('type') === 'password' ? 'text' : 'password';
        apiKeyInput.setAttribute('type', type);
    
        if (type === 'password') {
            toggleIcon.classList.remove('codicon-eye-closed');
            toggleIcon.classList.add('codicon-eye');
        } else {
            toggleIcon.classList.remove('codicon-eye');
            toggleIcon.classList.add('codicon-eye-closed');
        }
    }
    
`;
