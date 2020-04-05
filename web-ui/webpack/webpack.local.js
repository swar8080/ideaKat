/**
 * @prettier
 */

const webpackMerge = require("webpack-merge");
const commonConfig = require("./webpack.common.js");

module.exports = options =>
    webpackMerge(commonConfig(), {
        mode: "development",
        devtool: "eval-cheap-source-map"
    });
