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
                        <div class="common-input-box">
                            <div class="common-input-label common-input-label-width-3words">{{$t('common').telLable}}</div>
                            <div class="common-input-right">
                                <input
                                    type="text"
                                    class="common-input"
                                    :placeholder="$t('common').inputTel"
                                    v-model="inputUsername"
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
                                            :placeholder="$t('common').pleaseMessageVlidate"
                                            v-model="inputSmscode"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div
                                class="register-validate-btn"
                                @click="onSendMessage"
                            >{{$t('common').sendVlidateCode}}</div>
                        </div>
                        <div class="find-password-bottom-text">{{$t('common').messageVlidateSended}}
                        </div>
                    </div>
                    <div class="common-layout-bottom">
                        <!-- 确定按钮 -->
                        <cube-button
                            :primary="true"
                            class="common-primary-btn register-button"
                            @click="submitValidate"
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
const regExp = require('@public/js/regular.js')
import i18n from '@warning/i18n';
// import regExp from '@public/js/util.js'
export default {
    components: {

    },
    data() {
        return {
            // 验证码
            inputSmscode: '',
            // 手机号码
            inputUsername: '',
            PhoneNumber: '',
        }
    },
    computed: {
    },
    created: function () {
        this.inputUsername = this.$route.query.username ? this.$route.query.username : '';
    },
    mounted: function () {

    },
    methods: {
        // 将信息保存到vuex
        saveInfoToVuex() {
            this.$store.commit("findPassword/updateState", [
                { field: 'username', value: this.inputUsername },
                { field: 'smscode', value: this.inputSmscode },
            ])
        },
        // 提交验证
        submitValidate() {
            let toastTxt = '';
            const t = this;
            if (this.inputUsername === '') {
                toastTxt = t.$t('toastTxt').telNumberCantEmpty
            }
            if (this.inputSmscode === '') {
                toastTxt = t.$t('toastTxt').messageValidateCantEmpty
            }
            if (toastTxt !== '') {
                t.$createDialog({
                    type: 'alert',
                    title: t.$t('common').verifyIdentity,
                    content: toastTxt,
                }).show()
                return fasle
            }
            t.$router.push({
                name: 'setLoginPassword',
                query: {
                    ...t.$route.query,
                    inputSmscode: this.inputSmscode
                }
            })
        },
        // 发送短信验证码
        onSendMessage() {
            let toastTxt = ''
            const t = this;
            // 验证输入
            if (t.inputUsername === '') {
                toastTxt =  t.$t('toastTxt').telNumberCantEmpty
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
                username: this.inputUsername,
                usage: 'password'
            }
            request.sendMessage(params).then((res) => {
                const apiData = getDataFoxAxiosRequest(res, this, true);
                if (!apiData) return false;
                const { data: { code = '' }, status = '', message = '' } = apiData;
                if (status == 1 && code != '') {
                    t.$createToast({
                        type: 'correct',
                        time: 600,
                        txt: message ? message : t.$t('common').sendMessageVlidateSuccess
                    }).show()
                } else {
                    t.$createToast({
                        type: 'correct',
                        time: 1000,
                        txt: message ? message : t.$t('common').sendMessageVlidateFail
                    }).show()
                }

            }).catch(e => commonError(e, t))
        }
    },
    watch: {
        inputUsername: function (newValue, oldValue) {
            if (!regExp.number.test(Number(newValue))) {
                this.inputUsername = newValue.slice(0, -1);
            } else {
                if (newValue.length > 11) {
                    this.inputUsername = oldValue
                }
            }
        },
        inputSmscode: function (newValue, oldValue) {
            if (newValue.length > 6) {
                this.inputSmscode = oldValue
            }
        },

    },
    i18n
}
</script>

<style lang="scss">
@import "@public/css/warningGlobal.scss";
.find-password {
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
        top:0;
        height:$commonInputHeight;
        line-height: $commonInputHeight;
        color: $commonColorBlur;
    }
    .find-password-bottom-text {
        position: relative;
        font-size: $commonFsSmall;
        color: $commonFsColorGray;
        line-height: 0.36rem;
        margin-top: 0.2rem;
    }
}
</style>
