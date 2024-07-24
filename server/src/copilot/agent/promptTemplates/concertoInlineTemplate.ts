import { ROLE_DESCRIPTION, EXAMPLES } from './guide';

export function getConcertoInlineTemplate(beforeCursor: string, afterCursor: string, promptConfig: any): Array<{ content: string, role: string }> {
    const { instruction, previousContent, previousError } = promptConfig;

    const messageArray: Array<{ content: string, role: string }> = [
        {
            content: ROLE_DESCRIPTION.CONCERTO_COPILOT,
            role: "system"
        },
        {
            content: EXAMPLES.CONCERTO_MODEL,
            role: "user"
        },
        {
            content: `${beforeCursor} /* Analyze the following code in concerto and complete the code based on the context. ${instruction}. Remove this commented instruction in complete code. */ ${afterCursor}`,
            role: "user"
        }
    ];

    if (previousContent) {
        messageArray.push({
            content: previousContent,
            role: "system"
        });
    }

    if (previousError) {
        const userMessage = `Fix the following errors in previously outputed code: ${previousError.map((e: any) => e.message).join('. ')}. Don't put comments in the code.`;
        messageArray.push({
            content: userMessage,
            role: "user"
        });
    }

    return messageArray;
}
