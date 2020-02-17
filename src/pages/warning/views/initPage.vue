<template>
    <!-- 初始化页面，获取app getInfo方法的信息-->
    <!-- 微信清理缓存方法 -->
    <div>
        <div
            class="clearForWechat-container"
            v-if="isClearData"
        >
            <div class="right">
                <img
                    src="static/img/warning/illus_guide_arrow1@3x.png"
                    class="arrow"
                />
            </div>
            <div class="clearForWechat-tip02"> <span class="number">1</span>点击右上角<img  src="static/img/warning/guide_icon_more@3x.png" class="guide-icon-more" />图标</div>
                 <div class="clearForWechat-tip"><span class="number">2</span>连续点击<span class="mark-red">2次</span>“刷新”即可恢复使用</div>
            <div class="center">
                <img
                    src="static/img/warning/illus_guide_refresh@3x.png"
                    class="tip-pic"
                />
            </div>
        </div>

    </div>

</template>
<script>
import { getInfoFromApp, formatObjString, isObject, saveInfoToSessionStorage, createVconsoleScript, getPlatformCode, saveLoginInfoToWindow, getSearchParams, getAppMethodChannel, iConsole, removeStorage, getSaveTye, goAppLogin, wechatAuthDirect, getInfoFromSessionStorage, getDataFoxAxiosRequest, getTrackProjectName, newUserFromType, saveInfoToStorage, clearLocalData } from '@public/js/util.js'
import { globalTrackEvent } from '@public/js/trackEvent.js'
import request from '@services/documentary.js'
import { rejects } from 'assert'
const globalConsts = require('@public/js/consts.js')
const configConsts = require('@config/consts.js')

export default {
    data() {
        return {
            isClearData: false
        }
    },
    created() {
        // goAppLogin('/advanceAssign')/////////////////////////
        ////////////////////////////////////////////////
       
        createVconsoleScript();
        iConsole('16:'+location.href)
        const t = this;
        // app回调
        function appCallBack(data) {
            // 如果字符串转化为对象
            //02业务ios返回的是字符串格式
            iConsole('data_obj111111111111111111111111111111111111111=' + JSON.stringify(data));
            iConsole('data_string=' + data)
            let result = "";
            if (typeof (data) === 'string') {
                result = formatObjString(data)
                // 如果对象
            } else if (isObject(data)) {
                result = data
            }
            //  保存用户到sessionStorage信息
            removeStorage({ key: globalConsts.userInfoKeyNameInStore, type: getSaveTye() })
            saveInfoToSessionStorage(result, globalConsts.userInfoKeyNameInStore);
            // 保存app 业务名称到sessionStorage
            saveLoginInfoToWindow(result, function () {
                t.initAfterDirect()
            })
        }
       
        // 是否有清除缓存参数
        const _clearLocalData = getSearchParams(globalConsts.urlParamsKeys.clearLocalData.name);
        if (!!_clearLocalData && _clearLocalData=='true') {
            iConsole('42')
            clearLocalData();
            const {clearLocalData:clearLocalData2,...rest}= t.$route.query
             this.$router.replace({name:'index',query:rest})
            this.isClearData = true;
            return false
        }
        const platformParamValue = getSearchParams('platform');
        const platformNameValue = getSearchParams(globalConsts.urlParamsKeys.platformName.name);
        //非微信调用（测试）
        if(platformNameValue !==globalConsts.urlParamsKeys.platformName.value.wechat){
             request.getToken()
        }
        //   alert('platformParamValue='+platformParamValue);
        //   alert('platformNameValue='+platformNameValue);
        // 从app图表进入时候的symbol 参数
        const setWarningSymbol = getSearchParams(globalConsts.setWarningSymbolKey);

        // 如果有保存进本地存储
        if (setWarningSymbol) {
            saveInfoToSessionStorage({ value: setWarningSymbol }, globalConsts.setWarningSymbolKey);
        }
        // iai-trater app(ios和android都一样的调用方法flutter实现的)
        // alert('46='+(getSearchParams(globalConsts.urlParamsKeys.platformName.name) == globalConsts.urlParamsKeys.platformName.value.iaiTrader));
        if (getSearchParams(globalConsts.urlParamsKeys.platformName.name) == globalConsts.urlParamsKeys.platformName.value.iaiTrader) {
            getInfo.postMessage({});
            window['flutterGetInfo'] = appCallBack
            // resolve('iai-trade')
            return;
        }
        //platformParamValue == globalConsts.platformNames.wechat && getSearchParams(globalConsts.urlParamsKeys.platformName.name) == globalConsts.urlParamsKeys.platformName.value.wechat
        // 微信公众号平台

        if (!!platformNameValue && platformNameValue==globalConsts.urlParamsKeys.platformName.value.wechat) {
            iConsole('60')
            // 每次进如微信都刷新token
            request.refreshToken()
            saveInfoToSessionStorage({ value: platformParamValue }, globalConsts.platformCodeKey, 'localStorage')
            saveInfoToSessionStorage({ value: globalConsts.storageType.localStorage }, globalConsts.storageTypeKey, 'localStorage');
            const _tenant_id = getSearchParams(globalConsts.wechatStorageKeys.tenant_id);
             const _token = getSearchParams(globalConsts.wechatStorageKeys.token);
            const _bind_phone = getSearchParams(globalConsts.wechatStorageKeys.bind_phone);
            const _openid = getSearchParams(globalConsts.wechatStorageKeys.openid);
            const platformName = getSearchParams(globalConsts.urlParamsKeys.platformName.name);
            const platforVersion = globalConsts.urlParamsKeys.platforVersion;
            const _goPage = getSearchParams('goPage')
            const accessAuthInfo =localStorage.getItem(globalConsts.accessAuthKey)
            const _userInfo = getInfoFromSessionStorage(globalConsts.userInfoKeyNameInStore);
              if (!!_token) {
                 console.log(`_token:`+_token)
                  let _data={access_token:_token};
                  if(_tenant_id){
                     Object.assign(_data,{tenant_id:_tenant_id})
                  }
                  const saveType=!!accessAuthInfo?'modify':'save'
                  saveInfoToStorage({ data:_data, type:'localStorage',key: globalConsts.accessAuthKey, method:saveType })
              }
            // 获取微信用户信息 去微信授权
            if (_userInfo) {
                //////////
                iConsole('73=' + JSON.stringify(_userInfo))
                // 有用户数据，授权过后 地址栏带回token openid
                const { token = "", openid = "", avatar = '', nickname = '' } = _userInfo
                iConsole(`76==token:${_token},_openid=${_openid}`)
                if (!!_openid) {
                    let _cuserInfo = {
                        [globalConsts.wechatStorageKeys.openid]: _openid
                    }
                    iConsole('78:'+_token)
                    // 更新用户信息
                    if (!!_token) {
                        Object.assign(_cuserInfo, { [globalConsts.wechatStorageKeys.token]: _token});
                        // 保存url中的token
                       
                    }
                    if(!!_bind_phone){
                        Object.assign(_cuserInfo, { [globalConsts.wechatStorageKeys.bind_phone]: _bind_phone})
                    }
                    iConsole('90:'+JSON.stringify(_cuserInfo))
                    saveInfoToStorage({
                        data: _cuserInfo,
                        key: globalConsts.userInfoKeyNameInStore,
                        type: 'localStorage',
                        method: 'modify'
                    })
                }
                iConsole(`93==_bind_phone:${_bind_phone}`)
                // 有token 没有用户头像
                if ((!!token || !!_token) && _bind_phone == 1) {
                    iConsole('92')
                    t.wechatPubAuth({ token: _token }).then((data) => {
                        const { userid = '', nickname = "", avatar = "", phone = "" } = data;
                        saveInfoToStorage({
                            data: { account: userid, nickname, headimgurl: avatar, phone,[globalConsts.wechatStorageKeys.bind_phone]:_bind_phone },
                            key: globalConsts.userInfoKeyNameInStore,
                            type: 'localStorage',
                            method: 'modify'
                        })
                    })
                }
                iConsole('104')
                t.initAfterDirect()
                return false;

            } else {
                iConsole('109')
                const _userInfo2 = {
                    // account:'540',
                    // userid:'',
                    accountType: globalConsts.accountType.simulate,
                    platform: globalConsts.platformNames.wechat,
                    platformName: platformName,
                    [platforVersion.name]: platforVersion.value.version01,
                }
                // 本地没保存userInfo信息，url回传了token,bind_phone,openid,当作已授权并保存用户信息
                iConsole('186:'+(_token && _bind_phone && _openid))
                if (_token && _bind_phone && _openid) {
                    Object.assign(_userInfo2, {
                        token: _token,
                        openid: _openid,
                        [globalConsts.wechatStorageKeys.bind_phone]: _bind_phone
                    })
                    saveInfoToSessionStorage(_userInfo2, globalConsts.userInfoKeyNameInStore);
                    // 已绑定
                    iConsole('198:'+_bind_phone)
                    if (_bind_phone == 1) {
                        // 获取微信头像
                        t.wechatPubAuth({ token: _token }).then((data) => {
                             iConsole('202:'+JSON.stringify(data))
                            const { userid = '', nickname = "", avatar = "", phone = "" } = data;
                            saveInfoToStorage({
                                data: { account: userid, nickname, headimgurl: avatar, phone, [globalConsts.wechatStorageKeys.bind_phone]: _bind_phone },
                                key: globalConsts.userInfoKeyNameInStore,
                                type: 'localStorage',
                                method: 'modify'
                            })
                        })
                    }
                    t.initAfterDirect()
                } else {
                    saveInfoToSessionStorage(_userInfo2, globalConsts.userInfoKeyNameInStore);
                    wechatAuthDirect({ goPage: _goPage })
                    return false
                }
            }
            // iConsole('70:' + _token)
            // if (!!_openid && !!_bind_phone) {
            //     this.wechatPubAuth({ token: _token }).then((data = {}) => {
            //         const { userid = '', nickname = "", avatar = "", phone = "" } = data
            //         // 微信 回传的参数
            //         const _userInfo = {
            //             [globalConsts.wechatStorageKeys.token]: _token,
            //             [globalConsts.wechatStorageKeys.bind_phone]: _bind_phone,
            //             [globalConsts.wechatStorageKeys.openid]: _openid,
            //             account: userid,
            //             nickname,
            //             headimgurl: avatar,
            //             phone,
            //             accountType: globalConsts.accountType.simulate,
            //             platform: globalConsts.platformNames.wechat,
            //             platformName: platformName,
            //             [platforVersion.name]: platforVersion.value.version01,
            //         }
            //         saveInfoToSessionStorage(_userInfo, globalConsts.userInfoKeyNameInStore);
            //         t.initAfterDirect()
            //     }).catch(function (e) {
            //         iConsole('107:' + e)
            //     })
            // }

            //app里
        } else {
            const appMethodNameChannel = getAppMethodChannel(platformParamValue);
            window["getInfo"] = appCallBack
            getInfoFromApp(appMethodNameChannel).then((data) => {
                console.log('getInfoFromApp')
                //iai-trate app
                if (data == 'iai-trate') {
                    if (data === null) {
                        t.initAfterDirect()
                    }
                    // 返回ios表示是ios设备，其他未android,初始完以后（获取到app的用户信息）再跳转
                } else {
                    if (data !== 'ios') {
                        if (data === null) {
                            t.initAfterDirect()
                            //android端访问
                        } else {
                            saveLoginInfoToWindow(data, function () {
                                t.initAfterDirect()
                            })
                        }
                    }
                }
            })
        }
        // 设置App高度 解决ios微信底部条挡住问题

        setTimeout(() => {
            // this.remainder();
            document.querySelector('body').style.height = `${window.innerHeight}px`
        }, 200)
    },
    mounted() {
       
    },
    methods: {
        // 保存接口的服务名（url前缀）
        getServiceName(){
            let _serviceName=globalConsts.urlParamsKeys.seviceName.value.iaitrade;
            const searchParam=getSearchParams(globalConsts.urlParamsKeys.seviceName.name)
            const platformName=getSearchParams(globalConsts.urlParamsKeys.platformName.name);
            // 有传服务名
            if(searchParam){
                _serviceName=searchParam;
                // 微信
            }else if(platformName==globalConsts.urlParamsKeys.platformName.value.wechat){
                  _serviceName=globalConsts.urlParamsKeys.seviceName.value.wechat
            }
             saveInfoToStorage({ data:{value:_serviceName}, key: globalConsts.urlParamsKeys.seviceName.name, method: 'save' })
        },
        // 微信用户信息
        wechatPubAuth({ token = '' } = {}) {
            return new Promise((resolve, rejects) => {
                //{ data: resData }={}
                request.userInfoforWechat({ token }).then((res) => {
                    const { data = {} } = res;
                    resolve(data.data)
                }).catch((e) => {
                    rejects(e.message)
                })
            })
        },
        // 获取symbos 行情数据
        getSymbos() {
            return new Promise((resolve) => {
                request.getRiskWarningSymbol().then((res) => {
                    // console.timeEnd()
                    const resData = getDataFoxAxiosRequest(res, this, true);
                    const { data = '', status } = resData
                    // 请求成功并获得数据
                    if (status == 1) {
                        if (data) {
                            saveInfoToSessionStorage(data, globalConsts.waringSymbolsKey);
                            resolve(true)
                        }
                        // 未授权
                    } else {
                        resolve(false)
                    }
                }).catch(function (error) {
                    // alert(error);
                })
            })
        },
        // 跳转02业务新地址
        trackData() {
            //埋点
            try {
                const userFromType = newUserFromType()
                // 只有01 02 03业务app开启神测埋点
                if (userFromType === globalConsts.userFromType.app) {
                    let projectName = this.$config.NODE_ENV === configConsts.prodNodeEvn ? getTrackProjectName() : 'default';
                    console.log('神测埋点项目名22=' + projectName)
                    const _url = this.$config.NODE_ENV === configConsts.prodNodeEvn ? 'https://www.iaitrade.com' : 'http://192.168.35.103:8781';
                    if (getPlatformCode() == globalConsts.platformNames.fx) {
                        globalTrackEvent(projectName, `${_url}/warningFx/warning.html#/index`)
                    } else {
                        globalTrackEvent(projectName, `${_url}/warning/warning.html#/index`)
                    }
                }
            } catch (e) {
                console.error('埋点启动出错:' + e.message)
            }
        },
        initAfterDirect() {
            // createVconsoleScript();
            // 获取后端服务名，并写入到本地存储
            this.getServiceName()
            const t = this;
            this.getSymbos().then((data) => {
                iConsole('209:' + JSON.stringify(data))
                let directUrl = 'homePage';
                const platformParamValue = getSearchParams('platform');
                const goPageObj = globalConsts.urlParamsKeys.goPage;
                const goPageValue = getSearchParams(goPageObj.name);
                const urlQuery = this.$route.query;
                let qeuryPamras = {};
                // 从图表页面传入的当前图表的symbol值，有该值直接去价格预警页面
                console.log('location=' + location.href)
                const setWarningSymbol = getSearchParams(globalConsts.setWarningSymbolKey);
                this.trackData()
                if (!!setWarningSymbol) {
                    this.$router.replace({ path: '/priceWarning/main', query: Object.assign({}, urlQuery, qeuryPamras) });
                    return true;
                }
                if (!!goPageValue) {
                    switch (goPageValue) {
                        case goPageObj.value.page1: {
                            directUrl = 'homePage';
                            break;
                        }
                        case goPageObj.value.page2: {
                            directUrl = 'advanceAssign';
                            break;
                        }
                        case goPageObj.value.page3_1: {
                            directUrl = 'myWarning';
                            break;
                        }
                        case goPageObj.value.page3_2: {
                            //tabName=盯盘监控中
                            // directUrl = '/myWarning?tabName=盯盘监控中';
                            directUrl = 'myWarning';
                            qeuryPamras = { tabName: '盯盘监控中' }
                            break;
                        }
                        case goPageObj.value.page3_3: {
                            // directUrl = '/myWarning?tabName=盯盘已过期';
                            qeuryPamras = { tabName: '盯盘已过期' }
                            directUrl = 'myWarning';
                            break;
                        }
                        case goPageObj.value.page0: {
                            directUrl = 'iaiTraderAppIndex';
                            break;
                        }
                        case goPageObj.value.page4: {
                            directUrl = 'minePage';
                            break;
                        }
                        case goPageObj.value.page5: {
                            directUrl = 'dataWarningDetail';
                            break;
                        }
                        case goPageObj.value.page7: {
                            directUrl = 'homePage';
                            break;
                        }
                        case goPageObj.value.page8: {
                            directUrl = 'productDetailPage';
                            break;
                        }
                        default: {
                            directUrl = 'homePage';
                        }
                    }
                }
                t.$router.replace({ name: directUrl, query: Object.assign({}, urlQuery, qeuryPamras) })
            }).catch((data) => {
                iConsole('280:' + data)
            })

        }
    }
}
</script>

<style lang="scss" scoped>
.mark-red{
    color:#FF6666
}
.number{
    display: inline-block;
    width:0.48rem;
    height:0.48rem;
    background:rgba(51,133,255,1);
    vertical-align: middle;
    border-radius: 0.48rem;
    line-height: 0.48rem;
    text-align: center;
    margin:-4px 0.1rem 0 0
}
.clearForWechat-tip02{
    color:#fff;
    margin:0 0.46rem 0 0;
    font-size: 0.36rem;
}
.guide-icon-more{
    width:0.6rem;
    height:0.6rem;
    vertical-align: middle;
    margin:0 0.1rem
}
.clearForWechat-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 3000;
    background: #292933;
    text-align: right;
    .clearForWechat-tip {
        width: 7.5rem;
        background: rgba(41, 41, 51, 1);
        font-size: 0.36rem;
        color: #fff;
        text-align: center;
        line-height: 0.64rem;
        margin-top:3.82rem
    }
    .arrow {
        margin: 0.2rem 0.48rem 0 0;
        width: 0.97rem;
        height: 1.09rem;
    }
    .tip-pic {
        width: 5.8rem;
        height: 3.4rem;
        margin-left: auto;
        margin-right: auto;
        margin-top:0.24rem
    }
    .center{
        text-align: center
    }
    .right{
        text-align: right
    }
}
</style>
