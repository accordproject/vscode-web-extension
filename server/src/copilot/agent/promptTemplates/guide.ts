export const DOCUMENTATION = {
    TRANSACTIONS: `
		### Transaction Contents and Structure
		A transaction represents an event within the contract's lifecycle and includes data needed to process this event. Follow these guidelines:
		1. **Identify Events**: Determine the key events in the contract lifecycle that require transactions.
		2. **Define Attributes**: Specify attributes for the transaction based on the event's data requirements. Use variables from the grammar template and relevant namespaces.
		3. **Follow Examples**: Refer to example model CTOs to structure the transactions correctly.
	`,
    NAMESPACES: `
		### Useful Namespaces and Their Objects
		Namespaces define types that can be used in your model. Use the following format to import specific versions of namespaces:
		Use these namespaces to assign appropriate data types to variables. If no suitable type exists, use primitive types or create a new asset or concept.
    `,
    NAMESPACE_IMPORTS: `
		### Namespace Imports
		1. **Basic Import Syntax**: Use the \`import\` keyword followed by the namespace and version information.
		2. **URL Formation**: Namespace URLs follow the format \`https://models.accordproject.org/accordproject/<namespace>@<version>.cto\`. Replace \`<namespace>\` and \`<version>\` with the appropriate values.
		3. Don't use wildcard imports (e.g., \`*\`). Instead, you must import specific types. For example:
		Single Import: \`import org.accordproject.time@0.3.0.Duration from https://models.accordproject.org/accordproject/time@0.3.0.cto\`
		Multiple Import: \`import org.accordproject.time@0.3.0.{ Duration, Period } from https://models.accordproject.org/accordproject/time@0.3.0.cto\`
	`,
	NAMESPACE_INFORMATION: `
		### Namespace Information
		Each Concerto file (by convention with a .cto file extension) starts with the name and version of a single namespace. A Concerto namespace declares a set of declarations. A declaration is one of: enumeration, scalar, concept, asset, participant, transaction, event.
		All declarations within a single file belong to the same namespace.
		Example:
		\`\`\`
		namespace org.acme@1.0.0 // declares version 1.0.0 of the org.acme namespace
		/**
		 * This is a multiline code comment. Version 1.0.0 of
		 * the org.acme namespace declares a single concept 'Address'.
		 */
		concept Address {
			o String street // 'String' is a primitive type
			o String city
			o String postCode optional // this is a single line code comment
			o String country
		}
		\`\`\`
	`,
    PACKAGE_JSON_INFO: `
		### Package JSON
		This file contains template information.

		### Mapping Information from Package JSON
		1. **Namespace Mapping**: The namespace in model.cto should follow the format \`org.accordproject.<name>\`. The \`<name>\` is derived from the \`name\` field in package.json. For example, if \`name\` in package.json is 'contract-name', the namespace in model.cto should be 'org.accordproject.contract-name'.
		2. **Template**: The \`accordproject\` field in package.json specifies the template type. Ensure the model CTO adheres to the specified template type. For example:
		- Template Type: \`"template": "clause"\`
	`,
	PROPERTY_DECLARATION_DESCRIPTION: `
		A property of a class may be declared as a relationship using the --> syntax instead of the o syntax. The o syntax declares that the class contains (has-a) property of that type, whereas the --> syntax declares a typed pointer to an external identifiable instance.
	`,
    GRAMMAR_MARKDOWN_DESCRIPTION: `
		### Grammar Markdown
		This file provides variable information for the asset, which extends <clause/contract or other alias as per package.json>. The asset includes all variables mentioned within {{ }} brackets. Below is the grammar.md file for which we need to generate model cto:
	`,
	GRAMMAR_TEMPLATE_GUIDELINES: `
		### Guidelines for Grammar Template Creation
		1. Identify nouns and proper nouns that represent specific values and replace them with placeholders.
		2. Identify unique numerical values and replace them with placeholders.
		3. Ensure the placeholders are enclosed in double curly braces {{}}. Don't use any quotes or newline characters around the placeholders.
		4. Provide meaningful placeholder names based on the context.
	`
};

export const MODEL_GENERATION_INSTRUCTIONS = {
	INSTRUCTIONS: `
        ### Instructions for Model CTO Generation
        1. Create an asset extending Contract with variables from the grammar file.
        2. Define Request and Response transactions.
        3. Use types from the provided namespaces. If no suitable type exists, use primitive types or create a new asset or concept.
        4. Follow proper indentation and structure.
        5. Follow syntax of concerto language.
    `,
    FINAL_CHECKLIST: `
        ### Final Checklist
        - [ ] Namespace declaration before imports is mandatory for the model and it should include version.
        - [ ] All imports are specific (no wildcards) and include versions and corresponding source URL.
        - [ ] Asset extending Contract is defined.
        - [ ] Request and Response transactions are defined.
        - [ ] No comments in the generated code.
        - [ ] Proper indentation and structure.
    `
}

export const ROLE_DESCRIPTION = {
    COPILOT: "You are a copilot assistant. Your task is to complete the code based on the context.",
    CONCERTO_COPILOT: "You are a copilot assistant. Your task is to convert a natural language description of a domain model or incomplete code of a domain model into a complete Accord Project Concerto model.",
    CONCERTO_GENERATOR: "You are a concerto model generator. Your task is to generate a domain model based on the provided requirements.",
	GRAMMAR_GENERATOR: "You are an assistant that helps in generating grammar template files. A grammar template file uses placeholders for specific values, often represented by nouns, proper nouns, unique numbers, and context-specific terms, allowing for dynamic content generation."
};

export const EXAMPLES = {
    CONCERTO_MODEL: `Here is an annotated example Concerto model:\n\n\`\`\`\nnamespace <name of the namespace>@<version number> // the namespace and semantic version for the model. Semantic versions must be <major>.<minor>.<patch>. E.g. 'org.acme@1.0.0'.\n// All types must be defined in a single namespace. Do not use imports.\n\n[abstract] concept <concept name> identified by <identifying field name> { // defines a new concept, with a name. A concept may be declared as abstract. A concept may have an identifying property.\n  o <propery type>[] <property name> [optional] // add a property to a concept. For example, 'o String firstName optional' defines a property called 'firstName' of type 'String' that is optional. Add '[]' to the end of the type name to make the property an array. \n  // Primitive property types are: DateTime, String, Long, Double, Integer, Boolean\n  --> <relationship type> <relationship name> // adds a relationship to a concept. Concepts used in a relationship must have an identifying property.\n}\n\nscalar <name of scalar> extends <primitive type> // defines a scalar, a reusable primitive property\n\nenum <name of enum> { // defines an enumeration of values\n  o <value 1> // defines an enumerated value. enum values must only contain the letter A-Za-z0-9. They must not start with a number. They may not contain quotes or spaces.\n  o <value 2>\n}\n\n[abstract] concept <concept name> extends <super class> { // defines a concept that extends another concept\n}\n\`\`\`\n\nConcept and enumeration names within a model must be unique.\n`,
};