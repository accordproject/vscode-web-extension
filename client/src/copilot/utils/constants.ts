// Constants for VS Code prompts and error messages
export const ERROR_MESSAGES = {
    NO_ACTIVE_EDITOR: "No active editor found.",
    NO_API_KEY: "API key is required.",
    NO_API_URL: "API URL is required.",
    NO_MODEL_NAME: "Model name is required.",
    NO_MAX_TOKENS: "Max tokens is required.",
    NO_TEMPERATURE: "Temperature is required.",
    NO_ADDITIONAL_PARAMS: "Additional parameters are required.",
    GENERATE_CONTENT_ERROR: "Error generating content: ",
    OPENING_SAMPLE_FILE_ERROR: "Error opening sample file",
    OPENING_FILES_ERROR: "Error opening files"
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
    MISTRALAI: 'mistral-large-latest'
};

export const DEFAULT_LLM_ENDPOINTS = {
    GEMINI: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    OPENAI: 'https://api.openai.com/v1/chat/completions',
    MISTRALAI: 'https://api.mistral.ai/v1/chat/completions'
};
  
// Constants for Panel Manager
export const PANEL_MANAGER = {
    WEBVIEW_TITLE: 'Model Generation Wizard',
    FILE_GENERATING_STATE: 'updateGeneratingState',
    FILE_LIST_COMMAND: 'fileList'
};

// Constants for File Generators
export const FILE_GENERATORS = {
    GRAMMAR_FILE_NAME: 'grammar-ai-generated.md',
    MODEL_FILE_NAME: 'model-ai-generated.cto',
    GRAMMAR_FOLDER_PATTERN: '**/text/**',
    GRAMMAR_FOLDER_SUB_PATH: '/text/',
    MODEL_FOLDER_PATTERN: '**/model/**',
    MODEL_FOLDER_SUB_PATH: '/model/',
    GENERATE_GRAMMAR_FILE: 'generateGrammarFile',
    GENERATE_MODEL_FILE: 'generateModelFile',
    REQUEST_FILE_LIST: 'requestFileList'
};

// Constants for File Utils
export const FILE_UTILS = {
    FILE_LIST_EXCLUDE_PATTERN: '{**/node_modules/**,**/.*/**,**/*.!(cto|json|md)}',
    FOLDER_EXCLUDE_PATTERN: '**/node_modules/**'
};

export const ASSETS = {
    ACCORD_LOGO_DARK: 'assets/dark/accord_logo.png',
    ACCORD_LOGO_LIGHT: 'assets/light/accord_logo.png'
};

export const COPILOT_SETTINGS = {
    CONFIG_UPDATED_SUCCESS: 'Configuration updated successfully!',
    CONNECTION_SUCCESS: 'Connection to Copilot established successfully!',
    CONNECTION_FAILED: 'Connection to Copilot failed!',
    CONNECTION_FAILED_MESSAGE: 'Connection to Copilot failed! Please check your API key, billing status, and LLM model.',
};