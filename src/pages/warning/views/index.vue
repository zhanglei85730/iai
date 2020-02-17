<template>
    <!-- 策略详情页面 :isShowHeader="!isWechatPlatform"-->
    <div>
        <MainLayout
            :title="$route.meta.title"
            :headerStyle="$config.headerStyle"
            :isLayoutBodyFlex="true"
            class="common-layout-back"
            :isShowBackWord="false"
            @mainScrollBoxScrollTop="mainScroll"
            :backBtnFun="backApp"
            :navPosition="is03SePlatFormCode()?'top':'bottom'"
            :isShowHeader="true"
            :isShowHeaderLeft="!isIaiTraderPlatform && !isWechatPlatform"
        >
            <div
                slot="header-right"
                class="common-flex-column-row"
                style="justify-content: flex-end"
            >
                <!-- <div v-if="!isWechatPlatform">
                    <FeedBack />
                </div> -->
                <router-link :to="{name:'myWarning'}"><span class="common-link-txt">盯盘记录</span></router-link>
            </div>
            <div
                slot="page-body"
                class="warning-index"
            >

                <div class="banner-list-container">
                    <!-- 03开户广告 isWechatPlatform-->
                    <!-- <WechatNotice
                        v-if="isWechatPlatform"
                        :title="getAdTitle()"
                         imgurl="static/img/warning/ad03.png"
                         style="maring-bottom:16px"
                        @toWechatNotice="toWechatNotice"
                    ></WechatNotice> -->
                    <!--  -->
                    <div class="slide-items-box">
                        <!-- <cube-slide :data="slideItems" /> -->
                        <cube-slide>
                            <cube-slide-item>
                                <a href="javascript:void(0)">
                                    <img
                                        src="static/img/warning/carousel@2x.png "
                                        class="slide-bannber-img"
                                    >
                                </a>
                            </cube-slide-item>
                            <cube-slide-item v-if="$config.isWechatPlatform && getPlatformCode()!=='PF14'">
                                <a
                                    href="javascript:void(0)"
                                    @click="toseOpenAccount"
                                >
                                    <img
                                        src="static/img/warning/ad03.png"
                                        class="slide-bannber-img"
                                    >
                                </a>
                            </cube-slide-item>
                            <cube-slide-item v-if="$config.isWechatPlatform">
                                <a
                                    href="javascript:void(0)"
                                    @click="toBaike"
                                >
                                    <img
                                        src="static/img/warning/index_banner04.png"
                                        class="slide-bannber-img"
                                    >
                                </a>
                            </cube-slide-item>
                        </cube-slide>
                    </div>
                    <!-- <div class="common-head-ad-box">
                        <img
                            v-if="isWechatPlatform"
                            src="static/img/warning/ad03.png"
                            class="img-hight-quality"
                            @click="toWechatNotice"
                        />
                        <img
                            v-else
                            :src="$config.imagePathPrefix+'carousel@2x.png'"
                            class="img-hight-quality"
                        />
                    </div> -->
                    <!--  -->
                    <div class="second-menu">
                        <div
                            class="groupListNav"
                            ref="advListNav"
                            :style="getStickyTopValue()"
                            :class="{'sticky':isTabMenufixed}"
                        >
                            <cube-tab-bar
                                v-model="selectedLabel"
                                show-slider
                                @change="tabChanged"
                            >
                                <cube-tab
                                    v-for="(item) in tabs"
                                    :label="item.label"
                                    :key="item.label"
                                >
                                    <button class="sensors-track-button">{{item.label}}</button>
                                </cube-tab>
                            </cube-tab-bar>
                        </div>
                        <cube-tab-panels
                            v-model="selectedLabel"
                            ref="advListPanel"
                        >
                            <cube-tab-panel
                                v-for="(item, index) in tabs"
                                :label="item.label"
                                :key="item.label"
                            >
                                <v-touch
                                    v-on:swipeleft="onSwipeLeft"
                                    v-on:swiperight="onSwipeRight"
                                    :swipe-options="{direction: 'horizontal'}"
                                >
                                    <adv-index-list :tabContentData="tabs[index].content" />
                                </v-touch>
                            </cube-tab-panel>
                        </cube-tab-panels>
                    </div>
                </div>
            </div>
            <pageFooter slot="page-footer" />
        </MainLayout>
        <!-- 授权弹出层 -->
        <LoginPop class="warning-author-pop" />
    </div>
</template>

<script>
import request from '@services/documentary.js'
import { commonError, saveInfoToSessionStorage, getInfoFromSessionStorage, getDataFoxAxiosRequest, getInfoFromApp, isObject, backToApp, saveLoginInfoToWindow, trackEventGeneral, getTrackProjectName, getAccount, getPlatformCode, getSymbolInfoByEname, iosKeyboardHide, isPlatformCodeSe, isIos, getDeviceModel, getStickyTopValue, getAccountType, getCookie, saveInfoToStorage, initPage, goAppLogin, isWechatPlatform, isIaiTraderApp } from '@public/js/util.js'
import WechatNotice from "../components/WechatNotice";
import { globalTrackEvent } from '@public/js/trackEvent.js'
import LoginPop from '../components/LoginPop'
import SelectList from '../components/SelectList'
import PageFooter from '@warning/components/PageFooter'
import OpenWeChatNoticeEntry from '@warning/components/OpenWeChatNoticeEntry'
import FeedBack from '@warning/components/FeedBack'
import AdvIndexList from './advIndexList'
import i18n from '@warning/i18n';
const consts = require('../consts.js')
const configConsts = require('@config/consts.js')
const globalConsts = require('@public/js/consts.js')
import { getPriceWarningConfig, getCombinationWarningConfig, getIndexWarningConfig } from '../mapConfig.js'

export default {
    components: {
        SelectList,
        LoginPop,
        PageFooter,
        AdvIndexList,
        OpenWeChatNoticeEntry,
        FeedBack,
        WechatNotice
    },
    data() {
        return {
            slideItems: [
                {
                    url: 'http://www.didichuxing.com/',
                    image: 'static/img/warning/ad03.png'
                },
                {
                    url: 'http://www.didichuxing.com/',
                    image: 'static/img/warning/carousel@2x.png'
                }
            ],
            isIaiTraderPlatform: false,
            isWechatPlatform: false,
            // 使用盯盘的人数
            usersCount: 0,
            selectedLabel: this.$t('index_page.shakeIndexDP'),
            tabs: [
                // {
                //     label: this.$t('index_page.priceDP'),
                //     content: []
                // },
                {
                    label: this.$t('index_page.shakeIndexDP'),
                    content: []
                }, {
                    label: this.$t('index_page.trendIndexDP'),
                    content: []
                }, {
                    label: this.$t('index_page.combinaIndexDP'),
                    content: []
                }
            ],
            // 是否吸附顶部
            isTabMenufixed: false,
        }
    },
    methods: {
        toBaike() {
            location.href = "https://mp.weixin.qq.com/mp/homepage?__biz=Mzg3MzI1MDg3NQ==&hid=4&sn=0b04a05d3fedbb207277944b17ab9858&scene=18"
        },
        toseOpenAccount() {
            location.href = "https://m.se6868x.com/lp194_cg_D024BW_P035JW_mail00.html?utm_source=iaimyself&utm_medium=zhibiao&utm_campaign=iai_M035JW&utm_content=lp192_D024BW_P035JW&utm_term=191224"
        // toseOpenAccount() {
        //     location.href = "https://m.se6868a.com/lp147_ty_D024BW_P032AX_201908s50.html?utm_source=iaimyself&utm_medium=50&utm_campaign=iai_M035JW&utm_content=lp147_D024BW_P032AX&utm_term=11"
        },
        toWechatNotice() {
            if (isWechatPlatform()) {
                location.href = "https://m.se6868a.com/lp147_ty_D024BW_P032AX_201908s50.html?utm_source=iaimyself&utm_medium=50&utm_campaign=iai_M035JW&utm_content=lp147_D024BW_P032AX&utm_term=11"
            } else {
                this.$router.push({
                    name: "weChatNotice"
                });
            }

        },
        // getAdTitle() {
        //     return isWechatPlatform() ? '广告' : '【开通微信通知】第一时间获取更高级的盯盘攻略玩法。'
        // },
        // 正式要删除 ，用于测试
        bannerRestWxShow() {
            //  request.resetSeWxShow()
        },
        // 是否位02fx业务
        getPlatformCodeForFx() {
            if (getPlatformCode() == globalConsts.platformNames.fx) {
                this.$router.push({ name: 'index' })
            }
        },
        getPlatformCode() {
            return getPlatformCode()
        },
        is03SePlatFormCode() {
            return isPlatformCodeSe()
        },
        // 跳转到身份验证页面
        toValidateIdentity() {
            this.$router.push({ name: 'validateIdentity', query: { username: this.userName } })
        },
        // 跳转app登录
        goAppLogin() {
            // window.open("https://gologin", 'commlogin', 'mobile', "_blank");
            goAppLogin(this.$router.history.current.path)
        },
        // 调转登录
        goToLogin() {
            this.$router.push({ name: 'login', query: { loginAfterTo: 'index' } })
        },
        // 返回app
        backApp() {
            backToApp()
        },
        // 埋点为授权的用户（手动埋点,传到自己的后台）
        trackNoAuthCount() {
            // 真实场
            if (this.$config.NODE_ENV === configConsts.prodNodeEvn) {
                request.trackNoAuth().then(() => { })
            } else {
            }
        },
        // 点击图片跳转链接
        warningLink(type, symbol) {
            const link = { name: 'dataWarning' }
            const queryPamras = { query: { warningType: type, symbol, backTitle: this.$route.meta.title } }
            const _setWarningSymbolKey = globalConsts.setWarningSymbolKey;
            const queryObj = this.$route.query
            // 如果APP跳转过来时候有预警设置参数，要带上
            if (queryObj.hasOwnProperty(_setWarningSymbolKey)) {
                queryPamras.query[_setWarningSymbolKey] = queryObj[_setWarningSymbolKey]
            }
            //指标预警跳转单独的页面（tab切换页面较复杂）
            if (type === 'indexWarning') {
                link.name = 'indexWarning'
            }
            return Object.assign(link, queryPamras);
            // this.$router.push(Object.assign(link, queryPamras))
        },
        // 获取使用智能盯盘人数
        getUsersCount(callback) {
            request.getUsedAssign().then((res) => {
                const resData = getDataFoxAxiosRequest(res, this);
                if (!!resData) {
                    const { count = '' } = resData
                    this.usersCount = Number(count)
                    // resolve(Number(count))
                } else {
                    //    reject(false)
                }
            })
        },
        // tab菜单切换埋点
        trackForTabChange(tabIndex) {
            const _accountType = getAccountType();
            if (!_accountType) return false;
            let _currentTabType = '';
            switch (tabIndex) {
                // 价格盯盘
                case 0: {
                    _currentTabType = 'Price';
                    break;
                }
                //震荡指标盯盘
                case 1: {
                    _currentTabType = 'Oscillator';
                    break
                }
                // 趋势指标盯盘
                case 2: {
                    _currentTabType = 'TrendIndicator';
                    break
                }
                // 组合盯盘
                case 3: {
                    _currentTabType = 'Combined';
                    break
                }
            }
            const eventName = `${_accountType}_View_${_currentTabType}_label`
            trackEventGeneral(eventName)
        },
        tabChanged(current, isScrollIndex) {
            let _index = 0;
            if (!isScrollIndex) {
                this.tabs.forEach((item, index) => {
                    if (item.label === current) {
                        _index = index;
                    }
                })
            } else {
                _index = isScrollIndex;
            }
            this.trackForTabChange(_index)
            const _query = this.$route.query;
            this.$router.push({ query: Object.assign(_query, { tabName: current }) });
            // if (_index === 0) {
            //     this.getAdvDPDataList('priceWarning', 10);
            // } else if (_index === 1) {
            //     this.getAdvDPDataList('indexWarning', 20);
            // } else if (_index === 2) {
            //     this.getAdvDPDataList('indexWarning', 20);
            // } else if (_index === 3) {
            //     this.getAdvDPDataList('combinationWarning', 30);
            // }
            if (_index === 0) {
                document.querySelector('.second-menu .cube-tab-bar-slider').classList.add('first');
            }
            if (_index === 0) {
                this.getAdvDPDataList('indexWarning', 20);
            } else if (_index === 1) {
                this.getAdvDPDataList('indexWarning', 20);
            } else if (_index === 2) {
                this.getAdvDPDataList('combinationWarning', 30);
            }

            // 处理tab-panel 高度
            setTimeout(() => {
                var tabpanelDom = document.querySelector('.cube-tab-panels-group');
                var height = this.$refs.advListPanel.panels[_index].$el.firstChild.offsetHeight;
                height > 0 && (tabpanelDom.style.height = height + 'px');
            }, 100)
        },

        updateTabsContent(index, type, symbol) {
            const newestTipPriceSelKey = Boolean(getCookie(globalConsts.cookies.newestTipPriceSelKey));
            const newestTipRiseSelKey = Boolean(getCookie(globalConsts.cookies.newestTipRiseSelKey));
            const data = this.tabs[index].content.map((TabsItem, index) => {
                let item = Object.assign({}, TabsItem)
                // 位价格预警增加new标识
                if (type == 'priceWarning' && index == 1 && !newestTipPriceSelKey) {
                    item.newestTip = {
                        newestPriceTip: true,
                        newestTipShow: true
                    }
                }
                if (type == 'priceWarning' && index == 1 && !newestTipRiseSelKey) {
                    item.newestTip = {
                        newestRiseTip: true,
                        newestTipShow: true
                    }
                }
                item.changeId = Math.random();
                item.link.query.warningType = type;
                item.link.query.symbol = symbol;
                return item
            })
            this.tabs[index].content = data
        },

        getAdvDPDataList(type, symbol) {
            document.querySelector('.second-menu .cube-tab-bar-slider').classList.remove('first');
            switch (type) {
                // case 'priceWarning': {
                //     this.tabs[0].content = getPriceWarningConfig();
                //     this.updateTabsContent(0, type, symbol);
                //     document.querySelector('.second-menu .cube-tab-bar-slider').classList.add('first');
                //     break;
                // }
                case 'indexWarning': {
                    this.tabs[0].content = getIndexWarningConfig(1);
                    this.tabs[1].content = getIndexWarningConfig(2);
                    this.updateTabsContent(0, type, symbol);
                    document.querySelector('.second-menu .cube-tab-bar-slider').classList.add('first');
                    this.updateTabsContent(1, type, symbol);
                    break;
                }
                case 'combinationWarning': {
                    this.tabs[2].content = getCombinationWarningConfig();
                    this.updateTabsContent(2, type, symbol);
                    document.querySelector('.second-menu .cube-tab-bar-slider').classList.add('first');
                    break;
                }
            }
        },

        onSwipeLeft(el) {
            let _index = 0;
            this.tabs.forEach((item, index) => {
                if (item.label === this.selectedLabel) {
                    _index = index;
                }
            })
            _index++;
            if (_index > 3) {
                _index = 0;
            }
            this.selectedLabel = this.tabs[_index].label;
            this.tabChanged(this.selectedLabel, _index)
        },
        onSwipeRight(el) {
            let _index = 0;
            this.tabs.forEach((item, index) => {
                if (item.label === this.selectedLabel) {
                    _index = index;
                }
            })
            _index--;
            if (_index < 0) {
                _index = 3;
            }
            this.selectedLabel = this.tabs[_index].label;
            this.tabChanged(this.selectedLabel, _index)
        },

        //获取吸附菜单的top值
        getStickyTopValue() {
            return getStickyTopValue()
        },
        mainScroll(scrollTop) {
            if (scrollTop > this.$refs.advListNav.offsetTop) {
                this.isTabMenufixed = true
            } else {
                this.isTabMenufixed = false
            }
        },

    },
    created() {
        // iai-trader app
        if (isWechatPlatform()) {
            this.isWechatPlatform = true
        }
        // iaiTrader app
        if (isIaiTraderApp()) {
            this.isIaiTraderPlatform = true
        }
    },
    mounted: function () {
        // 保存symbols信息供后面页面使用
        const t = this;
        iosKeyboardHide()
        setTimeout(() => {
            t.getUsersCount()
        }, 500);
        let { tabName = '' } = this.$route.query;
        // TAB定位到 盯盘监控中
        let selectName = tabName || this.tabs[0].label;
        this.tabChanged(selectName)
        this.selectedLabel = selectName;
    },
    i18n
}
</script>
<style scoped lang="scss">
@import "@public/css/warningGlobal.scss";
.slide-items-box {
    img {
        width: 100%;
    }
}
.slide-bannber-img {
    width: 100%;
    padding: 0 0.28rem;
    box-sizing: border-box;
    border-radius: 0.2rem;
}
.warning-index {
    .banner-list-container {
        position: relative;
        width: 100%;
        .common-head-ad-box {
            height: 2.18rem;
            padding: 0.22rem 0.28rem 0.06rem 0.28rem;
        }
    }
    .banner-list {
        flex: 1;
    }
    .banner-list {
        display: flex;
        margin-top: 0.28rem;
        flex-direction: column;
        .banner-list-item {
            display: flex;
            position: relative;
            flex: 1;
            flex-direction: column;
            margin-top: 0.28rem;
            width: 100%;
            background: linear-gradient(
                270deg,
                rgba(76, 148, 255, 0.6) 0%,
                rgba(76, 148, 255, 0.2) 100%
            );
            border-radius: $commonRadius;
        }
        .banner-list-item:first-child {
            margin-top: 0;
        }
        .banner-list-title-sub {
            font-size: $commonFsSmall;
            color: #7eb2ff;
            margin-top: -6px;
        }
        .banner-list-title {
            font-size: $commonFsTitle;
        }
        .table-row {
            align-items: center;
            height: 100%;
        }
        .table-cell {
            height: 100%;
            vertical-align: middle;
            line-height: 24px;
            align-items: center;
        }
        .table {
            display: flex;
            flex-direction: column;
            height: 100%;
            flex: 1;
            justify-content: center;
        }
        .banner-list-left {
            vertical-align: middle;
            text-align: left;
            color: #fff;
            width: 100%;
            height: 100%;
        }
        .banner-list-right {
            width: 120px;
            text-align: left;
        }
        .banner-list-title,
        .banner-list-title-sub {
            margin-left: 0.36rem;
        }
        .banner-list-left-icon {
            height: 80%;
            position: absolute;
            right: 0;
            top: 10%;
        }
    }
    .warning-index-footer {
        color: $commonFsDarkColor;
        font-size: $commonFsSmall;
        text-align: center;
        margin-top: 0.35rem;
        height: 1rem;
        .warning-index-footer-teco {
            margin-top: 0.18rem;
            &:after,
            &:before {
                content: " ";
                display: inline-block;
                height: 1px;
                width: 0.8rem;
                border-bottom: 1px solid $commonFsDarkColor;
                vertical-align: middle;
            }
            &:after {
                margin-left: 4px;
            }
            &:before {
                margin-right: 4px;
            }
        }
    }
}

.groupListNav {
    transition-duration: 50ms;
    transition-timing-function: linear;
    z-index: 1;
    &.sticky {
        position: fixed;
        z-index: 90;
        width: 100%;
        background-color: rgb(46, 46, 59);
        transform: translateZ(0);
    }
}
</style>
<style lang="scss">
@import "@public/css/warningGlobal.scss";
.banner-list-container .winList-swiper {
    height: 2.18rem;
    padding: 0.22rem 0.28rem 0.06rem 0.28rem;
    .cube-slide {
        .cube-slide-dots {
            z-index: 20;
            span {
                width: 6px;
                height: 6px !important;
                border-radius: 50%;
                overflow: hidden;
                background-color: $commonForeFontColor;
                &.active {
                    background-color: $commonColorBlur;
                }
            }
        }
    }
}
.second-menu {
    .cube-tab {
        flex: auto;
        padding: 0.22rem 0 !important;
        .sensors-track-button {
            font-size: 0.26rem;
            color: #8b8e99;
            padding: 0.01rem 0.1rem;
        }
    }
    .cube-tab-bar-slider:after {
        width: 1.6rem;
    }
    .cube-tab-bar-slider.first:after {
        width: 1.06rem;
    }
}
.fx-notice {
    .open-wechat-entrance {
        background: linear-gradient(
            270deg,
            rgba(42, 105, 199, 1) 0%,
            rgba(40, 70, 163, 1) 100%
        ) !important;
        .open-wechat-entrance-arrow {
            color: #6a9ef9 !important;
        }
    }
}
</style>
