export function getInlineTemplate(beforeCursor: string, afterCursor: string, language: string, instruction: string): Array<{ content: string, role: string }> {
    return [
        {
            content: "You are a copilot assistant. Your task is to convert a natural language description of a domain model or incomplete code of a domain model into a complete Accord Project Concerto model.",
            role: "system"
        },
        {
            content: `${beforeCursor} /* Analyze the following code in ${language} and complete the code based on the context. ${instruction}. Remove this commented instruction in complete code. */ ${afterCursor}`,
            role: "user"
        }
    ];
}

export const commentRegex = /\/\* Analyze the following code in .*? and complete the code based on the context. .*? Remove this commented instruction in complete code. \*\//g;
