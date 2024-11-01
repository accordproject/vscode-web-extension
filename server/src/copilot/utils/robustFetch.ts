import { log } from '../../state';

export async function robustFetch(url: string, options: RequestInit, maxRetries = 3, timeout = 30000): Promise<Response> {
    let attempts = 0;

    while (attempts < maxRetries) {
        attempts++;

        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeout);
            const response = await fetch(url, { ...options, signal: controller.signal });

            clearTimeout(id);

            if (!response.ok) {
                log(`Attempt ${attempts}: Fetch failed with status ${response.status}`);
                throw new Error(`Fetch failed with status ${response.status}`);
            }

            return response;
        } catch (error: any) {
            log(`Attempt ${attempts}: Fetch error - ${error.message}`);
            if (attempts >= maxRetries) {
                throw new Error(`Fetch failed after ${attempts} attempts: ${error.message}`);
            }
            await new Promise(res => setTimeout(res, Math.pow(2, attempts) * 100)); 
        }
    }

    throw new Error('Fetch failed');
}