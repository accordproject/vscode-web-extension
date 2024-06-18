export function getFixTemplate(content: string, promptConfig: any): Array<{ content: string, role: string }> {
    const { instruction } = promptConfig;

    return [
        {
            content: `${content} // The above code have this error: ${instruction}. Provide the analysis and fixed code. Remove this comment in the fixed code of the analysis.`,
            role: "user"
        }
    ];
}
