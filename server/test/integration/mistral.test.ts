import { generateContent } from '../../src/copilot/llm/llmManager'; 
import { expect } from 'chai';
import 'dotenv/config';
import { getTestCases } from '../testcases';

const configString = process.env.MISTRAL_CONFIG;
const config = configString ? JSON.parse(configString) : null;

const testCases = getTestCases(config);

describe('Mistral API', function() {
    this.timeout(10000); // Set timeout to 10 seconds

    testCases.forEach(testCase => {
        it(`should generate content for: ${testCase.description}`, async function() {
            const documents = { main: testCase.documents.main }; 
            const generatedContent = await generateContent(config, documents, testCase.promptConfig);
            expect(generatedContent).to.be.a('string');
        });
    });
});
