<template>
    <div>
        <MainLayout
            title=""
            :headerStyle="$config.headerStyle"
            class="common-layout-back we-chat-page"
            :isShowBackWord="false"
        >
            <div slot="header-left">
                <i
                    class="cubeic-close header-close-btn"
                    style="font-size:0.5rem;color:#5291FF"
                    @click="goBack"
                ></i>
            </div>
            <div
                slot="page-body"
                class="we-chat-body"
            >

                <div class="page-title">
                    <h1 class="we-chat-title">开通微信通知</h1>
                    <div>更及时接收<span>盯盘“最佳买卖点”通知</span>，<br />将提升<span>50%</span>以上获利概率！</div>
                </div>
                <SideSpace>
                    <div
                        slot='content'
                        class="we-chat-container"
                    >
                        <p class="notice-sub-txt">开通后，<br />您还可以第一时间获取盯盘攻略玩法，解锁隐藏高级玩法。</p>
                        <div class="open-setps-title">开通步骤</div>

                        <h1 class="wechat-title wechat-title-02">
                            <span>1</span>复制个人“微信盯盘绑定码”
                        </h1>
                        <div class="wechat-qrcode-box">
                            <input
                                type="text"
                                class="qrcode-num"
                                v-model="wechatCode"
                                ref="wechatCodeRef"
                                readonly
                            />
                            <button
                                class="wechat-button wechat-qrcode-button"
                                @click="authHandle"
                                v-if="!isAuth"
                            >点击授权</button>
                            <button
                                v-else
                                @click="wechatBindCodeCopy"
                                ref="wechatBindCode"
                                class="wechat-button"
                                :data-clipboard-text="wechatCode"
                            >点击复制绑定码</button>

                        </div>
                          <h1 class="wechat-title wechat-title-02">
                            <span>2</span>将“服务号二维码”手机截图，通过微信扫码关注服务号
                        </h1>
                        <!--  -->
                        <div class="wechat-qrcode-box">
                            <p class="wechat-qrcode-title">{{wechatServiceName}}</p>
                            <div class="wechat-qrcode">
                                <img
                                    :src="`static/img/warning/wechat_qrcode_01.jpg`"
                                    class="wechat-qrcode-pic"
                                    ref="wechatImage"
                                    v-if="getWechatName=='01' || getWechatName=='01pmgold'"
                                />
                                <img
                                    :src="`static/img/warning/wechat_qrcode_02.jpg`"
                                    class="wechat-qrcode-pic"
                                    ref="wechatImage"
                                    v-if="getWechatName=='02'"
                                />
                                <img
                                    :src="`static/img/warning/wechat_qrcode_03.jpg`"
                                    class="wechat-qrcode-pic"
                                    ref="wechatImage"
                                    v-if="getWechatName=='03'"
                                />
                            </div>
                            <br />
                            <!-- <button
                                @click="wechatNameCopy"
                                class="wechat-button"
                                ref="wechatName"
                                :data-clipboard-text="wechatServiceName"
                            >点击复制服务号</button> -->
                        </div>
                        <h1 class="wechat-title wechat-title-02">
                            <span>3</span>打开微信扫一扫，点击右上角「相册」选择服务号二维码后关注服务号。
                            <p>在服务号中，粘贴发送「绑定码」，即可开通微信通知服务。</p>
                        </h1>
                        <div class="common-center">
                            <img
                                src="static/img/warning/wechat_alert_illus1@2x.png"
                                class="wechat-example-pic"
                            />
                            <!-- <button class="wechat-button">打开微信</button> -->
                        </div>
                    </div>
                    <canvas id="myCanvas"></canvas>
                </SideSpace>
            </div>
        </MainLayout>
        <!-- 登录pop -->
        <AuthPop
            :isShow="loginPopVisible"
            @cancle="AuthPopcancleHandle"
        />
        <!-- 授权pop -->
        <div v-if="isAuthPopupVisible">
            <LoginPop
                :isShow="true"
                :isAuth="true"
                @authSuccess="authSuccessHandle"
            />
        </div>
    </div>
</template>
<script>
import { getWarningConditionForSelectOptions } from '../mapConfig.js'
import request from '@services/documentary.js'
import i18n from '@warning/i18n';
import { commonError, getDataFoxAxiosRequest, getPlatformCode, isIos } from '@public/js/util.js'
import Clipboard from 'clipboard'
const globalConsts = require('@public/js/consts.js')
export default {
    components: {
    },
    data() {
        return {
            wechatServiceName: '',
            wechatNumber: 'fxdingpan',
            loginPopVisible: false,
            wechatCode: '绑定码授权后可见',
            // 是否授权
            isAuth: true,
            isAuthPopupVisible: false,
            platformName: '',
            isIos: false,
            wechatNameClip: '',
            wechatBindCodeClip: '',
            clipInstance: '',
        }
    },
    updated() {
        const t = this;
        // if (this.wechatNameClip == '') {
        //     this.wechatNameClip = new Clipboard(this.$refs.wechatName, {
        //         text: function () {
        //             return t.wechatServiceName;
        //         }
        //     });
        // }
        if (this.wechatBindCodeClip == '') {
            this.wechatBindCodeClip = new Clipboard(this.$refs.wechatBindCode, {
                text: function () {
                    return t.wechatCode;
                }
            });
        }
    },
    methods: {
        wechatNameCopy() {
            const t = this;
            this.wechatNameClip.on('success', function (e) {
                t.copyToast('微信号已复制')
            });

        },
        wechatBindCodeCopy() {
            debugger
            const t = this;
            this.wechatBindCodeClip.on('success', function (e) {
                t.copyToast('绑定码已复制')
            });

        },
        //复制微信号
        // copyWechatNumber() {
        //     window.getSelection().removeAllRanges();//这段代码必须放在前面否则无效
        //     var Url2 = this.$refs.wechatNumberRef
        //     Url2.select(); // 选择对象
        //     document.execCommand("Copy"); // 执行浏览器复制命令
        //     this.copyToast('微信号已复制')
        // },
        //复制绑定码
        // copyBindNumber() {
        //     if (this.isAuth) {
        //         var Url2 = this.$refs.wechatCodeRef
        //         Url2.select(); // 选择对象
        //         document.execCommand("Copy"); // 执行浏览器复制命令
        //         this.copyToast('绑定码已复制')
        //     }
        // },
        copyToast(cont = '') {
            this.$createToast({
                txt: cont,
                type: 'correct'
            }).show()
        },
        goBack() {
            history.back()
        },
        // 复制绑定码
        copyQrCode() {
            window.getSelection().removeAllRanges();//这段代码必须放在前面否则无效
            if (this.isAuth) {
                var Url2 = this.$refs.wechatCodeRef
                Url2.select(); // 选择对象
                document.execCommand("Copy"); // 执行浏览器复制命令
                this.copyToast('绑定码已复制')
            }
        },
        authHandle() {
            // 已登录
            if (this.isAuthed()) {
                // 没授权
                if (!this.isAuth) {
                    this.isAuthPopupVisible = true;
                }
                // 未登录
            } else {
                this.loginPopVisible = true
            }
        },
        // 调转登录
        goToLogin() {
            this.$router.push({ name: 'login', query: { loginAfterTo: 'index' } })
        },
        // 是否登录
        isAuthed() {
            //app 未登录
            if (this.$config.userFromType() == 'app') {
                console.log('是否登录' + this.$config.isLogined())
                if (this.$config.isLogined()) {
                    return true;
                } else {
                    return false
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
        AuthPopcancleHandle() {
            this.loginPopVisible = false;
        },
        // 获取用户信息
        getUserInfo() {
            const t = this;
            request.getUserInfo().then((res) => {
                debugger
                const resData = getDataFoxAxiosRequest(res, this, true);
                const { data = '', status } = resData
                if (status == globalConsts.resStatus.noLogin || status == globalConsts.resStatus.guest) {
                    console.log('用户信息接口没授权')
                    t.isAuth = false
                }
                if (!!data) {
                    const { code = '' } = data;
                    if (!!code) {
                        t.wechatCode = code
                    }
                }
            }).catch(e => {
                commonError(e, this)
            })
        },
        // 授权成功后回调
        authSuccessHandle() {
            this.getUserInfo();
            this.isAuth = true;
        }
    },
    created: function () {
        this.getUserInfo();
        const platform = getPlatformCode();
        this.platformName = platform;
        if (isIos()) {
            this.isIos = true
        }
    },

    computed: {
        getWechatCode() {
            return this.code !== '' ? true : false
        },
        // 根据业务返回微信名
        getWechatName() {
            let wechatName = '01';
            let wechatServiceName = 'IAITrade盯盘助手'
            switch (this.platformName) {
                case globalConsts.platformNames.pm: {
                    wechatName = '01';
                    wechatServiceName = 'IAITrade盯盘助手';
                    break;
                }
                case globalConsts.platformNames.pmglod: {
                    wechatName = '01pmgold';
                    wechatServiceName = 'IAITrade盯盘助手';
                    break;
                }
                case globalConsts.platformNames.fx: {
                    wechatName = '02';
                    wechatServiceName = 'IAITrade自动盯盘';
                    break;
                }
                case globalConsts.platformNames.se: {
                    wechatServiceName = 'IAITrade盯盘';
                    wechatName = '03';
                    break;
                }
            }
            this.wechatServiceName = wechatServiceName
            return wechatName
        },
    },
    i18n
}
</script>

<style scoped lang="scss">
@import "@public/css/warningGlobal.scss";
.input-line {
    display: inline;
    background: none;
    width: 2.74rem;
    text-align: center;
    color: #fff;
}
.wechat-copy-tip {
    color: $commonFsColorGray;
    font-size: 0.24rem;
    margin-top: 0.28rem;
    // opacity: 0.6
}
.wechat-button {
    width: 3.2rem;
    height: 0.72rem;
    background: rgba(51, 133, 255, 1);
    border-radius: 0.4rem;
    text-align: center;
    line-height: 0.72rem;
    color: #fff;
    margin: 0 auto;
    border: none;
    font-size:0.28rem;
    &:active {
        opacity: 0.9;
    }
}
.wechat-qrcode-button {
    margin-top: 0.29rem;
}
.wechat-qrcode-title {
    color: #8b8e99;
    text-align: center;
    font-size: 0.24rem;
    padding-bottom: 0.36rem;
}
.page-title {
    font-size: 0.35rem;
    line-height: 0.62rem;
    color: #fff;
    text-align: center;
    background: urlPrefix("static/img/warning/wechat_alert_bg_chart@2x.png")
        no-repeat;
    height:2.8rem;
    background-size: 100%;
    // display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.44rem;
    .we-chat-title {
        color: #fff;
        font-size: 0.44rem;
        text-align: center;
        margin-bottom:0.32rem;
    }
    span {
        color: #ffbf00;
    }
}
.notice-sub-txt {
    font-size: 0.24rem;
    font-weight: 400;
    color: rgba(182, 185, 197, 1);
    line-height: 0.42rem;
    text-align: center;
}
.open-setps-title {
    font-size: 0.4rem;
    font-weight: 800;
    line-height: 0.49rem;
    color: #fff;
    text-align: center;
    margin-top: 0.9rem;
    &:after,
    &:before {
        content: "";
        display: inline-block;
        width: 1rem;
        height: 0.04rem;
        background: #676776;
        // margin-bottom:0.1rem;
        vertical-align: middle;
    }
    &:after {
        margin-left: 0.08rem;
    }
    &::before {
        margin-right: 0.08rem;
    }
}
.wechat-title {
    color: #fff;
    line-height: 0.49rem;
    margin-top: 0.52rem;
    span {
        display: inline-block;
        width: 0.39rem;
        height: 0.39rem;
        border-radius: 0.39rem;
        background: $commonColorBlur;
        color: #fff;
        text-align: center;
        line-height: 0.41rem;
        margin-right: 0.08rem;
        vertical-align: middle;
        font-size: 0.25rem;
    }
    p {
        margin: 0.4rem 0;
    }
}
.wechat-qrcode-box {
    width: 5rem;
    min-height: 2rem;
    background: rgba(61, 61, 77, 1);
    border-radius: 0.08rem;
    margin: 0.38rem auto 0;
    padding: 0.28rem;
    box-sizing: border-box;
    text-align: center;
    .wechat-qrcode {
        width: 3rem;
        min-height: 3rem;
        background: rgba(255, 255, 255, 1);
        border-radius: 0.04rem;
        margin: 0 auto;
    }
}
.qrcode-num {
    margin-bottom: 0.28rem;
    width: 4.2rem;
    height: 0.97rem;
    background: rgba(81, 81, 97, 1);
    border-radius: 0.06rem;
    color: #8b8e99;
    font-size: 0.4rem;
    text-align: center;
}
.wechat-title-02 {
    margin-top: 0.89rem;
}
.wechat-example-pic {
    width: 70%;
}
.wechat-search-pic {
    margin-top: 0.23rem;
    margin-bottom: 0.38rem;
    width: 5rem;
}
.we-chat-container {
    padding-bottom: 1.12rem;
}
.wechat-qrcode-pic {
    width: 100%;
    // height: 100%;
}
</style>



