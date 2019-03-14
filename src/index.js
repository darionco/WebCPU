import CPUWorker from 'worker-loader?inline=true!./WebCPU.worker';
import {getHardwareConcurrency} from './CoreEstimator';

export class WebCPU {
    static async detectCPU() {
        return await getHardwareConcurrency();
        // const workers = [];
        // const times = [];
        // const loops = 20;
        // let size = 128;
        // let baseTime;
        //
        // workers.push(await this._initWorker(size, size));
        // baseTime = await this._testWorkers(workers, loops);
        // times.push(baseTime);
        // console.log(`Base Time: ${baseTime}`);
        //
        // if (hardcore) {
        //     this._killWorkers(workers);
        // }
        //
        // const maxThresholdCount = 3;
        // const threshold = 1.15;
        // let thresholdCount = 0;
        // let threadCount = 0;
        // let thresholdThreads = 0;
        // while (true) {
        //     ++threadCount;
        //     const promises = [];
        //     for (let i = workers.length; i < threadCount; ++i) {
        //         promises.push(this._initWorker(size, size).then(worker => workers.push(worker)));
        //     }
        //     await Promise.all(promises);
        //     promises.length = 0;
        //
        //     const time = await this._testWorkers(workers, loops);
        //     const expected = this._getExpectedNextOffset(times, baseTime);
        //     const diff = time - times[times.length - 1];
        //     times.push(time);
        //     console.log(`Threads:${workers.length} Took:${time}ms Expected:${expected} Diff:${diff}`);
        //     if (time / baseTime > threshold) {
        //         if (!thresholdThreads) {
        //             thresholdThreads = threadCount - 1;
        //         }
        //
        //         if (++thresholdCount >= maxThresholdCount) {
        //             break;
        //         }
        //     } else {
        //         thresholdCount = 0;
        //         thresholdThreads = 0;
        //     }
        //
        //     if (hardcore) {
        //         this._killWorkers(workers);
        //     }
        // }
        //
        // return {
        //     physicalCores: thresholdThreads,
        //     logicalCores: navigator.hardwareConcurrency ? navigator.hardwareConcurrency : thresholdThreads,
        // };
    }

    static _killWorkers(workers) {
        while (workers.length) {
            workers.pop().terminate();
        }
    }

    static _getExpectedNextOffset(times, baseTime) {
        let total = times[0] - baseTime;
        for (let i = 1; i < times.length; ++i) {
            total += times[i] - times[i - 1];
        }
        return total / times.length;
    }

    static async _testWorkers(workers, loops) {
        const params = this._generateParams();
        const promises = [];
        const extraLoops = 10;
        const startTime = Date.now() + workers.length * 10;
        let results;
        let time = 0;
        for (let n = 0; n < loops + extraLoops; ++n) {
            params.panX += 0.0001;
            params.panY += 0.0001;
            for (let i = 0; i < workers.length; ++i) {
                promises.push(this._computeWorker(workers[i], params, startTime));
            }
            results = await Promise.all(promises);
            let rs = '';
            if (n >= extraLoops) {
                for (let i = 0; i < results.length; ++i) {
                    rs += `T${i}:${results[i]} `;
                    time += results[i];
                }
            }
            // console.log(rs);
            promises.length = 0;
        }
        time /= loops * workers.length;
        return time;
    }

    static _computeWorker(worker, params, startTime) {
        return new Promise(resolve => {
            worker.onmessage = e => {
                worker.onmessage = null;
                resolve(e.data);
            };
            worker.postMessage({ type: 'workload', params, startTime, workload: 0x400000 });
        });
    }

    static _initWorker(width, height) {
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

            worker.postMessage({ type: 'init', width, height });
        });
    }

    static _generateParams() {
        return {
            magnificationFactor: 3800,
            maxIterations: 350,
            panX: 0.2,
            panY: 0.2,
        }
    }
}
