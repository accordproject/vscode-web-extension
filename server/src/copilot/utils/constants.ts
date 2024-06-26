export const ROLE_DESCRIPTION = {
    COPILOT: "You are a copilot assistant. Your task is to complete the code based on the context.",
    CONCERTO_COPILOT: "You are a copilot assistant. Your task is to convert a natural language description of a domain model or incomplete code of a domain model into a complete Accord Project Concerto model.",
    CONCERTO_GENERATOR: "You are a concerto model generator. Your task is to generate a domain model based on the provided requirements.",
};

export const EXAMPLES = {
    CONCERTO_MODEL: `Here is an annotated example Concerto model:\n\n\`\`\`\nnamespace <name of the namespace>@<version number> // the namespace and semantic version for the model. Semantic versions must be <major>.<minor>.<patch>. E.g. 'org.acme@1.0.0'.\n// All types must be defined in a single namespace. Do not use imports.\n\n[abstract] concept <concept name> identified by <identifying field name> { // defines a new concept, with a name. A concept may be declared as abstract. A concept may have an identifying property.\n  o <propery type>[] <property name> [optional] // add a property to a concept. For example, 'o String firstName optional' defines a property called 'firstName' of type 'String' that is optional. Add '[]' to the end of the type name to make the property an array. \n  // Primitive property types are: DateTime, String, Long, Double, Integer, Boolean\n  --> <relationship type> <relationship name> // adds a relationship to a concept. Concepts used in a relationship must have an identifying property.\n}\n\nscalar <name of scalar> extends <primitive type> // defines a scalar, a reusable primitive property\n\nenum <name of enum> { // defines an enumeration of values\n  o <value 1> // defines an enumerated value. enum values must only contain the letter A-Za-z0-9. They must not start with a number. They may not contain quotes or spaces.\n  o <value 2>\n}\n\n[abstract] concept <concept name> extends <super class> { // defines a concept that extends another concept\n}\n\`\`\`\n\nConcept and enumeration names within a model must be unique.\n`,
};

export const REGEX = {
    COMMENT: /\/\* Analyze the following code in .*? and complete the code based on the context. .*? Remove this commented instruction in complete code. \*\//g,
};

export const PROVIDERS = {
    GEMINI: 'gemini',
    OPENAI: 'openai',
    ANTHROPIC: 'anthropic',
    HUGGINGFACE: 'huggingface',
};

export const DEFAULTS = {
    MAX_RETRIES: 2,
    TEMP_DOCUMENT_EXTENSION: 'temp-document.',
    MAX_CACHE_ITEMS: 100 
};

export const LLM_ENDPOINTS = {
    GEMINI: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    OPENAI: 'https://api.openai.com/v1/chat/completions',
    ANTHROPIC: 'https://api.anthropic.com/v1/complete',
    HUGGINGFACE: 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1/v1/chat/completions'
};

export const LLM_EMDEDDINGS_ENDPOINTS = {
    GEMINI: 'https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent',
    OPENAI: 'https://api.openai.com/v1/embeddings'
};