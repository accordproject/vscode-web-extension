import { getGeneralTemplate } from './promptTemplates/generalTemplate';
import { getConcertoInlineTemplate } from './promptTemplates/concertoInlineTemplate';
import { getInlineTemplate } from './promptTemplates/inlineTemplate';
import { AgentPlannerParams } from '../utils/types';

export async function agentPlanner(params: AgentPlannerParams): Promise<{ content: string; role: string; }[]> {
    const { documentDetails, promptConfig } = params;
    const { content, cursorPosition } = documentDetails;
    const { requestType, language, instruction } = promptConfig;

    const beforeCursor = content.slice(0, cursorPosition);
    const afterCursor = content.slice(cursorPosition);
    
    let prompt;
    if (requestType === 'inline' && language === 'concerto') {
        prompt = getConcertoInlineTemplate(beforeCursor, afterCursor, promptConfig);
    } else if (requestType === 'inline' && language !== 'concerto') {
        prompt = getInlineTemplate(beforeCursor, afterCursor, promptConfig);
    } else if (requestType === 'general') {
        prompt = getGeneralTemplate(content);
    } else {
        throw new Error('Unsupported request type');
    }

    return prompt;
}
