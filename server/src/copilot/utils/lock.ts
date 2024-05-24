export class Lock {
    private isLocked: boolean;
    private waiting: Array<() => void>;

    constructor() {
        this.isLocked = false;
        this.waiting = [];
    }

    acquire(): Promise<void> {
        return new Promise((resolve) => {
            if (!this.isLocked) {
                this.isLocked = true;
                resolve();
            } else {
                this.waiting.push(resolve);
            }
        });
    }

    release(): void {
        if (this.waiting.length > 0) {
            const nextResolve = this.waiting.shift();
            if (nextResolve) {
                nextResolve();
            }
        } else {
            this.isLocked = false;
        }
    }
}
