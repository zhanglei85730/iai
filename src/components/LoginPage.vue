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
            <SideSpace value="0.6rem">
                <div slot="content">
                    <!-- logo -->
                    <div class="logo-box">
                        <img
                            :src="$config.imagePathPrefix+'login_logo@2x.png'"
                            class="logo-img"
                        >
                        <div class="logo-project-title">IAI TRADE</div>
                        <div class="logo-project-name">量化回测检验平台</div>
                        <div class="logo-box-slogo">各种优质策略信号，登录即可一键跟随</div>
                    </div>
                    <div class="login-form">
                        <cube-input
                            v-model="userName"
                            :clearable="true"
                            class="custom-input"
                            placeholder="请输入手机号"
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
                        >
                            <span
                                slot="prepend"
                                class="custom-input-label"
                            >密码</span>
                        </cube-input>

                        <!-- 记住密码 -->
                        <div class="checkbox-box">
                            <label>
                                <input
                                    type="checkbox"
                                    class="common-radio"
                                    @click="onRemberPassword"
                                    ref="remberPasswordInput"
                                >
                                <span class="label-txt">记住密码</span>
                            </label>
                        </div>
                        <!-- 确定按钮 -->
                        <cube-button
                            :primary="true"
                            class="common-primary-btn login-btn"
                            @click="loginSubmit"
                        >登录</cube-button>
                        <!-- 注册-找回密码 -->
                        <div class="login-bottom flex-box">
                            <router-link
                                class="flex-box-item common-ta-l common-link-blue"
                                tag="div"
                                to="/register"
                            >免费注册</router-link>
                            <router-link
                                class="flex-box-item common-ta-r common-link-blue"
                                tag="div"
                                to="/findPassword"
                            >找回密码</router-link>
                        </div>
                    </div>
                </div>
            </SideSpace>
        </div>
    </MainLayout>
</template>
<script>
import request from '@services/documentary.js'
import { commonError, setCookie, getCookie, getDataFoxAxiosRequest,saveInfoToSessionStorage } from '@public/js/util.js'
import i18n from '@warning/i18n';
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
        // 提交登录
        loginSubmit() {
            const t = this;
            let dialogContent = ''
            const cookie = document.cookie;
            if (this.userName === '') {
                dialogContent = '手机号不能为空'
            }
            if (this.userPassword === '') {
                dialogContent = '密码不能为空'
            }
            if (dialogContent !== '') {
                this.$createDialog({
                    type: 'alert',
                    title: '登录',
                    content: dialogContent,
                }).show()
                return false;
            }
            if (document.cookie !== '') {
                cookie.split(";")
            }
            request.login({ username: t.userName, password: t.userPassword }).
                then((res) => {
                    if (!getDataFoxAxiosRequest(res, t)) return false;
                    const { data, request } = res;
                    const { status = false, message = '',data:apiData } = data;
                    const { status: resStatus = '' } = request
                    if (resStatus == 200 && status == 1) {
                        // 登录后要跳转的参数
                         const  loginAfterTo = t.$route.query.loginAfterTo
                        saveInfoToSessionStorage(apiData)
                        t.$createDialog({
                            type: 'alert',
                            title: '登录',
                            content: message,
                        }).show();                       
                        t.$router.push(loginAfterTo?loginAfterTo:'/personal')
                        // 记住密码
                        if (t.isRemberPassWord) {
                            setCookie('username', Base64.encode(t.userName));
                            setCookie('password', Base64.encode(t.userPassword));
                        }
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
    margin-top: 1rem;
    input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill{
    background:none;
}
    .login-form {
        margin-top: 1.2rem;
    }
    .logo-img {
        width: 2.5rem;
    }
    .logo-project-title {
        font-size: $commonFsMedium;
        margin-top: 0.1rem;
    }
    .logo-project-name {
        font-size: $commonFsTitleMedium;
        margin-top: 0.1rem;
    }
    .logo-box-slogo {
        font-size: $commonFsSmall;
        color: $commonFsColorGray;
        margin-top: 0.2rem;
    }
    .login-form-item {
        display: flex;
        line-height: 0.8rem;
        margin-top: 0.3rem;
        border-bottom: 1px solid $commonFsColorGray;
        padding-bottom: 0.2rem;
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
        margin-top: 0.4rem;
    }
    .label-txt {
        margin-left: 0.2rem;
    }
    .login-btn {
        margin: 0.4rem 0 0.4rem;
    }
}
</style>
