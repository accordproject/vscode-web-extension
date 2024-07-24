import { log } from '../../state';

export class Lock {
    private isLocked: boolean;
    private waiting: Array<{ resolve: () => void, reject: (reason?: any) => void }>;
    private readonly maxWaiting: number;
    private releaseTimeout: number | null;
    private lockId: number;

    constructor(maxWaiting = 25, releaseTimeout: number | null = 30000) {
        this.isLocked = false;
        this.waiting = [];
        this.maxWaiting = maxWaiting;   // Maximum number of folks waiting to acquire the lock, bounded to prevent memory leaks
        this.releaseTimeout = releaseTimeout;
        this.lockId = 0;
    }

    async execute<T>(task: () => Promise<T>): Promise<T> {
        await this.acquire();
        try {
            return await task();
        } catch (error) {
            log(`Error occurred during task execution: ${error}`);
            throw error;
        } finally {
            this.release();
        }
    }

    acquire(): Promise<void> {
        return new Promise((resolve, reject) => {
            const lockTimeId = Date.now();
            // we should reject if we have too many folks waiting to acquire a lock
            if (this.waiting.length >= this.maxWaiting) {
                const errorMessage = `Too many waiting to acquire the lock. Event ID: ${lockTimeId}`;
                log(errorMessage);
                reject(new Error('Too many waiting to acquire the lock'));
            } else if (!this.isLocked) {
                this.isLocked = true;
                this.lockId = lockTimeId;
                log(`Lock acquired. Event ID: ${lockTimeId}`);
                resolve();
                this.setupTimeout();
            } else {
                this.waiting.push({ resolve, reject });
            }
        });
    }

    release(): void {
        if (this.waiting.length > 0) {
            const next = this.waiting.shift();
            if (next) {
                this.lockId = Date.now();
                log(`Lock transferred. Event ID: ${this.lockId}`);
                next.resolve();
                this.setupTimeout();
            }
        } else {
            log(`Lock released. Event ID: ${this.lockId}`);
            this.isLocked = false;
            this.clearTimeout();
        }
    }

    private setupTimeout() {
        // timeout to automatically release the lock if held for too long
        if (this.releaseTimeout !== null) {
            setTimeout(() => {
                if (this.isLocked) {
                    log(`Lock auto-released due to timeout. Event ID: ${this.lockId}`);
                    this.isLocked = false;
                    this.release();
                }
            }, this.releaseTimeout);
        }
    }

    private clearTimeout() {
        if (this.releaseTimeout !== null) {
            clearTimeout(this.releaseTimeout as number);
        }
    }
}
