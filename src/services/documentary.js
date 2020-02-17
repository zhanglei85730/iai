
/**
 * @description 量化移动站(手机web访问)、app(嵌入手机webview)接口api
 * @axios 接口访问插件
 * @see https://www.kancloud.cn/yunye/axios/234845
 */
import axios from 'axios'
import qs from 'qs'
import Vue from 'vue'
import { Toast } from 'cube-ui'

import { getSearchParams, getInfoFromSessionStorage, warpperDataToRes, getPlatformCode, userFromType, getI18nData, urlFormatByPlatform, getNewPlatform, urlPrefix, urlPrefix2, isWebPopularize } from '@public/js/util.js'
import i18n from '../pages/warning/i18n'
import { isWechatPlatform, isIaiTraderApp, iConsole, saveInfoToStorage } from '../public/js/util'
const i18nData = getI18nData(i18n)
// const config = require('../pages/app/config.js')
const configConsts = require('@config/consts.js')
const globalConsts = require('@public/js/consts.js')
// iaitradeurl前缀，
const urlPrefixName = globalConsts.urlPrefixName;
const wechatUrlPrefixName = globalConsts.wechatUrlPrefixName

Vue.use(Toast)
// 接口请求加载中
const toastInstance = Toast.$create({
    txt: i18nData.common.loadingText,
    mask: true,
    time: 1000 * 60
})
// const axiosCancelToken = axios.CancelToken;
// const axiosRequestSource = CancelToken.source();
// const moduleName='mobile'
// axiox实例
// var request = axios.create({
//     baseURL: 'http://192.168.35.103:8781',
//     timeout: 1000,
//   });
// baseURL不能设置，设置后跨域设置会不成功
// axios.defaults.baseURL = 'http://192.168.35.103:8781'
// 返回post FormData header设置-
// ----------跟单详情页面------------
// store.remove('username')
function getPostFormDataHeader() {
    return {
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
    }
}
/**
 * @description  app通过url传获取sid参数，无参数用默认参数10,有传参数有所传参数
 * 获取参数后保存到sessionStorage里面，sessionStorage有sid默认用sessionStorage的值
 * @param {*} defaultSid
 */
function getSidByUrl(defaultSid = false) {
    const sid = getSearchParams('sid'),
        sidFromSS = getInfoFromSessionStorage('sid');
    if (!!sid) {
        // saveInfoToSessionStorage({value:sid}, 'sid');
        sessionStorage.setItem('sid', JSON.stringify({ value: sid }))
        return sid
    } else if (!!sidFromSS) {
        return sidFromSS.value
    } else {
        return defaultSid ? defaultSid : '10'
    }
}
axios.interceptors.request.use((config) => {
    config.url = `${configConsts.uatBaseUrl}${config.url}`
    const { loading = false, refreshToken = false } = config;
    if (loading) {
        toastInstance.show()
    }
    // 增加时间戳防止缓存
    if (config.method == 'get') {
        config.params = {
            _t: Date.parse(new Date()) / 1000,
            ...config.params
        }
    }
    ////////////////
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    const tokenValue = getSearchParams('token');
    const accessAuthObj = getInfoFromSessionStorage(globalConsts.accessAuthKey);
    try {
        console.log('access_token:' + accessAuthObj.access_token)
        if (!!accessAuthObj & accessAuthObj.hasOwnProperty('access_token') && !refreshToken) {
            Object.assign(config.headers, {
                'Authorization': 'Bearer ' + accessAuthObj.access_token,
            });
        }
        if (refreshToken) {
            Object.assign(config.headers, {
                'x-access-token': 'Bearer ' + accessAuthObj.access_token,
            });
        }
    } catch (e) {

    }
    return config;
}, (error) => {
    return Promise.reject(error)
})
// 响应成功后拦截
axios.interceptors.response.use(function (response) {
    const { config: { loading = false } } = response;
    if (loading) {
        toastInstance.hide()
    }
    return response
}, function (error) {
    toastInstance.hide()
    // Toast.$create({
    //     txt: 'request time out',
    // }).show()
    return Promise.reject(error);
})

export default {
    // 登录
    login(params = { username: '13800138000', password: 'iai13800' }) {
        return axios({
            method: 'post',
            url: `${urlPrefixName}/app/user/login`,
            data: qs.stringify(Object.assign(params, { platfom: getPlatformCode() })),
            ...getPostFormDataHeader(),
        });
    },
    // 注册
    register({ username, password, smscode }) {
        const params = {
            username,
            password,
            smscode
        }
        return axios({
            method: 'post',
            url: '/app/user/register',
            data: qs.stringify(params),
            ...getPostFormDataHeader(),
        });
    },
    //发送验证码
    sendMessage({ username, usage }) {
        const params = {
            username,
            usage,
        }
        return axios({
            method: 'post',
            url: '/app/user/send-sms',
            data: qs.stringify(params),
            ...getPostFormDataHeader(),
        });
    },
    //App - 授权登录
    appAuth({ id = '', password = '', platform = getPlatformCode(), token = '', _ref = '' }) {
        if (id == '') return Promise.resolve(false);
        if (token == '') {
            if (!password || !platform) {
                return Promise.resolve(false)
            }
        }
        // 获取token信息
        // const token = getTokenFromAppGetinfo();
        // 如果有token 发送token信息，没有发送密码
        let params = {
            id,
            password,
            'iai-app-platform': platform,
        };
        if (token !== '') {
            params = {
                id,
                token,
                'iai-app-platform': platform,
            };
        }
        if (_ref !== '') {
            Object.assign(params, { _ref })
        }
        return axios({
            method: 'post',
            // url: '/app/user/auth',
            url: `${urlPrefixName}/app/risk_warning/conf_update`,
            data: qs.stringify(params),
            ...getPostFormDataHeader(),
        });
    },
    //绑定账号
    bindAccount({ platform = getPlatformCode(), account = '', password = '' }) {
        if (!account || !password) {
            return false
        }
        const params = {
            account,
            password,
            platform
        }
        return axios({
            method: 'post',
            url: `${Hanson}/app/account/bind`,
            data: qs.stringify(params),
            ...getPostFormDataHeader(),
        });
    },
    // 用户基本数据
    userBaseInfo({ platform = getPlatformCode() } = {}) {

        if (!platform) {
            return false
        }
        const params = {
            'iai-app-platform': platform
        }
        return axios.get(urlFormatByPlatform('/app/user-center/index', true))
    },
    // 返回账户信息
    getAccountInfo({ platform = getPlatformCode() } = {}) {
        if (!platform) {
            return false
        }
        return axios.get('/app/user-center/account-info')
    },
    //跟单列表
    getStrategyRankList({ platform = getPlatformCode(), ...rest } = {}) {
        if (!platform) {
            return false
        }
        const params = {
            'iai-app-platform': platform
        }
        return axios.get('/app/strategy-rank/list',
            {
                'params': Object.assign({}, params, { ...rest })
            }
        )
    },
    /**
     * @description 取消跟随
     * @param {Number} strategyId 榜单id（sid）
     * @param {String} platFlag 平台标识 real , demo
     * @returns {Object} json
     */
    cancelFollow(strategyId = '', platFlag = 'real') {
        if (!strategyId || !platFlag) {
            return false
        }
        const params = {
            strategyId,
            platFlag
        }
        return axios({
            method: 'post',
            url: `${urlPrefixName}/app/strategy-rank/cancel-follow`,
            data: qs.stringify(params),
            ...getPostFormDataHeader(),
        });
    },
    /**
     * @description 用户中心跟单列表
     */
    userCenterFollowers({ type = 'now', ...rest }) {
        const parmas = {
            type
        }
        return axios.get(`${urlPrefixName}/app/user-center/followers`, {
            'params': Object.assign({}, parmas, { ...rest })
        })
    },
    /**
    * @description 用户中心获取订单列表
    */
    userCenterOrders({ type = 'now', sid = '', ...rest }) {
        if (!sid) return false;
        const parmas = {
            type,
            sid
        }
        return axios.get(`${urlPrefixName}/app/user-center/orders`, {
            'params': Object.assign({}, parmas, { ...rest })
        })
    },
    /**
     * @description 用户找回密码
     */
    findPassWord({ username = '', password = '', smscode = '' }) {
        if (!username || !password || !smscode) return false;
        const parmas = {
            username,
            password,
            smscode
        }
        return axios({
            method: 'post',
            url: `${urlPrefixName}/app/user/password`,
            data: qs.stringify(parmas),
            ...getPostFormDataHeader(),
        });
    },
    //----------------风险预警------------------
    //新增预警
    riskWarningAdd({ platform = getPlatformCode(), ...rest }) {
        const sentParams = { platform, ...rest }
        return axios({
            loading: true,
            method: 'post',
            url: urlFormatByPlatform('/app/risk_warning/add_data'),
            data: qs.stringify(sentParams),
            ...getPostFormDataHeader(),
        });
    },
    //我的预警列表
    riskWarningSelect({ userid = '', is_listen = '', pageSize = 30, pageIndex = 1 }) {
        if (is_listen === '') return Promise.resolve(false)
        return axios({
            method: 'post',
            url: urlFormatByPlatform('/app/risk_warning/select_data'),
            data: qs.stringify({ userid, is_listen, pageSize, pageIndex, platform: getPlatformCode() }),
            ...getPostFormDataHeader(),
        });
    },
    //获取预警设置的货币对(如果sessionStorage有保存则不请求)
    getRiskWarningSymbol({ platform = getPlatformCode() } = {}) {
        const platformName = getSearchParams(globalConsts.urlParamsKeys.platformName.name);
        const waringSymbols = getInfoFromSessionStorage(globalConsts.waringSymbolsKey);
        if (!!waringSymbols) {
            return Promise.resolve(warpperDataToRes(waringSymbols));
        }
        let _url = `${urlPrefixName}/app/json/${platform}_product.json`;
        // isWechatPlatform() || isIaiTraderApp()  platformName==globalConsts.urlParamsKeys.platformName.value.wechat
        //isWechatPlatform() || isIaiTraderApp()
        ///////////////////////
        ///////////
        if (true) {
            _url = urlPrefix(`/app/risk_warning/get_symbol`)
        }
        iConsole('344:' + _url)
        return axios({
            method: 'get',
            url: _url,
        })
    },
    //删除预警
    riskWarningDelete({ id = '', warning_type = '' }) {
        if (id === '' || warning_type === '') return Promise.resolve(false)
        return axios({
            method: 'post',
            url: urlFormatByPlatform('/app/risk_warning/delete_data'),
            data: qs.stringify({ id, warning_type, platform: getPlatformCode() }),
            ...getPostFormDataHeader(),
        });
    },
    //修改预警
    riskWarningUpdate({ platform = getPlatformCode(), ...rest }) {
        // if (id === '' || warning_type === '') return Promise.resolve(false)
        const sentParams = { platform, ...rest }
        return axios({
            method: 'post',
            url: urlFormatByPlatform('/app/risk_warning/update_data'),
            data: qs.stringify(sentParams),
            ...getPostFormDataHeader(),
        });
    },
    // 获取symbol的id
    getSymbolId() {
        const sysmbolsId = getInfoFromSessionStorage(globalConsts.symbolsIdKeyInSessionStorage);
        if (sysmbolsId) {
            return Promise.resolve(warpperDataToRes(sysmbolsId));
        } else {
            return axios.get(`${urlPrefixName}/app/risk_warning/get_uicode?uicode=1`)
        }
    },
    // 埋点为授权的用户（手动埋点,传到自己的后台）
    //首页进入 app_Risk_warning_in, 行情进入 app_Risk_quote_in
    trackNoAuth({ identify = 'app_Risk_warning_in' } = {}) {
        const _url = getNewPlatform() ? `${urlPrefixName}/user-center/statics` : `${urlPrefixName}/app/risk_warning/statics`
        return axios({
            method: 'post',
            url: _url,
            data: qs.stringify({ userType: '未授权', identify }),
            ...getPostFormDataHeader(),
        });
    },
    //获取预警设置-使用盯盘的人数
    getUsedAssign({ platform = getPlatformCode() } = {}) {
        if (getNewPlatform()) {
            return axios.get(urlPrefix2('/user-center/get-user-count'))
        } else {
            return axios.get(urlPrefix2('/app/risk_warning/get-use-count'))
        }
    },
    //获取胜率榜单数据列表
    getRankList(params) {
        return axios({
            method: 'get',
            url: urlPrefix('/app/ranking/rank', true),
            params: params,
            loading: true
        })
    },
    //保存自选产品
    saveUserSelect(params) {
        return axios({
            loading: true,
            method: 'get',
            url: urlPrefix('/app/ranking/save', true),
            params
        })
    },
    /**
     *
     * @param {Strnig} （PF10,PF12,PF14）
     */
    getRankingProduct(platform = getPlatformCode()) {
        if (platform == '') return Promise.reject("platform can't empty")
        const rankingProductsData = getInfoFromSessionStorage(globalConsts.rankingProductsSesstionStorageKey)
        if (!!rankingProductsData) {
            return Promise.resolve(warpperDataToRes(rankingProductsData.value))
        } else {
            let platformCode = platform
            if (platformCode == globalConsts.platformNames.dev || platformCode == globalConsts.platformNames.web) {
                platformCode = globalConsts.platformNames.pm
            }
            // 非PF00平台
            let _url = `/app/json/${platformCode}_product.json`;
            // PF00
            if (getNewPlatform()) {
                _url = `${wechatUrlPrefixName}/app/ranking/product?platform=${platformCode}`
            }
            return axios({
                method: 'get',
                url: _url,
            })
        }
    },
    /**
    *
    *@description 获取用户授权状态
    @param clearSave是否清除保存过的信息
    */
    getUserAuthStatus() {
        // const authStatu = getInfoFromSessionStorage(globalConsts.auth.sessionStoryKey);
        // if (!!authStatu && authStatu.hasOwnproperty('value') && authStatu.value === true) {
        //     return Promise.resolve(authStatu.value);
        // }
        return axios({
            method: 'get',
            url: urlPrefix2(`/app/user-center/index`),
        })
    },

    /**
     * 已过期预计列表
     */
    getExpiredData({ userid = '', pageSize = 30, pageIndex = 1 }) {
        return axios({
            method: 'post',
            url: urlFormatByPlatform('/app/risk_warning/select_expire'),
            data: qs.stringify({ userid, pageSize, pageIndex }),
            ...getPostFormDataHeader()
        });
    },
    /**
   * 微信tip展示标识设置
   */
    seWxShow() {
        return axios({
            method: 'get',
            url: `${urlPrefixName}/app/user-center/set-wx-show`,
        })
    },
    /**
    * 获取用户信息
    */
    getUserInfo() {
        return axios({
            method: 'get',
            url: `http://172.29.1.144/uac/user/checkProductAuth?product=${globalConsts.product}`,
        })
        //url: `/uac/user/checkProductAuth?product=${globalConsts.product}`,
    },
    /**
     * @description 是否开显示过开通微信开通知弹框及是否显示微信入口，绑定过不显示微信入口
     * @returns {Object} {wx_show:1//1显示，0未显示,wx_bind:1//1绑定 0未绑定}
     */
    // 是否开通微信通知
    isWechatEntyShow() {
        return new Promise((resolve) => {
            axios({
                method: 'get',
                url: urlPrefix2(`/app/user-center/user-info`),
            }).then(({ status = '', data: resData = {} }) => {
                console.log('resData' + JSON.stringify(resData))
                if (status == 200) {
                    // 未登录情况
                    const { data = null, status = '' } = resData;
                    if (!!data && status != -1) {
                        const { wx_show = '', wx_bind = '' } = data;
                        let _obj = {};
                        // 判断是否显示过
                        if (wx_show !== '' && wx_show == 0) {
                            Object.assign(_obj, { wx_show: 0 })
                            // 调用接口设置为已显示过
                            //    request.seWxShow()
                        } else {
                            Object.assign(_obj, { wx_show: 1 })
                        }
                        if (wx_bind !== '' && wx_bind == 1) {
                            Object.assign(_obj, { wx_bind: 1 });
                        } else {
                            Object.assign(_obj, { wx_bind: 0 });
                        }
                        resolve(_obj)
                    } else {
                        resolve({
                            wx_bind: -3,
                            wx_show: -3
                        })
                    }
                } else {
                    resolve(new Error('api error'))
                }

            })
        }, (reject) => {
            reject('error')
        })

    },
    /**
     * 是否开通微信通知,是否榜单过
     *@returns {Boolean} 绑定true 未绑定为false
     */
    isWechatNoticeBind() {
        return new Promise((resolve) => {
            axios({
                method: 'get',
                url: urlPrefix2(`/app/user-center/user-info`),
            }).then(({ status = '', data: resData = {} }) => {
                if (status == 200) {
                    const { WX_bind = '' } = resData
                    if (WX_bind === '') {
                        resolve(false);
                    } else {
                        resolve(true)
                    }
                } else {
                    resolve(new Error('api error'))
                }
            })
        }, (reject) => {
            reject('error')
        })

    },
    /**
    * 微信tip展示标识重置(uat)
    */
    resetSeWxShow() {
        return axios({
            method: 'get',
            url: urlPrefix2(`/app/user-center/reset-wx-show`),
        })
    },
    /**
    * 用户退出登录(清楚cookie)
    */
    userLogout() {
        return axios({
            method: 'get',
            url: `${urlPrefixName}/app/user/logout`,
        })
    },
    /*
     * 获取symbol价格阻力位
     */
    getAtrValue({ symbol = '', platform = '' }) {
        if (symbol === '' || platform === '') {
            return Promise.resolve(false)
        }
        return axios({
            method: 'get',
            url: urlFormatByPlatform('/app/risk_warning/get_atr_value'),
            params: { symbol, platform },
            loading: true
        })
    },
    /**
   * @description 微信服务号绑定
   */
    wechatRegister({ phone = '', code = '', openid = '' }) {
        return axios({
            method: 'post',
            url: `${wechatUrlPrefixName}/wechat/sms/bind`,
            data: qs.stringify({ phone, code, openid }),
            ...getPostFormDataHeader()
        });
    },
    /**
     * @description 获取验证码
     */
    getImageCode() {
        const uuid = new Date().getTime();
        return axios({
            method: 'get',
            url: `${urlPrefixName}/base/image_code/${uuid}`,
            loading: true
        });
    },
    /**
     * @description 获取短信验证码
     */
    getMobilSMSCode({ phone = '', image_code_id = '', image_code = '0' }) {
        if (phone == '' || image_code_id == '') {
            return Promise.resolve(false)
        }
        // alert(`323:${wechatUrlPrefixName}/base/sms_code/${phone}/${image_code_id}/${image_code}/`)
        return axios({
            method: 'get',
            url: `${wechatUrlPrefixName}/base/sms_code/${phone}/${image_code_id}/${image_code}/`,
            loading: true
        });
    },
    /**
     * @description 返回平台榜单列表
     */
    // /iai_trader/user-center/platform/list
    ///////////////////////////////////////
    ///////////////
    getPlatformList() {
        return axios({
            method: 'get',
            url: `${wechatUrlPrefixName}/user-center/platform/list`,
            loading: true
        });
    },
    // 切换后将platform发送到后台
    platformBind(tenant_id = '') {
        //  return Promise.resolve(warpperDataToRes({
        //     status:1,
        // }))
        return axios({
            method: 'post',
            url: `${wechatUrlPrefixName}/user-center/platform/bind`,
            loading: true,
            headers: {
                'Content-type': 'application/json'
            },
            data: { tenant_id },
        });
    },
    /**
     *
     * @description 查询授权
     */
    platformQuery(tenant_id = "") {
        return axios({
            method: 'post',
            url: `${wechatUrlPrefixName}/user-center/platform/query`,
            loading: true,
            data: { tenant_id },
            headers: {
                'Content-type': 'application/json'
            },
            // ...getPostFormDataHeader()
        });
    },
    /**
     * 价格预警 获取已设置的数据
     */
    priseWarningGetSetData({
        account = "",
        platform = getPlatformCode(),
        symbol
    } = {}) {
        return axios({
            method: 'get',
            url: urlFormatByPlatform(`/app/risk_warning/group_price_get`, true),
            loading: true,
            params: { account, platform, symbol },
        });
    },
    // 价格预警修改
    priseWarningUpdateData(parmas) {
        return axios({
            method: 'post',
            url: urlFormatByPlatform(`/app/risk_warning/group_price_update`, true),
            loading: true,
            data: qs.stringify(parmas),
        });
    },
    // 价格预警删除
    priseWarningGetDeleteData(parmas) {
        return axios({
            method: 'post',
            url: urlFormatByPlatform(`/app/risk_warning/group_price_update`, true),
            loading: true,
            data: qs.stringify(parmas),
        });
    },
    // 价格预警新增
    priseWarningAddData(parmas) {
        return axios({
            method: 'post',
            url: urlFormatByPlatform(`/app/risk_warning/group_price_add`, true),
            loading: true,
            data: qs.stringify(parmas),
        });
    },
    /**
    *
    * @description 自选管理查询
    */
    getFavoritesOption({ platform = '', userid = '', account = '' } = {}) {
        return axios({
            method: 'get',
            url: urlFormatByPlatform(`/app/risk_warning/favorites`, true),
            loading: false,
            params: { platform, userid, account },
            ...getPostFormDataHeader()
        });
    },
    /**
     *
     * @description 更新自选管理查询
     */
    updateFavoritesOption({ platform, userid, account, ids, type }) {
        return axios({
            method: 'post',
            url: urlFormatByPlatform(`/app/risk_warning/favorite_update`),
            loading: true,
            data: qs.stringify({ platform, userid, account, ids, type }),

        });
    },
    /**
     *
     * @description 首页自选品种
     */
    homePageGroupSelect(platform = '', userid = '', account = '', date = '', loading = true, pageSize = 50) {
        return axios({
            method: 'get',
            url: urlFormatByPlatform(`/app/risk_warning/group_select`),
            loading: loading,
            params: { platform, userid, account, date, pageSize },
            ...getPostFormDataHeader(),
        });
    },
    /**
     *
     * @description 首页品种消息
     */
    homePageSymbolMessage({ platform, userid, account, symbol, date, cursor, wmid, pageSize, type, loading = true, is_index }) {
        return axios({
            method: 'get',
            url: urlFormatByPlatform(`/app/risk_warning/symbol_message`),
            loading: loading,
            params: { platform, userid, account, symbol, date, cursor, wmid, pageSize, type, is_index },
            ...getPostFormDataHeader(),
        });
    },
    /**
     *
     * @description 首页品种消息
     */
    homePageGroupSort({ platform, userid, account, symbol, sort }) {
        return axios({
            method: 'get',
            url: urlFormatByPlatform(`/app/risk_warning/group_sort`),
            loading: false,
            params: { platform, userid, account, symbol, sort },
            ...getPostFormDataHeader(),
        });
    },
    /**
     *
     * @description 推荐消息
     */
    homePageRecommendMessage({ platform, userid, account, cursor, type, m_type, pageSize }) {
        return axios({
            method: 'get',
            url: urlFormatByPlatform(`/app/risk_warning/recommend_message`),
            loading: false,
            params: { platform, userid, account, cursor, type, m_type, pageSize },
            ...getPostFormDataHeader(),
        });
    },
    /**
     *
     * @description 推荐消息
     */
    detailPageGroupDetail({ platform, userid, account, symbol, pageSize, is_index }) {
        return axios({
            method: 'get',
            url: urlFormatByPlatform(`/app/risk_warning/group_detail`, true),
            loading: true,
            params: { platform, userid, account, symbol, pageSize, is_index },
            ...getPostFormDataHeader(),
        });
    },
    /**
     *
     * @description 推荐symbol
     */
    optionPageGroupAdd({ platform, userid, account, symbol }) {
        return axios({
            method: 'post',
            url: urlFormatByPlatform(`/app/risk_warning/group_add`),
            loading: true,
            data: qs.stringify({ platform, userid, account, symbol }),
        });
    },
    /**
     *
     * @description 删除价格组
     */
    deleteGroupPrice({ platform, userid, account, symbol }) {
        return axios({
            method: 'post',
            url: urlFormatByPlatform(`/app/risk_warning/group_price_delete`),
            loading: true,
            data: qs.stringify({ platform, userid, account, symbol }),
        });
    },
    /**
     *
     * @description 获取产品列表
     */
    getSymbolList({ Platform }) {
        return axios({
            method: 'get',
            url: urlPrefix(`/app/risk_warning/get_symbol`),
            loading: false,
            params: { Platform },
            ...getPostFormDataHeader(),
        });
    },
    /**
     * @description 历史公布影响统计
     */
    eventEffectStatics(parmas) {
        return axios({
            method: 'get',
            url: urlFormatByPlatform(`/app/risk_warning/event_effect_statics`),
            loading: true,
            params: parmas,
            ...getPostFormDataHeader(),
        });
    },
    //http://192.168.35.103:8899/app/risk_warning/event_influence
    eventInfluence(parmas) {
        return axios({
            method: 'get',
            url: urlFormatByPlatform(`/app/risk_warning/event_influence`),
            loading: true,
            params: parmas,
            ...getPostFormDataHeader(),
        });
    },
    //微信鉴权
    userInfoforWechat({ token = '' } = {}) {
        return axios({
            method: 'get',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `token ${token}`
            },
            url: `${wechatUrlPrefixName}/wechat/pub/userinfo`,
        });
    },
    //获取用户设置查询
    warningConfGet({ userid = "", account = "", platform = getPlatformCode() } = {}) {
        return axios({
            method: 'get',
            params: { userid, account, platform },
            url: `${urlPrefixName}/app/risk_warning/conf_get`,
        });
    },
    //用户设置
    warningConfSet({ userid = "", account = "", platform = getPlatformCode(), ...rest } = {}) {
        return axios({
            method: 'post',
            url: `${urlPrefixName}/app/risk_warning/conf_update`,
            data: qs.stringify({ userid, account, platform, ...rest }),
            loading: true,
        });
    },
    // 获取token
    getToken() {
        return axios({
            method: 'POST',
            url: '/uac/auth/token',
            auth: {
                username: 'XI6PTHJAN0TV4XJ.R4K9XT.AFGFGS7FX',
                password: 'XBSL740FEI8BD72075VGEND1O6NQ0_Q0JVAU82LM-ETKONLK_-6KIM15M01W94--'
            },
            data: {
                // uuid: "5oe7hjiqc08001",
                // account_id: 'A0005',
                // account_type: "N",
                // source: "app",
                // group_ids: "",
                // platform:"PF10",
                uuid: "5oe7hjiqc08001",
                account_id: "88002290",
                account_type: "A",
                phone: "13800135000",
                md5_phone: "ea1f26bfde714bcdbd89cac437a6d816",
                platform: "PF10",
                source: "app",
                // "third_type":"10",
                // "third_id":"2131231230",
                group_ids: ""
            }
        }).then(res => {
            const { status, data } = res.data;
            saveInfoToStorage({ data:{[globalConsts.access_token]:data}, key: globalConsts.accessAuthKey, method: 'save' })
        });
    },
    // token过期，从新获取token,2个小时自动刷新token
    refreshToken() {
        // console.log('919')
        const accessAuthInfo = getInfoFromSessionStorage(globalConsts.accessAuthKey, 'localStorage')
        const token = accessAuthInfo ? accessAuthInfo.access_token : '';
        // alert('922:' + token)
        if (!token) {
            return false
        }
        axios({
            method: 'POST',
            url: '/uac/auth/refresh/token',
            refreshToken: true
        }).then(res => {
            const { status, data = {} } = res.data;
            console.log('930:' + JSON.stringify(data))
            const { access_token = '' } = data
            saveInfoToStorage({ data: {[globalConsts.access_token]:access_token}, key: globalConsts.accessAuthKey, method: 'modify' })
        }).catch(function (e) {
            console.log('934:' + e)
        });

    },
    // 设置用户授权产品 product=10表示智能盯盘产品
    updateProductAuth() {
        return axios({
            method: 'get',
            url: `/uac/user/updateProductAuth?product=10`,
            loading: true,
        });
    },
    // 查询用户是否授权?product=10
    checkProductAuth() {
        return axios({
            method: 'get',
            url: `/uac/user/checkProductAuth?product=10`,
            loading: true,
        });
    }

}
