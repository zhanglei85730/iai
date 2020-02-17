const { getInfoFromSessionStorage,
    userFromType, getNewPlatform,
    isWechatBind, isIaiTraderApp, newUserFromType,
    isWechatPlatform, } = require('../../public/js/util.js')
const globalConsts = require('@public/js/consts.js')
module.exports = {
    // 图片资源路径配置（生产环境mobile/static/images/、开发环境static/images）
    imagePathPrefix: process.env.NODE_ENV === 'production' ? 'static/img/warning/' : 'static/img/warning/',
    // 用户来源来信
    visitDeviceType: globalConsts.visitDeviceType,
    // 公共资源图片路径前缀
    commonImagePathPrefix: globalConsts.commonImagePathPrefix,
    NODE_ENV: process.env.NODE_ENV,
    //header头部颜色  
    headerBackgroundColor: '#2E2E3B',
    // 头部背景颜色
    headerStyle: {
        backgroundColor: '#2E2E3B'
    },

    // 获取用户登录信息（从sessionStorage里获取）
    getLoginInfo: function () {
        return getInfoFromSessionStorage('userInfo');
    },
    // 是否为微信公众号里访问
    isWechat: function () {
        const userInfo = getInfoFromSessionStorage(globalConsts.userInfoKeyNameInStore); //userInfoKeyNameInStore
        if (!!userInfo) {
            const { platformName = '' } = userInfo;
            if (platformName == globalConsts.urlParamsKeys.platformName.value.wechat && !isIaiTraderApp()) {
                return false;
            } else {
                return true
            }
        } else {
            return true
        }
        //
        // if (Platform) {
        //     return Platform.value == globalConsts.platformNames.wechat && !isIaiTraderApp() ? false : true
        // } else {
        //     return true
        // }

    },
    isIaiTraderApp:isIaiTraderApp(),
    isWechatPlatform:isWechatPlatform(),
    // 统一错误处理
    errorHandle: function (e) {
        console.error(e.message)
    },
    // 账号类型
    accountType: '',
    /**
     * @description 检查是否登录过，app登录通过accountType=0 或accountType=2游客和模拟账号当成未登录
     * 信息 {account:'',..}, 如果pc端登录会返回{"username":"19900049808","nickname":"","avatar":""}，通过 account!='' 或 username!=''来判断是否登录
     * @return {Boolean} 登录true,未登录 false
     */
    isLogined: function () {
        const loginInfo = getInfoFromSessionStorage('userInfo');
        if (loginInfo) {
            const { account = '', username = '', accountType = '', token = '',nickname='',platformName='' } = loginInfo;
            // iai-trade app
            if (isIaiTraderApp()) {
                return token != '' ? true : false
            }
            // 如果是app 账户类型是游客或模拟账号 当做未登录处理
            if (userFromType() == 'app') {
                if (accountType == globalConsts.accountType.visitor || accountType == globalConsts.accountType.simulate) {
                    //PF00平台模拟账号也能盯盘
                    if (getNewPlatform()) {
                        if (isWechatBind()) {
                            return true;
                        }
                        if (isIaiTraderApp() && loginInfo.hasOwnProperty('token') && token != '') {
                            return true;
                        }
                    }
                    return false
                } else if (accountType == globalConsts.accountType.real || isWechatBind()) {
                    return true
                }
                //web
            } else if(username !== '') {
                return true;
            //微信
            }else if(platformName==globalConsts.platformName.value.wechat){
                return true;
            }
        } else {
            return false
        }
    },
    /**
     * @description 获取用户访问来源 app或是web端，通过登录信息可判断，app来源的用户 会有account='***'、accountType信息，就算未登录app来源的用户account=""为空,登录信息是否有accout和accountType属于为依据
     * @returns {String} app or web
     */
    userFromType: function () {
        return userFromType();
    },
    newUserFromType: function () {
        return newUserFromType()
    }
}