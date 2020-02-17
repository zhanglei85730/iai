<template>
    <!-- {'ios-app-layout':iosAppLayoutHeight,'ios-app-bangs-layout-02-03':isBangsScreenForIos(),'ios-app-02-03-version-10':iosApp0203version10(),'app-layout-container':$config.newUserFromType()==1} -->
    <div
        class="page-layout common-bg-dark"
        :class="{'ios-app-layout':iosAppLayoutHeight,'ios-app-bangs-layout-02-03':isBangsScreenForIos(),'ios-app-02-03-version-10':iosApp0203version10(),'app-layout-container':$config.newUserFromType()==1,'wechat-layout':$config.isWechatPlatform && !isShowHeader}"
    >
        <!-- getIOSAppVersion()=='10.0.2' -->
        <!-- iosAppLayoutHeight -->
        <div
            :class="{'nav-position-top':navPosition=='top'}"
            :style="headerCss"
            v-if="navPosition=='top'"
        >
            <slot name="page-footer"></slot>
        </div>
        <header
            :style="headerForceShow && navPosition=='top'?{paddingTop:'0rem'}:headerCss"
            v-if="isShowHeader && (navPosition=='bottom' || headerForceShow)"
        >
            <div
                class="header-left header-item"
                :class="{'header-left-no-back-word':!isShowBackWord}"
                :style="{flex:getFlexData().left}"
            >
                <div
                    v-if="isShowHeaderLeft && !$slots.hasOwnProperty('header-left')"
                    class="header-back-btn"
                    @click="headerBack"
                >
                    <!-- <i class="cubeic-back"></i> -->
                    <span class="back-arrow"></span><span class="header-back-btn-word">{{isShowBackWord?backBtnTxt:''}}</span></div>
                <div
                    v-else
                    class="header-back-btn"
                >
                    <slot name="header-left"></slot>
                </div>
            </div>

            <!-- 如果有定义插槽 -->
            <div
                class="header-center header-item"
                :class="{'header-center-no-back-word':!isShowBackWord,headerCenterAlign:centerMoreDom}"
                v-if="$slots.hasOwnProperty('headerCenter')"
                :style="{flex:getFlexData().center}"
            >
                <slot name="headerCenter"></slot>
            </div>
            <div
                class="header-center header-item"
                :class="{'header-center-no-back-word':!isShowBackWord}"
                v-else
            >{{title}}</div>
            <div class="header-right header-item">
                <slot name="header-right"></slot>
            </div>
        </header>
        <!-- layout内容上下 flex布局 -->
        <div
            ref="mainScrollBox"
            class="page-layout-body"
            :class="{'page-layout-body-flex':isLayoutBodyFlex, 'scroll-hidden': isScroll,'page-layout-body-padding-top':isShowHeader,'page-layout-body-padding-bottom':isShowBottom}"
        >
            <slot name="page-body"></slot>
        </div>
        <!--页面底部-->
        <!--  :class="{'ios-app-bangs-layout-02-03-footer':isBangsScreenForIos(),'ios-app-bangs-layout-01-footer':isBangsScreenForIosPm()}" -->
        <div
            v-if="isShowHeaderByUrlParam()"
            class="page-layout-footer"
        >
            <slot
                name="page-footer"
                v-if="navPosition=='bottom'"
            ></slot>
        </div>
    </div>
</template>
<script>
import { usrFromTypeAsync, getDeviceModel, isIos, getPlatformCode, isBangsScreenForIos, iosKeyboardHide, iosApp0203version10, isBangsScreenForIosPm, getSearchParams, isWechatPlatform, iaiTraderControlApp, isIaiTraderApp } from '@public/js/util.js'
const globalConsts = require('@public/js/consts.js')
import request from '@services/documentary.js'
export default {
    props: {
        // 强制显示header头部
        headerForceShow: {
            type: Boolean,
            required: false,
            default: false,
        },
        // 导航位置 top/bottom
        navPosition: {
            type: String,
            required: false,
            default: "bottom"
        },
        title: {
            type: String,
            required: true,
            default: '页面标题'
        },
        // 返回按钮事件
        backBtnFun: {
            type: Function,
            required: false,
        },
        // 头部样式
        headerStyle: {
            type: Object,
            required: false,
        },
        isShowHeader: {
            type: Boolean,
            required: false,
            default: true,
        },
        isShowHeaderLeft: {
            type: Boolean,
            required: false,
            default: true,
        },
        // 是否允许滚动
        isScroll: {
            type: Boolean,
            required: false,
            default: false,
        },
        // layout内容上下flex布局
        isLayoutBodyFlex: {
            type: Boolean,
            required: false,
            default: false,
        },
        // 是否显示返回两个文字内容
        isShowBackWord: {
            type: Boolean,
            required: false,
            default: true,
        },
        // 头部是否显示上下结构并且居中，参考router为：toDetailPage
        centerMoreDom: {
            type: Boolean,
            required: false,
            default: false,
        },
        // 返回按钮文字
        backBtnTxt: {
            type: String,
            required: false,
            default: '返回',
        },
        // flex设置
        flexSet: {
            type: Object,
            required: false,
            default: function () {
                return { left: 2, center: 4 }
            }
        },
        myWarning: {
            type: String,
            required: false,
            default: '',
        },
        isShowBottom: {
            type: Boolean,
            required: false,
            default: true,
        }
    },
    data() {
        return {
            headerCss: {},
            count: 0,
            // fnScroll: () => { }
            iosAppLayoutHeight: false
        }
    },
    computed: {

    },
    methods: {
        // 通过url参数控制底部菜单是否隐藏
        isShowHeaderByUrlParam() {
            const parmasObj = this.$route.query;
            const bottomMenu = globalConsts.urlParamsKeys.bottomMenu;
            if (parmasObj.hasOwnProperty(bottomMenu.name)) {
                const bottomMenuValue = getSearchParams(bottomMenu.name)
                return bottomMenuValue == bottomMenu.value.hide ? false : true
            } else {
                return true;
            }
            // return true
        },
        isBangsScreenForIosPm() {
            return isBangsScreenForIosPm()
        },
        // ios 系统版本为10且业务类型为02、03
        iosApp0203version10() {
            return iosApp0203version10()
        },
        getFlexData() {
            const { left = 2, center = 4 } = this.flexSet;
            return { left, center }
        },
        headerBack() {
            //首页返回按钮或有回调方法
            if (this.backBtnFun) {
                this.backBtnFun();
            } else {
                //如果直接跳转详情页面，返回按钮无效的时候
                //  this.$router.go(-1)
                if (history.length > 2) {
                    this.$router.go(-1)
                } else {
                    this.$router.replace({ name: 'index' });

                }
            }
        },
        isIosApp() {
            usrFromTypeAsync().then((data) => {
                const platformCode = getPlatformCode();
                const aa = platformCode != globalConsts.platformNames.pm;
                console.log('platformCode=' + aa)
                if (data == 'app') {
                    if (isIos()) {
                        // if (platformCode == globalConsts.platformNames.fx || platformCode == globalConsts.platformNames.se) {
                        //     this.iosAppLayoutHeight = true
                        // }
                        this.iosAppLayoutHeight = true
                    }
                }
            })
        },
        //ios刘海屏 02、03业务
        isBangsScreenForIos() {
            return isBangsScreenForIos()

        },
        getHeaderCss() {

            const t = this;
            // 需要排除页面不设置padding-top值，主要针对我的预警页面不需要设置header的 padding-top
            const exceptMainLayoutNames = ['myWarning'];

            usrFromTypeAsync().then((data) => {
                const deviceModel = getDeviceModel();
                const platformCode = getPlatformCode();
                let paddingTopValue = 0;
                console.log('是否刘海屏:' + deviceModel.isBangsScreen)
                console.log('类型：' + data, platformCode)
                if (data == 'app') {
                    //刘海屏
                    if (deviceModel.isBangsScreen) {
                        if (isIos()) {
                            paddingTopValue = '0.7rem'
                        } else {
                            if (platformCode == globalConsts.platformNames.fx || platformCode == globalConsts.platformNames.se) {
                                paddingTopValue = '0'
                            } else {
                                paddingTopValue = '0.6rem'
                            }
                        }

                    } else {
                        if (isIos()) {
                            if (platformCode == globalConsts.platformNames.fx || platformCode == globalConsts.platformNames.se) {
                                // paddingTopValue = '0'
                                paddingTopValue = '0.4rem'
                            } else {
                                paddingTopValue = '0.4rem'
                            }
                        } else {
                            paddingTopValue = '0.4rem'
                        }
                    }
                }
                t.headerCss = Object.assign({
                    display: this.isShowHeader ? '' : 'none'
                },
                    t.headerStyle,
                    // 如果微信公众号取消顶部padding
                    { paddingTop: isWechatPlatform() || isIaiTraderApp() ? 0 : paddingTopValue }
                )
            });
        },
        fnScroll() {
            var scrollTopValue;
            if (document.body.scrollTop) {
                scrollTopValue = document.body.scrollTop;
            } else if (document.documentElement.scrollTop) {
                scrollTopValue = document.documentElement.scrollTop;
            }
            this.$emit('mainScrollBoxScrollTop', scrollTopValue)
        }
    },
    mounted() {
        window.addEventListener("scroll", this.fnScroll);
    },
    created: function () {
        this.getHeaderCss();
        this.isIosApp()
    },
}
</script>
<style scoped lang="scss">
@import "@public/css/appGlobal.scss";

.page-layout {
    // display: flex;
    // flex-direction: column;
    min-height: 100vh;
    box-sizing: border-box;
    // overflow: hidden;
    .header-back-btn-word {
        color: $commonColorBlur;
    }
    .back-arrow {
        width: 0.24rem;
        height: 0.44rem;
        margin-right: 0.06rem;
        display: inline-block;
        background: urlPrefix("static/img/commonPage/header_back_arrow.png")
            center no-repeat;
        background-size: cover;
        vertical-align: middle;
    }
    header {
        height: $headerHeight;
        overflow: hidden;
        background: rgb(46, 46, 59);
        text-align: center;
        color: #fff;
        width: 100%;
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
    }
    .header-back-btn-word {
        // margin-left: 0.06rem;
        font-size: $commonFsContent;
        vertical-align: middle;
    }
    .header-item {
        height: $headerHeight;
        line-height: $headerHeight;
    }
    .header-left,
    .header-right {
        text-align: left;
        font-size: $commonFsContent;
        box-sizing: border-box;
    }
    .header-left {
        padding-left: $commonSpace;
        flex-shrink: 0;
        white-space: nowrap;
        flex: 2;
    }
    .header-right {
        padding-right: $commonSpace;
        text-align: right;
        width: 0.44rem;
        flex-grow: 2;
    }
    .header-center {
        font-size: $commonFsTitleMedium;
        font-weight: bold;
        flex: 4;
        white-space: nowrap;
        padding-left: 10px;
    }
    .headerCenterAlign {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .header-center-no-back-word {
        width: 60%;
    }
    .header-left-no-back-word {
        width: 20%;
    }
    .page-layout-body {
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        flex: 1;
        position: relative;
        min-height: 100vh;
        box-sizing: border-box;
    }
    //
    .page-layout-footer {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
    }
    //
    .page-layout-body-flex {
        flex-grow: 1;
        display: flex;
        flex-direction: row;
    }
    .page-layout-body-flex > * {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex: 1;
    }
    .header-back-btn {
        font-size: $commonFsContent;
    }
    .scroll-hidden {
        overflow: hidden;
    }
}
.page-layout-body-padding-top {
    padding-top: $headerHeight;
}
// 主要针对android
.app-layout-container {
    .page-layout-body-padding-top {
        padding-top: 1.28rem;
    }
}
.page-layout-body-padding-bottom {
    padding-bottom: 1.2rem;
}
.ios-app-layout {
    height: calc(100vh - 20px) !important;
    .page-layout-body-padding-top {
        padding-top: 1.28rem;
    }
}
.ios-app-02-03-version-10 {
    padding-top: 20px !important;
}
.ios-app-bangs-layout-02-03 {
    height: calc(100vh - 76px) !important;
    .page-layout-body-padding-top {
        padding-top: 1.51rem;
    }
}
.ios-app-bangs-layout-03 {
    height: 100% !important;
}
.ios-app-bangs-layout-01-footer {
    padding-bottom: 0.4rem;
}
</style>
<style lang="scss">
//刘海屏 脚部
.page-layout-footer {
    .m-pageFooter {
        background: #3d3d4d;
    }
}
// 刘海屏设置样式
@supports (bottom: constant(safe-area-inset-bottom)) or
    (bottom: env(safe-area-inset-bottom)) {
    .ios-app-layout {
        .page-layout-footer .m-pageFooter {
            padding-bottom: constant(safe-area-inset-bottom);
            padding-bottom: env(safe-area-inset-bottom);
        }
        header {
            padding-top: constant(safe-area-inset-top) !important;
            padding-top: env(safe-area-inset-top) !important;
        }
        .page-layout-body {
            padding-top: calc(
                0.88rem + constant(safe-area-inset-top)
            );
            padding-top: calc(0.88rem + env(safe-area-inset-top));
        }
    }
}
.wechat-layout {
    .page-layout-body {
        padding-top: 0 !important;
    }
}
</style>


