import { getGeneralTemplate } from './promptTemplates/generalTemplate';
import { getConcertoInlineTemplate } from './promptTemplates/concertoInlineTemplate';
import { getInlineTemplate } from './promptTemplates/inlineTemplate';
import { getFixTemplate } from './promptTemplates/fixTemplate';
import { AgentPlannerParams, RequestType, Language } from '../utils/types';

export async function agentPlanner(params: AgentPlannerParams): Promise<Array<{ content: string; role: string }>> {
  const { documentDetails, promptConfig } = params;
  const { content, cursorPosition } = documentDetails;
  const { requestType, language } = promptConfig;

  const beforeCursor = content.slice(0, cursorPosition);
  const afterCursor = content.slice(cursorPosition);

  let prompt;
  switch (requestType) {
    case RequestType.Inline:
      prompt = language === Language.Concerto
        ? getConcertoInlineTemplate(beforeCursor, afterCursor, promptConfig)
        : getInlineTemplate(beforeCursor, afterCursor, promptConfig);
      break;
    case RequestType.Fix:
      prompt = getFixTemplate(content, promptConfig);
      break;
    case RequestType.General:
      prompt = getGeneralTemplate(promptConfig);
      break;
    default:
      throw new Error('Unsupported request type');
  }

  return prompt;
}