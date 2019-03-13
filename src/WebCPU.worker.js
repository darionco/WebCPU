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

        // case 'compute': {
        //     let dot;
        //     let length;
        //
        //     for (let i = 0; i < count; ++i) {
        //
        //     }
        // }

        default:
            break;
    }
};
