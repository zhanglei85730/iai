const globalConsts = require('./consts.js');
const configConsts = require('@config/consts.js')
import { globalTrackEvent } from '@public/js/trackEvent.js'
const warningConfig = require('../../pages/warning/config')
import axios from 'axios';
const urlPrefixName = globalConsts.urlPrefixName
/**
 * @description 统一处理错误方法
 * @param {Error} error
 */
export function commonError(error, context) {
    // context.toast = context.$createToast({
    //     txt: error.message,
    //     type: 'txt'
    // })
    // context.toast.show()
}
/**
 * @description 判断是否手机系统类型
 * @return {Boolean}  true / false
 */
export function isIos() {
    const ios = function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        return isIOS;
    }
    return ios()
}
/**
 * @description 获取url后参数值
 * @param {String} param url后面？开始参数 如:?a=1中的a
 * @returns {Srring|Boolean}相应参数值,未找到返回false
 */
export function getSearchParams(param) {
    const hash = location.href;
    const search = hash.match(/\?[^?]*/);
    if (!search) {
        return false
    }
    const searchStr = decodeURIComponent(search[0].slice(1));
    if (!searchStr) return false;
    const arr1 = searchStr.split('&');
    const result = Object.create({});
    arr1.forEach((item) => {
        const arr2 = item.split('=');
        result[arr2[0]] = arr2[1];
    });
    if (param) {
        return Object.keys(result).indexOf(param) >= 0 ? result[param] : false;
    } else {
        return result;
    }
}
/**
 * @description 设置cookie
 * @param {String} name 键名
 * @param {*} value  值
 */
export function setCookie(name, value) {
    var Days = 360 * 20;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
/**
 * @description 获取cookie
 * @param {String} name 键名
 * @param {*} value 值
 */
export function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    } else {
        return null;
    }
}
/**
     * 删除cookie
     * @param name cookie的名称
     */
export function deleteCookie(name) {
    setCookie(name, ' ', -1);
};
/**
 * @description 判断Axios请求是否成功，错误alert错误信息,axios返回的数据经过处理所以需要处理
 * @param {Object} res 接口响应数据
 * @param {Object} conext vue实例
 * @param {Boolen} isApiData 是否返回未处理的原始api数据结构
 * @returns {Boolen} 成功返回接口data的数据  失败false
 */
export function getDataFoxAxiosRequest(res, conext, isApiData = false) {
    //
    if (res === false) {
        console ? console.error('参数有误') : ''
    };
    const { status: httpStatus = '', data = {} } = res;
    const { status: apiStatus = '', data: apiData = '', message = '' } = data;
    // http 是否响应成功
    if (Number(httpStatus) !== 200) {
        // conext.$createDialog({
        //     type: 'alert',
        //     content: '接口响应失败',
        // }).show();
        console.log('接口响应失败')
        return false
    }
    // 0为失败、1为成功、-3为未绑定账号
    if (Number(apiStatus) == 0) {
        // conext.$createDialog({
        //     type: 'alert',
        //     icon: 'cubeic-warn',
        //     content: message !== '' ? message : '操作失败',
        // }).show();
        // console.log(message)
        return false
    } else if (Number(apiStatus) == -3) {
        // conext.$createDialog({
        //     type: 'alert',
        //     icon: 'cubeic-warn',
        //     content: message !== '' ? message : '请绑定交易账号',
        // }).show();
        // console.log(message)
    }
    return isApiData ? data : apiData
}
/**
 *@description 保留小数位数
 *@param  {Number} num 需要保留的小数位数
* @returns {String} 返回保留位数的数据或''
 */
export function numberFixed(number, num = false, symbol = '') {
    if (number == undefined || !num || isNaN(num)) return '';
    return symbol + (Number(number)).toFixed(Number(num))
}
// 保留金额两位小数并加符号
export function getMoneyAmount(value) {
    let result = '';
    try {
        result = numberFixed(value, 2, '$')
    } catch (e) {
        result = 'null'
    }
    return result
}
/**
 * @description 本地保存类型
 */
export function getSaveTye() {
    try {
        const _getPlatformCode = localStorage.getItem(globalConsts.storageTypeKey);
        const __getPlatformCodeObj = JSON.parse(_getPlatformCode)
        return __getPlatformCodeObj.value == globalConsts.storageType.localStorage ? 'localStorage' : 'sessionStorage'
    } catch (e) {
        return 'sessionStorage'
    }

}
//保存用户信息到SessionStorage
export function saveInfoToSessionStorage(data = '', key = 'userInfo', type = "sessionStorage", isUpdate = false) {
    if (!data) return null;
    const userInfoKey = key;
    let storageName = getSaveTye()
    if (type !== 'sessionStorage') {
        storageName = type
    }
    const userInfo = window[storageName].getItem(userInfoKey);
    if (!userInfo) {
        window[storageName].setItem(userInfoKey, JSON.stringify(data))
    }
}
/**
 * @description 保存信息到本地存储,保存的数据一定要用json数据
 * @param {*} data  保存的数据
 * @param {String} key 保存的键值
 * @param {String} type 保存类型 sessionStorage\localStorage
 * @param {String} method 方法类型 更新、保存
 */
export function saveInfoToStorage({ data = '', key = 'userInfo', type = 'sessionStorage', method = 'save' }) {
    try {
        if (!data) return null;
        if(!isObject(data)){
            debugger
        }
        const userInfoKey = key;
        let storageName = getSaveTye()
        iConsole('storageName='+storageName)
        if (type !== 'sessionStorage') {
            storageName = type
        }
        const userInfo = window[storageName].getItem(userInfoKey);
        // 更新
        const isOk =( method == 'modify' && userInfo)
        if (method == 'modify' && userInfo) {
            const _userInfo = JSON.parse(userInfo);
            if (_userInfo.hasOwnProperty('value')) {
                Object.assign(_userInfo.value, data);
            } else {
                Object.assign(_userInfo, data);
            }
            window[storageName].setItem(userInfoKey, JSON.stringify(_userInfo));
            return;
        }
        if (method == 'save' && !userInfo) {
            window[storageName].setItem(userInfoKey, JSON.stringify(data))
        }
    } catch (e) {
       iConsole(e.message)
    }
}
//获取用户信息SessionStorage
export function getInfoFromSessionStorage(key = 'userInfo', type = "sessionStorage") {
    let storageName = getSaveTye()
    // let storageName=type;
    if (type !== 'sessionStorage') {

        storageName = type
    }
    const userInfo = window[storageName].getItem(key);
    if (!userInfo) return null;
    try {
        let userInfoObject = JSON.parse(userInfo);
        return userInfoObject
    } catch (e) {
        console.error(e.message)
    }
}
/**
 * @description 获取json的属性
 * @param {Object} objectData json对象
 * @param {String} propertyName json键名
 * @param {String} type string/number
 * @param {Boolean} toFixedNum 是否保留小数位数
 * @returns {String}
 */
export function getPropertyForObject({ objectData = false, propertyName = '', type = 'string', toFixedNum = false } = {}) {
    const strategRankDetail = objectData;
    if (!objectData || !isObject(objectData) || !propertyName) {
        return '';
    }
    if (!objectData.hasOwnProperty(propertyName)) {
        if ((type).toLowerCase() === 'number') {
            return 0;
        } else {
            return '';
        }
    }
    if (type === 'Number') {
        if (toFixedNum) {
            return (Number(strategRankDetail[propertyName])).toFixed(2)
        } else {
            return Number(strategRankDetail[propertyName])
        }
    } else {
        return strategRankDetail[propertyName]
    }
}
// 判断Array
export function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
}
// 判断Object
export function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}
/**
 * @description 根据预警类型code返回预警分类（价格预警、指标预警、组合预警）
 * @param {Number|String} code 为预警类型
 * @returns {Object} {name:'',code:''} indexWarning/combinationWarning/priceWarning
 */
export function getWarningSort(code = '') {
    if (code === '') return null;
    const matchResult = String(code).match(/\d{1}/);
    if (!matchResult) return '';
    const matchValue = matchResult[0];
    let result = { cname: '', ename: '', code: '' };
    switch (matchValue) {
        case '1': {
            result = { cname: '价格预警', ename: 'priceWarning', code: '10' };
            break;
        }
        case '2': {
            result = { cname: '指标预警', ename: 'indexWarning', code: '20' };
            break;
        }
        case '3': {
            result = { cname: '组合预警', ename: 'combinationWarning', code: '30' };
            break;
        }
    }
    return result
}
/**
 * @description 通过id查找symbol信息
 * @param  {String | Number } id symbos的id
 * @returns {Object}
 */
export function getSymbolInfoById(id) {
    // 从sessionStorage获取保存的symbols数据
    const symbols = getInfoFromSessionStorage('waringSymbols');
    if (!symbols) return false;
    const filter = symbols.filter((item, index) => {
        item['index'] = index;
        return item.id[0] == id
    })

    if (filter.length > 0) {
        return filter[0]
    } else {
        return false
    }
}
// 通过symbol英文查找数据
export function getSymbolInfoByEnName(enName) {
    // 从sessionStorage获取保存的symbols数据
    const symbols = getInfoFromSessionStorage('waringSymbols');
    if (!symbols) return false;
    const filter = symbols.filter((item, index) => {
        item['index'] = index;
        return item.uname == enName
    })

    if (filter.length > 0) {
        return filter[0]
    } else {
        return false
    }
}
/**
 * @description 返回所有的symbols
 */
export function getSymbols() {
    const symbols = getInfoFromSessionStorage('waringSymbols');
    return symbols ? symbols : null
}
/**
 * @description 返回symbols中同一种类型（如：current、stock、index）
 * @param {String} sort 分类名 currency|goods|index|virtual_coin|refer|stock
 */
export function getSymbolsBySort(sort) {
    // 从sessionStorage获取保存的symbols数据
    const symbols = getInfoFromSessionStorage('waringSymbols');
    if (!symbols) return false;
    const filter = symbols.filter((item, index) => {
        return item.id[2] === sort
    })
    if (filter.length > 0) {
        return filter
    } else {
        return []
    }
}
export function jsonToParams(obj) {
    const arr = []
    let add = '';
    function getarams(obj) {
        const result = [];
        for (var key in obj) {
            result.push(key + '=' + obj[key])
        }
        return result.join('&')
    }
    for (var key in obj) {
        if (isObject(obj[key])) {
            add += getarams(obj[key])
        } else {
            arr.push(key + '=' + obj[key])
        }
    }
    if (add != '') {
        return arr.join('&') + "&" + add
    } else {
        return arr.join('&')
    }
}
/**
 * @description 将字符串对象格式转换为json格式
 * @param {String} 字符串 如:"a:1,b:1"
 *@returns {Object}
 */
export function formatObjString(strObj = "") {
    if (strObj === '') return;
    let arr = strObj.split(","),
        Obj = {};
    arr.forEach((item) => {
        if (item.indexOf(":") >= 0) {
            const _arr = item.split(':');
            Obj[_arr[0]] = `${_arr[1]}`
        }
    })
    return Obj
}
/**
 * 调用app方法获取用户信息
 */
export function getInfoFromApp(appMethodchannel = 'uiObject') {
    return new Promise((resolve, reject) => {
        const loginedInfo = getInfoFromSessionStorage('userInfo');
        // 判断是否已登录过,已登录过返回已登录信息
        if (!!loginedInfo) {
            resolve(loginedInfo)
            // 未登录
        } else {
            //以下app未公司业务独立app ios与android调用方法部一样
            // ios浏览器
            if (isIos()) {
                try {
                    // ios调用用户信息方法
                    // 这里的回调写在初始化页面了
                    window.webkit.messageHandlers.getInfo.postMessage(null);
                    resolve('ios')
                } catch (e) {
                    // web用户且未登录
                    resolve(null)
                }
                // 安卓
            } else {
                try {
                    // android调用用户信息方法
                    const userInfo = JSON.parse(window[appMethodchannel].getInfo());
                    resolve(userInfo);
                    //  保存用户到sessionStorage信息
                    saveInfoToSessionStorage(userInfo, globalConsts.userInfoKeyNameInStore);
                    openSensorsTarck(userInfo)
                } catch (e) {
                    console.log('getInfo：' + e.message)
                    // web用户且未登录
                    resolve(null)
                }
            }
        }
    })
}
/**
 * 调用app方法 跳转去交易页面
 */
export function goAppTrage(symbolId) {
    console.log('执行跳转页面')
    if (isIos()) {
        try {
            // ios调用用户信息方法
            window.webkit.messageHandlers.goTrade.postMessage(symbolId);
            return true
        } catch (e) {
            return false
            // web用户且未登录
            // resolve(null)
        }
        // 安卓
    } else {
        try {
            // android调用用户信息方法
            window.uiObject.goTrade(symbolId);
            return true
            // resolve(userInfo)
        } catch (e) {
            return false
            // web用户且未登录
            // resolve(null)
        }
    }
}
// 检查app用户是否打开通知权限 打开返回1 为打开返回0
export function getIsNotificationNeedOpen() {
    const isNotificationed = getInfoFromSessionStorage(globalConsts.notificationNeedOpenKey)
    // 如果提示过一次 不再提示 直到下次再打开app或进入盯盘
    if (!!isNotificationed && isNotificationed.value == 3) {
        return Promise.resolve(3)
    }
    if (isIos()) {
        try {
            // ios调用用户信息方法
            window.webkit.messageHandlers.isNotificationNeedOpen.postMessage(null);
            saveInfoToSessionStorage({ value: 3 }, globalConsts.notificationNeedOpenKey)
            return Promise.resolve(1)
        } catch (e) {
            // web端或出现异常
            console.error('isNotificationNeedOpen调用出错：' + e.message)
            return Promise.resolve(false)

        }
        // 安卓
    } else {
        try {
            const appMethodNameChannel = getAppMethodChannel(getPlatformCode())
            // android调用用户信息方法
            saveInfoToSessionStorage({ value: 3 }, globalConsts.notificationNeedOpenKey)
            return Promise.resolve(window[appMethodNameChannel].isNotificationNeedOpen())
        } catch (e) {
            return Promise.reject(false)
            // web用户且未登录
            // resolve(null)
        }
    }
}
/**
 * @description 通过调用app方法返回app页面
 */
export function backToApp() {
    function _backApp() {
        if (isIos()) {
            try {
                window.webkit.messageHandlers.backAction.postMessage(null);
            } catch (e) {
            }
            // 安卓
        } else {
            try {
                const _appMethodChannelName = getInfoFromSessionStorage(globalConsts.appMethodChannel.saveStorageKey)
                window[_appMethodChannelName.value].backAction();
            } catch (e) {

            }
        }
    }
    axios({
        method: 'get',
        url: `/app/user/logout`
    }).then(() => {
        _backApp()
    }).catch((e) => {
        _backApp()
    })
}
/**
 * @description 将js数据数据包装成项目res接口数据
 */
export function warpperDataToRes(wrapperData = '') {
    if (!wrapperData) return null;
    return {
        data: {
            data: wrapperData,
            status: 1
        },
        status: 200
    }
}
// 保存平台信息到window
export function saveLoginInfoToWindow(loginInfo = {}, callback = () => { }) {
    // pc等、非app
    if (loginInfo === null) {
        callback();
        return Promise.resolve(null)
    };
    if (loginInfo.hasOwnProperty('account') & loginInfo.hasOwnProperty('platformName')) {
        const { platformName = 'fs', platformType = 'zz_d' } = loginInfo;
        // 去除空格 01业务贵金属 app
        const replaceSapce = platformName.replace(/\s{0,}/g, '')
        /**
         * 用到了两种判断方法判断app平台，首要判断条件用platformType,
         * 没有platformType属性则用platformName属性判断，platformName用来兼容之前uat没加platformType属性的安装包
         */
        // console.log('platformType='+platformType)
        // console.log('pmglod='+globalConsts.juadePlatformTypes.pmglod);
        // 同一个业务的app android、ios版本可能不一样（如：03智选天下 andorid版为10_se， ios为14_se只能判断下滑线后面的字符串）
        const platformTypeValue = platformType.split('_')[1];
        // 01业务黄金投资
        if (platformTypeValue == globalConsts.juadePlatformTypes.pm ||
            platformName.indexOf(globalConsts.juadePlatformNames.pm) >= 0
        ) {
            saveInfoToSessionStorage({ value: globalConsts.platformNames.pm }, globalConsts.platformCodeKeyNameInStore)
            // 01业务 贵金属
        } else if (platformTypeValue == globalConsts.juadePlatformTypes.pmglod ||
            replaceSapce.indexOf(globalConsts.juadePlatformNames.pmglod) >= 0
        ) {
            saveInfoToSessionStorage({ value: globalConsts.platformNames.pmglod }, globalConsts.platformCodeKeyNameInStore)
            // 02业务 fx 外汇投资
        } else if (platformTypeValue == globalConsts.juadePlatformTypes.fx ||
            (loginInfo.hasOwnProperty('companyId') && loginInfo.companyId == globalConsts.juadePlatByCompanyId.fx)
        ) {
            saveInfoToSessionStorage({ value: globalConsts.platformNames.fx }, globalConsts.platformCodeKeyNameInStore)
            // 03 se 智选天下
        } else if (platformTypeValue == globalConsts.juadePlatformTypes.se ||
            (loginInfo.hasOwnProperty('companyId') && loginInfo.companyId == globalConsts.juadePlatByCompanyId.se)
        ) {
            saveInfoToSessionStorage({ value: globalConsts.platformNames.se }, globalConsts.platformCodeKeyNameInStore)
            //iai-trader app
        } else if (platformName == globalConsts.juadePlatformNames.iaitradeApp) {
            saveInfoToSessionStorage({ value: globalConsts.platformNames.iaiTrader }, globalConsts.platformCodeKeyNameInStore)
        }
    }
    callback()
}
// 获取用户来源类型 app or web 同步方法
export function userFromType() {
    const loginInfo = getInfoFromSessionStorage('userInfo');
    // console.log('loginInfo:'+loginInfo)
    saveLoginInfoToWindow(loginInfo);
    if (loginInfo) {
        if (loginInfo.hasOwnProperty('account') && loginInfo.hasOwnProperty('accountType')) {
            return 'app'
        } else {
            // 新平台除01、02、03\ix业务，PF00平台等 //getNewPlatform
            //loginInfo.hasOwnProperty('platform') && loginInfo.platform == globalConsts.platformNames.wechat
            if (getNewPlatform()) {
                return 'app'
            }
            return 'web'
        }
    } else {
        return 'web'
    }
}
/*app:1,//业务方01 02 03 app
iaiTraderApp:2,//自有app iaiTrader app
wechat:3,//微信
web:4//web端
返回code 1 2 3 4
*/
export function newUserFromType() {
    if (isIaiTraderApp()) {
        return globalConsts.userFromType.iaiTraderApp
    } else if (isWechatPlatform()) {
        return globalConsts.userFromType.wechat
    }
    const loginInfo = getInfoFromSessionStorage('userInfo');
    saveLoginInfoToWindow(loginInfo);
    if (loginInfo) {
        if (loginInfo.hasOwnProperty('account') && loginInfo.hasOwnProperty('accountType')) {
            return globalConsts.userFromType.app
        } else {
            return globalConsts.userFromType.web
        }
    } else {
        return globalConsts.userFromType.web
    }
}
// 获取用户来源类型 app or web 异步方法
export function usrFromTypeAsync() {
    return new Promise(resolve => {
        getInfoFromApp().then(loginInfo => {
            saveLoginInfoToWindow(loginInfo);
            if (loginInfo) {
                if (loginInfo.hasOwnProperty('account') & loginInfo.hasOwnProperty('accountType')) {
                    return resolve('app')
                } else {
                    return resolve('web')
                }
            } else {
                return resolve('web')
            }
        })
    })
}
// 返回用户账户信息
export function getAccount() {
    const loginInfo = getInfoFromSessionStorage('userInfo');
    let result = ''
    if (!!loginInfo) {
        const { account = '' } = loginInfo;
        result = account
    }
    return result
}
// 获取平台类型主要用于埋点 神测分析后台能区分是那个业务（01、02、03）或pc来源数据
export function judgePlatformType() {
    const platformCode = getInfoFromSessionStorage(globalConsts.platformCodeKeyNameInStore);
    let codeResult = '';
    // 根据平台添加事件跟踪前缀
    if (platformCode !== null) {
        codeResult = platformCode.value + '_'
    } else {
        codeResult = globalConsts.platformNames.web + '_'
    }
    return codeResult
}
/**
 * @description 埋点统一方法（神策埋点）
 * @param {Object} param0 神策参数
 * @param {Object} param1 根据code及warningType获取每个预警类型的前缀
 * @returns {Array}
 */
//神策埋点需要跟踪路径 预警类型等
export function trackEvent({ eventName = '', properties } = {}, { code = '', warningType = '' } = {}) {
    // if (!window.sensors) return;
    // const triggerSelectOptions = warningMapConfig.getWarningConditionForSelectOptions(code, warningType);
    // const { trackPrefix = "" } = triggerSelectOptions[0];
    // let codeResult = judgePlatformType();
    // const loginInfo = getInfoFromSessionStorage('userInfo');
    // // 首字母大写
    // const _eventName = eventName !== '' ? '_' + eventName.charAt(0).toUpperCase() + eventName.slice(1) : '';
    // if (trackPrefix != '') {
    //     try {
    //         sensors.track(`${trackPrefix}${_eventName}`, {
    //             account: getAccount()
    //         });
    //     } catch (e) {
    //     }
    // }
    //
}
// 神策埋点通用方法不会处理事件名
export function trackEventGeneral(eventName, properties = {}) {
    if (!window.sensors) return;
    let codeResult = judgePlatformType();
    // 首字母大写
    // const _eventName = eventName.charAt(0).toUpperCase() + eventName.slice(1)
    sensors.track(eventName, properties);
}
// 获取平台名 返回 PF10\PF12
export function getPlatformCode(data) {
    if (globalConsts.NODE_ENV == configConsts.devNodeEvn) {
        return "PF10"
    }
    const code = getInfoFromSessionStorage(globalConsts.platformCodeKeyNameInStore);

    try {
        if (code !== null) {
            return code.value
        } else {
            return globalConsts.platformNames.dev
        }
    } catch (e) {
        return globalConsts.platformNames.dev
    }
}
// 获取埋点项目名,初始化神策的时候要传进入
export function getTrackProjectName(data = '') {
    const code = getInfoFromSessionStorage(globalConsts.platformCodeKeyNameInStore);
    if (!code) return;
    // 01 黄金投资
    if (code.hasOwnProperty('value') && code.value == globalConsts.platformNames.pm) {
        return globalConsts.projectName.pm
        // 01 贵金属code.value
    } else if (code.hasOwnProperty('value') && code.value == globalConsts.platformNames.pmglod) {
        return globalConsts.projectName.pmglod
        //02 外汇投资
    } else if (code.hasOwnProperty('value') && code.value == globalConsts.platformNames.fx) {
        return globalConsts.projectName.fx
        // 03智选天下
    } else if (code.hasOwnProperty('value') && code.value == globalConsts.platformNames.se) {
        return globalConsts.projectName.se
    }
}
// 获取symbol ui code
export function getSymbolUiCode(symbolId) {
    const symbolUiCodes = getInfoFromSessionStorage(globalConsts.symbolsIdKeyInSessionStorage);
    if (!symbolUiCodes) return [];
    return symbolUiCodes.filter((item) => {
        const { id } = item;
        return id == symbolId
    })
}
/**
 * @description 编译特殊符号 如：% # 等
 */
export function encodURIForSpecial(str = '') {
    if (str == '') return;
    return str.replace(/\&/g, "alt38")
}
/**
 * @description 编译特殊符号 如：% # 等
 */
export function decodURIForSpecial(str = '') {
    if (str == '') return;
    return str.replace('alt38', "&")
}
/**
 * @description 根据symbol的英文名返回symbol信息
 * @param {String} name symbol的英文名
 */
export function getSymbolInfoByEname(name, symbol) {
    // 从sessionStorage获取保存的symbols数据
    const symbols = getInfoFromSessionStorage('waringSymbols');
    if (!symbols) return false;
    const filter = symbols.filter((item, index) => {
        return item.uname == name
    })
    if (filter.length > 0) {
        return filter[0]
    } else {
        return false
    }
}
/**
 * @description 解决ios 键盘收起后页面不能还原的问题
 */
export function iosKeyboardHide() {
    if (isIos()) {
        document.body.addEventListener("focusout", () => {
            //软键盘收起的事件处理
            setTimeout(() => {
                const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                window.scrollTo(0, Math.max(scrollHeight - 1, 0));
            }, 100);
        });
    }
}
/**
 * @description 设备型号
 * @returns {Object} 属性model表示 型号，属性isBangsScreen表示是否刘海屏
 */
export function getDeviceModel() {
    let deviceString = '';
    if (/iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)) {
        deviceString = 'iphoneX'
    } else if (/iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 414 && window.screen.height === 896) {
        deviceString = 'iphoneXSMax'
    } else if (/iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 2 && window.screen.width === 414 && window.screen.height === 896) {
        deviceString = 'isIPhoneXR'
    }
    // console.log(document.navigator)
    return {
        model: deviceString,
        isBangsScreen: deviceString != '' ? true : false
    }
}
/**
 * @description 返回i18n的当前数据
 * @param {Object} i18n
 * @returns {Object}
 */
export function getI18nData(i18n = '') {
    if (i18n == '') return;
    const { messages = {}, locale = '' } = i18n;
    let i18nData = {};
    for (let key in messages) {
        if (key == locale) {
            i18nData = messages[key];
            break;
        }
    }
    return i18nData
}
/**
 * @description 从app getInfo方法返回信息里获取token信息
 * @returns {String} 返回token信息，没有则返回'' 空字符串
 */
export function getTokenFromAppGetinfo() {
    const userInfo = getInfoFromSessionStorage(globalConsts.userInfoKeyNameInStore);
    let result = ''
    if (typeof (userInfo) === 'string') {
        console.log('执行转换为obj')
        result = formatObjString(data)
        // 如果对象
    } else if (isObject(userInfo)) {
        result = userInfo
    }
    if (!!userInfo) {
        const { token = '' } = result;
        return token
    } else {
        return ''
    }
}
//  // 判断是否显示菜单显示在顶部
export function isPlatformCodeSe() {
    const keyNameValue = "top"
    const params = getSearchParams('menuPosition')
    if (params == keyNameValue) {
        saveInfoToSessionStorage({ value: keyNameValue }, 'menuPosition')
        return true
    } else {
        const parmasFromStore = getInfoFromSessionStorage('menuPosition')
        if (!!parmasFromStore && parmasFromStore.value == keyNameValue) {
            return true
        } else {
            return false
        }
    }
}
/**
 * @description 对字符串按unicode编码进行计数，中文占两个字符
 * @param {Srring} string
 */
export function getStringLengthByUnicode(string = '') {
    if (string == '' || string.length == 0) return 0;
    let add = 0;
    for (let i = 0; i < string.length; i++) {
        if (/^[\u4E00-\u9FA5]{1,5}$/.test(string[i])) {
            add += 2
        } else {
            add++
        }
    }
    return add
};

//ios刘海屏 02、03业务
export function isBangsScreenForIos() {
    const deviceModel = getDeviceModel();
    const platformCode = getPlatformCode();
    if (deviceModel.isBangsScreen) {
        if (isIos()) {
            if (platformCode == globalConsts.platformNames.fx || platformCode == globalConsts.platformNames.se) {
                // if (platformCode == globalConsts.platformNames.fx) {
                return true
            } else {
                return false
            }
        }
    }
}
//ios刘海屏 01业务
export function isBangsScreenForIosPm() {
    const deviceModel = getDeviceModel();
    const platformCode = getPlatformCode();
    if (deviceModel.isBangsScreen) {
        if (isIos()) {
            if (platformCode == globalConsts.platformNames.pm || platformCode == globalConsts.platformNames.pmglod) {
                // if (platformCode == globalConsts.platformNames.fx) {
                return true
            } else {
                return false
            }
        }
    }
}
/**
 * 去app登录界面
 */
export function goAppLogin(pageUrl = '') {
    const goPageObj = globalConsts.urlParamsKeys.goPage;
    let urlVlaue = '1';
    switch (pageUrl) {
        case '/winList': {
            urlVlaue = goPageObj.value.page1;
            break;
        }
        case '/advanceAssign': {
            urlVlaue = goPageObj.value.page2;
            break;
        }
        case '/myWarning': {
            urlVlaue = goPageObj.value.page3_1;
            break;
        }
        case '/myWarning?tabName=盯盘监控中': {
            //tabName=盯盘监控中
            urlVlaue = goPageObj.value.page3_2;
            break;
        }
        case '/myWarning?tabName=盯盘已过期': {
            urlVlaue = goPageObj.value.page3_3;
            break;
        }
        case '/iaiTraderAppIndex': {
            urlVlaue = goPageObj.value.page0;
            break;
        }
        case '/minePage': {
            urlVlaue = goPageObj.value.page4;
            break;
        }
    }
    if (pageUrl != '') {
        location.href = `https://gologin?goPage=${urlVlaue}`
    } else {
        location.href = `https://gologin`
    }
}
/**
 * @description 去到app注册页面
 */
export function goAppRegister() {
    const code = getInfoFromSessionStorage(globalConsts.platformCodeKeyNameInStore);
    let url = ''
    if (code.hasOwnProperty('value') && code.value == globalConsts.platformNames.pm) {
        url = 'https://oa.24k.hk/op/account.html'
        //uat 开户
        // url='https://testm.24k.hk/realaccount_open.html';
        // 01 贵金属
    } else if (code.hasOwnProperty('value') && code.value == globalConsts.platformNames.pmglod) {
        url = 'https://oa.24k.hk/realaccount2_open.html?clientSource=gts2app'
        //02 外汇投资
    } else if (code.hasOwnProperty('value') && code.value == globalConsts.platformNames.fx) {
        url = 'https://oa.gwfx.hk/zh/nzMobileAccount.html?wx=app'
        // 03智选天下
    } else if (code.hasOwnProperty('value') && code.value == globalConsts.platformNames.se) {
        url = 'https://oa.se6868.com/zh/nzMobileAccount.html?wx=app'
    }
    if (isIos()) {
        window.open(url, 'warning', 'register');
    } else {
        window.open(url, 'warning', 'register', "_blank");
    }
}
/**
 * @description 去开户web
 */
export function goOpenAccountForWeb(platformCode = '') {
    // const code = getInfoFromSessionStorage(globalConsts.platformCodeKeyNameInStore);
    let url = ''
    if (platformCode == globalConsts.platformNames.pm) {
        url = 'https://oa.24k.hk/op/account.html'
        //uat 开户
        // url='https://testm.24k.hk/realaccount_open.html';
        // 01 贵金属
    } else if (platformCode == globalConsts.platformNames.pmglod) {
        url = 'https://oa.24k.hk/realaccount2_open.html?clientSource=gts2app'
        //02 外汇投资
    } else if (platformCode == globalConsts.platformNames.fx) {
        url = 'https://oa.gwfx.hk/zh/nzMobileAccount.html?wx=app'
        // 03智选天下
    } else if (platformCode == globalConsts.platformNames.se) {
        url = 'https://oa.se6868.com/zh/nzMobileAccount.html?wx=app'
    }
    window.location.href = url
    // if (isIos()) {
    //     window.open(url, 'warning', 'register');
    // } else {
    //     window.open(url, 'warning', 'register', "_blank");
    // }
}
/**
 * @description 获取ios app版本
 * @returns String
 */
export function getIOSAppVersion() {
    var str = navigator.userAgent.toLowerCase();
    var ver = str.match(/cpu iphone os (.*?) like mac os/);
    try {
        console.log('appVersion:' + ver[1].replace(/_/g, "."))
    } catch (e) {
        console.log('appVersion:' + ver)
    }
    if (!ver) {
        return false
    } else {
        // alert("你当前的Ios系统版本为：" + ver[1].replace(/_/g, "."));
        return ver[1].replace(/_/g, ".")
    }

}
/**
 * @description 获取吸附菜单的top值
 */
export function getStickyTopValue() {
    let topValue = userFromType() == 'app' ? 1.2 : 0.8;
    const platformCode = getPlatformCode();
    if (userFromType() == 'app') {
        if (isIos()) {
            const deviceModel = getDeviceModel();
            if (platformCode == globalConsts.platformNames.fx || platformCode == globalConsts.platformNames.se) {
                //ios系统版本为10且业务类型为02、03
                if (iosApp0203version10()) {
                    console.log('ios10 sticky')
                    topValue = 1.2
                } else {
                    topValue = 1
                }

            }
            if (deviceModel.isBangsScreen) {
                if (platformCode == globalConsts.platformNames.pm || platformCode == globalConsts.platformNames.pmglod) {
                    topValue = 1.4
                } else {
                    topValue = 1.4
                }
            }
        } else {
            topValue = 1.2
        }
    } else {
        topValue = 0.8
    }
    // 如果没有头部微信（PF00平台，iai-trade平台app除外）
    if (isWechatPlatform()) {
        return {
            top: 0 + 'rem'
        }
    } else if (isIaiTraderApp()) {
        return {
            top: 0.8 + 'rem'
        }
    } else {
        return {
            top: topValue + 'rem'
        }
    }
    console.log('test03')
    // return {
    //     top: 0.8 + 'rem'
    // }

}
/**
 * @description ios系统版本为10且业务类型为02、03
 */
export function iosApp0203version10() {
    return getIOSAppVersion() == '10.0.2' && (getPlatformCode() == globalConsts.platformNames.fx || getPlatformCode() == globalConsts.platformNames.se)
}
/**
 * @description // 创建头部vconsole script,主要用于正式版的测试,测试账号会显示console工具 或者开发和uat环境显示console工具
 */
export function createVconsoleScript() {
    // 是否强行打开vconsole工具
    let isForceOpenVconsole = false;
    let isDebuggerMode=false;
    if(!!getSearchParams(globalConsts.urlParamsKeys.debugger.name)){
        isDebuggerMode=true
    }
    const userInfo = getInfoFromSessionStorage(globalConsts.userInfoKeyNameInStore);
    const wechatTestAccountArr=globalConsts.testAccounts.wechat.prod.split(',')
    try {
        const { phone = '' } = userInfo
        // 微信真实环境账号
        if (wechatTestAccountArr.indexOf(String(phone))>=0) {
            isForceOpenVconsole = true
        }
    } catch (e) {
       
    }
    if (!!document.querySelector('#VConsole')) {
        return false;
    }
    const account = getAccount();
    const accountsArr = Object.values(globalConsts.testAccounts);
    const isTestAccount = accountsArr.some(({ prod = '', uat = '' }) => {
        if (account !== '' && (account == prod || account == uat)) {
            return true
        }
    })   
    if (isTestAccount || globalConsts.NODE_ENV !== configConsts.prodNodeEvn || isForceOpenVconsole || isDebuggerMode) {
        const head = document.getElementsByTagName('head')[0];
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = "static/js/vconsole.min.js";
        script.id = "VConsole"
        head.appendChild(script);
        script.onload = function () {
            if (window.hasOwnProperty('VConsole')) {
                window.vConsole = new window.VConsole({
                    defaultPlugins: ['system', 'network', 'element', 'storage'], // 可以在此设定要默认加载的面板
                    maxLogNumber: 1000,
                });
            }
        }
    }
}
/**
 * @description 获取行情数据getSymbos并保存到sessionStorage
 */
export function getSymbos() {
    return new Promise((resolve) => {
        request.getRiskWarningSymbol().then((res) => {
            const resData = getDataFoxAxiosRequest(res, this, true);
            const { data = '', status } = resData
            if (status == 1) {
                if (data) {
                    saveInfoToSessionStorage(data, 'waringSymbols');
                    resolve({
                        requestSuccess: true,
                        login: true
                    })
                }
                // 未授权
            } else if (status == -1) {
                resolve({
                    requestSuccess: false,
                    login: false
                })
                //为未授权用户埋点
            }
        })
    }, (reject) => {

    })

}
/*
从localstorage里获取授权状态
*/
export function getAuthStatu() {
    const statu = getInfoFromSessionStorage(globalConsts.auth.sessionStoryKey);
    if (!!statu) {
        const { value = -1 } = statu;
        return value
    } else {
        return null
    }
}
/**
 * 从app方法getInfo里获取账户类型 demo（模拟）、Real（真实）、Guest（游客） 主要用于埋点
 */
export function getAccountType() {
    const loginInfo = getInfoFromSessionStorage(globalConsts.userInfoKeyNameInStore);
    let resultType = 'Pc';
    if (!!loginInfo) {
        const { accountType = '' } = loginInfo;
        switch (accountType) {
            case globalConsts.accountType.visitor: {
                resultType = 'Guest';
                break;
            }
            case globalConsts.accountType.real: {
                resultType = 'Real';
                break;
            }
            case globalConsts.accountType.simulate: {
                resultType = 'Demo';
                break;
            }
        }
    }
    return resultType
}
/**
 * 开启神测埋点
 */
export function openSensorsTarck(data) {
    // 如果是真实场启动埋点
    // saveLoginInfoToWindow(data, function () {
    //     console.log('项目名称=' + getTrackProjectName())
    //     console.log('warningConfig.NODE_ENV=' + warningConfig.NODE_ENV)
    //     if (warningConfig.NODE_ENV === configConsts.prodNodeEvn) {
    //         console.log('真实场启动埋点开始：' + t.$config.NODE_ENV)
    //         globalTrackEvent(getTrackProjectName())
    //     } else {
    //         console.log('uat场不启动埋点：' + warningConfig.NODE_ENV)
    //     }
    // })
    // globalTrackEvent('default')
}
/**
 * 移除首页加载动画
 */
export function removeIndexLoading() {
    const indexLoading = document.querySelector('#indexLoading');
    if (!!indexLoading) {
        document.body.removeChild(indexLoading)
    }
}
/**
 * @description 获取appMethodChannel参数
 * @param platformName 平台名 如PF10\PF12
 * @returns {String}
 */
export function getAppMethodChannel(platformName = '') {
    let _appMethodNameChannel = globalConsts.appMethodChannel.default.android
    if (!platformName) {
        saveInfoToSessionStorage({ value: _appMethodNameChannel }, globalConsts.appMethodChannel.saveStorageKey)
        return _appMethodNameChannel;
    }
    switch (platformName) {
        case globalConsts.platformNames.ix: {
            _appMethodNameChannel = globalConsts.appMethodChannel.ix.android
        }
    }
    saveInfoToSessionStorage({ value: _appMethodNameChannel }, globalConsts.appMethodChannel.saveStorageKey)
    return _appMethodNameChannel;
}
/**
 * @description 返回ix项目图片名 xxx@3.png  其他xxx@2.png,项目语言不一样区分图片名及路径
 * 主要是预警详情页面图片 及帮助图片，在wariningDataConfig里配置的图片
 */
export function getImgFileName(imgName = '') {
    if (imgName == '') return false;
    const _platformCode = getPlatformCode();
    let imgType = '@2x.png';
    let imgPath = "static/img/warning/";
    let _imgName = imgName.substring(0, imgName.indexOf('@'))
    // ix项目 g
    console.log("_platformCode=" + _platformCode)
    //_platformCode == globalConsts.platformNames.ix
    if (true) {
        imgType = '.png';
        imgPath = "static/img/warning/indonesia/"
        //非ix项目
    }
    return `${imgPath}${_imgName}${imgType}`
}
/**
 * 自定义console打印输出
 */
export function iConsole(str = '') {
    console.log(str)
    // alert(str)
}
/**
 * 是否为新的平台
 */
export function getNewPlatform() {
    // try {
    //     const _platformCode = getPlatformCode();
    //     if (_platformCode == globalConsts.platformNames.wechat) {
    //         return true
    //     }
    // } catch (e) {
    //     return false;
    // }
    const _userInfo = getInfoFromSessionStorage(globalConsts.userInfoKeyNameInStore);
    if (!!_userInfo) {
        const platforVersion = globalConsts.urlParamsKeys.platforVersion;
        if (_userInfo.hasOwnProperty(platforVersion.name) && _userInfo[platforVersion.name] == platforVersion.value.version01) {
            return true
        } else {
            false
        }
    }

}
/**
 * 格式化url为新平台 url前缀加/iai_trader/PF00
 */
export function urlFormatByPlatform(urlStr = '') {
    const _platformCode = getPlatformCode();
    //_platformCode == globalConsts.platformNames.wechat
    // if (getNewPlatform()) {
    //     return `/iaitrade/${_platformCode}${urlStr}`
    // } else {
    //     return urlStr
    // }
    return `${urlPrefixName}${urlStr}`
}
/**
 * @description url前缀加/iai_trader
 * @param {*} urlStr
 * @param {Boolen}
 */
export function urlPrefix(urlStr = '', isAddPlatform = false) {
    const _platformCode = getPlatformCode();
    const userInfo = getInfoFromSessionStorage(globalConsts.userInfoKeyNameInStore);
    const _platforVersion = globalConsts.urlParamsKeys.platforVersion;
    const isNewPlatform = !!userInfo && userInfo.hasOwnProperty(_platforVersion.name);
    if (isNewPlatform && userInfo[_platforVersion.name] == _platforVersion.value.version01) {
        return isAddPlatform ? `${urlPrefixName}${urlStr}?platform=${_platformCode}` : `${urlPrefixName}${urlStr}`
    } else {
        return `${urlPrefixName}${urlStr}`
    }
}
/**
 *
 * @description 替换url 前缀app 为/iai_trader
 */
export function urlPrefix2(urlStr = '') {
    const _platformCode = getPlatformCode();
    const userInfo = getInfoFromSessionStorage(globalConsts.userInfoKeyNameInStore);
    // const {}=userInfo
    const _platforVersion = globalConsts.urlParamsKeys.platforVersion;
    const isNewPlatform = !!userInfo && userInfo.hasOwnProperty(_platforVersion.name);
    // if (isNewPlatform && userInfo[_platforVersion.name] == _platforVersion.value.version01) {
    //     return urlStr.replace('/app', '/iaitrade')
    // } else {
    //     return urlStr
    // }
    // return urlStr.replace('/app', '/iaitrade')
    return `${urlPrefixName}${urlStr}`
}
/**
 * 微信服务号是已经绑定
 */
export function isWechatBind() {
    const getInfo = getInfoFromSessionStorage(globalConsts.userInfoKeyNameInStore);
    if (!!getInfo) {
        if (getInfo.hasOwnProperty(globalConsts.wechatStorageKeys.bind_phone) &&
            getInfo[globalConsts.wechatStorageKeys.bind_phone] == globalConsts.bindPhone.binded) {
            return true;
        } else {
            return false;
        }
    }
}
/**
 * 是否是iai-trader app平台
 */
export function isIaiTraderApp() {
    const getInfo = getInfoFromSessionStorage(globalConsts.userInfoKeyNameInStore);
    if (!!getInfo) {
        return getInfo.platformName == globalConsts.juadePlatformNames.iaitradeApp ? true : false
    } else {
        return false
    }
}
/**
 * 是否是wechat服务号平台
 */
export function isWechatPlatform() {
    const getInfo = getInfoFromSessionStorage(globalConsts.userInfoKeyNameInStore);
    if (!!getInfo) {
        return getInfo.platformName == globalConsts.juadePlatformNames.wechat ? true : false
    } else {
        return false
    }
}
/**
 * @description 清除storage里的值，key为空为清除所有值
 * @param {String} key  保存的键值
 * @param {String} type localstorage或sessionStorage
 * @returns 无返回值
 */
export function removeStorage({ key = '', type = getSaveTye() }={}) {
    if (key != '') {
        window[type].removeItem(key);
    } else {
        window[type].clear();
    }
}
// 清除本地保存的数据 localStorage/sessionStorage
export function clearLocalData() {
    localStorage.clear();
    sessionStorage.clear();
    // localStorage.setItem(parseInt(Math.random()*100),parseInt(Math.random()*100))
    iConsole('1382:清理完成')
    // window.reload()
}
/**
 * @description 调用iai-trade app方法（flutter）
 * @param {String | Number} showBottom 1显示 0部显示
 * @param {String | Number} curentIndex 当前底部菜单 index
 */
export function iaiTraderControlApp({ showBottom = '1', curentIndex = '0' }) {
    if (window.hasOwnProperty('controlPlatformUI')) {
        window.controlPlatformUI.postMessage(JSON.stringify({ showBottom, curentIndex }))
    }
}
/**
 * @description 从新初始化
 */
export function initPage(vueRouter, qeury = {}) {
    console.log('initPage调用')
    const _userInfo = getInfoFromSessionStorage(globalConsts.userInfoKeyNameInStore);
    if (!!_userInfo) {
        const newInfo = Object.assign(_userInfo, qeury)
        removeStorage({key:globalConsts.userInfoKeyNameInStore})
        removeStorage({key:globalConsts.waringSymbolsKey})
        removeStorage({key:globalConsts.platformCodeKey})
        vueRouter.replace({ name: 'index', query: newInfo })
    }
}
/**
 * @description 微信授权
 */
export function wechatAuthDirect(qeury = {}) {
    const _qeury = jsonToParams(qeury);
    //uat环境
    let url = configConsts.wechatUatAuthUrl;
    let appid = 'wx812f56b95ddfc361'
    //生产环境
    iConsole('1415:'+globalConsts.NODE_ENV == configConsts.prodNodeEvn)
    if (globalConsts.NODE_ENV == configConsts.prodNodeEvn) {
        url = configConsts.wechatProdAuthUrl;
        appid = 'wx2d977d14f3d3ffd4'
    }
    const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${url}/iai_trader/wechat/pub/auth?gopage=1&response_type=code&scope=snsapi_userinfo&state=123&${_qeury}#wechat_redirect`;
    iConsole('1421:'+authUrl)
    location.href = authUrl
}
/**
 * @description 是否第一次访问保存在本地
 * @returns true首次绑定 false非首次绑定
 */
export function isFirstVisite(context) {
    if (!isWechatPlatform()) {
        return false
    }
    const firstVisiter = getCookie(globalConsts.firstVisiterKey);
    // 是否第一次登录，第二次登录改写第一次登录为false
    if (!!firstVisiter) {
        // const objValue = JSON.parse(firstVisiter)
        if (firstVisiter == true || firstVisiter == 'true') {
            // localStorage.setItem(globalConsts.firstVisiterKey,JSON.stringify({"value":"false"}));
            setCookie(globalConsts.firstVisiterKey, 'fase')
        }
        return false;
    } else {
        // localStorage.setItem(globalConsts.firstVisiterKey,JSON.stringify({"value":"true"}));
        // 是否首次登录
        context.$createDialog({
            type: 'confirm',
            title: '是否绑定并切换经纪商？',
            content: '绑定并切换至合作的经纪商，将同步经纪商行情及盯盘信息，解锁价格盯盘功能。',
            confirmBtn: {
                text: '绑定切换',
                active: true,
                disabled: false,
                href: 'javascript:;'
            },
            cancelBtn: {
                text: '暂不',
                active: false,
                disabled: false,
                href: 'javascript:;'
            },
            onConfirm: () => {
                const platformChangePlane = globalConsts.urlParamsKeys.platformChangePlane;
                context.$router.push({ name: 'myWarning', query: { [platformChangePlane.name]: platformChangePlane.value.show } })
            },
            onCancel: () => {

            }
        }).show()
        setCookie(globalConsts.firstVisiterKey, 'true')
        return true
    }

}
// 升级公告
export function noticeToast(context) {
    const cookieVersion = 2.13
    if (!context || isWebPopularize()) {
        return false
    }
    let isVresionDiffent = false
    const _showNoticeKey = getCookie(globalConsts.cookies.showNoticeKey);
    if (!!_showNoticeKey) {
        try {
            const obj = JSON.parse(_showNoticeKey);
            isVresionDiffent = obj.version !== cookieVersion ? true : false;
        } catch (e) {
            isVresionDiffent = true
        }
    }
    if (!!!_showNoticeKey || isVresionDiffent) {
        let url = '';
        if (globalConsts.NODE_ENV == configConsts.devNodeEvn) {
            url = 'http://172.30.10.20:8080/warning.html#/vsersionIntroduce'
        } else if (globalConsts.NODE_ENV == configConsts.uatNodeEvn) {
            url = 'http://192.168.35.103:8781/warning/warning.html#/vsersionIntroduce'
        } else {
            url = 'https://www.iaitrade.com/warning/warning.html#/vsersionIntroduce'
        }
        context.$createDialog({
            type: 'alert',
            title: '版本更新说明',
            content: `我们已升级至版本2.1.3，已设盯盘不受影响。<br/>
            <h2 style="margin-top:10px">功能介绍：</h2>
            优化整体体验，加入了盯盘通知设置，可通过【我的-通知管理】开启或关闭不同类型的盯盘通知。<br/><br/>           
            感谢您的支持与反馈，IAI Trade将持续为您提升盯盘体验！
            `,
        }, function () { }, false).show()
        setCookie(globalConsts.cookies.showNoticeKey, JSON.stringify({ value: true, version: cookieVersion }))
    }
    // cookieForFirstShowNotice({
    //     cookieConfig: {
    //         key: globalConsts.cookies.showNoticeKey,
    //         version: 0.7,
    //         callback: function () {
    //             context.$createDialog({
    //                 type: 'alert',
    //                 title: '更新公告',
    //                 content: `为向您提供更优质的服务，我们将于2019-10-29 17:00进行升级，已设盯盘不受影响，敬请期待。<br/>
    //         <h2 style="margin-top:10px">功能介绍：</h2>
    //         1. 新增“重要数据事件”盯盘：事前、事中盯盘，更有量化结果助您看清“方向”。<br/>
    //         2. “多维度盯盘”：支持各类异动、K线形态、指标信号等盯盘提醒。<br/>
    //         3. “价格盯盘”：增加多种盯盘类型，可根据买入价、卖出价、最新价、分钟内涨跌设置预警。<br/>
    //         4. 优化“盯盘榜”：升级为“胜率指标信号推荐”。可在【自选-盯盘管理】添加产品并开启信号推荐，24小时监控优质信号。<br/>
    //         感谢您的支持与反馈，IAI Trade将持续为您提升盯盘体验！`,
    //             }, function () { }, false).show()
    //         }

    //     }
    // })
}
/**
 * 为设置过1分钟提醒账户显示通知弹窗
 */
export function noticeForOneMinute(context) {
    const account = getAccount();
    const accounts = [
        '85393501', '86033515', '86079692', '86083231', '86099466', '86127220', '86127908', '86128672',
        '86134210', '86174363', '86182119', '86206796', '86216122', '86221652', '86229291', '86236465',
        '86239427', '86242860', '86252384', '86258354', '86258421']
    // uat 账号
    // const accounts = [
    //     '86143009','86142613','86143006']
    if (accounts.indexOf(account) >= 0) {
        const gk = getCookie(globalConsts.cookies.noticeForOneMinuteKey);
        if (!!gk) return false;
        context.$createDialog({
            type: 'alert',
            title: '通知公告',
            content: `尊敬的客户，感谢您使用IAI Trade盯盘功能。由于新版上线后收到用户反馈，目前【价格盯盘】中选择了【1分钟最多一次】提醒频率会造成频繁推送的打扰。对此我们深感抱歉，现暂定先下架该提醒选项(调整为默认仅提醒一次）。再次感谢您的支持，如有其它意见及建议，请通过【我的-意见反馈】向我们反馈。  您的理解和支持，是我们前进的最大动力`,
        }, function () { }, false).show()
        setCookie(globalConsts.cookies.noticeForOneMinuteKey, true);
    }
}
// 显示一次通知内容
export function cookieForFirstShowNotice(config = {}) {
     if(isWebPopularize()){
         return false
     }
    const { cookieConfig: { key, version = 0 }, callback = () => { } } = config
    let isVresionDiffent = false
    const _showNoticeKey = getCookie(key);
    if (!!_showNoticeKey) {
        try {
            const obj = JSON.parse(_showNoticeKey);
            isVresionDiffent = obj.version !== version ? true : false;
        } catch (e) {
            isVresionDiffent = true
        }
    }
    if (!!!_showNoticeKey || isVresionDiffent) {
        callback()
        setCookie(key, JSON.stringify({ value: true, version: version }))
    }
}
/**
 * @description 跳转app图表
 * @param {String} symbol 英文名symbol
 */
export function linkToAppChart(symbol) {
    if (isIos()) {
        location.href = `https://gts2tubiao/${symbol}`;
    } else {
        window.open(
            `https://gts2tubiao/${symbol}`,
            "tubiao",
            "mobile",
            "_blank"
        );
    }
}
/**
 * 首页是否是作为web版推广页
 */
export function isWebPopularize(){
    //this.$config.userFromType() == "web" && window.screen.width > 1200
    var parmas = getSearchParams(globalConsts.urlParamsKeys.popularize.name);
     return !!parmas && userFromType() == "web" && window.screen.width > 1200
}
/**
 * @description 获取服务模块名 接口url前缀名
 * @returns {String}
 */
export function getServiceName(){
    const serviceName = getInfoFromSessionStorage(globalConsts.urlParamsKeys.seviceName.name);
    try{
        if(serviceName){
            return serviceName.value
        }
    }catch(e){
       
    }
}
/**
 * @description 获取租户ID
 */
export function getTenantId(){
    const accessAuthObj = getInfoFromSessionStorage(globalConsts.accessAuthKey)
    const _accessAuthObj =accessAuthObj?accessAuthObj:{};
    const {tenant_id=''} = _accessAuthObj
    return tenant_id
}
