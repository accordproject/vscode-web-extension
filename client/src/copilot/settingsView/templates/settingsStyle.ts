export const cssTemplate = `
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
    .form-group {
        margin-bottom: 20px;
        transition: background-color 0.3s ease;
        padding: 10px;
        border-radius: 0px;
        border-left: 2px solid transparent;
    }
    .form-group:hover {
        background-color: var(--list-hover-background);
        border-left: 1px solid var(--focus-border);
    }
    .form-group label {
        display: block;
        font-weight: bold;
        color: var(--text-input-foreground);
        margin-bottom: 5px;
    }
    .form-group p {
        margin-top: 0;
        color: var(--description-foreground);
    }
    .input-container {
        position: relative;
    }
    .input-container input {
        width: calc(100% - 40px);
        padding: 8px;
        background-color: var(--input-background);
        color: var(--input-foreground);
        border: 1px solid var(--input-border);
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
        background-color: var(--input-background);
        color: var(--input-foreground);
        border: 1px solid var(--input-border);
        border-radius: 4px;
        margin-top: 4px;
    }
    .button {
        padding: 10px 20px;
        background-color: var(--button-background);
        color: var(--button-foreground);
        border: 1px solid var(--button-border);
        cursor: pointer;
        border-radius: 4px;
    }
    .button:hover {
        background-color: var(--button-hover-background);
        color: var(--button-hover-foreground);
    }
    .button:focus {
        outline: none;
    }
    /* Hide the default arrow */
    select {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-color: var(--input-background);
        color: var(--input-foreground);
        border: 1px solid var(--input-border);
        padding: 8px;
        padding-right: 30px;
        border-radius: 4px;
    }
    
    .select-container {
        position: relative;
        width: 100%;
    }
    .select-container .codicon {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none; 
        color: var(--input-foreground); 
    }
    .error-message { /* New class for error messages */
        color: var(--error-foreground);
        margin-top: 5px;
        font-size: 0.9em;
        display: none; /* Hidden by default */
    }
`;
