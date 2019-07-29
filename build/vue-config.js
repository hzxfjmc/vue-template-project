const CompressionWebpackPlugin = require('compression-webpack-plugin')
const commonConfig = require('./vue-common-config')
const { getPages, getCommandParam } = require('./utils')
const fs = require('fs')
const path = require('path')

const project = getCommandParam('project')
/**
 * 把相对于src目录的路径转换成绝对路径
 * @param sub_path
 * @returns {string}
 */
const absoluteSrcPath = sub_path => {
    return path.resolve(__dirname, `../src/${sub_path}`)
}

// 获取页面entry
const pages = getPages(`./src/pages/${project}/**/main.js`)
let openPage = ''
if (Object.values(pages)[0]) {
    openPage = Object.values(pages)[0].filename // 当前项目的第一个单页
}

// config 配置
module.exports = {
    ...commonConfig(project),
    pages: {
        ...pages
    },
    chainWebpack: config => {
        config.plugin('copy').tap(options => {
            if (fs.existsSync(`public/${project}`)) {
                options[0][0] = {
                    from: `public/${project}`,
                    to: '',
                    toType: 'dir',
                    ignore: []
                }
            } else {
                options[0] = []
            }
            return options
        })

        // todo：其他较少复用的node_modules模块需要单独提取
        // 不能提取其他公共文件，除非将相应chunk加入到htmlWebpackPlugin中，否则会丢失chunk
        config.optimization.splitChunks({
            cacheGroups: {
                // 公共包
                vendors: {
                    name: 'chunk-vendors',
                    test: /[\\\/]node_modules[\\\/](vue|axios|badjs-report|fastclick|core-js|@babel|path-browserify|vue-loader|is-buffer|node-libs-browser|regenerator-runtime)[\\\/]/,
                    priority: -10,
                    chunks: 'initial'
                },
                // 其余公共代码
                common: {
                    name: 'chunk-common',
                    minChunks: 2,
                    priority: -20,
                    chunks: 'initial',
                    reuseExistingChunk: true
                }
            }

            // chunks: 'all',
            // maxInitialRequests: Infinity,
            // minSize: 20000,
            // cacheGroups: {
            //     vendor: {
            //         test: /[\\/]node_modules[\\/]/,
            //         priority: -20,
            //         name (module) {
            //             const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
            //             return `npm.${packageName.replace('@', '')}`
            //         }
            //     }
            // }
        })

        // market项目公用代码目录别名
        config.resolve.alias.set(
            '@market-components',
            absoluteSrcPath('pages/market/0-components')
        )
        config.resolve.alias.set(
            '@market-config',
            absoluteSrcPath('pages/market/0-config')
        )
        config.resolve.alias.set(
            '@market-filters',
            absoluteSrcPath('pages/market/0-filters')
        )
        config.resolve.alias.set(
            '@market-images',
            absoluteSrcPath('pages/market/0-images')
        )
        config.resolve.alias.set(
            '@market-plugins',
            absoluteSrcPath('pages/market/0-plugins')
        )
        config.resolve.alias.set(
            '@market-service',
            absoluteSrcPath('pages/market/0-service')
        )
        config.resolve.alias.set(
            '@market-style',
            absoluteSrcPath('pages/market/0-style')
        )
        config.resolve.alias.set(
            '@market-third',
            absoluteSrcPath('pages/market/0-third')
        )
        config.resolve.alias.set(
            '@market-utils',
            absoluteSrcPath('pages/market/0-utils')
        )
        config.resolve.alias.set(
            '@market-mixins',
            absoluteSrcPath('pages/market/0-mixins')
        )
    },
    configureWebpack: config => {
        console.log(process.env.NODE_ENV, 'process.env.NODE_ENV')
        if (process.env.NODE_ENV === 'production') {
            config.plugins.push(
                new CompressionWebpackPlugin({
                    filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: new RegExp(
                        '\\.(' + ['js', 'css', 'html'].join('|') + ')$'
                    ),
                    minRatio: 0.8
                })
            )
        }
    },
    devServer: {
        disableHostCheck: true,
        open: true, // 是否打开页面
        host: '0.0.0.0', // m-sit.yxzq.com
        port: 80,
        https: false,
        hotOnly: true,
        openPage, // 当前项目的第一个单页
        proxy: {
            '/message-center': {
                // target: 'http://10.55.4.13:23002',
                // target: 'http://hz-sit.yxzq.com',
                target: 'http://hz1-sit.yxzq.com',
                changOrigin: true
            },
            '/quotes-dataservice': {
                target: 'http://hz1-sit.yxzq.com',
                changOrigin: true
            },
            '/quotes-search': {
                target: 'http://10.210.110.75:8081',
                changOrigin: true
            },
            '/config-manager': {
                target: 'http://jy1-sit.yxzq.com',
                changOrigin: true
            },
            '/stock-capital-server': {
                target: 'http://jy1-sit.yxzq.com',
                changOrigin: true
            },
            '/stock-order-server': {
                // target: 'http://10.210.20.108:9903',
                target: 'http://jy1-sit.yxzq.com',
                changOrigin: true
            },
            '/user-server': {
                target: 'http://jy1-sit.yxzq.com',
                // target: 'http://jy1-sit.yxzq.com',
                changOrigin: true
            },
            '/user-account-server': {
                target: 'http://jy1-sit.yxzq.com',
                // target: 'http://10.210.20.87:8812',
                changOrigin: true
            },
            '/faceid': {
                target: 'https://api.megvii.com',
                changOrigin: true
            },
            // banner
            '/news-configserver': {
                //target: 'http://10.55.4.9:15002',
                target: 'http://hz1-uat.yxzq.com',
                changOrigin: true
            },
            // 策略详情接口
            '/news-strategyserver': {
                // target: 'http://10.55.4.9:15005',
                // target: 'http://10.55.4.7:15003',
                // target: 'http://hz-sit.yxzq.com',
                target: 'http://hz1-sit.yxzq.com',
                changOrigin: true
            },
            // 帮助中心接口
            '/news-helpcenter': {
                target: 'http://hz1-sit.yxzq.com',
                changOrigin: true
            },
            // 行情资讯接口服务器
            '^/news-': {
                target: 'http://hz1-sit.yxzq.com',
                changOrigin: true
            },
            // 行情资讯接口服务器
            '^/helpCenter': {
                target: 'http://10.55.4.7:15002',
                changOrigin: true,
                pathRewrite: {
                    '^/helpCenter': ''
                }
            },
            // 代理其他项目的图片
            '^/webapp': {
                target: 'http://m1-sit.yxzq.com',
                changOrigin: true
            },
            '^/banner': {
                target: 'http://10.55.4.9:15002',
                changOrigin: true,
                pathRewrite: {
                    '^/banner': ''
                }
            },
            // '^/': {
            //     target: 'http://10.55.4.87:3000',
            //     changOrigin: true,
            // },
            //奖励中心
            '/product-server': {
                // target: 'http://jy1-sit.yxzq.com',
                target: 'http://jy1-sit.yxzq.com',
                changOrigin: true
            },
            '/customer-relationship-server': {
                target: 'http://jy1-sit.yxzq.com',
                // target: 'http://jy-dev.yxzq.com',
                changOrigin: true
            },
            '/user-oversea-server': {
                target: 'http://jy1-sit.yxzq.com',
                changOrigin: true
            },
            '/verification-code-server': {
                target: 'http://jy1-sit.yxzq.com',
                changOrigin: true
            },
            '/message-server': {
                target: 'http://10.210.20.39:8809',
                changOrigin: true
            }
        },
        historyApiFallback: {}
    }
}