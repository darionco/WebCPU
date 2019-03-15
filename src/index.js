import CPUWorker from 'worker-loader?inline=true!./WebCPU.worker';

export class WebCPU {
    static async detectCPU(hardcore = false) {
        const workers = [];
        const loops = 10;
        let size = 128;
        let baseStats;

        workers.push(await this._initWorker(size, size));
        await this._testWorkers(workers, loops);
        baseStats = await this._testWorkers(workers, loops);
        console.log(baseStats);

        if (hardcore) {
            this._killWorkers(workers);
        }

        let oddCores = 0;
        let thresholdCount = 0;
        let threadCount = 0;
        let thresholdThreads = 0;
        while (true) {
            ++threadCount;
            const promises = [];
            for (let i = workers.length; i < threadCount; ++i) {
                promises.push(this._initWorker(size, size).then(worker => workers.push(worker)));
            }
            await Promise.all(promises);
            promises.length = 0;

            const stats = await this._testWorkers(workers, loops);
            if (!this._estimateCores(baseStats, stats, 0.9)) {
                --threadCount;
                ++thresholdCount;
                if (thresholdCount > 3) {
                    if (threadCount % 2 && oddCores < 3) {
                        ++oddCores;
                        --threadCount;
                        thresholdCount = 0;
                        this._killWorkers([workers.pop()]);
                    } else {
                        this._killWorkers(workers);
                        break;
                    }
                }
            } else if (thresholdCount) {
                --threadCount;
                --thresholdCount;
            }

            if (hardcore) {
                this._killWorkers(workers);
                break;
            }
        }

        return {
            physicalCores: threadCount,
            logicalCores: navigator.hardwareConcurrency ? navigator.hardwareConcurrency : thresholdThreads,
        };
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
        const stats = [];
        const promises = [];
        const extraLoops = 5;
        const startTime = Date.now() + workers.length * 5;
        let results;
        for (let n = 0; n < loops + extraLoops; ++n) {
            for (let i = 0; i < workers.length; ++i) {
                promises.push(this._computeWorker(workers[i], i, startTime));
            }
            results = await Promise.all(promises);
            if (n >= extraLoops) {
                this._addResults(stats, results);
            }
            promises.length = 0;
        }

        this._aggregateResults(stats, loops);

        return stats;
    }

    static _addResults(stats, results) {
        for (let i = 0; i < results.length; ++i) {
            if (!stats[results[i].id]) {
                stats[results[i].id] = {
                    elapsed: 0,
                    iterations: 0,
                }
            }
            stats[results[i].id].elapsed += results[i].elapsed;
            stats[results[i].id].iterations += results[i].iterations;
        }
    }

    static _aggregateResults(stats, loops) {
        for (let i = 0; i < stats.length; ++i) {
            stats[i].elapsed /= loops;
            stats[i].iterations /= loops;
        }

        return stats;
    }

    static _computeWorker(worker, id, startTime) {
        return new Promise(resolve => {
            worker.onmessage = e => {
                worker.onmessage = null;
                resolve(e.data);
            };
            worker.postMessage({type: 'workload', id, startTime});
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

            worker.postMessage({type: 'init', width, height});
        });
    }

    static _estimateCores(baseStats, stats, threshold) {
        let iterations = 0;
        stats.sort((a, b) => b.iterations - a.iterations);
        for (let i = 0; i < stats.length; ++i) {
            iterations += stats[i].iterations;
        }

        console.log(stats);

        const local = stats[stats.length - 1].iterations / stats[0].iterations;
        const global = iterations / (baseStats[0].iterations * stats.length);
        const combined = local * 0.85 + global * 0.15;
        console.log(`local:${local} global:${global} estimated:${combined}`);

        return combined >= threshold;
    }
}
