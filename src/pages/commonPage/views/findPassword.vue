<template>
    <!-- 注册 -->
    <MainLayout
        :title="$route.meta.title"
        :isShowHeader="true"
        :isLayoutBodyFlex="true"
        class="common-layout-back"
        :headerStyle="$config.headerStyle"
        :isShowBackWord="true"
        :backBtnTxt="$t('common').loginLable"
    >
        <div
            slot="page-body"
            class="find-password common-body-space-top"
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
                                            :placeholder="$t('common').pleadeInputVlidateCode"
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
                        <div class="find-password-bottom-text">{{$t('findPassword_page').findPasswordDiscribe}}<div
                                class="concat-administrator"
                                @click="concatAdmin"
                            >{{$t('findPassword_page').concatAdmin}}</div>
                        </div>
                    </div>
                    <div class="common-layout-bottom">
                        <!-- 确定按钮 -->
                        <cube-button
                            :primary="true"
                            class="common-primary-btn register-button"
                            @click="findPassWordNext"
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
        ...mapState('findPassword', ['username', 'smscode']),
    },
    mounted: function () {
        this.inputSmscode = this.smscode;
        this.inputUsername = this.username;
    },
    methods: {
        // 打开联系管理员QQ
        concatAdmin() {
            window.location.href = "tencent://message/?uin=2825333818&Site=https://01wap/&Menu=yes";
        },
        // 将信息保存到vuex
        saveInfoToVuex() {
            this.$store.commit("findPassword/updateState", [
                { field: 'username', value: this.inputUsername },
                { field: 'smscode', value: this.inputSmscode },
            ])
        },
        // 提交找回密码
        findPassWordNext() {
            const params = {
                username: this.inputUsername,
                smscode: this.inputSmscode
            }
            let toastTxt = '';
            const t = this;
            // 验证输入
            if (this.inputUsername === '') {
                toastTxt = t.$t('toastTxt').telNumberCantEmpty
            }
            if (this.inputSmscode === '') {
                toastTxt = t.$t('toastTxt').messageValidateCantEmpty
            }
            if (this.inputUsername !== '' && !regExp.phoneNumber.test(this.inputUsername)) {
                toastTxt = t.$t('toastTxt').inputCorrectTelNumber
            }
            if (toastTxt !== '') {
                t.$createDialog({
                    type: 'alert',
                    title: t.$t('common').findPassword,
                    content: toastTxt,
                }).show()
                return fasle
            }
            this.saveInfoToVuex();
            this.$router.push('/setNewPassword')

        },
        // 发送短信验证码
        onSendMessage() {
            let toastTxt = ''
            const t = this;
            // 验证输入
            if (t.inputUsername === '') {
                toastTxt = t.$t('toastTxt').telNumberCantEmpty
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
                usage: 'password'
            }
            request.sendMessage(params).then((res) => {
                const apiData = getDataFoxAxiosRequest(res, this);
                if (!apiData) return false;
                const { data: { code = '' }, status = '', message = '' } = apiData;
                if (status == 1 && code != '') {
                    t.$createDialog({
                        type: 'alert',
                        title: t.$t('common').sendVlidateCode,
                        content: message ? message : t.$t('common').sendValidateSuccess,
                    }).show()
                }
            }).catch(e => commonError(e, t))
        }
    },
    watch: {
        inputUsername: function (newValue = '', oldValue = '') {
            if (!newValue) return;
            if (newValue !== '' && !regExp.number.test(Number(newValue))) {
                this.inputUsername = newValue.slice(0, -1);
            } else {
                if (newValue.length > 11) {
                    this.inputUsername = oldValue
                }
            }
        },
        inputSmscode: function (newValue, oldValue) {
            if (!newValue) return;
            if (newValue.length > 6) {
                this.inputSmscode = oldValue
            }
        },

    },
    i18n
}
</script>

<style lang="scss">
@import "@public/css/mobileGlobal.scss";
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
        top: 0;
        color: $commonColorBlur;
        height: $commonInputHeight;
        line-height: $commonInputHeight;
    }
    .concat-administrator {
        @include button(1.9rem, 0.72rem, $commonRadius);
        border: 1px solid #ccc;
        color: $commonFsColorGray;
        position: absolute;
        text-align: right;
        right: 0;
        top: 3px;
        font-size: $commonFsMedium;
        background: urlPrefix("static/img/commonPage/QQ@2x.png") 8px center
            no-repeat;
        background-size: 0.32rem 0.32rem;
        border-color: $commonFsColorGray;
    }
    .find-password-bottom-text {
        position: relative;
        padding-right: 2.22rem;
        font-size: $commonFsMedium;
        color: $commonFsColorGray;
        line-height: 0.42rem;
        margin-top: 0.8rem;
        vertical-align: top;
    }
}
</style>
