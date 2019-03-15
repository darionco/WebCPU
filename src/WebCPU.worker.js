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

function runMandelbrot(duration, id) {
    const width = 32784;
    const height = 32784;
    let magnificationFactor = 3800;
    let maxIterations = 350;
    let panX = 0.2;
    let panY = 0.2;

    let coordinate = 0;
    let pixel = 0;

    const start = performance.now();
    let end = start;

    let i = 0;
    while (end - start < duration) {
        panX += 0.01;
        panY += 0.01;
        magnificationFactor += 1;
        for (let x = 0; x < width && end - start < duration; x++) {
            for (let y = 0; y < height && end - start < duration; y++) {
                const belongsToSet = checkIfBelongsToMandelbrotSet(x / magnificationFactor - panX, y / magnificationFactor - panY, maxIterations);
                coordinate |= y * width + x;
                pixel |= Math.floor(belongsToSet);
                end = performance.now();
                ++i;
            }
        }
    }

    return {
        elapsed: end - start,
        iterations: i,
        result: coordinate ^ pixel,
        id,
    };
}

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

self.onmessage = e => {
    const message = e.data;

    switch (message.type) {
        case 'init':
            runWorkload(2, 0);
            runMandelbrot(2, 0);
            self.postMessage('success');
            break;

        case 'mandelbrot': {
            setTimeout(() => {
                self.postMessage(runMandelbrot(10, message.id));
            }, message.startTime - Date.now());
            break;
        }

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
