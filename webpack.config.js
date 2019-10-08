const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// HTMLファイルのビルド設定
const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: path.join(__dirname, 'examples/src/index.html'),
    filename: './index.html'
});
module.exports = {
    // 依存関係解決の起点となる資産を指定します。
    entry: path.join(__dirname, 'examples/src/index.js'),
    // Babelのトランスパイル対象資産を指定します。
    module: {
        rules: [
            {
                test: /\.(js|jsx)/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    plugins: [htmlWebpackPlugin],
    resolve: {
        extensions: ['.js', '.jsx']
    },
    // 開発用Webサーバのポートを指定します。
    devServer: {
        port: 3001
    }
}