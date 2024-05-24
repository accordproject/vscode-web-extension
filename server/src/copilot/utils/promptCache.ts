import { LRUCache } from 'lru-cache';

// Initialize LRU cache with a max size of 100 items
const cache = new LRUCache<string, any>({
  max: 100,
  // Optional: specify additional options as needed
  // ttl: 3600 * 1000, // Time to live in milliseconds (1 hour)
});

export function getPromptFromCache(prompt: string): any | undefined {
	// normalize the prompt before getting it from cache
	prompt = prompt.trim();
  	return cache.get(prompt);
}

export function setPromptToCache(prompt: string, value: any): void {

	// normalize the prompt before setting it to cache
	prompt = prompt.trim();
	cache.set(prompt, value);
}
