const isNodeJS = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
const _self = isNodeJS ? require('worker_threads').parentPort : self; // eslint-disable-line
const _performance = isNodeJS ? require('perf_hooks').performance : performance; // eslint-disable-line

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
    const sin = Math.sin;
    const cos = Math.cos;
    const M_PI = Math.PI;

    let creal = -0.8;
    let cimag = 0.156;

    let frame = 0;

    let y;
    let x;
    let i;
    let ii;

    let cx;
    let cy;
    let xt;

    const start = _performance.now();
    let end = start;

    for (ii = 0; end - start < duration; ++ii, end = _performance.now()) {
        for (y = 0; y < 200; ++y) {
            for (x = 0; x < 200; ++x) {
                cx = -2 + x / 50;
                cy = -2 + y / 50;
                i = 0;

                do {
                    xt = cx * cx - cy * cy + creal;
                    cy = 2 * cx * cy + cimag;
                    cx = xt;
                }
                while ((cx * cx + cy * cy < 4) && ++i < 25);
            }
        }
        ++frame; // increase the number of the frame
        creal = -0.8 + 0.6 * sin(frame / (M_PI * 20)); // calculate the new coordinates
        cimag = 0.156 + 0.4 * cos(frame / (M_PI * 40)); // of the c point
    }

    return {
        elapsed: end - start,
        iterations: frame,
        result: xt,
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
(_self.on || _self.addEventListener).call(_self, 'message', e => {
    const message = e.data || e;

    switch (message.type) {
        case 'init':
            if (message.wasm) {
                const memorySize = 16;
                memory = new WebAssembly.Memory({initial: memorySize, maximum: memorySize});
                view = new DataView(memory.buffer);
                wasm = new WebAssembly.Instance(message.wasm, {
                    env: {
                        _now: _performance.now.bind(_performance),
                        memory: memory,
                    },
                });
                runWorkload = runWorkloadWASM;
            } else {
                runWorkload = runWorkloadJS;
            }
            runWorkload(1, 0);
            _self.postMessage('success');
            break;

        case 'workload': {
            setTimeout(() => {
                _self.postMessage(runWorkload(10, message.id));
            }, message.startTime - Date.now());
            break;
        }

        default:
            break;
    }
});
