<template>
    <!-- 注册 -->
    <MainLayout
        :title="$route.meta.title"
        :isShowHeader="true"
        :isLayoutBodyFlex="true"
        :headerStyle="$config.headerStyle"
    >
        <div
            slot="page-body"
            class="find-password common-body-space-top"
        >
            <SideSpace
                value="0.6rem"
                class="common-flex-column-row"
            >
                <div
                    class="common-layout-box"
                    slot="content"
                >
                    <div class="common-layout-top">
                        <!-- 内容 -->
                        <cube-input
                            v-model="password"
                            type="password"
                            :clearable="true"
                            :maxlength="11"
                            class="custom-input"
                            :placeholder="$t('common').setLoginPasswordText"
                        >
                            <span
                                slot="prepend"
                                class="custom-input-label custom-input-set-password"
                            >{{$t('common').setLoginPasswordText}}</span>
                        </cube-input>
                        <cube-input
                            v-model="surePassword"
                            type="password"
                            :clearable="true"
                            :maxlength="11"
                            class="custom-input"
                            :placeholder="$t('common').sureLoginPassword"
                        >
                            <span
                                slot="prepend"
                                class="custom-input-label custom-input-set-password"
                            >{{$t('common').sureLoginPassword}}</span>
                        </cube-input>
                    </div>
                    <div class="common-layout-bottom">
                        <!-- 确定按钮 -->
                        <cube-button
                            :primary="true"
                            class="common-primary-btn register-button"
                            @click="setPasssordSubmit"
                        >{{$t('common').nextSetpBtnText}}</cube-button>
                    </div>
                </div>
                <!-- 内容 end -->
            </SideSpace>
        </div>
    </MainLayout>
</template>
<script>
import request from '@services/documentary.js'
import { mapState } from 'vuex';
import { commonError, getDataFoxAxiosRequest } from '@public/js/util.js'
import i18n from '@warning/i18n';
let Base64 = require('js-base64').Base64
export default {
    components: {

    },
    data() {
        return {
            // 确认密码
            surePassword: '',
            //新密码
            password: '',
            // 验证码
            smscode: '',
        }
    },
    mounted: function () {

    },
    methods: {
        // 设置密码
        setPasssordSubmit() {
            const t = this;
            if (this.surePassword !== '' && this.password !== '' && this.surePassword !== this.password) {
                t.$createDialog({
                    type: 'alert',
                    title:t.$t('common').findPassword,
                    content: t.$t('toastTxt').passwordNoSame,
                }).show()
                this.surePassword = '';
                return false;
            }
            const params = {
                username: this.username,//this.username
                password: this.password,
                smscode: this.smscode
            }

            let toastTxt = '';

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
            if (toastTxt !== '') {
                t.$createDialog({
                    type: 'alert',
                    title: t.$t('common').setLoginPasswordText,
                    content: toastTxt,
                }).show()
                return false;
            }
            request.findPassWord(params).then((res) => {
                const apiData = getDataFoxAxiosRequest(res, t, true);
                if (!!apiData === false) return;
                const { status = '', message = '' } = apiData;
                let toastTxt = ''
                if (status == 1) {
                    toastTxt = message ? message : t.$t('toastTxt').setLoginPasswordSuccess;
                    // 登录成功后跳转页面
                    setTimeout(() => {
                        t.$router.replace({ name: 'login', query: { loginAfterTo: '/index' } })
                    }, 800)
                } else {
                    toastTxt = message ? message : t.$t('toastTxt').setLoginPasswordFail
                }
                t.$createDialog({
                    type: 'alert',
                    title: t.$t('common').setLoginPasswordText,
                    content: toastTxt,
                }).show();


            }).catch(e => commonError(e, t))
        },
    },
    // 
    created: function () {
        this.smscode = this.$route.query.inputSmscode;
        this.username = this.$route.query.username
    },
    i18n
}
</script>

<style lang="scss">
@import "@public/css/warningGlobal.scss";
.custom-input .custom-input-set-password {
    width: 2rem !important;
}
</style>
