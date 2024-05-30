export const cssTemplate = `
#chat-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    color: var(--vscode-descriptionForeground);
    // color: var(--vscode-editorCommentsWidget-replyInputBackground);
    background-color: var(--vscode-sideBar-background);
}

#messages {
    flex-grow: 1;
    overflow-y: auto;
    padding: 10px;
    border: 1px solid #ccc;
    margin-bottom: 10px;
    border-radius: 4px;
    // background-color: var(--vscode-input-foreground);
    background-color: var(--vscode-workbench-background);
}

#messages .message {
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
    background-color: var(--vscode-input-background);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

#input-container {
    display: flex;
    align-items: center;
    margin-top: 1em;
    background-color: var(--vscode-workbench-background);

}

#message-input {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 10px;
    box-sizing: border-box;
    resize: vertical;
    max-height: 200px;
    overflow-y: auto;
    color: var(--vscode-descriptionForeground);
    background-color: var(--vscode-workbench-background);
}

#message-input::placeholder {
  color: var(--vscode-descriptionForeground);
}

#send-button {
    padding: 10px 20px;
    background-color: #007acc;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

#send-button:disabled {
    // background-color: #cccccc;
    cursor: not-allowed;
}
`;
