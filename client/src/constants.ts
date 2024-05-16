// Constants for VS Code prompts and error messages
export const ERROR_MESSAGES = {
    NO_ACTIVE_EDITOR: "No active editor found.",
    NO_API_KEY: "API key is required.",
    NO_API_URL: "API URL is required.",
    NO_MODEL_NAME: "Model name is required.",
    NO_MAX_TOKENS: "Max tokens is required.",
    NO_TEMPERATURE: "Temperature is required.",
    NO_ADDITIONAL_PARAMS: "Additional parameters are required."
};

// General constants
export const GENERAL = {
    ACTIVATION_MESSAGE: 'Accord Project Extension activated',
    CLIENT_READY_MESSAGE: 'Accord Project client is ready',
    QUICK_PICK_PLACEHOLDER: 'Choose an action',
    QUICK_PICK_OPTION_SETTINGS: '$(gear)  Open Copilot Settings',
    QUICK_PICK_OPTION_SUGGESTIONS: '$(copilot)  Get Inline Suggestions',
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
    ENTER_ADDITIONAL_PARAMS: "Enter additional parameters as a JSON string"
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
    modelName: 'gpt-4',
    maxTokens: 100,
    temperature: 0.7,
    additionalParams: {}
};




  
  