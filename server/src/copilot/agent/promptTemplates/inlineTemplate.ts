import { ROLE_DESCRIPTION } from './guide';

export function getInlineTemplate(beforeCursor: string, afterCursor: string, promptConfig: any): Array<{ content: string, role: string }> {
    const { instruction, previousContent, language, previousError } = promptConfig;

    let messageArray: Array<{ content: string, role: string }> = [
        {
            content: ROLE_DESCRIPTION.COPILOT,
            role: "system"
        },
        {
            content: `${beforeCursor} /* Analyze the following code in ${language} and complete the code based on the context. ${instruction}. Remove this commented instruction in complete code. */ ${afterCursor}`,
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
        let userMessage = `Fix the following errors: ${previousError.map((e: any) => e.message).join('. ')}. Don't put comments in the code.`;
        messageArray.push({
            content: userMessage,
            role: "user"
        });
    }

    return messageArray;
}
