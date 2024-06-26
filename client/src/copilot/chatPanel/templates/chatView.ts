import { getCommonStyles } from '../../utils/commonStyles';

export const htmlTemplate = (css: string, script: string): string => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://microsoft.github.io/vscode-codicons/dist/codicon.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/default.min.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/highlight.min.js"></script>
        <style>
            ${getCommonStyles}
            ${css}
        </style>
    </head>
    <body>
        <div id="chat-container">
            <div id="messages">
                <div class="message"><span class="codicon codicon-copilot"></span>&nbsp; Hi User, How can I help you!</div>
            </div>
            <div id="input-container">
                <textarea id="message-input" rows="1" placeholder="Ask Copilot something..."></textarea>
                <button id="send-button" disabled>Send</button>
            </div>
        </div>
        <script>
            ${script}
        </script>
    </body>
    </html>
`;
