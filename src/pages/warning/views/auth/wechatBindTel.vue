<template>
    <div class="wechat-login-box">
        <!-- 头部 -->
        <div class="wechat-login-box-head">
            <div v-show="stepPage==1">
                <div class="login-title ">
                    <div class="login-title-left login-title-item"></div>
                    <div class="login-title-main login-title-item">登录注册</div>
                    <div class="login-title-right login-title-item"><i
                            class="cubeic-close"
                            @click="closeLoginBox"
                        ></i></div>
                </div>
                <div class="login-description">手机号快捷登录后，可使用智能盯盘服务</div>
            </div>
            <!-- 输入验证码 -->
            <div v-show="stepPage==2">
                <div class="login-title">
                    <div
                        class="login-title-left login-title-item"
                        @click="backStep(1)"
                    ><i class="cubeic-back"></i></div>
                    <div class="login-title-main login-title-item">输入验证码</div>
                    <div class="login-title-right login-title-item"><i
                            class="cubeic-close"
                            @click="closeLoginBox"
                        ></i></div>
                </div>
                <div class="login-description">验证码已发送至手机号码 {{telNumber}}</div>
            </div>
        </div>
        <!-- =================弹框主要内容 ===============-->
        <!-- 登录-获取手机验证码 -->
        <div
            v-show="stepPage==1"
            class="wechat-login-box-body"
        >
            <!-- 手机号输入框 -->
            <div
                class="form-row-box"
                :class="{'error-form-row':isError}"
            >
                <div class="login-input form-row">
                    <div class="login-input-left form-row-icon-box"><img
                            class="form-row-icon"
                            src="static/img/warning/form_icon_mobile@2x.png"
                        /></div>
                    <div class="login-input-right  form-row-right"><input
                            type="text"
                            class="form-row-input"
                            placeholder="请输入手机号"
                            v-model="telNumber"
                        /></div>
                    <div
                        class="form-row-clear"
                        @click="clearTelNumber"
                    ><img
                            src="static/img/warning/input_icon_delete@2x.png"
                            class="form-row-clear-img"
                        /></div>
                </div>
                <div class="form-error-tip">请输入正确的手机号码</div>
            </div>

            <!-- 验证码输入框 -->
            <div
                class="login-input form-row"
                v-if="vlidateCodeVisible"
            >
                <div class="login-input-left form-row-icon-box"><img
                        class="form-row-icon"
                        src="static/img/warning/form_icon_identifying_code@2x.png"
                    /></div>
                <div class="login-input-right  form-row-right"><input
                        type="text"
                        class="form-row-input"
                        v-model="validateCode"
                        placeholder="请输入验证码"
                    /></div>
                <!-- <div class="validate-code"><img :src="validateImgUrl"/></div> -->
                <img
                    :src="validateImgUrl"
                    class="img-validate"
                    @click="getImageCode"
                />
            </div>
            <button
                class="common-button-style01 common-button-radius-40 get-validate-code"
                :class="{' button-disable':!judgeGetSmsButton}"
                @click="getMobilSMSCode"
            >获取验证码</button>
            <div class="wechat-login-bottom">继续表示已阅读并同意<span
                    class="blue-link"
                    @click="showUserProtol"
                >《用户服务协议》</span></div>
        </div>
        <!-- 用户协议 -->
        <!-- <div
                v-show="stepPage==2"
                class="user-protocol wechat-login-box-body" style="height:60vh;overflow:hidden"
            >

              
            </div> -->
        <!-- 输入手机验证码 -->
        <div
            v-show="stepPage==2"
            class="wechat-login-box-body"
        >
            <div class="tel-sms-input-box">
                <input
                    type="text"
                    class="tel-sms-input"
                    ref='teSmsInput'
                    v-model="teSmsInput"
                    maxlength="6"
                />
                <ul class="tel-sms-input-number">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
            <div
                v-if="oneMinute==0"
                class="get-rest"
                @click="getMobilSMSCode"
            >重新获取</div>
            <div
                v-else
                class="get-rest rest-get-sms"
                @click="getSmsAagin"
            >{{oneMinute}}s后重新获取</div>
        </div>
        <!-- 脚部 -->
        <!-- <div
                class="login-box-footer"
                v-show="stepPage==2"
            >
                <div @click="backStep(1)">知道了</div>
            </div> -->

    </div>

</template>
<script>
// regExp.numberInputValidate.test(t.warningPriceInput)
const globalConsts = require('@public/js/consts.js')
const configConsts = require('@config/consts.js')
import i18n from '@warning/i18n'
import { commonError, saveInfoToSessionStorage, getInfoFromSessionStorage, getPlatformCode, saveInfoToStorage, iConsole, initPage } from '@public/js/util.js'
import request from '@services/documentary.js'
// import { setInterval } from 'timers';
const regExp = require('@public/js/regular.js');
// 时间
const timeAmount = 60;
export default {
    props: {
        show: {
            type: Boolean,
            required: false,
            default: true
        },
        // refreshPage: {
        //     type: String,
        //     required: true,
        //     default: '1'
        // }
    },
    data() {
        return {
            //验证码输入
            vlidateCodeVisible: false,
            // 手机号码错误输入统计
            telInputErrorCount: 0,
            oneMinute: timeAmount,
            popupVisible: false,
            telNumber: '',
            validateImgUrl: '',
            isError: false,
            validateCode: '',
            isValidateButton: false,
            uuid: '',
            // 验证码发送是否成功
            smsSendSuccess: true,
            // 短信验证码输入
            teSmsInput: '',
            stepPage: 1,//1 输入手机图形码 、2输入验证码
            timer: '',
        }
    },
    destroyed() {
        this.clearTimer()
    },
    mounted() {

    },
    methods: {
        showUserProtol() {
            // this.stepPage = 2
            this.$router.push('/userProtocol')
        },
        clearTimer() {
            const t = this;
            if (t.timer != '') {
                clearInterval(t.timer._id);
                this.timer = '';
            }
        },
        timeCount() {
            const t = this;
            if (t.timer != '') {
                t.clearTimer();
            }
            if (t.timer == '') {
                t.oneMinute = timeAmount;
                this.timer = setInterval(function () {
                    t.$nextTick(function () {
                        this.oneMinute = this.oneMinute - 1;
                    })
                }, 1000)
            }
        },
        resetLoginInput() {
            this.vlidateCodeVisible = false;
            this.oneMinute = timeAmount;
            this.popupVisible = false;
            this.telNumber = '';
            // this.validateImgUrl = '';
            this.isError = false;
            this.validateCode = '';
            this.isValidateButton = false;
            this.uuid = '';
            // 验证码发送是否成功
            this.smsSendSuccess = true;
            // 短信验证码输入
            this.teSmsInput = '';
            this.stepPage = 1;//1 输入手机图形码 、2用户服务协议、3输入验证码
            this.timer = '';
            this.clearTimer();
        },
        closeLoginBox() {
            this.$refs.wechatLogin.hide();
            this.resetLoginInput();
            this.$emit('close');
        },
        backStep(currentPage) {
            if (currentPage == 1) {
                this.currentPage = 1;
                this.validateCode = '',
                    this.telInputErrorCount = this.telInputErrorCount + 1;
                this.clearTimer();
                this.resetLoginInput();
                this.getImageCode();
                this.vlidateCodeVisible = true;
            }
            this.stepPage = currentPage
        },
        clearTelNumber() {
            this.telNumber = '';
            this.isError = false
        },
        // 保存登录注册后的响应信息
        saveUserInfo(objdata) {
            saveInfoToStorage({
                data: objdata,
                key: globalConsts.userInfoKeyNameInStore,
                method: 'modify',
            })
        },
        wechatRegisterRequest() {
            const { refreshPage = 1 } = this.$route.params
            const t = this;
            const userInfo = getInfoFromSessionStorage(globalConsts.userInfoKeyNameInStore);
            let _openid = '';
            if (!!userInfo) {
                let { openid = '' } = userInfo;
                _openid = openid
            }
            if (_openid == '') {
                iConsole('openid不能为空')
                return false;
            }
            const params = {
                phone: this.telNumber,
                code: this.teSmsInput,
                openid: _openid,
                uuid: t.vlidateCodeVisible ? this.uuid : '0'
            }
            request.wechatRegister(params).then((res) => {
                const { data: resData } = res;
                const { status = '', data: mainData, msg = '' } = resData;
                if (status == globalConsts.resStatus.success) {
                    const { token = '', phone_bind = '', phone = '', userid = '', account = '', alias = '', ...rest } = mainData
                    t.closeLoginBox()
                    t.$createToast({
                        type: 'correct',
                        txt: '登录成功',
                        mask: true
                    }).show();
                    t.saveUserInfo({
                        phone,
                        [globalConsts.wechatStorageKeys.bind_phone]: phone_bind,
                        token,
                        userid,
                        account,
                        alias,
                        ...rest
                    })
                    t.clearTimer();
                    // initPage(t.$router, { goPage: refreshPage })
                    // // t.$forceUpdate()
                    // // window.location.reload()

                } else {
                    iConsole('resData=' + JSON.stringify(resData))
                    t.$createToast({
                        txt: msg != '' ? msg : t.$t('wechatLogin.bindFail'),
                        type: 'warn'
                    }).show()
                }
            }).catch(e => commonError(e, t))
        },
        // 获取图片验证码
        getImageCode() {
            const ss = new Date().getTime();
            this.uuid = ss;
            let urlPrex = '';
            if (globalConsts.NODE_ENV == configConsts.prodNodeEvn) {
                urlPrex = configConsts.iaiTradeProdUrl
            } else {
                urlPrex = configConsts.iaiTradeUatUrl
            }
            this.validateImgUrl = `${urlPrex}/iai_trader/base/image_code/${ss}/`
        },
        getSmsAagin() {
            this.$createToast({
                txt: '验证码已发送，请重新查收',
                type: 'correct'
            }).show();
        },
        // 发送短信验证码
        getMobilSMSCode() {
            const t = this;
            if (!this.judgeGetSmsButton) {
                return false
            }
            if (!(regExp.phoneNumber.test(`${this.telNumber}`))) {
                // t.$createToast({
                //     txt: '请输入正确的手机号',
                //     type: 'warn'
                // }).show();
                this.isError = true;
                return false;
            }
            const params = {
                phone: this.telNumber,
                image_code_id: this.vlidateCodeVisible ? this.uuid : '0',
                image_code: this.validateCode == '' ? '0' : this.validateCode,
            }
            // t.stepPage = 2;
            //  t.getImageCode()
            request.getMobilSMSCode(params).then((res) => {
                const { data: resData, status: resStatu = '' } = res;
                const { status = '', data: mainData, msg = '' } = resData;
                if (status == globalConsts.resStatus.success) {
                    t.stepPage = 2;
                    if (t.stepPage == 2) {
                        t.timeCount();
                    }
                } else {
                    t.$createToast({
                        txt: msg != '' ? msg : t.$t('wechatLogin.smsSendFail'),
                        type: 'warn'
                    }).show();
                    t.getImageCode()
                }
            })
        }
    },
    computed: {
        judgeGetSmsButton() {
            if (this.vlidateCodeVisible) {
                return !this.isError && this.telNumber != '' && this.validateCode != ''
            } else {
                return !this.isError && this.telNumber != ''
            }

        }
    },
    created() {
        this.getImageCode();
    },
    watch: {
        telInputErrorCount(newval, oldval) {
            if (newval >= 2) {
                this.vlidateCodeVisible = true;
            }
        },
        oneMinute(newval, oldval) {
            console.log(newval)
            if (Number(newval) <= 0) {
                this.clearTimer()
            }
        },
        stepPage(newval, oldval) {
            if (newval == 2) {
                this.timeCount()
            }
        },
        // 验证数字和长度不能大于手机长度
        telNumber(newval, oldval) {
            if (this.isError) {
                this.isError = false;
            }
            if (newval.slice(-1) != '.' && newval.length <= 11) {
                if (!isNaN(newval)) {
                    this.telNumber = newval
                } else {
                    this.telNumber = oldval
                }
            } else {
                this.telNumber = oldval
            }
        },
        teSmsInput(newval, oldval) {
            const t = this;
            if (newval.length >= 6) {
                setTimeout(() => {
                    t.wechatRegisterRequest()
                }, 300)
            }
        }
    },
    i18n
}
</script>
<style lang="scss" scoped>
@import "@public/css/warningGlobal.scss";
.wechat-login-box-head {
    padding: 0 0.28rem;
}
.login-box-footer {
    font-size: 0.36rem;
    font-weight: 800;
    color: rgba(76, 148, 255, 1);
    line-height: 0.88rem;
    border-top: 1px solid $commonFsColorDarkGray;
    text-align: center;
    height: 0.88rem;
}
.login-title-left {
    text-align: left;
    flex: 1;
    font-weight: normal;
}
.login-title-right {
    text-align: right;
    flex: 1;
    font-weight: normal;
}
.login-title-main {
    text-align: center;
    flex: 2;
    color: #fff;
    font-size: 0.52rem;
    margin-bottom: 0.18rem;
    text-align: center;
    margin-top: 0.82rem;
}
.get-rest {
    color: #4c94ff;
    margin-top: 0.6rem;
    text-align: center;
}
.tel-sms-input-box {
    overflow: hidden;
    margin-top: 0.36rem;
}
.user-protocol {
    font-size: $commonFsSmall;
    color: rgba(139, 142, 153, 1);
    line-height: 0.36rem;
}
.tel-sms-input-number {
    display: flex;
    li {
        flex: 1;
        margin: 0 3px;
        height: 2px;
        background: #626273;
        justify-content: space-between;
    }
}
.tel-sms-input {
    width: 99%;
    background: none;
    color: #fff;
    font-size: 0.72rem;
    text-align: left;
    background: none;
    letter-spacing: 0.35rem;
    // padding-left:0.2rem;
    box-sizing: border-box;
    overflow: hidden;
    margin-left: 0.2rem;
}
.validate-code {
    width: 1.2rem;
    height: 0.53rem;
    background: #515161;
    color: $commonBackgroundDark;
    border-radius: 0.04rem;
    line-height: 0.53rem;
    // padding: 0 0.1rem;
    img {
        width: 100%;
    }
}
.img-validate {
    width: 1.8rem;
}
.form-row-clear {
    width: 0.44rem;
    height: 0.44rem;
}
.form-row-clear-img {
    width: 0.44rem;
    height: 0.44rem;
}
.button-disable {
    background-color: #565666;
    opacity: 1;
    color: #333;
    -webkit-appearance: none;
    &:active {
        background: #565666 !important;
        opacity: 1 !important;
    }
}
.blue-link {
    color: $commonColorBlur;
}
.wechat-login-bottom {
    margin-top: 0.42rem;
    font-size: $commonFsSmall;
    color: $commonFsColorGray;
    text-align: center;
}
.form-row {
    border-bottom: 1px solid #ccc;
    display: flex;
    height: 1rem;
    margin-top: 0.18rem;
    align-items: center;
    border-bottom: 1px solid $commonBorderColor;
    overflow: hidden;
    .form-row-icon-box {
        .form-row-icon {
            width: 0.44rem;
            height: 0.44rem;
        }
    }
    .form-row-right {
        flex: 1;
        // margin-left: 3px;
        width: 100%;
    }
    .form-row-input {
        background: none;
        height: 0.5rem;
        color: #fff;
        width: 100%;
        padding: 0 3px;
        box-sizing: border-box;
    }
}
.get-validate-code {
    margin-top: 0.44rem;
}
.wechat-login-box {
    min-height: 4.88rem;
    max-width: 500px;
    box-sizing: border-box;
    background: $commonBackgroundDark;
    border-radius: 14px;
    .login-title {
        font-size: $commonFsTitleMedium;
        font-weight: 800;
        color: #fff;
        line-height: 36px;
        text-align: center;
        padding-top: 0.32rem;
        // padding-bottom: 0.32rem;
        display: flex;
        justify-content: center;
    }
    .login-description {
        // font-size: $commonFsSmall;
        // color: $commonFsColorGray;
        // text-align: center;
        color: rgba(235, 235, 245, 0.6);
        font-size: $commonFsMedium;
        line-height: 0.42rem;
        text-align: center
    }
}
.wechat-login-box-body {
    padding: 1rem 0.6rem 0.42rem 0.6rem;
}
.form-error-tip {
    font-weight: 400;
    color: rgba(221, 74, 74, 1);
    line-height: 0.36rem;
    height: 0.36rem;
    font-size: $commonFsSmall;
    display: none;
}
.error-form-row {
    .form-row {
        border-bottom: 1px solid $commonFsColorRed2;
    }
    .form-error-tip {
        display: block;
    }
}
.rest-get-sms {
    font-size: 0.28rem;
    font-family: PingFangSC;
    font-weight: 400;
    color: rgba(139, 142, 153, 1);
    line-height: 0.42rem;
}
</style>