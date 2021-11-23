const ThemeColorReplacerPlugin = require('./webpack_theme_plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
    chainWebpack: (config) => {
        config.optimization.minimizer('terser').tap((args) => {
            args[0].terserOptions.compress.drop_console = true
            return args
        })
    },
    publicPath: './',
    outputDir: `dist`,
    assetsDir: 'static',
    lintOnSave: false,
    productionSourceMap: false,
    css: {
        extract: ['production', 'development'].includes(process.env.NODE_ENV),
        loaderOptions: {
            less: {
                lessOptions: {
                    javascriptEnabled: true,
                }
            },
        },
    },
    configureWebpack: {
        plugins: [
            ThemeColorReplacerPlugin(),
            new CompressionPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: new RegExp('\\.(js|css)$'),
                // 只处理大于xx字节 的文件，默认：0
                threshold: 10240,
                // 示例：一个1024b大小的文件，压缩后大小为768b，minRatio : 0.75
                minRatio: 0.8, // 默认: 0.8
                // 是否删除源文件，默认: false
                deleteOriginalAssets: false,
            }),
        ]
    }
}