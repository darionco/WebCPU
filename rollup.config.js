'use strict';

const path = require('path');
const packageJson = require('./package.json');
const eslint = require('rollup-plugin-eslint').eslint;
const urlLoader = require('rollup-plugin-url');
const webWorkerLoader = require('rollup-plugin-web-worker-loader');
const server = require('live-server');

const JS_OUTPUT = `${packageJson.name}.js`;
const isBrowser = (process.env.TARGET === 'browser');
const outputName = JS_OUTPUT;

function liveServer (options = {}) {
    const defaultParams = {
        file: 'index.html',
        host: '0.0.0.0',
        logLevel: 2,
        open: false,
        port: 8080,
        root: '.',
        wait: 200,
    };

    const params = Object.assign({}, defaultParams, options);
    let running = false;

    return {
        name: 'liveServer',
        writeBundle () {
            if (!running) {
                running = true;
                server.start(params);
                console.log(`live-server running on ${params.port}`);
            }
        },
    };
}

const config = {
    input: path.resolve(__dirname, packageJson.entry),
    output: [],
    plugins: [
        eslint(),
        webWorkerLoader(),
        urlLoader({
            limit: 1024 * 1024 * 1024, // 1GB - Basically unlimited
            include: ['**/*.wasm'],
            emitFiles: false,
        }),
    ],
};

if (isBrowser) {
    config.output.push({
        file: path.resolve(__dirname, `dist/iife/${outputName}`),
        format: 'iife',
        name: packageJson.name,
    });

    config.plugins.push(liveServer({
        port: 8090,
        host: "0.0.0.0",
        root: "www",
        file: "index.html",
        mount: [['/', './dist/iife']],
        open: false,
        wait: 500
    }));
} else {
    config.output.push({
        file: path.resolve(__dirname, `dist/amd/${outputName}`),
        format: 'amd',
    });

    config.output.push({
        file: path.resolve(__dirname, `dist/cjs/${outputName}`),
        format: 'cjs',
    });

    config.output.push({
        file: path.resolve(__dirname, `dist/esm/${outputName}`),
        format: 'esm',
    });

    config.output.push({
        file: path.resolve(__dirname, `dist/umd/${outputName}`),
        format: 'umd',
        name: packageJson.name,
    });

    config.output.push({
        file: path.resolve(__dirname, `dist/iife/${outputName}`),
        format: 'iife',
        name: packageJson.name,
    });
}

module.exports = config;
