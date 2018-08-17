var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var webpackConfig = {
    mode: 'development',
    entry: './src/uiDevelop.js',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'dev.js'
    },
    module: {
        rules: [{
                test: /\.(html|md)$/,
                use: {
                    loader: 'html-loader',
                    options: {}
                }
            },
            {
                test: /\.(png|jpg|gif|jpeg)$/,
                use: [
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 8192
                    }
                  }
                ]
            },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin()
    ]
};
module.exports = webpackConfig;