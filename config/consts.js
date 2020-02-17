'use strict'

module.exports = {
    //--------api url配置----
    //uat环境
    uatBaseUrl: 'http://172.29.1.144', //H5版网关地址http://172.29.1.144  原开发环境 http://192.168.35.103:8781
    //真实场环境
    prodBaseUrl: 'https://www.iaitrade.com',
    // iaitradeWechatUrl:'http://iaitrader.widequant.cn',
    iaiTradeProdUrl:'http://iaitrader.bbyou.net',
    // uat微信授权地址
    wechatUatAuthUrl:'http://120.77.0.106',
    // 生产微信授权地址
    wechatProdAuthUrl:'http://120.77.0.106',
    iaiTradeUatUrl:'http://172.29.1.144', //120.77.0.106  //220.241.167.139
    // iaiTradeUatUrl:'http://172.29.1.144',
    //--------node 环境变量----
    uatNodeEvn:'uat',
    prodNodeEvn:'production',
    devNodeEvn:'development'
}
