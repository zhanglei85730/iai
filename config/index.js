'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path')
const page = require('../build/page')
const buildTools = require('../build/tools.js')
const consts = require('./consts.js')
// 根据不同的模块名，在dist下生产模块名文件夹（dist/app或者dist/mobile）
/**
 *打包参数 iai_trader for weichat,warningFx for PF12,warning for 01\02\03,
 * 
 */
const moduleName = 'iai_trader';//app/mobile/warning/iai_trader /warningFx
// ----------------------根据环境调用baseApiUrl-------------------------------
// 默认使用dev、uat的api地址
// 是否跨越
const isChangeOrigin = false;
let apiBaseUrl = consts.uatBaseUrl;
let iaiTradeUrl=consts.iaiTradeUatUrl
// let apiBaseUrl ='';
if (process.env.NODE_ENV === consts.uatNodeEvn) {
  apiBaseUrl = consts.uatBaseUrl
} else if (process.env.NODE_ENV === consts.prodNodeEvn) {
  apiBaseUrl = consts.prodBaseUrl;
  iaiTradeUrl=consts.iaiTradeProdUrl
}
console.log('apiBaseUrl=' + apiBaseUrl);
console.log('NODE_ENV=' + process.env.NODE_ENV)
module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/app': {
        // target: 'http://192.168.35.103:8781',//http://iaiatade-backend.wys.com设置你调用的接口域名和端口号 别忘了加http
        // 真实场环境
        // target:productionApiUrl,
        // 开发、测试
        target: apiBaseUrl,
        changeOrigin: isChangeOrigin,
        // pathRewrite: {
        //   '^/api': ''//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
        // }
      },      
      '/PF00': {
        target:iaiTradeUrl,
        changeOrigin: isChangeOrigin,
      },
      '/iai_trader': {
        target:iaiTradeUrl,
        changeOrigin: isChangeOrigin,
      },
      '/iaitrade': {
        target:consts.uatBaseUrl,
        changeOrigin: isChangeOrigin,
      },
      '/uac': {
        target:consts.uatBaseUrl,
        changeOrigin: isChangeOrigin,
      }
    },
    // Various Dev Server settings
    // 原值localhost,修改为0.0.0.0可以通过ip访问
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true,

  },

  build: {
    // Paths
    // 编译代码存放的位置
    assetsRoot: path.resolve(__dirname, moduleName=='iai_trader'?`../dist/${moduleName}/warning/`:`../dist/${moduleName}`),
    assetsSubDirectory: 'static',
    assetsPublicPath:moduleName=='iai_trader'?`/${moduleName}/warning/`: `/${moduleName}/`,//设置html模板页面引用资源目录
    /**
     * Source Maps
     */

    productionSourceMap: false,//是否生成map后缀文件
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
