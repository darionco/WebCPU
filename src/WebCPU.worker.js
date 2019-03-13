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

            for (let i = 0; i < count; ++i) {
                lengthA += Math.atan2(view[i], view[i + count]);
                lengthB += Math.atan2(view[i + count], view[i]);
                dot += Math.atan(view[i] * view[i + count]);
            }

            for (let i = count - 1; i >= 0; --i) {
                lengthA -= Math.acos(view[i] * view[i]);
                lengthB -= Math.acos(view[i + count] * view[i + count]);
                dot -= Math.acos(view[i] * view[i + count]);
            }

            for (let i = count - 1; i >= 0; --i) {
                lengthA -= Math.log2(view[i] * view[i]);
                lengthB -= Math.log2(view[i + count] * view[i + count]);
                dot -= Math.log2(view[i] * view[i + count]);
            }

            for (let i = 0; i < count; ++i) {
                lengthA += Math.sin(view[count - i - 1] * view[count - i - 1]);
                lengthB += Math.sin(view[count * 2 - i - 1] * view[count * 2 - i - 1]);
                dot += Math.sin(view[count - i - 1] * view[count * 2 - i - 1]);
            }

            for (let i = 0; i < count; ++i) {
                lengthA += Math.asin(view[count - i - 1] * view[count - i - 1]);
                lengthB += Math.asin(view[count * 2 - i - 1] * view[count * 2 - i - 1]);
                dot += Math.asin(view[count - i - 1] * view[count * 2 - i - 1]);
            }

            for (let i = 0; i < count; ++i) {
                lengthA -= Math.log10(view[count - i - 1] * view[count - i - 1]);
                lengthB -= Math.log10(view[count * 2 - i - 1] * view[count * 2 - i - 1]);
                dot -= Math.log10(view[count - i - 1] * view[count * 2 - i - 1]);
            }

            for (let i = 0; i < count; ++i) {
                lengthA -= Math.tan(view[count - i - 1] * view[count - i - 1]);
                lengthB -= Math.tan(view[count * 2 - i - 1] * view[count * 2 - i - 1]);
                dot -= Math.tan(view[count - i - 1] * view[count * 2 - i - 1]);
            }

            const result = Math.sqrt(dot) / (lengthA * lengthB);
            self.postMessage(result);
            break;
        }

        default:
            break;
    }
};
