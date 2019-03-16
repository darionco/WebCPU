/**
 * Function to run the numeric workload in the current thread for the specified amount of time.
 * @param {number} duration - The duration of this workload in milliseconds
 * @param {number} id - The id of this thread.
 * @returns {{elapsed: number, result: number, id: *, iterations: number}}
 */
function runWorkload(duration, id) {
    const start = performance.now();
    let end = start;
    let a = 0x08a90db3;
    let b = 0xabd209a0;
    let c = 0x29019b32;
    let d = 0x01ab3291;
    let i;

    for (i = 0; end - start < duration; ++i, end = performance.now()) {
        a = (b ^ a) >> 1;
        b = (c ^ b) << 1;
        c = (d ^ c) >> 1;
        d = (a ^ d) << 1;
    }

    return {
        elapsed: end - start,
        iterations: i,
        result: a,
        id,
    };
}

/**
 * Handles events sent to this thread, from other threads, through the `self` object.
 * The messages cane be:
 * `init` - to initialize this thread, takes care of briefly running to workload to allow CPUs to cache the code
 * `workload` - runs the workload on this thread for 10ms and returns the results to the calling thread
 * @param {Event} e - The posted message event.
 */
self.onmessage = e => {
    const message = e.data;

    switch (message.type) {
        case 'init':
            runWorkload(1, 0);
            self.postMessage('success');
            break;

        case 'workload': {
            setTimeout(() => {
                self.postMessage(runWorkload(10, message.id));
            }, message.startTime - Date.now());
            break;
        }

        default:
            break;
    }
};
