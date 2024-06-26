export const wizardStyle = `
    body {
        font-family: var(--font-family);
        font-size: var(--font-size);
        line-height: var(--line-height);
        color: var(--foreground);
        background-color: var(--background);
        padding: 20px;
    }
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        background-color: var(--container-background);
        border-radius: 4px;
        border: 1px solid var(--container-border);
    }
    h1 {
        color: var(--header-foreground);
        padding: 5px;
    }
    h1:hover {
        background-color: var(--hover-background);
    }
    h2 {
        color: var(--description-foreground);
        margin-top: 20px;
    }
    hr {
        border: 0.2px solid;
        border-top: 1px solid var(--container-border);
        margin-top: 20px;
    }
    .form-group {
        transition: background-color 0.3s ease;
        padding: 10px;
        border-radius: 4px;
        border-left: 2px solid transparent;
    }
    .form-group:hover {
        background-color: var(--list-hover-background);
        border-left: 2px solid var(--focus-border);
    }
    .form-group label {
        display: block;
        font-weight: bold;
        color: var(--text-input-foreground);
        margin-bottom: 5px;
    }
    .select-container {
        display: flex;
        align-items: center;
        position: relative;
    }
    .select-container select {
        width: 100%;
        padding: 8px;
        border: 1px solid var(--input-border);
        border-radius: 4px;
        background-color: var(--input-background);
        color: var(--input-foreground);
        appearance: none;
    }
    .select-container .codicon {
        position: absolute;
        right: 10px;
        pointer-events: none;
    }
    .button {
        display: inline-flex;
        align-items: center;
        padding: 10px 20px;
        background-color: var(--button-background);
        color: var(--button-foreground);
        border: 1px solid var(--button-border);
        cursor: pointer;
        border-radius: 4px;
        margin-top: 10px;
        position: relative;
    }
    .button:hover {
        background-color: var(--button-hover-background);
        color: var(--button-hover-foreground);
    }
    .button:focus {
        outline: none;
    }
    .button .button-text {
        flex: 1;
    }
    .button .spinner {
        margin-left: 10px;
    }
    .blue-button {
        background-color: #007acc;
    }
    .blue-button:hover {
        background-color: #005ea6;
    }
    .input-file {
        display: block;
        margin-top: 10px;
    }
    .file-picker-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-height: 80%;
        width: 50%;
        overflow-y: auto;
        background-color: var(--input-background);
        border: 1px solid var(--container-border);
        border-radius: 4px;
        padding: 10px;
        z-index: 1000;
    }
    .file-item {
        padding: 5px;
        border-bottom: 1px solid var(--container-border);
        cursor: pointer;
        color: var(--foreground);
    }
    .file-item:hover {
        background-color: var(--hover-background);
    }
    .file-path {
        display: block;
        margin-top: 10px;
        color: var(--description-foreground);
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    .spinner {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        margin-top: 10px;
        color: white;
    }
    .spinner .codicon {
        animation: spin 1s linear infinite;
    }
    .spinner.hidden {
        display: none;
    }
    .error {
        color: var(--error-foreground);
        margin-top: 10px;
        padding: 10px;
        border: 1px solid var(--error-foreground);
        border-radius: 4px;
    }
    .error.hidden {
        display: none;
    }
`;
