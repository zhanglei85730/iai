<template>
    <div>
        <MainLayout
            title=""
            :isShowHeader="!$config.isWechatPlatform && !$config.isIaiTraderApp"
            :headerStyle="{backgroundColor: '#292933'}"
            class="common-layout-back2 my-warning-layout"
            :isShowBackWord="false"
            :isScroll="true"
            :backBtnTxt="$route.query.backTitle"
            :flexSet="{center:6}"
            name='myWarning'
        >
            <div
                slot="page-body"
                class="price-warning-body page-body-background"
            >
                <div class="minePageClass">
                    <!-- !($config.isLogined()) ///////////////////////-->
                    <div
                        class="noneLoginBoxClass infoBoxClass"
                        v-if="(!($config.isLogined()) || authState==-1) && newUserFromType()==1 "
                        :style="{paddingTop:$config.isWechatPlatform?'16px':0}"
                       >
                        <img
                            class="noneLoginImage"
                            src="static/img/warning/icon_account_user@3x.png"
                        />
                        <!-- 点击登录 -->
                        <div
                            class="noneLoginBtn"
                            @click="toAllLogin"
                            v-if="!($config.isLogined())"
                        >{{$t('minePage.clickDlogin')}}</div>
                        <!-- 点击授权 -->
                        <div
                            v-if="$config.isLogined() && authState==-1"
                            class="noneLoginBtn"
                            @click="toClickAuth"
                        >{{$t('minePage.clickAuth')}}</div>
                    </div>
                    <div
                        class="infoBoxClass"
                        v-else
                        :style="{paddingTop:$config.isWechatPlatform?'16px':0}"
                    >
                        <!-- userInfo.headimgurl -->
                        <img
                            class="infoImage"
                            :src="getUserPhoto()"
                        />
                        <div class="infoDetail">
                            <div
                                class="info-name"
                                v-if="$config.isWechatPlatform"
                            >{{userInfo.nickname}}</div>
                            <div
                                class="info-name"
                                v-else
                            >{{userInfo.account}}</div>
                            <!-- <div class="info-sign">IAI-TRADE用户</div> -->
                        </div>
                    </div>
                    <div class="listBoxClass">
                        <!-- 切换平台 -->
                        <div
                            class="listcell"
                            v-if="$config.isWechatPlatform"
                            @click="showPlatformChange"
                        >
                            <!-- 切换平台 绑定手机后 -->
                            <div
                                class="listcell-main"
                                v-if="isWechatBinded"
                            >
                                <span class="rightMenuName">{{$t('minePage.changePlatform')}}</span>
                                <div class="listcell-main-right">
                                    <span class="listcell-main-right-txt">{{getPlatformSelectCnshort}}</span>
                                    <img
                                        src="static/img/warning/arrow@2x.png"
                                        class='select-row-arrow'
                                    />
                                </div>
                            </div>
                            <!-- 绑定平台 未绑定手机 -->
                            <div
                                class="listcell-main"
                                v-else
                            >
                                <span class="rightMenuName">{{$t('minePage.bindPlatform')}}</span>
                                <div class="listcell-main-right">
                                    <span class="listcell-main-right-txt">{{$t('minePage.rightText01')}}</span>
                                    <img
                                        src="static/img/warning/arrow@2x.png"
                                        class='select-row-arrow'
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            class="listcell"
                            v-if="($config.isLogined() && wechatEntryVisible)"
                            @click="linkTo('/weChatNotice')"
                        >
                            <div class="listcell-main">
                                <span class="rightMenuName">{{$t('minePage.openWechatNotice')}}</span>
                                <img
                                    src="static/img/warning/arrow@2x.png"
                                    class='select-row-arrow'
                                /></div>
                        </div>
                        <!-- 通知管理 -->
                        <div
                            class="listcell"
                            @click="toWarningNotice"
                        >
                            <div class="listcell-main">
                                <span class="rightMenuName">通知管理</span>
                                <div class="listcell-main-right">
                                    <span class="listcell-main-right-txt">
                                        APP及微信通知设置</span>
                                    <img
                                        src="static/img/warning/arrow@2x.png"
                                        class='select-row-arrow'
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            class="listcell"
                            @click="toSetting"
                        >
                            <div class="listcell-main">
                                <span class="rightMenuName">{{$t('minePage.versionIntroduce')}}</span>
                                <div class="listcell-main-right">
                                    <span class="listcell-main-right-txt">2.0</span>
                                    <img
                                        src="static/img/warning/arrow@2x.png"
                                        class='select-row-arrow'
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            class="listcell"
                            @click="linkTo('/feedback')"
                        >
                            <div class="listcell-main"><span class="rightMenuName">{{$t('minePage.feedback')}}</span>
                                <div class="listcell-main-right">
                                    <img
                                        src="static/img/warning/arrow@2x.png"
                                        class='select-row-arrow'
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            class="listcell"
                            @click="linkTo('/aboutUs')"
                        >
                            <div class="listcell-main">
                                <span class="rightMenuName">{{$t('minePage.aboutIaiTRade')}}</span>
                                <div class="listcell-main-right">
                                    <img
                                        src="static/img/warning/arrow@2x.png"
                                        class='select-row-arrow'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <pageFooter slot="page-footer" />
        </MainLayout>
        <!-- 授权开始 -->
        <div>
            <!-- 授权弹出层  isAuthStart-->
            <div v-if="isAuthStart">
                <LoginPop
                    class="warning-author-pop"
                    @authSuccessAfter="authSuccessAfterHandle"
                    :isShow="isAuthStart"
                    :isAuth="isAuthStart"
                    @hide="loginPopHideHandle"
                />
            </div>
            <!-- 为登录、游客弹出层 -->
            <AuthPop
                :isShow="loginPopVisible"
                @cancle="AuthPopcancleHandle"
            />
            <!-- 微信登录注册框 isWeChatLogin-->
            <WeChatLogin
                :show="isWeChatLogin"
                @close="weChatLoginClose"
                refreshPage="1"
            />
        </div>
        <!-- 授权end -->
        <!-- 切换平台popup -->
        <PlatformChangePlane
            :visible="platformPlaneVisible"
            @select="platformChange"
            :data="platformData"
            @queryAuth="bindTip"
            @set="showPlatformPlane"
            :selectIndex='getPlatformSelectIndex'
            @maskClick="maskClickHandle"
        />
    </div>
</template>
<script>
import PlatformChangePlane from '@warning/components/PlatformChangePlane/index.js'
import i18n from '@warning/i18n'
import PageFooter from '@warning/components/PageFooter'
import { getInfoFromSessionStorage, goAppLogin, getPlatformCode, isWechatPlatform, isWechatBind, cookieForFirstShowNotice, getAuthStatu,newUserFromType } from "@public/js/util.js";
import { create } from "domain";
import request from '@services/documentary.js'

import authMixin from '@warning/mixins/auth.js'
import platformChange from '@warning/mixins/platformChange.js'
const globalConsts = require('@public/js/consts.js')
// 授权end

export default {
    i18n,
    mixins: [authMixin, platformChange],
    data() {
        return {
            userInfo: {},
            // 微信没绑定绑定入口
            wechatEntryVisible: false,
            isWechatBinded: false,
            authState: -1
        };
    },
    components: {
        PageFooter,
        PlatformChangePlane
    },
    created() {
        const t = this;
        // console.log('this.$config.isLogined()=' + this.$config.isLogined())
        var user = getInfoFromSessionStorage();
        if (!!user) {
            this.userInfo = user
        }
        this.openWechatNotice()
        // 是否为微信且绑定
        if (isWechatPlatform() && isWechatBind()) {
            this.isWechatBinded = true;
            this.getPlatformListRequest()
        }
        this.authState = getAuthStatu()

    },
    mounted() {
        let that = this
        if (isWechatBind() && !isWechatPlatform()) {
            // 显示通知弹窗
            cookieForFirstShowNotice({
                cookieConfig: {
                    key: globalConsts.cookies.minePageNoticeKey,
                    version: 1
                },
                callback: function () {
                    that.$nextTick(function () {
                        that.$createDialog({
                            type: "confirm",
                            title: that.$t('minePage.noticeDialog.title'),
                            content:
                                that.$t('minePage.noticeDialog.content'),
                            confirmBtn: {
                                text: that.$t('minePage.noticeDialog.firmBtn'),
                                active: true,
                                disabled: false,
                                href: "javascript:;"
                            },
                            cancelBtn: {
                                text: that.$t('minePage.noticeDialog.cancleBtn'),
                                active: false,
                                disabled: false,
                                href: "javascript:;"
                            },
                            onConfirm: () => {
                                that.$router.push('/noticeManage')
                            },
                            onCancel: () => {
                                // item.isToLeft = false;
                                // this.$forceUpdate();
                            }
                        }).show();
                    });
                }
            });
        }
    },
    methods: {
        newUserFromType(){
          return newUserFromType()
        },
        toClickAuth() {
            this.authTrigger()
        },
        toWarningNotice() {
            if (!this.$config.isLogined() || getAuthStatu() == -1) {
                this.authTrigger()
            } else {
                this.$router.push('/noticeManage')
            }
        },
        wechatPubAuth() {
            let _userInfo = getInfoFromSessionStorage(globalConsts.userInfoKeyNameInStore)
            alert(JSON.stringify(_userInfo))
            if (!!_userInfo && _userInfo.hasOwnProperty('token')) {
                request.userInfoforWechat({ token: _userInfo.token }).then(({ data: resData }) => {
                    const { data = {} } = resData;
                })
            }
        },
        // 切换平台，未绑定手机显示登录注册（绑定手机）
        showPlatformChange() {
            if (!this.$config.isLogined()) {
                this.authTrigger()
            } else {
                this.showPlatformPlane()
            }
        },
        // 是否显示过微信绑定提示弹框，调用接口表示已显示过
        openWechatNotice() {
            const t = this;
            // 是否开通过微信
            //isWechatEntyShow  isOpenWechatNotice
            request.isWechatEntyShow().then(({ wx_show = '', wx_bind = '' }) => {
                // 未开通  wx_bind:1//1绑定 0未绑定///////////////////
                ///////////////////
                if (wx_bind == 0 && !isWechatPlatform()) {
                    t.wechatEntryVisible = true
                }
            }).catch(e => {
                commonError(e, this)
            })
        },
        linkTo(url = '', query = {}) {
            this.$router.push(url, query)
        },
        // 获取用户头像
        getUserPhoto() {
            try {
                if (this.userInfo.hasOwnProperty('headimgurl') && this.userInfo.headimgurl != '') {
                    return this.userInfo.headimgurl
                } else {
                    return this.$config.imagePathPrefix + 'icon_account_user@3x.png'
                }
            } catch (e) {
                return this.$config.imagePathPrefix + 'icon_account_user@3x.png'
            }
        },
        toLookAction() {
            this.$router.push({ name: "myWarning" });
        },
        toLogin() {
            this.$createDialog({
                type: "confirm",
                title: t.$t('minePage.dialog01.title'),
                content: t.$t('minePage.dialog01.content'),
                confirmBtn: {
                    text: t.$t('minePage.dialog01.firmBtn'),
                    active: true,
                    disabled: false,
                    href: "javascript:;"
                },
                cancelBtn: {
                    text: t.$t('minePage.dialog01.cancleBtn'),
                    active: false,
                    disabled: false,
                    href: "javascript:;"
                },
                onConfirm: () => {
                    console.log("sssssss");
                    // sessionStorage.removeItem("userInfo");
                    if (window.hasOwnProperty("removeUserInfo")) {
                        removeUserInfo.postMessage({});
                    }
                    if (window.hasOwnProperty("pushLoginPage")) {
                        pushLoginPage.postMessage({});
                    }
                },
                onCancel: () => { }
            }).show();
        },
        toSetNotification() {
            this.$createDialog(
                {
                    type: "confirm",
                    showClose: true,
                    title: t.$t('minePage.dialog02.title'),
                    // content: `   1.建议开启“系统和应用”通知权限`,
                    confirmBtn: {
                        text: t.$t('minePage.dialog02.firmBtn'),
                        active: true,
                        disabled: false,
                        href: "javascript:;"
                    },
                    cancelBtn: {
                        text: t.$t('minePage.dialog02.cancleBtn'),
                        active: true,
                        disabled: false,
                        href: "javascript:;"
                    },
                    onConfirm: () => {
                        //去原生应用设置界面
                        if (window.hasOwnProperty("toSetNotification")) {
                            toSetNotification.postMessage({});
                        }
                    },
                    onCancel: () => {
                        //测试推送
                        if (window.hasOwnProperty("toTestNotification")) {
                            toTestNotification.postMessage({});
                        }
                    }
                },
                createElement => {
                    return [
                        createElement(
                            "p",
                            { style: { "text-align": "center" }, slot: "content" },
                            t.$t('minePage.openSwitch.text01')
                        ),
                        createElement(
                            "p",
                            { style: { "text-align": "center" }, slot: "content" },
                            t.$t('minePage.openSwitch.text02')
                        ),
                        createElement(
                            "p",
                            { style: { "text-align": "center" }, slot: "content" },
                            t.$t('minePage.openSwitch.text03')
                        ),
                        createElement(
                            "p",
                            { style: { "text-align": "center" }, slot: "content" },
                            t.$t('minePage.openSwitch.text04')
                        )
                    ];
                }
            ).show();
        },
        toAllLogin() {
            // if (window.hasOwnProperty("pushLoginPage")) {
            //     pushLoginPage.postMessage({});
            // }
            // this.loginPopVisible=true
            // this.isAuthStart=true
            this.authTrigger()
            // goAppLogin(this.$router.history.current.path)
        },
        toSetting() {
            //
            const platformCode = getPlatformCode();
            let url = 'https://m2.24k.hk/detail.html?id=25457&app=gts2_app_orig&consulting=1&touziyoujiangjiu=1'
            switch (platformCode) {
                case globalConsts.platformNames.se: {
                    url = 'https://mp.weixin.qq.com/s?__biz=Mzg3MzI1MDg3NQ==&mid=2247483846&idx=1&sn=3611119926eefcfd17cf1014da4aed60&chksm=cee3a892f994218448b07e683fcb9d17e369d0a670ebcde5196d23f6073ce5e11b20283ee7ab&token=356443933&lang=zh_CN#rd';
                    break;
                }
                default: {
                    url = 'https://m2.24k.hk/detail.html?id=25457&app=gts2_app_orig&consulting=1&touziyoujiangjiu=1';
                }
            }
            if (this.$config.isWechatPlatform) {
                url = 'https://mp.weixin.qq.com/s?__biz=Mzg3MzI1MDg3NQ==&mid=2247483877&idx=1&sn=541f4499ddfb495c4ae291a1cbf39d9e&chksm=cee3a8b1f99421a7b376f076c07c8627d321f106ed157ddd54d8064743f3c6a5388d0108d295&token=1212880129&lang=zh_CN#rd'
                location.href = url;
            }
            if (this.$config.isWechatPlatform || platformCode == globalConsts.platformNames.se) {
                location.href = url;
                return false
            }
            //
            this.$router.push('/vsersionIntroduce')
        },
        toAbout() {
            this.$createDialog({
                type: "alert",
                title: t.$t('minePage.tipTitle'),
                content: t.$t('minePage.tipContent')
            }).show();
        },
        toFeedback() {
            this.$createDialog({
                type: "alert",
                title: t.$t('minePage.tipTitle'),
                content: t.$t('minePage.tipContent')
            }).show();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@public/css/global.scss";
.minePageClass {
    // padding:0.2rem 0 0.2rem 0.2rem;
    box-sizing: border-box;
    background: $commonColorDarkBalck;
    color: white;
    .entryBoxClass {
        display: flex;
        background: #292933;
        justify-content: space-between;
        .entryButton {
            font-size: 16px;
            padding: 0.1rem;
            border-radius: 0.1rem;
            // background-color: #5291ff;
        }
    }
    .noneLoginBoxClass {
        flex-direction: column;
        display: flex;
        align-items: center;
        .noneLoginImage {
            width: 1.44rem;
            height: 1.44rem;
        }
        .noneLoginBtn {
            border-radius: 0.36rem;
            text-align: center;
            width: 2rem;
            padding: 0.2rem;
            background: #4c94ff;
            margin-top: 0.2rem;
            margin-bottom: 0.1rem;
        }
    }
    .listcell-main-right {
        vertical-align: middle;
        font-size: $commonFsMedium;
        display: flex;
        align-items: center;
        .listcell-main-right-txt {
            color: #7c7c7d;
        }
    }
    .infoBoxClass {
        display: flex;
        flex-direction: column;
        justify-items: center;
        align-items: center;
        margin-bottom: 0.16rem;
        background-color: #292933;
        padding-bottom: 0.48rem;
        .infoImage {
            border-radius: 0.8rem;
            width: 1.6rem;
            height: 1.6rem;
        }
        .infoDetail {
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-top: 0.2rem;
            .info-name {
                margin-bottom: 0.2rem;
            }
        }
    }
    .back-arrow {
        width: 0.24rem;
        height: 0.44rem;
    }
    .listBoxClass {
        .listcell {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            text-align: center;
            height: 1rem;
            font-size: $commonFsContent;
            color: white;
            background-color: #292933;
            width: 100%;
            .listcell-main {
                border-bottom: solid 1px $commonBorderColor;
                border-color: rgba(0, 0, 0, 0.15);
                width: 100%;
                text-align: left;
                display: flex;
                justify-content: space-between;
                align-items: center;
                justify-items: center;
                height: 100%;
                padding-right: 0.28rem;
            }
            .leftImage {
                width: 0.4rem;
                margin: 0 0.28rem;
            }
            .rightMenuName {
                font-size: $commonFsContent;
                margin-left: 0.28rem;
            }
        }
        .select-row-arrow {
            width: 0.18rem;
            height: 0.35rem;
            padding-left: 0.3rem;
        }
    }
}
</style>

