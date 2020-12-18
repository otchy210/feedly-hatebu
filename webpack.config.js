const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        background: './src/js/background.js',
        options: './src/js/options.js',
        content: './src/js/content.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ],
    },
    output: {
        filename: '[name].js',
        path: path.resolve('./build/js')
    },
};
