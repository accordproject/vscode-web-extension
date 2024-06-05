export function getGeneralTemplate(content: string): Array<{ content: string, role: string }> {
    return [
        {
            content: `${content}`,
            role: "user"
        }
    ];
}
