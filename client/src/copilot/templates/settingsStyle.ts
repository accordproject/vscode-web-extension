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
        background-color: var(--vscode-sideBar-background);
        border-radius: 4px;
        border: 1px solid var(--vscode-sideBar-border);
    }
    h1 {
        color: var(--vscode-settings-headerForeground);
    }
    .form-group {
        margin-bottom: 20px;
        transition: background-color 0.3s ease;
        padding: 10px;
        border-radius: 0px;
        border-left: 2px solid transparent;
    }
    .form-group:hover {
        background-color: rgba(255, 255, 255, 0.05);
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
    .form-group input,
    .form-group textarea {
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
`;
