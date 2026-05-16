export function getGeneralTemplate(promptConfig: any): Array<{ content: string, role: string }> {
    const { instruction } = promptConfig;
    return [
        {
            content: `Q: ${instruction}\nA:`,
            role: "user"
        }
    ];
}
