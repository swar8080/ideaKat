/**
 * @prettier
 */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const utils = require("./utils.js");

module.exports = () => ({
    entry: {
        shell: "./app/appshell.tsx",
        main: "./app/app.tsx"
    },
    output: {
        path: utils.root("../web-app/target/classes/static/"),
        filename: "app/[name].[contenthash].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: [/node_modules/, /\.test\.tsx?$/, /\.stories\.*$/]
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                    {
                        loader: "sass-resources-loader",
                        options: {
                            resources: [path.resolve(__dirname, "../app/style/globals.scss")]
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loaders: ["style-loader", "css-loader"]
            },
            {
                test: /\.(jpg|png|woff|woff2|eot|ttf|svg)$/,
                loader: "file-loader",
                options: {
                    outputPath: "app"
                }
            }
        ]
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx"]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./app/index.html",
            chunks: ["shell", "main"],
            filename: "index.html",
            chunksSortMode: "dependency",
            inject: "body",
            favicon: "./app/assets/favicon.png"
        })
    ]
});
