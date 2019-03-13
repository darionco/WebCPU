'use strict';

const path = require('path');
const packageJson = require('./package.json');
const webpack = require('webpack');
const JS_OUTPUT_DEV = `${packageJson.name}.js`;
const JS_OUTPUT_PROD = `${packageJson.name}.min.js`;
const BROWSER_OUTPUT_DEV = `${packageJson.name}.browser.js`;
const BROWSER_OUTPUT_PROD = `${packageJson.name}.browser.min.js`;

const isBrowser = (process.env.TARGET === 'browser');
const isProduction = (process.env.NODE_ENV === 'production');

const outputName = isProduction ? (isBrowser ? BROWSER_OUTPUT_PROD : JS_OUTPUT_PROD) : (isBrowser ? BROWSER_OUTPUT_DEV : JS_OUTPUT_DEV);

let config = {
    stats: 'errors-only',
    entry: [path.resolve(__dirname, packageJson.main)],
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
            },
        ],
    },
    externals: [
    ],
    plugins: [
    ],
    output: {
        filename: outputName,
        globalObject: `(typeof self != 'undefined' ? self : this)`,
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    node: {
        fs: 'empty',
    }
};

if (isProduction) {
    config.devtool = 'sourcemap';

    config.plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
            },
        })
    );

    config.mode = 'production';
} else {
    config.devtool = 'eval';

    config.plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('dev'),
            },
        })
    );

    config.mode = 'development';
}

if (isBrowser) {
    config.output.library = packageJson.name.split('.');
    config.output.libraryTarget = 'window';
}


module.exports = [config];
