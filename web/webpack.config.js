// noinspection NodeCoreCodingAssistance
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin;

const CORS_PROXY_URL = {
    production: JSON.stringify('https://aquarelaks.cardinalby.workers.dev/'),
    development: JSON.stringify('http://127.0.0.1:8787/')
}

const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const config = {
    entry: "./src/index.ts",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".js"]
    },
    module: {
        rules: [{ test: /\.ts$/, loader: "ts-loader" }]
    },
    plugins: [
        new DefinePlugin({
            'CORS_PROXY_URL': CORS_PROXY_URL[environment]
        }),
        new HtmlWebpackPlugin({title: 'Aquarelaks', favicon: 'static/favicon.png'}),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'node_modules/pdfjs-dist/build/pdf.worker.js', to: 'pdf.worker.js' },
            ]
        })
    ]
}

if (process.argv.includes('--mode=development')) {
    config.devtool = 'inline-source-map';
}

module.exports = config