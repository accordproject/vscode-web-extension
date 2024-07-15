export class Lock {
    private isLocked: boolean;
    private waiting: Array<{ resolve: () => void, reject: (reason?: any) => void }>;
    private readonly maxWaiting: number;
    private releaseTimeout: number | null;

    constructor(maxWaiting: number = 25, releaseTimeout: number | null = 30000) {
        this.isLocked = false;
        this.waiting = [];
        this.maxWaiting = maxWaiting;   // Maximum number of folks waiting to acquire the lock, bounded to prevent memory leaks
        this.releaseTimeout = releaseTimeout;
    }

    acquire(): Promise<void> {
        return new Promise((resolve, reject) => {
            // we should reject if we have too many folks waiting to acquire a lock
            if (this.waiting.length >= this.maxWaiting) {
                reject(new Error('Too many waiting to acquire the lock'));
            } else if (!this.isLocked) {
                this.isLocked = true;
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
                next.resolve();
                this.setupTimeout();
            }
        } else {
            this.isLocked = false;
            this.clearTimeout();
        }
    }

    private setupTimeout() {
        // timeout to automatically release the lock if held for too long
        if (this.releaseTimeout !== null) {
            setTimeout(() => {
                if (this.isLocked) {
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
