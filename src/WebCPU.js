import CPUWorker from 'worker-loader?inline=true!./WebCPU.worker';

/**
 * Namespace for the functions used to estimate the number of cores in this machine's CPU, takes ~3 seconds.
 *
 * The resulting `physicalCores` count is useful when using the CPU to compute data since repetitive math calculations
 * cannot take advantage of hyper threading and similar technologies.
 *
 * The `logicalCores` count is useful when performing different tasks on multiple threads (i.e. physics in one thread,
 * animation in another, etc), in that scenario hyper threading really shines.
 *
 * The core estimation is affected by the other tasks in the system, usually the OS scheduler is efficient enough that
 * light tasks (playing music, idle programs, background updates, etc) are evenly distributed across cores and so they
 * will not affect the result of this estimation. Heavy tasks do have an effect in the results of the estimation, it is
 * recommended that you avoid performing heavy tasks while the estimation is running, it is considered good practice to
 * run the estimation periodically to compensate for user's CPU workloads and always keep an optimal number of
 * operational cores.
 *
 * The estimation is performed by running a mathematical operation in a loop for a predefined amount of time. Modern
 * CPUs run this task simultaneously across physical cores and usually each core completes a very similar number of
 * operations, once hyper threading or simply task scheduling kicks in, a few cores must share their cycles among
 * threads running. By detecting the changes in operations completed by each thread, it si possible to estimate the
 * number of cores in the system.
 *
 * This method DOES NOT estimate logical cores, instead it uses `navigator.hardwareConcurrency` if available or simply
 * returns the same number as physical cores.
 */
export class WebCPU {
    /**
     * Estimates the number of CPUs in this machine.
     * @param {boolean} hardcore - Engages hardcore mode, which kills all the workers after every test.
     * @returns {Promise<{logicalCores: number, physicalCores: number}>} - Result of the estimation.
     */
    static async detectCPU(hardcore = false) {
        const workers = [];
        const loops = 10;
        let baseStats;

        workers.push(await this._initWorker());
        await this._testWorkers(workers, loops);
        baseStats = await this._testWorkers(workers, loops);
        // console.log(baseStats);

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
                promises.push(this._initWorker().then(worker => workers.push(worker)));
            }
            await Promise.all(promises);
            promises.length = 0;

            const stats = await this._testWorkers(workers, loops);
            if (!this._areAllCoresValid(baseStats, stats, 0.9)) {
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

    /**
     * Kills all the workers in the specified array.
     * @param {Worker[]} workers - Workers to kill
     * @private
     */
    static _killWorkers(workers) {
        while (workers.length) {
            workers.pop().terminate();
        }
    }

    /**
     * Run tests in the specified workers and repeats the test for the specified number of loops. This function performs
     * and ignores the results of 5 extra loops. This is to mitigate the fact that some processor and OS combinations
     * use lazy loading.
     * @param {Worker[]} workers - The workers in which the test will run.
     * @param {number} loops - The number of times the tests will be repeated.
     * @returns {Promise<Array>}
     * @private
     */
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

    /**
     * Adds the results from a test loop to the specified stats array.
     * @param {Array} stats - Stats array to save the results in
     * @param {Array} results - The results of a test loop.
     * @private
     */
    static _addResults(stats, results) {
        for (let i = 0; i < results.length; ++i) {
            if (!stats[results[i].id]) {
                stats[results[i].id] = {
                    elapsed: 0,
                    iterations: 0,
                };
            }
            stats[results[i].id].elapsed += results[i].elapsed;
            stats[results[i].id].iterations += results[i].iterations;
        }
    }

    /**
     * Aggregates all the results added to a stats object.
     * This function effectively normalizes the data passed to it.
     * @param {Array} stats - Stats array no aggregate.
     * @param {number} loops - The number of times the test ran.
     * @returns {Array}
     * @private
     */
    static _aggregateResults(stats, loops) {
        for (let i = 0; i < stats.length; ++i) {
            stats[i].elapsed /= loops;
            stats[i].iterations /= loops;
        }

        return stats;
    }

    /**
     * Starts the computation task in the specified worker with the specified id.
     * This method also accepts a start time (in ms, usually Date.now() + ms_to delay), useful to synchronize the start
     * time of the computation in multiple threads.
     * @param {Worker} worker - The worker in which the computation will be started.
     * @param {number} id - The id of this thread.
     * @param {number} startTime - A time in the future when the computations should start.
     * @returns {Promise<any>}
     * @private
     */
    static _computeWorker(worker, id, startTime) {
        return new Promise(resolve => {
            worker.onmessage = e => {
                worker.onmessage = null;
                resolve(e.data);
            };
            worker.postMessage({type: 'workload', id, startTime});
        });
    }

    /**
     * Allocates and initializes a worker.
     * @returns {Promise<any>}
     * @private
     */
    static _initWorker() {
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

            worker.postMessage({type: 'init'});
        });
    }

    /**
     * Estimates if all the cores, based on the results in the provided `stats` object, are running at the same time and
     * performing the same number of operations.
     * @param {Array} baseStats - The stats resulting from running tests loops on a single core.
     * @param {Array} stats - The stats of multiple cores to test against.
     * @param {number} threshold - Threshold, between 0 ans 1, that defines when a core is not considered physical.
     * @returns {boolean}
     * @private
     */
    static _areAllCoresValid(baseStats, stats, threshold) {
        let iterations = 0;
        stats.sort((a, b) => b.iterations - a.iterations);
        for (let i = 0; i < stats.length; ++i) {
            iterations += stats[i].iterations;
        }

        // console.log(stats);

        const local = stats[stats.length - 1].iterations / stats[0].iterations;
        const global = iterations / (baseStats[0].iterations * stats.length);
        const combined = local * 0.85 + global * 0.15;
        // console.log(`local:${local} global:${global} estimated:${combined}`);

        return combined >= threshold;
    }
}
