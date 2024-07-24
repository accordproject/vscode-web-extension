# VSCode Extension Server

This server is the backend part of our VSCode extension, responsible for handling language server capabilities, managing large language models (LLMs), and providing intelligent code suggestions.

## Table of Contents

- [User Guide](#user-guide)
  - [Input Format for Copilot](#input-format-for-copilot)
- [Developer Guide](#developer-guide) 
  - [Language Server Initialization](#language-server-initialization)
  - [LLM Manager](#llm-manager)
  - [Test Server](#test-server)
  - [Implementing a New LLM Provider](#implementing-a-new-llm-provider)


## User Guide

### Input Format for Copilot

The LLM Manager expects input in specific formats for document details, prompt configurations, and model configurations. Below are the interfaces for these inputs:

- **Document Details:**
  - `content`: string (The content of the document)
  - `cursorPosition`: number (Optional, The position of the cursor in the document)
  - `fileExtension`: string (Optional, The file extension of the document)
  - `fileName`: string (Optional, The name of the file)

- **Prompt Configuration:**
  - `requestType`: string ('inline' | 'general' | 'fix' | 'model' | 'grammar')
  - `instruction`: string (Optional, The instruction for the prompt)
  - `language`: string (Optional, The language of the document)
  - `previousContent`: string (Optional, The previous content for context)
  - `previousError`: any (Optional, The previous errors for context)

- **Model Configuration:**
  - `provider`: string (The LLM provider name)
  - `llmModel`: string (The specific LLM model to use)
  - `apiUrl`: string (Optional, The API URL for the LLM provider)
  - `accessToken`: string (The access token for the LLM provider)
  - `additionalParams`: object (Optional, Any additional parameters for the LLM)

#### Example
````bash
const documentDetails: DocumentDetails = {
    content: "function example() { return 42; }",
    cursorPosition: 10,
    fileExtension: ".js",
    fileName: "example.js"
};

const documents: Documents = {
    main: documentDetails
};

const promptConfig: PromptConfig = {
    requestType: 'inline',
    instruction: "Refactor the function to be more efficient.",
    language: "javascript"
};

const modelConfig: ModelConfig = {
    provider: "openai",
    llmModel: "text-davinci-002",
    apiUrl: "https://api.openai.com/v1/engines/davinci-codex/completions",
    accessToken: "YOUR_ACCESS_TOKEN"
};
````

## Developer Guide

### Language Server Initialization

The `browserServerMain.ts` file initializes the language server and sets up the connection with the VSCode client. It handles the following tasks:

- Initializes the language server capabilities.
- Tracks document open, change, and close events.
- Loads models and registers command handlers.

### LLM Manager

The `llmManager.ts` is responsible for managing interactions of user with different large language models (LLMs) such as Gemini, OpenAI, and Mistral for code generation. It handles:

- Generating content using the selected LLM provider.
- Generating embeddings for given text.
- Error handling and retry mechanisms on generated suggestions.

### Test Server

To run the test cases, use the following command:
```bash
npm run test
```
Before running the tests, ensure that you have the necessary environment variables set up in the .env file. Update the .env file with the required configurations for testing, such as API keys and model endpoints.

### Steps to Implement a New LLM Provider
To add a new LLM provider, follow the steps below.

1. **Implement the `LargeLanguageModel` Interface:**

    Create a new TypeScript file for your LLM provider in the `src/copilot/llm/providers/` directory. Implement the `LargeLanguageModel` interface, which includes the following methods:

    - `getIdentifier()`: Returns a unique identifier for the LLM provider.
    - `generateContent(config: any, promptArray: { content: string; role: string }[]): Promise<string>`: Generates content based on the provided prompt.
    - `generateEmbeddings(config: any, text: string): Promise<Embedding[]>`: Generates embeddings for the given text.
    - `getDocsEmbeddings(data: any, docType: string): number[]`: Retrieves document embeddings based on the provided data and document type.

2. **Register the New Provider:**

    After implementing the new LLM provider, register it in the LargeLanguageModelProvider class. Open `src/copilot/llm/llmProvider.ts` and add the registration logic.
    ```typescript
    constructor() {
        // existing providers
        this.register(YourLLMProvider); // Register your new provider here
    }
    ```

3. **Populate Embeddings:**

    Ensure that your new provider can generate embeddings for templates, grammar, and sample files. Update the embedding.ts file with the corresponding embeddings. Check the JSON strucutre of the deserialized object. For example for adding templates embeddings we follow this structure:
    ```JSON
    "embeddings": {
        "gemini": { "embedding": [/* ... */] },
        "mistralai": [/* ... */],
        "openai": [/* ... */]
        // Add your new provider here
    }
    ```
4. **Testing Your Provider Implementation:**

    To ensure your implementation works correctly, write integration tests for your new LLM provider. Create a new test file in test/integration/ and follow the structure of existing tests for other providers.

## Contact Us

For any questions please [join](https://discord.com/invite/Zm99SKhhtA) the Accord Project Discord community and post questions to the `#technology-concerto` channel.

---

Accord Project is an open source, non-profit, initiative working to transform contract management and contract automation by digitizing contracts. Accord Project operates under the umbrella of the [Linux Foundation][linuxfound]. The technical charter for the Accord Project can be found [here][charter].

### README Badge

Using Accord Project? Add a README badge to let everyone know: [![accord project](https://img.shields.io/badge/powered%20by-accord%20project-19C6C8.svg)](https://www.accordproject.org/)

```
[![accord project](https://img.shields.io/badge/powered%20by-accord%20project-19C6C8.svg)](https://www.accordproject.org/)
```


## License <a name="license"></a>

Accord Project source code files are made available under the [Apache License, Version 2.0][apache].
Accord Project documentation files are made available under the [Creative Commons Attribution 4.0 International License][creativecommons] (CC-BY-4.0).

Copyright 2018-2019 Clause, Inc. All trademarks are the property of their respective owners. See [LF Projects Trademark Policy](https://lfprojects.org/policies/trademark-policy/).

[linuxfound]: https://www.linuxfoundation.org
[charter]: https://github.com/accordproject/governance/blob/master/accord-project-technical-charter.md
[apmain]: https://accordproject.org/ 
[apblog]: https://medium.com/@accordhq
[apdoc]: https://docs.accordproject.org/
[apdiscord]: https://discord.com/invite/Zm99SKhhtA

[contributing]: https://github.com/accordproject/vscode-web-extension/blob/master/CONTRIBUTING.md
[developers]: https://github.com/accordproject/vscode-web-extension/blob/master/DEVELOPERS.md

[apache]: https://github.com/accordproject/vscode-web-extension/blob/master/LICENSE
[creativecommons]: http://creativecommons.org/licenses/by/4.0/