<template>
    <MainLayout
        :title="$route.meta.title"
        :backgroundColor="$config.headerBackgroundColor"
        :isShowHeader="false"
    >
        <div
            slot="page-body"
            class="login"
        >
            <SideSpace value="0.48rem">
                <div slot="content">
                    <!-- logo -->
                    <div class="logo-box">
                        <img
                            :src="$config.commonImagePathPrefix+'login_logo@2x.png'"
                            class="logo-img"
                        >
                        <div class="logo-project-title">{{$t('common').projectName}}</div>
                        <div class="logo-project-name">{{$t('commonPage').loginTitle}}</div>
                        <div class="logo-box-slogo">{{$t('commonPage').loginSlogin}}</div>
                    </div>
                    <div class="login-form">
                        <!-- <cube-input
                            v-model="userName"
                            :clearable="true"
                            class="custom-input"
                            placeholder="请输入手机号"
                            style="background-color:none"
                             autocomplete="off"
                        >
                            <span
                                slot="prepend"
                                class="custom-input-label"
                            >手机</span>
                        </cube-input>
                        <cube-input
                            v-model="userPassword"
                            :clearable="true"
                            type="password"
                            class="custom-input"
                            placeholder="请输入密码"
                            style="background-color:none"
                            autocomplete="off"
                        >
                            <span
                                slot="prepend"
                                class="custom-input-label"
                            >密码</span>
                        </cube-input> -->
                        <div class="common-input-box">
                            <div class="common-input-label">{{$t('common').telLable}}</div>
                            <div class="common-input-right">
                                <input
                                    type="text"
                                    v-model="userName"
                                    class="common-input"
                                    :placeholder="$t('common').telLable"
                                />
                            </div>
                        </div>
                        <div class="common-input-box">
                            <div class="common-input-label">{{$t('common').password}}</div>
                            <div class="common-input-right">
                                <input
                                    type="password"
                                    v-model="userPassword"
                                    class="common-input"
                                    :placeholder="$t('common').pleaseInputPassword"
                                />
                            </div>
                        </div>

                        <!-- 记住密码 -->
                        <div class="checkbox-box">
                            <label>
                                <input
                                    type="checkbox"
                                    class="common-radio"
                                    @click="onRemberPassword"
                                    ref="remberPasswordInput"
                                    readonly
                                >
                                <span class="label-txt">{{$t('common').rememberPassword}}</span>
                            </label>
                        </div>
                        <!-- 确定按钮 -->
                        <cube-button
                            :primary="true"
                            class="common-primary-btn login-btn"
                            @click="loginSubmit"
                        >{{$t('common').loginLable}}</cube-button>
                        <!-- 注册-找回密码 -->
                        <div class="login-bottom flex-box">
                            <router-link
                                class="flex-box-item common-ta-l common-link-blue"
                                tag="div"
                                to="/register"
                            >{{$t('common').register}}</router-link>
                            <router-link
                                class="flex-box-item common-ta-r common-link-blue"
                                tag="div"
                                to="/findPassword"
                            >{{$t('common').findPassword}}</router-link>
                        </div>
                    </div>
                </div>
            </SideSpace>
        </div>
    </MainLayout>
</template>
<script>
import request from '@services/documentary.js'
import { commonError, setCookie, getCookie, getDataFoxAxiosRequest, saveInfoToSessionStorage, getPlatformCode,getI18nData } from '@public/js/util.js'
import i18n from '@warning/i18n';
const globalConsts = require('@public/js/consts.js')
const configConsts = require('@config/consts.js')
let Base64 = require('js-base64').Base64

export default {
    data() {
        return {
            // 手机号码
            userName: '',
            //密码
            userPassword: '',
            isRemberPassWord: '',
        }
    },
    mounted: function () {
        //如果有记住密码
        if (document.cookie !== '') {
            const userName = getCookie('username'), userPassword = getCookie('password');
            if (userName) {
                this.userName = Base64.decode(userName)
            }
            if (userPassword) {
                this.userPassword = Base64.decode(userPassword);
                this.$refs.remberPasswordInput.checked = true
            }
        }
    },
    methods: {
        // 获取国际化数据
        getPageI18nData(){
            getI18nData
        },
        // 跳转到身份验证页面
        toValidateIdentity() {
            this.$router.push({ name: 'validateIdentity', query: { username: this.userName } })
        },
        removeReadonly(e) {
            // e.target.removeReadonly
        },
        // 提交登录
        loginSubmit() {
            const t = this;
            let dialogContent = ''
            const cookie = document.cookie;
            if (this.userName === '') {
                dialogContent = t.$t('toastTxt').telNumberCantEmpty
            }
            if (this.userPassword === '') {
                dialogContent = t.$t('toastTxt').passwordCantEmpty
            }
            if (dialogContent !== '') {
                this.$createDialog({
                    type: 'alert',
                    title: t.$t('toastTxt').loginLable,
                    content: dialogContent,
                }).show()
                return false;
            }
            if (document.cookie !== '') {
                cookie.split(";")
            }
            request.login({ username: t.userName, password: t.userPassword }).
                then((res) => {
                    // if (!getDataFoxAxiosRequest(res, t)) return false;
                    const { data, request } = res;
                    const { status = false, message = '', data: apiData } = data;
                    const { status: resStatus = '' } = request
                    if (resStatus == 200) {
                        if (status == 1) {
                            // 登录后要跳转的参数
                            const loginAfterTo = t.$route.query.loginAfterTo
                            saveInfoToSessionStorage(apiData)
                            t.$createDialog({
                                type: 'alert',
                                title: t.$t('toastTxt').loginLable,
                                content: message,
                            }).show();
                            t.$router.push(loginAfterTo ? loginAfterTo : '/personal')
                            // 记住密码
                            if (t.isRemberPassWord) {
                                setCookie('username', Base64.encode(t.userName));
                                setCookie('password', Base64.encode(t.userPassword));
                            }
                        } else if (status == -4) {
                            t.toValidateIdentity();
                            // 登录失败
                        } else {
                            t.$createToast({
                                txt: message ? message : t.$t('toastTxt').loginFail,
                                type: 'warn'
                            }).show()
                        }

                    } else {
                        t.$createToast({
                            txt: t.$t('toastTxt').errorLable,
                            type: 'warn'
                        }).show()
                    }
                }).catch(e => commonError(e, t))
        },
        // 记住密码
        onRemberPassword(e) {
            const remberPassWordDom = this.$refs.remberPasswordInput;
            this.isRemberPassWord = remberPassWordDom.checked;
        }
    },
    i18n
}
</script>

<style lang="scss">
@import "@public/css/mobileGlobal.scss";
.login {
    color: #fff;
    margin-top: 0.78rem;
    .login-form {
        margin-top: 0.94rem;
    }
    .logo-img {
        width: 1.82rem;
        height: 0.58rem;
    }
    .logo-project-title {
        font-size: $commonFsMedium;
        margin-top: 0.23rem;
        font-weight: bold;
    }
    .logo-project-name {
        font-size: $commonFsTitleMedium;
        margin-top: 0.1rem;
        font-weight: bold;
    }
    .logo-box-slogo {
        font-size: $commonFsSmall;
        color: $commonFsColorGray;
        margin-top: 0.22rem;
    }
    .login-form-item {
        display: flex;
        line-height: 1rem;
        // margin-top: 0.3rem;
        border-bottom: 1px solid $commonFsColorGray;
        // padding-bottom: 0.2rem;
    }
    .login-form-item-left {
        width: 1rem;
        padding-top: 0.2rem;
    }
    .login-form-item-right {
        flex: 1;
    }
    .custom-input {
        border: none;
        background: none;
        .cube-input-field {
            font-size: 0.34rem;
            color: #a0a0a2;
        }
    }
    .custom-input::after {
        border: none;
    }
    .checkbox-box {
        text-align: right;
        margin-top: 0.28rem;
    }
    .label-txt {
        vertical-align: middle;
    }
    .login-btn {
        margin: 0.28rem 0 0;
    }
    .login-bottom {
        margin-top: 0.28rem;
    }
}
</style>
