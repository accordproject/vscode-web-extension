export function getConcertoInlineTemplate(beforeCursor: string, afterCursor: string, instruction: string): Array<{ content: string, role: string }> {
    return [
        {
            content: "You are a copilot assistant. Your task is to convert a natural language description of a domain model or incomplete code of a domain model into a complete Accord Project Concerto model.",
            role: "system"
        },
        {
            content: `Here is an annotated example Concerto model:\n\n\`\`\`\nnamespace <name of the namespace>@<version number> // the namespace and semantic version for the model. Semantic versions must be <major>.<minor>.<patch>. E.g. 'org.acme@1.0.0'.\n// All types must be defined in a single namespace. Do not use imports.\n\n[abstract] concept <concept name> identified by <identifying field name> { // defines a new concept, with a name. A concept may be declared as abstract. A concept may have an identifying property.\n  o <propery type>[] <property name> [optional] // add a property to a concept. For example, 'o String firstName optional' defines a property called 'firstName' of type 'String' that is optional. Add '[]' to the end of the type name to make the property an array. \n  // Primitive property types are: DateTime, String, Long, Double, Integer, Boolean\n  --> <relationship type> <relationship name> // adds a relationship to a concept. Concepts used in a relationship must have an identifying property.\n}\n\nscalar <name of scalar> extends <primitive type> // defines a scalar, a reusable primitive property\n\nenum <name of enum> { // defines an enumeration of values\n  o <value 1> // defines an enumerated value. enum values must only contain the letter A-Za-z0-9. They must not start with a number. They may not contain quotes or spaces.\n  o <value 2>\n}\n\n[abstract] concept <concept name> extends <super class> { // defines a concept that extends another concept\n}\n\`\`\`\n\nConcept and enumeration names within a model must be unique.\n`,
            role: "user"
        },
        {
            content: `${beforeCursor} /* Analyze the following code in concerto and complete the code based on the context. ${instruction}. Remove this commented instruction in complete code. */ ${afterCursor}`,
            role: "user"
        }
    ];
}
