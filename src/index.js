import CPUWorker from 'worker-loader?inline=true!./WebCPU.worker';

export class WebCPU {
    static detectCPU() {
        const data = this._generateData(2048);

        return true;
    }

    static _initWorker(data) {
        return new Promise((resolve, reject) => {
            const worker = new CPUWorker();

            worker.onmessage = e => {
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
