export const scriptTemplate = `
(function() {
    const vscode = acquireVsCodeApi();

    const messagesContainer = document.getElementById('messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    const sendMessage = () => {
        const message = messageInput.value;
        if (message) {
            vscode.postMessage({ type: 'sendMessage', text: message });
            messageInput.value = '';
            sendButton.disabled = true;
        }
    };

    messageInput.addEventListener('input', () => {
        sendButton.disabled = !messageInput.value.trim();
    });

    sendButton.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    window.addEventListener('message', event => {
        const message = event.data;
        if (message.type === 'newMessage') {
            const messageElement = document.createElement('div');
            messageElement.className = 'message';
            messageElement.innerHTML = message.text;
            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            hljs.highlightAll();
        } else if (message.type === 'removeThinking') {
            const thinkingMessage = document.querySelector('.message-thinking');
            if (thinkingMessage) {
                thinkingMessage.remove();
            }
        } else if (message.type === 'thinking') {
            const thinkingMessage = document.createElement('div');
            thinkingMessage.className = 'message message-thinking';
            thinkingMessage.innerHTML = message.text;
            messagesContainer.appendChild(thinkingMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    });
})();
`;
