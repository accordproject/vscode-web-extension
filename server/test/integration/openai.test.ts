import { generateContent } from '../../src/copilot/api/llmModelManager'; 
import { expect } from 'chai';
import 'dotenv/config';
import { getTestCases } from '../testcases';

// Load config from environment variable
const configString = process.env.OPENAI_CONFIG;
const config = configString ? JSON.parse(configString) : null;

// Load test cases
const testCases = getTestCases(config);

describe('OpenAI API', function() {
    this.timeout(10000); // Set timeout to 10 seconds

    testCases.forEach(testCase => {
        it(`should generate content for: ${testCase.description}`, async function() {
            const documents = { main: testCase.documents.main };
            const generatedContent = await generateContent(config, documents, testCase.promptConfig);
            expect(generatedContent).to.be.a('string');
        });
    });
});
