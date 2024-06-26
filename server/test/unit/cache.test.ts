import { generateContent } from '../../src/copilot/api/llmModelManager'; 
import { expect } from 'chai';
import { LRUCache } from 'lru-cache';
import 'dotenv/config';
import { getUnitTestCase } from '../testcases';
import { getPromptFromCache, setPromptToCache } from '../../src/copilot/utils/promptCache';

const configString = process.env.ANTHROPIC_CONFIG || process.env.OPENAI_CONFIG || process.env.GEMINI_CONFIG || process.env.HUGGINGFACE_CONFIG;
if (!configString) {
    throw new Error('No configuration found in environment variables.');
}
const config = JSON.parse(configString);

const testCase = getUnitTestCase(config);

describe('Cache Test', function() {
    this.timeout(10000); // Set timeout to 10 seconds

    let firstRunContent: string;

    // Run the test case the first time and store the response
    it(`should generate content for: ${testCase.description} (First Run)`, async function() {
        const documents = { main: testCase.documents.main };
        firstRunContent = await generateContent(config, documents, testCase.promptConfig);
        expect(firstRunContent).to.be.a('string');
    });

    // Run the test case the second time and compare the response with the first run
    it(`should generate content for: ${testCase.description} (Second Run)`, async function() {
        const documents = { main: testCase.documents.main };
        const secondRunContent = await generateContent(config, documents, testCase.promptConfig);
        expect(secondRunContent).to.be.a('string');
        expect(secondRunContent).to.equal(firstRunContent, 'The second run content should match the first run content (cached response)');
    });

    // Test cache miss scenario
    it('should store new prompt in cache if not present', async function() {
        const prompt = "function newFunction() { return 'new'; }";
        const cachedResponse = getPromptFromCache(prompt);
        expect(cachedResponse).to.be.undefined;
        const documents = { main: testCase.documents.main };
        const generatedContent = await generateContent(config, documents, { requestType: 'inline', language: 'TypeScript' });
        setPromptToCache(prompt, generatedContent);
        
        const cachedAfterSet = getPromptFromCache(prompt);
        expect(cachedAfterSet).to.equal(generatedContent);
    });

    // Test cache hit scenario
    it('should return cached response if prompt is already in cache', async function() {
        const prompt = "function cachedFunction() { return 'cached'; }";
        const generatedContent = "cached response";
        setPromptToCache(prompt, generatedContent);
        
        const cachedResponse = getPromptFromCache(prompt);
        expect(cachedResponse).to.equal(generatedContent);
    });

    // Test cache eviction scenario
    it('should evict the least recently used item when cache is full', function() {
        const maxItems = 5;
        const testCache = new LRUCache<string, string>({ max: maxItems });

        for (let i = 0; i < maxItems; i++) {
            testCache.set(`key${i}`, `value${i}`);
        }

        // Add one more item to exceed the cache limit
        testCache.set('key5', 'value5');

        // The first inserted item should be evicted
        expect(testCache.has('key0')).to.be.false;
        expect(testCache.has('key1')).to.be.true;
    });

    // Test prompt normalization
    it('should normalize prompt before caching', function() {
        const prompt = "   function normalizedFunction() { return 'normalized'; }   ";
        const trimmedPrompt = prompt.trim();
        const generatedContent = "normalized response";

        setPromptToCache(prompt, generatedContent);

        const cachedResponse = getPromptFromCache(trimmedPrompt);
        expect(cachedResponse).to.equal(generatedContent);
    });

});
