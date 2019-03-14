let view = null;
let width = 1024;
let height = 1024;

function checkIfBelongsToMandelbrotSet(x, y, maxIterations = 350) {
    let realComponentOfResult = x;
    let imaginaryComponentOfResult = y;
    // Set max number of iterations
    for (let i = 0; i < maxIterations; i++) {
        const tempRealComponent = realComponentOfResult * realComponentOfResult - imaginaryComponentOfResult * imaginaryComponentOfResult + x;
        const tempImaginaryComponent = 2.0 * realComponentOfResult * imaginaryComponentOfResult + y;
        realComponentOfResult = tempRealComponent;
        imaginaryComponentOfResult = tempImaginaryComponent;
        // Return a number as a percentage
        if (realComponentOfResult * imaginaryComponentOfResult > 5) {
            return (i / maxIterations);
        }
    }
    // Return zero if in set
    return 0;
}

function runMandelbrot(magnificationFactor = 8500, maxIterations = 350, panX = 0.8, panY = 0.4) {
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const belongsToSet = checkIfBelongsToMandelbrotSet(x / magnificationFactor - panX, y / magnificationFactor - panY, maxIterations);
            view[0] += y * width + x;
            view[1] += Math.floor(belongsToSet);
        }
    }
}

function runWorkload(workload) {
    let a = 0x08a90db3;
    let b = 0xabd209a0;
    let c = 0x29019b32;
    let d = 0x01ab3291;

    for (let i = 0; i < workload; i++) {
        a = (b ^ a) >> 1;
        b = (c ^ b) << 1;
        c = (d ^ c) >> 1;
        d = (a ^ d) << 1;
    }

    return a;
}

self.onmessage = e => {
    const message = e.data;

    switch (message.type) {
        case 'init':
            if (!view) {
                width = message.width ? message.width : width;
                height = message.height ? message.height : height;
                view = new Uint32Array(2);
                // for (let i = 0; i < 10; ++i) {
                //     runMandelbrot();
                // }
                self.postMessage('success');
            } else {
                self.postMessage('error');
            }
            break;

        case 'compute': {
            setTimeout(() => {
                const start = performance.now();
                runMandelbrot(message.params.magnificationFactor, message.params.maxIterations, message.params.panX, message.params.panY);
                const result = performance.now() - start;
                self.postMessage(result);
            }, message.startTime - Date.now());
            break;
        }

        case 'workload': {
            self.postMessage(runWorkload(message.workload));
            break;
        }

        default:
            break;
    }
};
