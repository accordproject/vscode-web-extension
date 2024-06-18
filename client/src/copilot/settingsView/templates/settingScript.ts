export const scriptTemplate = `
    const vscode = acquireVsCodeApi();
    function saveSettings() {
        const scope = document.getElementById('scope').value;
        const apiKey = document.getElementById('apiKey').value;
        const provider = document.getElementById('provider').value;
        const llmModel = document.getElementById('llmModel').value;
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

        if (!provider) {
            document.getElementById('providerError').innerText = "Provider is required";
            document.getElementById('providerError').style.display = "block";
            isValid = false;
        } else {
            document.getElementById('providerError').style.display = "none";
        }
        
        if (!isValid) return; // Prevent saving if validation fails

        vscode.postMessage({
            scope: scope,
            command: 'saveSettings',
            apiKey,
            provider,
            llmModel,
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
