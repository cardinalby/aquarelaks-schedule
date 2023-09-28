// noinspection NodeCoreCodingAssistance
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin;

const isDevBuild = process.argv.includes('--mode=development')

const config = env => { return {
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
            'CORS_PROXY_URL': JSON.stringify(env.CORS_PROXY_URL)
        }),
        new HtmlWebpackPlugin({title: 'Aquarelaks', favicon: 'static/favicon.png'}),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'node_modules/pdfjs-dist/build/pdf.worker.js', to: 'pdf.worker.js' },
            ]
        })
    ],
    devtool: isDevBuild ? 'inline-source-map' : undefined
}}

module.exports = config