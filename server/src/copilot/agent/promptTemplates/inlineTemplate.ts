import { ROLE_DESCRIPTION } from './guide';

export function getInlineTemplate(beforeCursor: string, afterCursor: string, promptConfig: any): Array<{ content: string, role: string }> {
    const { instruction, previousContent, language, previousError } = promptConfig;

    const messageArray: Array<{ content: string, role: string }> = [
        {
            content: ROLE_DESCRIPTION.COPILOT,
            role: "system"
        },
        {
            content: `${beforeCursor} /* The user's cursor is here. Analyze the following code in ${language} language and provide a suggestion to complete it according to this instruction from user: ${instruction}. Only add new code at the cursor position without modifying the existing code. Remove this comment in the final output. */ ${afterCursor}`,
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
        const userMessage = `Fix the following errors: ${previousError.map((e: any) => e.message).join('. ')}. Don't put comments in the code.`;
        messageArray.push({
            content: userMessage,
            role: "user"
        });
    }

    return messageArray;
}
