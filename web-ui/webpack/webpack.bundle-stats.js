/**
 * @prettier
 */

const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const webpackMerge = require("webpack-merge");
const prodConfig = require("./webpack.prod.js");

module.exports = options =>
    webpackMerge(prodConfig(), {
        plugins: [
            new BundleAnalyzerPlugin({
                analyzerMode: "static"
            })
        ]
    });
