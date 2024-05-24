import { expect } from 'chai';
import { Lock } from '../../src/copilot/utils/lock';

describe('Lock', function() {
    this.timeout(5000); // Set timeout to 5 seconds

    it('should allow a single acquisition', async function() {
        const lock = new Lock();
        await lock.acquire();
        lock.release();
        expect(true).to.be.true; // If we reach here, the lock worked as expected
    });

    it('should queue and release correctly', async function() {
        const lock = new Lock();
        let acquiredSecond = false;

        await lock.acquire(); // Acquire the lock first

        const secondLockPromise = lock.acquire().then(() => {
            acquiredSecond = true;
        });

        // Ensure the second lock is not acquired immediately
        expect(acquiredSecond).to.be.false;

        lock.release(); // Release the lock

        await secondLockPromise; // Wait for the second lock to be acquired
        expect(acquiredSecond).to.be.true;
        lock.release(); // Release the second lock
    });

    it('should handle multiple queued acquisitions in order', async function() {
        const lock = new Lock();
        const acquiredOrder: number[] = [];

        await lock.acquire(); // Acquire the lock first

        const acquirePromise1 = lock.acquire().then(() => {
            acquiredOrder.push(1);
        });

        const acquirePromise2 = lock.acquire().then(() => {
            acquiredOrder.push(2);
        });

        const acquirePromise3 = lock.acquire().then(() => {
            acquiredOrder.push(3);
        });

        lock.release(); // Release the first lock
        await acquirePromise1;

        lock.release(); // Release the second lock
        await acquirePromise2;

        lock.release(); // Release the third lock
        await acquirePromise3;

        expect(acquiredOrder).to.deep.equal([1, 2, 3], 'The locks should be acquired in the order they were requested');
    });

    it('should handle simultaneous acquisitions and releases', async function() {
        const lock = new Lock();
        const results: string[] = [];

        const task = async (name: string, delay: number) => {
            await lock.acquire();
            results.push(`${name} acquired`);
            await new Promise(resolve => setTimeout(resolve, delay));
            results.push(`${name} releasing`);
            lock.release();
        };

        const tasks = [
            task('A', 50),
            task('B', 30),
            task('C', 10)
        ];

        await Promise.all(tasks);

        expect(results).to.deep.equal([
            'A acquired', 'A releasing',
            'B acquired', 'B releasing',
            'C acquired', 'C releasing'
        ], 'Tasks should acquire and release the lock in the correct order');
    });
});
