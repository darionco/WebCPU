import CPUWorker from 'worker-loader?inline=true!./WebCPU.worker';

export class WebCPU {
    static async detectCPU(hardcore = true) {
        const data = this._generateData(1024 * 256);
        const workers = [];
        const loops = 100;
        let baseTime = 0;
        let start;
        let end;

        workers.push(await this._initWorker(data.slice(0)));

        for (let n = 0; n < loops; ++n) {
            start = performance.now();
            await this._computeWorker(workers[0]);
            end = performance.now();
            baseTime += end - start;
        }
        baseTime /= loops;
        console.log(`Base Time: ${baseTime}`);
        this._killWorkers(workers);

        const maxThresholdCount = 3;
        const threshold = 1.15;
        let thresholdCount = 0;
        let threadCount = 1;
        let thresholdThreads = 0;
        while (true) {
            ++threadCount;
            const promises = [];
            for (let i = workers.length; i < threadCount; ++i) {
                promises.push(this._initWorker(data.slice(0)).then(worker => workers.push(worker)));
            }
            await Promise.all(promises);
            promises.length = 0;

            let time = 0;
            for (let n = 0; n < loops; ++n) {
                start = performance.now();
                for (let i = 0; i < workers.length; ++i) {
                    promises.push(this._computeWorker(workers[i]));
                }
                await Promise.all(promises);
                end = performance.now();
                time += end - start;
            }
            time /= loops;
            console.log(`Threads:${workers.length} Took:${time}ms Diff:${time / baseTime}`);
            if (time / baseTime > threshold) {
                if (!thresholdThreads) {
                    thresholdThreads = threadCount - 1;
                }

                if (++thresholdCount >= maxThresholdCount) {
                    break;
                }
            } else {
                thresholdCount = 0;
                thresholdThreads = 0;
            }

            if (hardcore) {
                this._killWorkers(workers);
            }
        }

        return {
            physicalCores: thresholdThreads,
            logicalCores: navigator.hardwareConcurrency ? navigator.hardwareConcurrency : thresholdThreads,
        };
    }

    static _killWorkers(workers) {
        while (workers.length) {
            workers.pop().terminate();
        }
    }

    static _computeWorker(worker) {
        return new Promise(resolve => {
            worker.onmessage = e => {
                worker.onmessage = null;
                resolve(e.data);
            };
            worker.postMessage({ type: 'compute' });
        });
    }

    static _initWorker(data) {
        return new Promise((resolve, reject) => {
            const worker = new CPUWorker();

            worker.onmessage = e => {
                worker.onmessage = null;
                if (e.data === 'success') {
                    resolve(worker);
                } else {
                    worker.terminate();
                    reject();
                }
            };

            worker.postMessage({ type: 'init', data }, data);
        });
    }

    static _generateData(count) {
        const buffer = new ArrayBuffer(count * 2 * 4);
        const view = new Float32Array(buffer);

        for (let i = 0; i < count; ++i) {
            view[i] = Math.random() + 0.00001;
            view[i + count] = Math.random() + 0.00001;
        }

        return buffer;
    }
}
