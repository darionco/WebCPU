let wasm = null;
let memory = null;
let view = null;

let runWorkload = () => {
    throw 'ERROR: Worker has not been initialized!';
};

/**
 * Function to run the numeric workload in the current thread for the specified amount of time in JavaScript.
 * @param {number} duration - The duration of this workload in milliseconds
 * @param {number} id - The id of this thread.
 * @returns {{elapsed: number, result: number, id: *, iterations: number}}
 * @private
 */
function runWorkloadJS(duration, id) {
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
 * Function to run the numeric workload in the current thread for the specified amount of time in WASM.
 * Note: the WASM module must be pre-loaded by sending the `init` message from the main thread.
 * @param {number} duration - The duration of this workload in milliseconds
 * @param {number} id - The id of this thread.
 * @returns {{elapsed: number, result: number, id: *, iterations: number}}
 * @private
 */
function runWorkloadWASM(duration, id) {
    wasm.exports._runWorkload(duration, 4);
    return {
        iterations: view.getUint32(4, true),
        result: view.getUint32(8, true),
        elapsed: view.getFloat32(12, true),
        id,
    };
}

/**
 * Handles events sent to this thread, from other threads, through the `self` object.
 * The messages cane be:
 * `init` - to initialize this thread, takes care of briefly running to workload to allow CPUs to cache the code
 * `workload` - runs the workload on this thread for 10ms and returns the results to the calling thread
 * @param {MessageEvent} e - The posted message event.
 * @private
 */
self.onmessage = e => {
    const message = e.data;

    switch (message.type) {
        case 'init':
            if (message.wasm) {
                const memorySize = 16;
                memory = new WebAssembly.Memory({initial: memorySize, maximum: memorySize});
                view = new DataView(memory.buffer);
                wasm = new WebAssembly.Instance(message.wasm, {
                    env: {
                        _now: performance.now.bind(performance),
                        memory: memory,
                    },
                });
                runWorkload = runWorkloadWASM;
            } else {
                runWorkload = runWorkloadJS;

            }
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
