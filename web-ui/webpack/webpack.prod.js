/**
 * @prettier
 */

const webpackMerge = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const PreloadWebpackPlugin = require('preload-webpack-plugin');

module.exports = options =>
    webpackMerge(commonConfig(), {
        mode: "production",
        devtool: "source-map",
        plugins: [
            new PreloadWebpackPlugin({
                rel: "preload",
                include: ['shell']
            }),
            new PreloadWebpackPlugin({
                rel: "preload",
                include: ['main']
            })
        ]
    });