export const cssTemplate = `
    #chat-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
        color: var(--description-foreground);
        background-color: var(--container-background);
    }

    #messages {
        flex-grow: 1;
        overflow-y: auto;
        padding: 10px;
        border: 1px solid var(--container-border);
        margin-bottom: 10px;
        border-radius: 4px;
        background-color: var(--background);
    }

    #messages .message {
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 4px;
        background-color: var(--input-background);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    #input-container {
        display: flex;
        align-items: center;
        margin-top: 1em;
        background-color: var(--container-background);
    }

    #message-input {
        flex-grow: 1;
        padding: 10px;
        border: 1px solid var(--container-border);
        border-radius: 4px;
        margin-right: 10px;
        box-sizing: border-box;
        resize: vertical;
        max-height: 200px;
        overflow-y: auto;
        color: var(--description-foreground);
        background-color: var(--input-background);
    }

    #message-input::placeholder {
        color: var(--description-foreground);
    }

    #send-button {
        padding: 10px 20px;
        background-color: var(--button-background);
        color: var(--button-foreground);
        border: 1px solid var(--button-border);
        border-radius: 4px;
        cursor: pointer;
    }

    #send-button:disabled {
        background-color: var(--button-hover-background);
        cursor: not-allowed;
    }
`;
