import CPUWorker from 'web-worker:./WebCPU.worker';
import workloadWASM from './wasm/workload.wasm';

/**
 * Utility to estimate the number of usable cores to perform data processing in node.js and the browser.
 *
 * In node.js, it uses the code from [this gist](https://gist.github.com/brandon93s/a46fb07b0dd589dc34e987c33d775679) to
 * query the number of CPUs on the system. It can be configured to run the same estimation as in the browser.
 *
 * In the browser, takes ~2 seconds to estimate the number of CPUs, uses WASM (when available) to perform the estimation.
 *
 * Returns a {@link Promise} that resolves to a {@link WebCPUResult}.
 *
 * ### Installation
 * ```
 * yarn add webcpu
 * ```
 * or
 * ```
 * npm install webcpu
 * ```
 *
 * ### Usage
 * ```
 * import {WebCPU} from 'webcpu';
 *
 * WebCPU.detectCPU().then(result => {
 *     console.log(`Reported Cores: ${result.reportedCores}`);
 *     console.log(`Estimated Idle Cores: ${result.estimatedIdleCores}`);
 *     console.log(`Estimated Physical Cores: ${result.estimatedPhysicalCores}`);
 * });
 * ```
 *
 * ### Description
 * The core estimation is affected by other tasks in the system, usually the OS scheduler is efficient enough that
 * light tasks (playing music, idle programs, background updates, etc) are evenly distributed across cores and so they
 * will not affect the result of this estimation. Heavy tasks do have an effect in the results of the estimation, it is
 * recommended that you avoid performing heavy tasks while the estimation is running, it is considered good practice to
 * run the estimation periodically to compensate for user's CPU workloads and always keep an optimal number of
 * operational cores.
 *
 * The estimation is performed by running a mathematical operation in a loop for a predefined amount of time. Modern
 * CPUs run this task simultaneously across physical cores and usually each core completes a very similar number of
 * operations, once hyper threading (or task scheduling) kicks in, a few cores must share their cycles among
 * threads running. By detecting the changes in operations completed by each thread, it is possible to estimate the
 * number of cores in the system.
 *
 * The current algorithm returns bad estimations for CPUs with asymmetric cores (usually mobile ARM chips) because, as
 * explained above, it detects the changes in number of operations between threads. Asymmetric cores will complete
 * a different number of operations depending on the power of the core the task is scheduled on. Although the returned
 * estimations will be incorrect, they are safe to use to spawn threads.
 *
 * This utility DOES NOT estimate logical cores, instead it uses `navigator.hardwareConcurrency` (if available) or simply
 * returns the same number as the estimated physical cores.
 *
 * ## Methods
 */
export class WebCPU {
    /**
     * Estimates the number of CPUs in this machine.
     * @param {boolean=} hardcore - Engages hardcore mode, which kills all the workers after every test.
     * @param {boolean=} estimateInNode - If `true`, forces core estimation in Node.js rather than querying the system.
     * @returns {Promise<WebCPUResult>} - Result of the estimation.
     */
    static async detectCPU(hardcore = false, estimateInNode = false) {
        /* handle running in node.js */
        const isNodeJS = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';

        let reportedCores;

        if (isNodeJS) {
            /* we are running in node, emulate the response */
            /* eslint-disable */
            const os = require('os');
            const childProcess = require('child_process');

            reportedCores = require('os').cpus().length;

            if (!estimateInNode) {
                /* code taken from https://gist.github.com/brandon93s/a46fb07b0dd589dc34e987c33d775679 */
                const exec = function exec(command) {
                    return childProcess.execSync(command, {encoding: 'utf8'});
                };

                const platform = os.platform();
                let amount;

                if (platform === 'linux') {
                    const output = exec('lscpu -p | egrep -v "^#" | sort -u -t, -k 2,4 | wc -l');
                    amount = parseInt(output.trim(), 10);
                } else if (platform === 'darwin') {
                    const output = exec('sysctl -n hw.physicalcpu_max');
                    amount = parseInt(output.trim(), 10);
                } else if (platform === 'windows') {
                    const output = exec('WMIC CPU Get NumberOfCores');
                    amount = output.split(os.EOL)
                        .map(function parse(line) {
                            return parseInt(line)
                        })
                        .filter(function numbers(value) {
                            return !isNaN(value)
                        })
                        .reduce(function add(sum, number) {
                            return sum + number
                        }, 0);
                } else {
                    const cores = os.cpus().filter(function (cpu, index) {
                        const hasHyperthreading = cpu.model.includes('Intel');
                        const isOdd = index % 2 === 1;
                        return !hasHyperthreading || isOdd;
                    });
                    amount = cores.length;
                }

                return {
                    reportedCores: reportedCores,
                    estimatedIdleCores: amount,
                    estimatedPhysicalCores: amount,
                }
            }
            /* eslint-enable */
        } else {
            reportedCores = navigator.hardwareConcurrency ? navigator.hardwareConcurrency : null;
        }

        const maxCoresToTest = reportedCores ? reportedCores : Number.MAX_SAFE_INTEGER;
        const workers = [];
        const loops = 2;
        let baseStats;

        let wasmModule = null;
        if (WebAssembly) {
            if (WebAssembly.compileStreaming) {
                wasmModule = await WebAssembly.compileStreaming(fetch(workloadWASM));
            } else if (WebAssembly.compile) {
                if (isNodeJS) {
                    const buffer = Buffer.from(workloadWASM.substr(workloadWASM.indexOf(',') + 1), 'base64');
                    wasmModule = await WebAssembly.compile(buffer);
                } else {
                    const result = await fetch(workloadWASM);
                    const buffer = await result.arrayBuffer();
                    wasmModule = await WebAssembly.compile(buffer);
                }
            }
        }

        workers.push(await this._initWorker(wasmModule));
        await this._testWorkers(workers, loops);
        baseStats = await this._testWorkers(workers, loops);
        // console.log(baseStats);

        if (hardcore) {
            this._killWorkers(workers);
        }

        let oddCores = 0;
        let thresholdCount = 0;
        let threadCount = 0;
        while (threadCount < maxCoresToTest) {
            ++threadCount;
            const promises = [];
            for (let i = workers.length; i < threadCount; ++i) {
                promises.push(this._initWorker(wasmModule).then(worker => workers.push(worker)));
            }
            await Promise.all(promises);
            promises.length = 0;

            const stats = await this._testWorkers(workers, loops);
            if (!this._areAllCoresValid(baseStats, stats, 0.9)) {
                --threadCount;
                ++thresholdCount;
                if (thresholdCount > 3) {
                    if (threadCount % 2 && ++oddCores < 2) {
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
            }
        }

        let physicalCores;
        if (reportedCores && threadCount < reportedCores) {
            physicalCores = Math.floor(reportedCores / 2);
        } else {
            physicalCores = threadCount;
        }

        return {
            reportedCores: reportedCores,
            estimatedIdleCores: threadCount,
            estimatedPhysicalCores: physicalCores,
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
        const extraLoops = 2;
        const startTime = Date.now() + workers.length * 3;
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
        const addListener = worker.addEventListener || worker.on;
        const removeListener = worker.removeEventListener || worker.off;
        return new Promise(resolve => {
            const handler = e => {
                removeListener.call(worker, 'message', handler);
                resolve(e.data || e);
            };
            addListener.call(worker, 'message', handler);
            worker.postMessage({type: 'workload', id, startTime});
        });
    }

    /**
     * Allocates and initializes a worker.
     * @param {WebAssembly.Module=} wasm - The WASM module, if available, that contains the workload.
     * @returns {Promise<any>}
     * @private
     */
    static _initWorker(wasm = null) {
        return new Promise((resolve, reject) => {
            const worker = new CPUWorker();

            const addListener = worker.addEventListener || worker.on;
            const removeListener = worker.removeEventListener || worker.off;

            const handler = e => {
                removeListener.call(worker, 'message', handler);
                const message = e.data || e;
                if (message === 'success') {
                    resolve(worker);
                } else {
                    worker.terminate();
                    reject();
                }
            };
            addListener.call(worker, 'message', handler);
            worker.postMessage({type: 'init', wasm});
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
        // console.log(`threads:${stats.length} local:${local} global:${global} estimated:${combined}\n`);

        return combined >= threshold;
    }
}

/**
 * @typedef {Object} WebCPUResult
 *
 * @property {number|null} reportedCores
 * The result of `navigator.hardwareConcurrency` or `null` if not supported. `navigator.hardwareConcurrency` returns the
 * total number of cores in the system, physical and logical. This is not particularly useful for data computations
 * because logical cores do no improve and, in some cases, even hinder performance in repetitive tasks.
 *
 * @property {number} estimatedIdleCores
 * This number represents the estimated number of cores that can be used to compute a repetitive task, like data
 * computations, in parallel. The result of the estimation is affected by system workload at the time of the detection,
 * if this number is used to spawn threads, it is recommended to re-run the detection algorithm periodically to always
 * use an optimal number of cores when computing data.
 *
 * @property {number} estimatedPhysicalCores
 * Given the reported number of cores and the result of estimated idle cores, this number represents the "best guess"
 * for the total number of physical cores in the system. This number of threads is safe to use on all platforms.
 */
