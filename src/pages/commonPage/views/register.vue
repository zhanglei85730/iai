<template>
    <!-- 注册 -->
    <MainLayout
        :title="$route.meta.title"
        :backgroundColor="$config.headerBackgroundColor"
        :isShowHeader="true"
        class="common-layout-back"
        :isLayoutBodyFlex="true"
        :headerStyle="$config.headerStyle"
        :isShowBackWord="true"
        :backBtnTxt="$t('common').loginLable"
    >
        <div
            slot="page-body"
            class="register common-body-space-top"
        >
            <SideSpace
                value="0.48rem"
                class="common-flex-column-row"
            >
                <div
                    class="common-layout-box"
                    slot="content"
                >
                    <div class="common-layout-top">
                        <div class="common-input-box">
                            <div class="common-input-label common-input-label-width-3words">{{$t('common').telLable}}</div>
                            <div class="common-input-right">
                                <input
                                    type="text"
                                    class="common-input"
                                    :placeholder="$t('common').inputTel"
                                    v-model="username"
                                />
                            </div>
                        </div>
                        <div class="common-input-box">
                            <div class="common-input-label common-input-label-width-3words">{{$t('common').password}}</div>
                            <div class="common-input-right">
                                <input
                                    type="password"
                                    class="common-input"
                                    :placeholder="$t('toastTxt').inputStringLimit"
                                    v-model="password"
                                />
                            </div>
                        </div>
                        <div class="register-box">
                            <div class="common-flex-item register-button-input">
                                <div class="common-input-box">
                                    <div class="common-input-label common-input-label-width-3words">{{$t('common').vlidateCode}}</div>
                                    <div class="common-input-right">
                                        <input
                                            type="text"
                                            class="common-input"
                                            :placeholder="$t('common').pleadeInputVlidateCode"
                                            v-model="smscode"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div
                                class="register-validate-btn"
                                @click="onSendMessage"
                            >{{$t('common').sendVlidateCode}}</div>
                        </div>
                    </div>
                    <div class="common-layout-bottom">
                        <!-- 确定按钮 -->
                        <cube-button
                            :primary="true"
                            class="common-primary-btn register-button"
                            @click="registerSubmit"
                        >{{$t('common').registerText}}</cube-button>
                    </div>
                </div>

                <!-- 内容 end -->
            </SideSpace>
        </div>
    </MainLayout>
</template>
<script>
import request from '@services/documentary.js'
import { commonError, getDataFoxAxiosRequest } from '@public/js/util.js'
import i18n from '@warning/i18n';
const regExp = require('@public/js/regular.js')
let Base64 = require('js-base64').Base64
export default {
    components: {

    },
    data() {
        return {
            // 验证码
            smscode: '',
            // 手机号码
            username: '',
            //密码
            password: '',
            usage: '',
        }
    },
    mounted: function () {
    },
    methods: {
        // 提交登录
        registerSubmit() {
            const params = {
                username: this.username,
                password: this.password,
                smscode: this.smscode
            }
            let toastTxt = '';
            const t = this;
            // 验证输入
            if (this.username === '') {
                toastTxt = t.$t('toastTxt').userNameCantEmpty
            }
            if (this.password === '') {
                toastTxt = t.$t('toastTxt').passwordCantEmpty
            }
            if (this.smscode === '') {
                toastTxt = t.$t('toastTxt').messageValidateCantEmpty
            }
            if (this.username !== '' && !regExp.phoneNumber.test(this.username)) {
                toastTxt = t.$t('toastTxt').inputCorrectTelNumber
            }
            if (toastTxt !== '') {
                t.$createDialog({
                    type: 'alert',
                    title: t.$t('common').registerText,
                    content: toastTxt,
                }).show()
                return false;
            }
            request.register(params).then((res) => {
                const apiData = getDataFoxAxiosRequest(res, t);
                if (apiData) return false;
                const { status = '', message = '' } = apiData;
                let toastTxt = ''
                if (status == 1) {
                    toastTxt = message ? message : t.$t('toastTxt').registerSuccess;
                } else {
                    toastTxt = message ? message :t.$t('toastTxt').registerFail
                }
                t.$createDialog({
                    type: 'alert',
                    title: t.$t('toastTxt').registerText,
                    content: toastTxt,
                }).show()
            })
        },
        // 发送短信验证码
        onSendMessage() {
            let toastTxt = '';
            const t=this;
            // 验证输入
            if (this.username === '') {
                toastTxt = t.$t('toastTxt').userNameCantEmpty
            }
            if (this.password === '') {
                toastTxt = t.$t('toastTxt').passwordCantEmpty
            }
            if (this.username !== '' && !regExp.phoneNumber.test(this.username)) {
                toastTxt = t.$t('toastTxt').inputCorrectTelNumber
            }
            if (toastTxt !== '') {
                t.$createDialog({
                    type: 'alert',
                    title: t.$t('common').sendVlidateCode,
                    content: toastTxt,
                }).show()
                return false;
            }
            const params = {
                username: this.username,
                usage: 'register'
            }
            request.sendMessage(params).then((res) => {
                const apiData = getDataFoxAxiosRequest(res, this);
                if (!apiData) return false;
                const { data: { code = '' }, status = '', message = '' } = apiData;
                if (status == 1 && code != '') {
                    t.$createDialog({
                        type: 'alert',
                        title: t.$t('common').sendVlidateCode,
                        content: message ? message : t.$t('toastTxt').sendValidateSuccess,
                    }).show()
                }

            })
        }
    },
    watch: {
        username: function (newValue, oldValue) {
            if (!regExp.number.test(Number(newValue))) {
                this.username = newValue.slice(0, -1);
            } else {
                if (newValue.length > 11) {
                    this.username = oldValue
                }
            }
        },
        smscode: function (newValue, oldValue) {
            if (newValue.length > 6) {
                this.smscode = oldValue
            }
        },
    },
    i18n
}
</script>

<style lang="scss">
@import "@public/css/mobileGlobal.scss";
.register {
    box-sizing: border-box;
    .register-button {
        margin-top: 0.3rem;
    }
    .common-flex-box {
        display: flex;
    }
    .register-box {
        position: relative;
    }
    .register-validate-btn {
        position: absolute;
        right: 0;
        top: 0;
        color: $commonColorBlur;
        height: $commonInputHeight;
        line-height: $commonInputHeight;
    }
}
</style>
