const WebCPU = require('../dist/umd/webcpu').WebCPU;

async function main() {
    let result;

    console.log('Running with defaults...');
    result = await WebCPU.detectCPU();
    console.log(result);

    console.log('Running forcing estimation...');
    result = await WebCPU.detectCPU(false, true);
    console.log(result);
}

main();
