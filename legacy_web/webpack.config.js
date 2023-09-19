// noinspection NodeCoreCodingAssistance
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
        new HtmlWebpackPlugin({title: 'Aquarelaks', favicon: 'static/favicon.png'}),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'node_modules/pdfjs-dist/build/pdf.worker.js', to: 'pdf.worker.js' },
                //{ from: 'static/favicon.png', to: 'favicon.png' }
            ]
        })
    ]
}

if (process.argv.includes('--mode=development')) {
    config.devtool = 'inline-source-map';
}

module.exports = config