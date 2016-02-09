'use strict';
let webpack = require('webpack');

module.exports = {
    context: __dirname + '/js',
    entry: './entry.js',

    output: {
        filename: 'bundle.js',
        path: __dirname + '/build'
    },

    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.scss$/,
            loader: 'style-loader!css-loader!sass-loader'
        }]
    }
};
