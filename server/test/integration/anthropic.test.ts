import { generateContent } from '../../src/copilot/api/llmModelManager'; 
import { expect } from 'chai';
import 'dotenv/config';
import { getTestCases } from '../testcases';

const configString = process.env.ANTHROPIC_CONFIG;
const config = configString ? JSON.parse(configString) : null;

const testCases = getTestCases(config);

describe('Anthropic API', function() {
    this.timeout(10000); // Set timeout to 10 seconds

    testCases.forEach(testCase => {
        it(`should generate content for: ${testCase.description}`, async function() {
            const documents = { main: testCase.documents.main }; // Ensure documents object has a 'main' property
            const generatedContent = await generateContent(config, documents, testCase.promptConfig);
            expect(generatedContent).to.be.a('string');
        });
    });
});
