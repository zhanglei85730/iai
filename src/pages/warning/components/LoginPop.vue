<template>
    <!-- 登录弹框 -->
    <div v-if="$attrs.isShow || visibile">
        <cube-popup
            type="my-popup"
            ref="loginPopup"
            :mask="true"
            :visible="$attrs.isShow || visibile"
        >
            <div class="login-form-box common-popup-container">
                <!-- 无token -->
                <div
                    v-if="token==''"
                    class="common-popup-title"
                >{{$t('common').loignPopAuthTitle}}</div>
                <!-- 有token -->
                <div
                    v-else
                    class="common-popup-title common-popup-title-token"
                >{{$t('common').serviceAuth}}</div>
                <div
                    class="common-popup-content"
                    v-if="token==''"
                >
                    <div class="common-input-box">
                        <div class="common-input-label">{{$t('common').accountLable}}</div>
                        <div class="common-input-right">
                            <input
                                type="text"
                                class="common-input"
                                :placeholder="$t('common').pleaseInputAccountOrTelNum"
                                v-model="userName"
                                readonly
                            />
                        </div>
                    </div>
                    <div class="common-input-box last-input-box">
                        <div class="common-input-label">{{$t('common').password}}</div>
                        <div class="common-input-right">
                            <input
                                ref="passwordInputDom"
                                type="password"
                                class="common-input"
                                :placeholder="$t('common').pleaseInputPassword"
                                v-model="password"
                            />
                        </div>
                    </div>
                </div>
                <div
                    v-else
                    class='common-popup-content common-auth-description'
                >
                    {{$t('common').serviceAuthDescription}}
                </div>
                <div class="common-popup-footer">
                    <div
                        class="common-popup-footer-btn common-popup-footer-active-btn"
                        @click="userAuthLogin"
                        :class="{'disable-btn':loadingVisible}"
                    >
                        <cube-loading
                            :size="16"
                            v-if="loadingVisible"
                            style='display:inline-block;vertical-align:middle;margin-right:4px'
                        >
                        </cube-loading>
                        <span v-if="token==''">{{$t('common').authLoginBtn}}</span>
                        <span v-else>{{$t('common').authAndUse}}</span>
                    </div>
                    <div
                        class="common-popup-footer-btn"
                        @click="userAuthLoginCancle"
                    >{{$t('common').cancleLoginBtn}}</div>

                </div>
            </div>
        </cube-popup>
        <!-- 登录弹框 end -->
    </div>
</template>
<script>
import request from '@services/documentary.js'
import { commonError, saveInfoToSessionStorage, getInfoFromSessionStorage, getDataFoxAxiosRequest, getInfoFromApp, isObject, backToApp, saveLoginInfoToWindow, trackEventGeneral, getTrackProjectName, getAccount, getPlatformCode, getSymbolInfoByEname, iosKeyboardHide, getSearchParams, getTokenFromAppGetinfo, getIsNotificationNeedOpen } from '@public/js/util.js'
import { globalTrackEvent } from '@public/js/trackEvent.js'
import i18n from '@warning/i18n';
const configConsts = require('@config/consts.js')
const globalConsts = require('@public/js/consts.js')
const consts = require('@warning/consts.js')
export default {
    props: {
        // 是否需要校验登录
        isAuth: {
            type: Boolean,
            required: false,
            default: false
        },
        // 是否显示
        isShow: {
            type: Boolean,
            required: false,
            default: false
        },
    },
    data() {
        const t = this;
        return {
            userName: '',
            password: '',
            visibile: false,
            // 加载loading是否显示
            loadingVisible: false,
            // token值
            token: ''
        }
    },
    methods: {
        // 用户登录确定按钮
        userAuthLogin() {
            // 无token
            try {
                //每次 请求时先清除已保存在sessionStorage里的认证状态
                sessionStorage.removeItem(globalConsts.auth.sessionStoryKey)
            } catch (e) {

            }
            console.log('toekn=' + this.token)
            if (this.token == '') {
                const { isDisable = true, userName = '' } = this;
                if (!isDisable) return false;
                const { password = '' } = this;
                if (userName === '' || password === '') {
                    this.$createDialog({
                        type: 'alert',
                        title: '授权登录',
                        showClose: true,
                        content: "账号或密码不能为空",
                        confirmBtn: {
                            text: '确定',
                            active: true,
                            disabled: false,
                            href: 'javascript:;'
                        },
                    }).show();
                    return false;
                }
                this.userAuthLoginReauest({ userName, password })
            } else {
                this.userAuthLoginReauest({ userName: this.userName, token: this.token })
            }
        },
        // app用户认证成功流程
        authSuccessFllow() {
            // this.visibile = false;
            this.getSymbos();
        },
        // 授权
        userAuthLoginReauest({ userName = '', password = '', token = '' }) {
            const t = this;
            t.loadingVisible = true;
            // 有token就不需要账号密码
            const params = token == '' ? { id: userName, password } : { id: userName, token };
            // 地址栏是否有app参数（标识app来源）
            const queryParamApp = getSearchParams('app')
            if (!!queryParamApp) {
                Object(params, { _ref: queryParamApp })
            }
            console.log('auth parmas=' + JSON.stringify(params))
            console.log('授权开始。。。。')
            request.updateProductAuth(params).then((res) => {
                t.loadingVisible = false;
                const data = getDataFoxAxiosRequest(res, t, true);
                console.log('授权结果' + data)
                if (data) {
                    const { status = '', message = '' } = data;
                    if (status == 1) {
                        // 认证成功流程
                        t.authSuccessFllow();
                        t.$createToast({
                            txt: message ? message : t.$t('common').authSuccess,
                            type: 'correct'
                        }).show();
                        // 授权成功回调
                        t.$emit('authSuccess')
                    } else {
                        t.$createToast({
                            txt: t.$t('toastTxt').accountOrPwError,
                            type: 'warn'
                        }).show()
                    }
                }

            }).catch(e => commonError(e, t))
        },
        // 自动获取焦点
        inputFocus() {
            const t = this;
            this.$nextTick(() => {
                t.$refs.passwordInputDom.focus()
            })
        },
        // app授权取消按钮
        userAuthLoginCancle() {
            const t = this;
            // t.$createDialog({
            //     type: 'alert',
            //     title: t.$t('toastTxt').tipLable,
            //     showClose: true,
            //     content: t.$t('toastTxt').appAuthTip,
            //     confirmBtn: {
            //         text: t.$t('common').sureBtnText,
            //         active: true,
            //         disabled: false,
            //         href: 'javascript:;'
            //     },
            //     onConfirm: () => {
            //         // backToApp();
            //         t.visibile=false;
            //     },
            // }).show();
             t.visibile=false;
            this.$emit('hide',this.visibile)

        },
        // 获取symbos 行情数据
        getSymbos() {
            const t = this;
            const toast = this.$createToast({
                txt: t.$t('common').loadingText,
                mask: true
            })
            toast.show()
            // console.log('获取getsymbol接口开始')
            // console.time()
            request.getRiskWarningSymbol().then((res) => {
                // console.timeEnd()
                const resData = getDataFoxAxiosRequest(res, this, true);
                const { data = '', status } = resData
                // 请求成功并获得数据
                toast.hide()
                if (status == 1) {
                    if (data) {
                        saveInfoToSessionStorage(data, 'waringSymbols');
                        t.$emit('authSuccessAfter')
                        this.visibile = false;
                    }
                    // 未授权
                } else if (status == -1) {
                    console.log('未授权')
                    this.noLoginHandle()
                    //为未授权用户埋点
                }

            })
        },
        // 埋点为授权的用户（手动埋点,传到自己的后台）
        trackNoAuthCount() {
            // 真实场
            // if (this.$config.NODE_ENV === configConsts.prodNodeEvn) {
            //     request.trackNoAuth().then(() => { })
            // } else {
            // }
            // app 图表进入
           if(this.$route.query.hasOwnProperty(globalConsts.setWarningSymbolKey)){
               request.trackNoAuth({identify:"app_Risk_quote_in"}).then(() => { })
            //其他入口
           }else{
                request.trackNoAuth().then(() => { })
           }
            
        },
        // 未登录处理
        noLoginHandle() {
            const userFromType = this.$config.userFromType()
            // app用户
            console.log('userFromType:' + this.$config.userFromType())
            console.log('未登录处理:' + consts.fromApp)
            if (consts.fromApp == userFromType) {
                if (this.$props.isAuth) {
                    this.visibile = true;
                }
            } else {
                if (this.$props.isAuth) {
                    // web用户没登录
                    if (!this.$config.isLogined()) {
                        console.log('web用户没登录')
                        this.goToLogin()
                    }
                } else {

                }

            }
        },
        // 跳转app登录
        goAppLogin() {
            window.open("https://gologin", 'commlogin', 'mobile', "_blank");
        },
        // 调转登录
        goToLogin() {
            this.$router.push({ name: 'login', query: { loginAfterTo: 'index' } })
        },
        //保存app用户账户信息到sessionStorage
        /**
         * @return {Number} -1 :web用户未登录，-4:app用户
         */
        saveAppUserAccountInfo() {
            const t = this;
            console.log('调用获取用户信息方法01')
            return new Promise(resolve => {
                getInfoFromApp().then(userInfoData => {
                    //保存平台信息
                    const data = userInfoData;
                    console.log('用户信息类型:' + typeof (data))
                    console.log('用户信息:' + JSON.stringify(data))
                    saveLoginInfoToWindow(data, function () {
                        // 如果是真实场启动埋点
                        // const projectName = getTrackProjectName()
                        // console.log('神测埋点项目名22=' + projectName)
                        // if (t.$config.NODE_ENV === configConsts.prodNodeEvn) {
                        //     console.log('真实场启动埋点开始：' + t.$config.NODE_ENV)
                        //     globalTrackEvent(getTrackProjectName())
                        // } else {
                        //     console.log('uat场不启动埋点：' + t.$config.NODE_ENV)
                        // }
                        //globalTrackEvent('default')
                    })
                    // app
                    if (!!data) {
                        saveInfoToSessionStorage(data, 'userInfo');
                        console.log('consts.fromApp:' + consts.fromApp)
                        if (globalConsts.visitDeviceType.fromWeb == t.$config.userFromType()) {
                            if (t.$props.isAuth) {
                                if (t.$config.isLogined()) {
                                    // console.log('167')
                                    // t.goToLogin();
                                    resolve(1);
                                } else {
                                    resolve(-1);
                                }
                            } else {
                                resolve(1);
                            }
                            //app用户
                        } else {
                            console.log('app授权开始')
                            request.getUserAuthStatus().then((res) => {
                                console.log('app授权=' + JSON.stringify(data))
                                const { data: { status = '' } = {} } = res
                                console.log('app授权status=' + status)
                                //saveInfoToSessionStorage, getInfoFromSessionStorage,
                                //  保存授权信息
                                saveInfoToSessionStorage({ value: status }, globalConsts.auth.sessionStoryKey)
                                if (status == '-1') {
                                    // alert(t.$props.isAuth+','+t.isAuth)
                                    if (t.$props.isAuth) {
                                        resolve(-1);
                                    } else {
                                        resolve(1);
                                    }
                                } else {
                                    resolve(1);
                                }
                            })
                        }
                        //web未登录
                    } else {
                        if (consts.fromWeb === t.$config.userFromType()) {
                            if (t.isAuth) {
                                if (!t.$config.isLogined()) {
                                    console.log('199')
                                    t.goToLogin()
                                    resolve(-1);
                                }
                            } else {
                                resolve(1);
                            }
                            //app用户
                        }
                    }

                }, err => {
                }).catch(e => commonError(e, t))
            })
        },
    },
    created: function () {
        const t = this;
        // 执行保存app信息
        console.log('执行保存app信息')
        setTimeout(() => {
            t.getSymbos();
            this.saveAppUserAccountInfo().then(data => {
                console.log('调用接口：' + data)
                const token = getTokenFromAppGetinfo();
                if (token != '') {
                    t.token = token
                }
                t.userName = getAccount();
                console.log('getAccount378=' + getAccount())
                if (data == -1) {
                    // 登录后且真实账号
                    if (t.$config.isLogined()) {
                        this.noLoginHandle();
                    }
                    //为未授权用户埋点
                    this.trackNoAuthCount()
                }
            })
        }, 300)

        // const {callback=()=>{},callbackResult=()=>{}}=t.$attrs
        // callback().then((data)=>{
        //     callbackResult(data)
        // })
    },
    mounted: function () {
        setTimeout(() => {
            this.trackNoAuthCount()
        }, 300)
    },
    watch: {
        visibile(newval, oldval) {
            if (newval && this.token == '') {
                this.inputFocus()
            }
        },
        isAuth(newval, oldval){
            if(newval===true && oldval===false){
                this.visibile=true
            }
        }
    },
    i18n,
}
</script>
<style lang="scss" scoped>
@import "@public/css/warningGlobal.scss";
$btnHeigh: 0.8rem;
.common-popup-container {
    min-width: 308px;
    border-radius: 0.14rem;
}
.login-form-tip-risk-box {
    // padding: 0 0 0.57rem 0;
    padding: 0 0 1rem 0;
}
.login-form-box {
    .common-popup-footer {
        flex-direction: column;
        margin: 0 0.9rem;
        margin-top: 0.72rem;
        width: auto !important;
    }
    .common-input {
        color: #fff;
        font-weight: normal;
    }
    .common-popup-footer-active-btn {
        background: $commonColorBlur;
        color: #fff;
    }
    .common-popup-footer-btn {
        height: $btnHeigh;
        line-height: $btnHeigh;
        border: none;
        border-radius: 0.45rem;
        &:last-child {
            margin-top: 0.08rem;
            margin-bottom: 0.08rem;
        }
    }
    .common-input-label {
        color: $commonFsColorGray;
    }
    .disable-btn {
        opacity: 0.6;
    }
    .loading-icon {
    }
}
</style>

