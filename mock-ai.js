const http = require('http');

const server = http.createServer((req, res) => {
    // Set headers to allow VS Code to talk to us (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            console.log('Received request:', body); // See what VS Code sends!

            // 1. Mock response for OpenAI format
            const mockResponse = {
                id: "mock-response-123",
                object: "chat.completion",
                created: Date.now(),
                choices: [{
                    index: 0,
                    message: {
                        role: "assistant",
                        content: "Hello! I am a MOCK AI running on your system. I received your code!"
                    },
                    finish_reason: "stop"
                }]
            };

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(mockResponse));
        });
    }
});

const PORT = 11434; // Same port as Ollama!
server.listen(PORT, () => {
    console.log(`🤖 Mock AI Server running at http://localhost:${PORT}`);
    console.log(`Ready to trick the extension into thinking I am a supercomputer.`);
});