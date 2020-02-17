
import request from '@services/documentary.js'
const globalConsts = require('@public/js/consts.js')
import {
    getNewPlatform,
    isWechatBind,
    goAppLogin,
    isIaiTraderApp,
    saveInfoToSessionStorage,
    getAuthStatu
} from '@public/js/util.js'
export default {
    data() {
        return {
            isAuthStart: false,
            loginPopVisible: false,
            isWeChatLogin: false,
            isLogined: false,
            isAuth: false
        }
    },
    components: {
        // // 微信授权modal
        // WeChatLogin:()=>import("@warning/components/WeChatLogin"),
        //  // 未授权modal
        // AuthPop:()=>import("@warning/components/AuthPop"),
        // // 未登录modal
        // LoginPop:()=>import("@warning/components/LoginPop"),
        /////
        ///
        ///
    },
    created() {
        this.isAuth = getAuthStatu()==1?true:false
    },
    methods: {
        //======================触发授权流程===================
        // 是否登录
        // 调转登录
        goToLogin() {
            if (getNewPlatform()) {
                this.isWeChatLogin = true
            } else {
                this.$router.push({ name: 'login', query: { loginAfterTo: 'index' } })
            }
        },
        isAuthed() {
            //app 未登录
            if (this.$config.userFromType() == 'app') {
                // 未登录
                if (!this.$config.isLogined()) {
                    //iai-trade app
                    if (isIaiTraderApp()) {
                        // 跳转登录界面（原生app,url拦截）
                        goAppLogin(this.$router.history.current.path);
                        return false
                    }
                    //微信服务号
                    if (getNewPlatform()) {
                        this.isWeChatLogin = true
                    } else {
                        this.loginPopVisible = true;
                    }
                    return false;
                } else {
                    return true;
                    // 登录后再校验是否授权，如果已校验未登录弹出未登录不提示授权
                }
                // web 未登录
            } else {
                if (!this.$config.isLogined()) {
                    this.goToLogin();
                    return false;
                } else {
                    return true
                }
            }
        },
        authTrigger() {
            if (!this.isAuthed()) return false;
            // 从localstorage获取保存的授权状态，为-1 提示授权 getAuthStatu()
            if (-1 === globalConsts.auth.statu.fail) {
                if (isWechatBind() && getNewPlatform()) {

                } else {
                    this.isAuthForApp();
                    return false;
                }
            } else {
                return true
            }
        },
        isAuthForApp() {
            // PF00新平台
            if (getNewPlatform() && !isWechatBind()) {
                this.isWeChatLogin = true
                //01 02 03等老平台
            } else {
                this.isAuthStart = true;
            }

        },
        authSuccessAfterHandle() {
            const t = this;
            request.updateProductAuth().then(({ data }) => {
                const { status = '' } = data;
                t.isAuth = status == 1 ? true : false;
                t.isGuest = status == -5 ? true : false;
                sessionStorage.removeItem(globalConsts.auth.sessionStoryKey)
                saveInfoToSessionStorage({ value: status }, globalConsts.auth.sessionStoryKey);
            })
            // this.getGroupData(true)
        },
        loginPopHideHandle(data) {
            this.isAuthStart = false
        },
        AuthPopcancleHandle() {
            this.loginPopVisible = false
        },
        // 隐藏wechatlogin
        weChatLoginClose() {
            this.isWeChatLogin = false
        },
    }
}
