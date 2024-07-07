export const wizardScript = `
    const vscode = acquireVsCodeApi();
    const state = vscode.getState() || {};

    document.getElementById('generate-grammar').addEventListener('click', () => {
        const filePath = document.getElementById('sample-file').value;
        vscode.postMessage({ command: 'generateGrammarFile', filePath });
    });

    document.getElementById('generate-model').addEventListener('click', () => {
        const packageFile = document.getElementById('package-file').value;
        const grammarFile = document.getElementById('grammar-file').value;
        vscode.postMessage({ command: 'generateModelFile', packageFile, grammarFile });
    });

    window.addEventListener('message', event => {
        const message = event.data;
        if (message.command === 'preloadFileLists') {
            populateFileOptions(message.mdFiles, 'sample-file');
            populateFileOptions(message.mdFiles, 'grammar-file');
            populateFileOptions(message.jsonFiles, 'package-file');
            saveState();
        } else if (message.command === 'updateGeneratingState') {
            const { type, isGenerating, errorMessage } = message;
            const spinner = document.getElementById(\`\${type}-spinner\`);
            const error = document.getElementById(\`\${type}-error\`);
            if (isGenerating) {
                spinner.classList.remove('hidden');
                error.classList.add('hidden');
            } else {
                spinner.classList.add('hidden');
                if (errorMessage) {
                    error.innerText = errorMessage;
                    error.classList.remove('hidden');
                } else {
                    error.classList.add('hidden');
                }
            }
        }
    });

    function populateFileOptions(fileList, targetElementId) {
        const selectElement = document.getElementById(targetElementId);
        selectElement.innerHTML = '<option value="">Select a file</option>';
        fileList.forEach(file => {
            const option = document.createElement('option');
            option.value = file;
            option.textContent = file;
            selectElement.appendChild(option);
        });
        if (state[targetElementId]) {
            selectElement.value = state[targetElementId];
        }
    }

`;
