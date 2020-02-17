<template>
    <cube-popup
        type="my-popup"
        ref="authPopup"
        :mask="true"
        :visible="isShow"
    >
        <div class="authPopup-container">
            <div class="authPopup-top">
                <div class="authPopup-title">
                    {{$t('common').serviceAuth}}
                </div>
                <div class="authPopup-container-tip-text">{{$t('common').authPopupTipTxt}}</div>
                <div class="authPopup-btn-box">
                    <button
                        class="common-button-style01 common-button-radius-40 go-login-btn"
                        @click="goAppLoginHandle"
                    >{{$t('common').loginRealAccountLabel}}</button>
                </div>
                <div style="text-align:center">
                    <button
                        class="go-open-account common-text-botton"
                        @click="goAppOpenAccountHandle"
                    >{{$t('common').noRealAccountGoOpen}}</button>
                </div>
            </div>
            <div class="authPopup-bottom">
                <div
                    class="authPopup-cancle-btn"
                    @click="cancleBtnHandle"
                > {{$t('common').cancleLoginBtn}}</div>
            </div>
        </div>

    </cube-popup>
</template>

<script>
import { commonError, getDataFoxAxiosRequest, saveInfoToSessionStorage, getSymbolInfoById, getSymbolsBySort, goAppLogin, goAppRegister } from '@public/js/util.js'
import i18n from '@warning/i18n';
//goAppLogin
export default {
    props: {
        // 是否显示
        isShow: {
            type: Boolean,
            required: false,
            default: false
        },
    },
    methods: {
        goAppLoginHandle() {
            goAppLogin()
        },
        goAppOpenAccountHandle() {
            goAppRegister();
        },
        cancleBtnHandle() {
            // this.$refs.authPopup.hide()
            this.$emit('cancle')
        }
    },
    i18n
}
</script>
<style lang="scss" scoped>
@import "@public/css/mobileGlobal.scss";
.go-open-account {
    font-size: 0.3rem;
    margin: 0.4rem 0 0.4rem 0;
    text-align: center;
    color: #8b8e99;
}
.authPopup-btn-box {
    margin-top: 0.6rem;
}
.authPopup-cancle-btn {
    height: 0.88rem;
    line-height: 0.88rem;
    text-align: center;
    color: #8b8e99;
}
.authPopup-bottom {
    border-top: 2px solid $commonFsColorDarkGray;
}
.authPopup-container-tip-text {
    color: #8b8e99;
    font-size: 0.3rem;
    line-height: 0.45rem;
}
.register-btn {
    margin-top: 0.3rem;
}
.authPopup-title {
    color: #fff;
    text-align: center;
    height: 0.6rem;
    margin-top: 0.12rem;
}
.authPopup-top {
    padding: 0.42rem 0.6rem 0 0.6rem;
}
.authPopup-container {
    width: 6rem;
    // height: 4.69rem;
    background: rgba(46, 46, 59, 1);
    border-radius: 0.14rem;
    margin: 0 auto;
}
.go-login-btn {
    margin-top: 0.4rem;
}
</style>


