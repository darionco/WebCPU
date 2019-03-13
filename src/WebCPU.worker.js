let data = null;
let view = null;
let count = 0;

self.onmessage = e => {
    const message = e.data;

    switch (message.type) {
        case 'init':
            if (!data) {
                data = message.data;
                view = new Float32Array(data);
                count = view.length * 0.5;

                self.postMessage('success');
            } else {
                self.postMessage('error');
            }
            break;

        case 'compute': {
            let dot = 0.0;
            let lengthA = 0.0;
            let lengthB = 0.0;

            for (let i = 0; i < count; ++i) {
                lengthA += Math.sqrt(view[i] * view [i]);
                lengthB += Math.sqrt(view[i + count] * view[i + count]);
                dot += view[i] * view[i + count];
            }

            const result  = Math.sqrt(dot) / (lengthA * lengthB);
            self.postMessage(result);
            break;
        }

        default:
            break;
    }
};
