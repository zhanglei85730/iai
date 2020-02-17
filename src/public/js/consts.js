/**
 * pages下的通用变量定义
 */
// 真实场
const prodWebSocketUrl = 'ws://220.241.167.89:8899/ws';
// 开发、测试行情websocket
const devWebSocketUrl = 'ws://192.168.35.103:8781/ws';
// const globalConsts = require('@public/js/consts.js')

const platformCode = 'platformCode';
// 从sessionStorage里获取platformCode
function getPlatformCode() {
    const code = sessionStorage.getItem(platformCode);
    if (code) {
        return code
    } else {
        return 'PF10'
    }
}
console.log('全局变量NODE_ENV环境:' + process.env.NODE_ENV)
module.exports = {
    //微信接口url前缀
    wechatUrlPrefixName:'/thirddock/iai_trader',
    //接口url前缀
    urlPrefixName:'/iaitrade',
    // 盯盘产品代码 10表示智能盯盘
    product:10,
    // 后台融合保存授权的访问信息
    accessAuthKey:'accessAuth',
    // token key值
    access_token:'access_token',
    // 表格数据无数据占位符
    placeholderForTableTd: '_',
    // 用户访问来源
    userFromType: {
        app: 1,//业务方01 02 03 app
        iaiTraderApp: 2,//自有app iaiTrader app
        wechat: 3,//微信
        web: 4//web端
    },
    // 微信url参数key
    wechatStorageKeys: {
        token: 'token',
        bind_phone: 'phone_bind',
        openid: 'openid',
        tenant_id:'tenant_id' // 租户id
    },
    // 微信本地存储key
    wechatSaveKey: 'wechatInfo',
    bindPhone: {
        binded: 1,
        noBind: 0
    },
    // 本地存储类型
    storageType: {
        sessionStorage: 1,
        localStorage: 2,
        cookie: 3,
    },
    // url参数key
    urlParamsKeys: {
        debugger: {
            name: 'debug',
            value: {
                show: true
            }
        },
        // 是否显示平台切换浮层
        showChangePlatformPlane: {
            name: 'showChangePlatformPlane',
            value: {
                show: true
            }
        },
        // 微信清除本地存储参数
        clearLocalData: {
            name: 'clearLocalData',
            value: {
                clear: true
            }
        },
        // 后台融合 接口服务名
        seviceName: {
            name: 'seviceName',
            value: {
                // 微信
                wechat: 'iai_trader',
                //业务方01pm 01贵金属 02 03业务    
                iaitrade: 'iaitrade'
            }
        },
        // web首页推广参数
        popularize: {
            name: 'popularize',
            value: {
                isPopularize: true
            }
        },
        // 首页推荐事件推荐类型
        singularType: {
            name: 'singularType',
            value: {
                importantEvent: 5,//重要事件，
                allType: 0
            }
        },
        // 跳转页面
        goPage: {
            name: 'goPage',
            value: {
                page0: '0',//iai-trader app首页
                page1: '1',//胜率榜单
                page2: '2',//2高级盯盘
                page3_1: '3_1',//盯盘通知
                page3_2: '3_2',//盯盘监控中
                page3_3: '3_3',//盯盘已过期
                page4: '4',//minePage
                page5: '5',//预警设置详情页面
                page6: '6',//新的价格预警页面
                page7: '7',//新首页
                page8: '8',//产品详情

            }
        },
        //iaiTrater app url区分参数
        platformName: {
            name: 'platformName',
            // value:'iaiTrader'
            value: {
                iaiTrader: 'iaiTrader',
                wechat: 'wechat',
            }
        },
        // 底部菜单是否隐藏
        bottomMenu: {
            name: 'bottomMenu',
            value: {
                show: 1,//显示
                hide: 0//不显示
            }
        },
        // 平台版本
        platforVersion: {
            name: 'platforVersion',
            value: {
                version01: 2,
            }
        },
        // 切换平台面板是否显示
        platformChangePlane: {
            name: 'platformChangePlane',
            value: {
                show: true,
            }
        },
        // iai-trader微信号参数标识是否是测试账号
        wechatTestParmasName: {
            name: '',
            value: {

            }
        },
        // 新价格预警页面返回参数
        backPage: {
            name: 'backPage',
            value: {
                page: ''
            }
        },
        //isInfo 带此参数 为----信息流进入产品详情页面。
        isInfo: {
            name: ''
        }
    },
    waringSymbolsKey: 'waringSymbols',
    platformCodeKey: 'platformCode',
    storageTypeKey: 'storageType',
    // 是否首次进入
    firstVisiterKey: 'firstVisiterKey',
    // 获取userInfo从app方法名
    getInfoFromAppMethodName: 'getInfo',
    // js调用app方法钩子
    appMethodChannel: {
        // ix印尼
        ix: {
            android: 'IxJsHook'
        },
        // 默认01pm、01pmgold、02fx、03se使用默认
        default: {
            android: 'uiObject'
        },
        // 保存appMethodChannel在storage里的key
        saveStorageKey: 'appMethodChannel'
    },
    // DialogSwipe组件refs配置
    dialogSwipeRefName: {
        // 综合评分
        allScore: 'sialogSwipe01',
        // 盈亏比评分
        winOrLoss: 'sialogSwipe02'
    },
    //cookies
    cookies: {
        // 新手向导标识是否显示过新手向导
        newGuideKey: 'newGuideShow',
        // 新功能阻力位输入tip
        newInputTipKey1: 'newInputTip1',
        newInputTipKey2: 'newInputTip2',
        //高级盯盘-现价盯盘第一次进入newest图标显示标记key，cookie里有标及不显示
        newestTipPriceSelKey: 'newestPriceList',
        //高级盯盘-涨跌盯盘第一次进入newest图标显示标记key，cookie里有标及不显示
        newestTipRiseSelKey: 'newestRiseList',
        showNoticeKey: 'isShowNoticeKey',
        // 为设置过1分钟提醒账户显示通知弹窗 有值表示已经提示过
        noticeForOneMinuteKey: 'noticeForOneMinute',
        homePageGuideKey:'homePageGuide',
        minePageNoticeKey:'minePageNotice',
        managerItemOpenKey:'managerItemOpen'

    },
    colors: {
        red: '#9e5159',
        green: '#5b8463'
    },
    // app用户授权
    auth: {
        // app用户授权状态
        statu: {
            // 成功
            success: 1,
            //失败
            fail: -1,
            noLogin:5
        },
        // 授权状态session的key
        sessionStoryKey: 'authStatu'
    },
    // 访问设备类型
    visitDeviceType: {
        fromApp: 'app',
        fromWeb: 'web',
    },
    //后端返回状态映射
    resStatus: {
        //响应成功
        success: 1,
        // 未绑定账号
        bindAccount: -3,
        // 未授权
        noLogin: -1,
        // 错误
        error: 0,
        // h5授权之后未设置密码
        noAuth: -4,
        //游客
        guest: -5
    },
    NODE_ENV: process.env.NODE_ENV,
    wsUrl: devWebSocketUrl,//开发、测试
    // wsUrl:prodWebSocketUrl,//真实
    // wsUrl:'ws://172.30.10.244:8899/ws',//测试休市行情
    userInfoKeyNameInStore: 'userInfo',
    platformCodeKeyNameInStore: platformCode,
    // 预警类型编码
    priceWarningCode: '10',
    indexWarningCode: '20',
    combinationWarningCode: '30',
    // 公共资源图片路径前缀
    commonImagePathPrefix: 'static/img/commonPage/',
    // 账号类型
    accountType: {
        visitor: 0,//游客
        real: 1,//真实
        simulate: 2,//模拟或demo
    },
    platformNames: {
        // 01黄金投资
        pm: 'PF10',
        // 01业务贵金属
        pmglod: 'PF10_A',
        // 02金道外汇投资
        fx: 'PF12',
        // 03智选天下
        se: 'PF14',
        dev: 'PF10',
        // dev: 'PF10',
        web: 'web',
        wechat: 'PF00',
        iaiTrader: 'PF00'
    },
    // 平台代码
    platformCode: getPlatformCode(),
    // 埋点需要动态传的项目名
    projectName: {
        // 01
        pm: 'gwpm',
        //02
        fx: 'gwfx',
        //01贵金属
        // pmglod:'gwpmgold',
        pmglod: 'gwpm',
        default: 'default',
        // 03 智选天下
        se: 'gwse',
    },
    //真实场websocket url,01业务、02业务不一样的地址
    wsUrls: {
        //01 金道黄金投资
        pm: 'wss://www.iaitrade.com/ws/PF10',
        //01 金道贵金属
        pmglod: 'wss://www.iaitrade.com/ws/PF10',
        //02 金道外汇投资
        fx: 'wss://www.iaitrade.com/ws/PF12',
        //03 03智选天下
        se: 'wss://www.iaitrade.com/ws/PF12',
        //web端
        web: 'wss://www.iaitrade.com/ws/PF10',
        // 新平台
        newPlatform: 'ws://172.29.1.144/ws',//PF12 or PF10
    },
    //用于测试的账号
    testAccounts: {
        pm: {
            // 正式环境测试账号
            prod: '88064688',//qwer1234
            // 测试环境账号
            uat: '88002290',
        },
        pmglod: {
            uat: '88002421',
            prod: '88067599'
        },
        fx: {
            // 正式环境测试账号
            prod: '86252384',//pc端登录账号13530111459 qwer1234
            uat: '86142613',
        },
        se: {
            prod: '68026247',
            uat: '68001141'
        },
        //微信绑定手机号
        wechat: {
            prod: '15920002035',
        }
    },
    //特殊账号
    specialAccounts: {
        fx: {
            // tracy 查看我的预警-已过期收益点数只对86241862账号开放
            viewData: '86241862'
        }
    },
    //根据getInfo返回的platformName信息区分app平台（01、02）的判断标识（老方法，少用）
    juadePlatformNames: {
        // 01业务  外汇投资
        pm: '金道黄金投资',
        // 01业务  贵金属
        pmglod: '金道贵金属',
        // 02业务
        fx: '金道外汇投资',
        se: '智选天下',
        // 微信
        wechat: 'wechat',
        //iai-trader 独立app
        iaitradeApp: 'iaiTrader'
    },
    // 根据getInfo返回的platformType信息区分app平台(这个试app平台判断的主要方法，主要用这个，新方法)
    juadePlatformTypes: {
        // 01业务  黄金投资 3_pm
        pm: 'pm',
        // 01业务  贵金属  3_pmgold
        pmglod: 'pmgold',
        // 02业务 外汇投资 1_fx
        fx: 'fx',
        // 03业务 智选天下 10_se
        se: 'se'
    },
    //判断平台依据app返回的companyId
    juadePlatByCompanyId: {
        // 02业务
        fx: 1,
    },
    symbolsIdKeyInSessionStorage: 'symbolsId',
    // url中encodeURI不能处理的特殊符号
    stringAsciiCode: {
        percent: 'alt37',
    },
    // app传过来的直接跳转预警设置页面的symbol id参数key
    setWarningSymbolKey: 'setWarningSymbol',
    // 语言代码
    locale: {
        // 中文（大陆）
        chinese: 'zh_CN',
        // 印度尼西亚
        indonesia: 'ID',
    },
    // 胜率榜单产品信息sessionStorage key
    rankingProductsSesstionStorageKey: 'rankingProducts',
    // 是否提示过打开通知权限 sessionStorage key
    notificationNeedOpenKey: 'notificationedNeedOpen',
    tableStyle: {
        stockName: { width: "80px", color: '#5291FF', fontSize: '0.26rem' },
        redColumn: { color: '#FF6666' },
        // 上涨颜色
        upColor: '#D95757',
        // 上涨颜色
        downColor: '#83B36B',
        //  不涨
        equalColor: '#fff',
        noData: '--',
        default: '<span class="column-sort-default-icon"></span>',
        sortUp: '<span class="column-sort-up-icon"></span>',
        sortDown: '<span class="column-sort-down-icon"></span>',
        //  降序
        sortDesc: 'desc',
        //  升序
        sortAsc: 'asc',
        //
        sortDefault: 'default',
    },
};
