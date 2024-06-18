// Constants for VS Code prompts and error messages
export const ERROR_MESSAGES = {
    NO_ACTIVE_EDITOR: "No active editor found.",
    NO_API_KEY: "API key is required.",
    NO_API_URL: "API URL is required.",
    NO_MODEL_NAME: "Model name is required.",
    NO_MAX_TOKENS: "Max tokens is required.",
    NO_TEMPERATURE: "Temperature is required.",
    NO_ADDITIONAL_PARAMS: "Additional parameters are required.",
    GENERATE_CONTENT_ERROR: "Error generating content: "
};

// General constants
export const GENERAL = {
    ACTIVATION_MESSAGE: 'Accord Project Extension activated',
    CLIENT_READY_MESSAGE: 'Accord Project client is ready',
    QUICK_PICK_STATUS_OK: '$(copilot)  Status:  Ready',
    QUICK_PICK_STATUS_ERROR: '$(copilot)  Status:  Configuration Error',
    QUICK_PICK_PLACEHOLDER: 'Choose an action',
    QUICK_PICK_OPTION_CHAT_AGENT: 'Open Chat Agent',
    QUICK_PICK_OPTION_SETTINGS: '$(gear)  Open Copilot Settings',
    QUICK_PICK_OPTION_SUGGESTIONS: '$(copilot)  Get Inline Suggestions',
    QUICK_PICK_OPTION_ENABLE_INLINE_SUGGESTIONS: 'Enable Inline Suggestions',
    QUICK_PICK_OPTION_DISABLE_INLINE_SUGGESTIONS: 'Disable Inline Suggestions',
    QUICK_PICK_OPTION_ENABLE_CODE_ACTIONS: 'Enable Code Actions',
    QUICK_PICK_OPTION_DISABLE_CODE_ACTIONS: 'Disable Code Actions',
    QUICK_PICK_SEPARATOR: '<hr/>',
    PATTERN_ALL_FILES: '**/*'
};

// Constants for prompts
export const PROMPTS = {
    INPUT_BOX: "Enter your prompt for AI-driven suggestion",
    ENTER_API_KEY: "Enter your API key",
    ENTER_API_URL: "Enter the API URL",
    ENTER_MODEL_NAME: "Enter the model name",
    ENTER_MAX_TOKENS: "Enter the maximum number of tokens",
    ENTER_TEMPERATURE: "Enter the temperature value",
    ENTER_ADDITIONAL_PARAMS: "Enter additional parameters as a JSON string",
    GENERATING_CODE: "Generating code...  Please wait."
};

// Constants for status bar
export const STATUS_BAR = {
    TEXT: '$(copilot) Accord Copilot',
    TOOLTIP: 'Click to access Accord Copilot settings or suggestions',
    COMMAND: 'cicero-vscode-extension.showQuickPick',
    PRIORITY: 100
};

// Constants for line range calculations
export const LINE_RANGE = {
    START_OFFSET: 10,
    END_OFFSET: 10
};

// Default configuration values
export const CONFIG_DEFAULTS = {
    apiKey: '',
    apiUrl: '',
    provider: '',
    llmModel: '',
    additionalParams: {
        topP: 1.0,
        maxTokens: 100,
        temperature: 0.8
    }
};

// Constants for chatPanel.ts
export const CHAT_PANEL = {
    TITLE: 'Accord Assistant',
    NEW_MESSAGE_ICON: '<span class="codicon codicon-person"></span>&nbsp;',
    THINKING_MESSAGE: '<span class="codicon codicon-copilot"></span>&nbsp; Thinking...',
    ERROR_MESSAGE: '<span class="codicon codicon-copilot"></span>&nbsp; Unable to generate a response at this time.'
};

// Default LLM models for providers
export const DEFAULT_LLM_MODELS = {
    GEMINI: 'gemini-pro',
    OPENAI: 'gpt-3.5-turbo',
    ANTHROPIC: 'claude-1.5',
    HUGGINGFACE_MISTRAL: 'Mistral-7B-Instruct-v0.1'
};

export const DEFAULT_LLM_ENDPOINTS = {
    GEMINI: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    OPENAI: 'https://api.openai.com/v1/chat/completions',
    ANTHROPIC: 'https://api.anthropic.com/v1/complete',
    HUGGINGFACE: 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1/v1/chat/completions'
};
  
  