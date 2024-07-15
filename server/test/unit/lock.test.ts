import { expect } from 'chai';
import { Lock } from '../../src/copilot/utils/lock';

describe('Lock', function() {
    this.timeout(5000); // Set timeout to 5 seconds
    let lock: Lock;

    beforeEach(() => {
        lock = new Lock();
    });

    afterEach(() => {
        lock = null!;
    });

    it('should allow a single acquisition', async function() {
        await lock.acquire();
        lock.release();
        expect(true).to.be.true; 
    });

    it('should queue and release correctly', async function() {
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

    it('should reject if too many are waiting to acquire the lock', async function() {
        let limitedLock = new Lock(2, 3000); // Set max waiting to 2
        let rejected = false;
    
        // Acquire the lock initially
        await limitedLock.acquire();
    
        // Add the second and third acquires to the waiting array
        const promise1 = limitedLock.acquire();
        const promise2 = limitedLock.acquire();
    
        // Now attempt to acquire the lock a fourth time, which should be rejected
        try {
            await limitedLock.acquire();
        } catch (error) {
            rejected = true;
        }
    
        limitedLock.release();
    
        await promise1;
        limitedLock.release();
        await promise2;
        limitedLock.release();
    
        limitedLock = null!;

        expect(rejected).to.be.true;
    });    

    it('should release automatically if release is not called within timeout', async function() {
        const timedLock = new Lock(100, 500); // Set release timeout to 500ms
        let secondAcquired = false;

        await timedLock.acquire();

        setTimeout(async () => {
            await timedLock.acquire();
            secondAcquired = true;
            timedLock.release();
        }, 600); // Wait longer than the timeout to try acquiring the lock

        await new Promise(resolve => setTimeout(resolve, 700));

        expect(secondAcquired).to.be.true;
    });
});
