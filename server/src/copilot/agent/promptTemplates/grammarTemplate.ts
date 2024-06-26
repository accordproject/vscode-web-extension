import { Documents } from '../../utils/types';

export function getGrammarTemplate(documents: Documents): Array<{ content: string; role: string }> {
  const { contextDocuments } = documents;

  let sampleContent = contextDocuments?.find(doc => doc.fileName === 'sample.md')?.content;

  const systemMessage = "You are an assistant that helps in generating grammar template files. A grammar template file uses placeholders for specific values, often represented by nouns, proper nouns, unique numbers, and context-specific terms, allowing for dynamic content generation.";

  let userMessage = `We need to convert the provided sample markdown content into a grammar template file by identifying and replacing specific values with placeholders. Consider nouns, proper nouns, unique numerical values, and context-specific terms as potential placeholders. Use double curly braces {{}} for placeholders, and provide meaningful names based on the context. For example:\n`;
  userMessage += `Sample: Eating healthy clause between "Alice" (the Employee) and "ACME" (the Company). The canteen only sells apple products. Apples, apple juice, apple flapjacks, toffee apples. Employee gets fired if caught eating anything without apples in it. THE EMPLOYEE, IF ALLERGIC TO APPLES, SHALL ALWAYS BE HUNGRY. Apple products at the canteen are subject to a 4.5% tax.\n`;
  userMessage += `Grammar: Eating healthy clause between {{employee}} (the Employee) and {{company}} (the Company). The canteen only sells apple products. Apples, apple juice, apple flapjacks, toffee apples. Employee gets fired if caught eating anything without apples in it. THE EMPLOYEE, IF ALLERGIC TO APPLES, SHALL ALWAYS BE HUNGRY. Apple products at the canteen are subject to a {{tax}}% tax.\n\n`;
  userMessage += `Use the following guidelines to create the grammar template:\n`;
  userMessage += `1. Identify nouns and proper nouns that represent specific values and replace them with placeholders.\n`;
  userMessage += `2. Identify unique numerical values and replace them with placeholders.\n`;
  userMessage += `3. Ensure the placeholders are enclosed in double curly braces {{}}. Don't use any quotes and newline characters around the placeholders.\n`;
  userMessage += `4. Provide meaningful placeholder names based on the context.\n`;
  userMessage += `5. Grammar templates look identical to the sample markdown content, but with placeholders instead of specific values.\n\n`;
  userMessage += `Here is the sample markdown file content whose grammar is needed to be generated:\n\n${sampleContent}\n\n`;
  userMessage += `Now, based on the information provided above, provide the grammar template from the sample markdown content by replacing specific values with placeholders. Only output the grammar template content.`;

  return [
    { 
      content: systemMessage, 
      role: "system" 
    },
    { 
      content: userMessage, 
      role: "user" 
    }
  ];
}
