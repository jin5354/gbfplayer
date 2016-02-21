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
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {stage: 0}
        },{
            test: /\.scss$/,
            loader: 'style-loader!css-loader!sass-loader'
        },{
            test: /\.less$/,
            loader: 'style-loader!css-loader!less-loader'
        },{
            test: /\.(jpg|png)$/,
            loader: 'url-loader?limit=100000'
        }]
    },
    node: {
        __dirname: true
    },
    externals: {
        'config': 'config'
    }
};

options.target = webpackTargetElectronRenderer(options);

module.exports = options;