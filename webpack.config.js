var webpackTargetElectronRenderer = require('webpack-target-electron-renderer');

var options = {
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
            exclude: /node_modules/,
            query: {stage: 0}
        }, {
            test: /\.scss$/,
            loader: 'style-loader!css-loader!sass-loader'
        },{
            test: /\.less$/,
            loader: 'style-loader!css-loader!less-loader'
        },{
            test: /\.(jpg|png)$/,
            loader: 'url-loader?limit=100000'
        }]
    }
};

options.target = webpackTargetElectronRenderer(options);

module.exports = options;