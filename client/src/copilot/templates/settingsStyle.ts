export const cssTemplate = `
    body {
        font-family: var(--vscode-workbench-widget-font-family);
        font-size: var(--vscode-font-size);
        line-height: var(--vscode-workbench-widget-line-height);
        color: var(--vscode-workbench-foreground);
        background-color: var(--vscode-workbench-background);
        padding: 20px;
    }
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        background-color: var(--vscode-workbench-widget-background);
        border-radius: 4px;
        border: 1px solid var(--vscode-sideBar-border);
    }
    h1 {
        color: var(--vscode-settings-headerForeground);
        padding: 5px;
    }
    h1:hover {
        background-color:  var(--vscode-settings-focusedRowBackground);
    }
    .form-group {
        margin-bottom: 20px;
        transition: background-color 0.3s ease;
        padding: 10px;
        border-radius: 0px;
        border-left: 2px solid transparent;
    }
    .form-group:hover {
        background-color:  var(--vscode-settings-focusedRowBackground);
        border-left: 1px solid var(--vscode-focusBorder);
    }
    .form-group label {
        display: block;
        font-weight: bold;
        color: var(--vscode-settings-textInputForeground);
        margin-bottom: 5px;
    }
    .form-group p {
        margin-top: 0;
        color: var(--vscode-descriptionForeground);
    }
    .input-container {
        position: relative;
    }
    .input-container input {
        width: calc(100% - 40px);
        padding: 8px;
        background-color: var(--vscode-input-background);
        color: var(--vscode-input-foreground);
        border: 1px solid var(--vscode-input-border);
        border-radius: 4px;
        margin-top: 4px;
        padding-right: 40px;
    }
    .input-container .toggle-visibility {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        font-size: 1.5em;
        color: white;
    }
    .form-group input,
    .form-group textarea,
    .form-group select {
        width: calc(100% - 16px);
        padding: 8px;
        background-color: var(--vscode-input-background);
        color: var(--vscode-input-foreground);
        border: 1px solid var(--vscode-input-border);
        border-radius: 4px;
        margin-top: 4px;
    }
    .button {
        padding: 10px 20px;
        background-color: var(--vscode-button-background);
        color: var(--vscode-button-foreground);
        border: 1px solid var(--vscode-button-border);
        cursor: pointer;
        border-radius: 4px;
    }
    .button:hover {
        background-color: var(--vscode-button-hoverBackground);
        color: var(--vscode-button-hoverForeground);
    }
    .button:focus {
        outline: none;
    }
    /* Hide the default arrow */
    select {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-color: var(--vscode-input-background);
        color: var(--vscode-input-foreground);
        border: 1px solid var(--vscode-input-border);
        padding: 8px;
        padding-right: 30px;
        border-radius: 4px;
    }
    /* Style for container to ensure the custom arrow appears correctly */
    .select-container {
        position: relative;
        width: 100%;
    }
    .select-container .codicon {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none; /* Makes sure the icon doesn't interfere with select functionality */
        color: var(--vscode-input-foreground); /* Matches the icon color with the text color */
    }
    .error-message { /* New class for error messages */
        color: var(--vscode-errorForeground);
        margin-top: 5px;
        font-size: 0.9em;
        display: none; /* Hidden by default */
    }

`;
