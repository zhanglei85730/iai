<template>
    <div>
        <!--:class="{iosFix:isTopFixBox}"   !$config.isWechatPlatform && !$config.isIaiTraderApp-->
        <MainLayout
            @scroll="homePageScroll($event)"
            :title="$route.meta.title"
            :headerStyle="$config.headerStyle"
            class="common-layout-back2"
            :isShowBackWord="false"
            :isShowHeader="getShowHeader"
            :isShowBottom="!isWebPopularize"
            :backBtnFun="backApp"
            @mainScrollBoxScrollTop="mainScroll"
        >
            <div slot="headerCenter"></div>
            <div
                slot="page-body"
                class="homePageClass"
                :class="{homePageHavePadding:isTopFixBox}"
            >
                <div
                    v-show="!isTopFixBox"
                    ref="pageTitleBox"
                    class="pageTitleBoxClass"
                    :style="{paddingTop:$config.isWechatPlatform?'16px':0}"
                >
                    <div
                        class="actionName"
                        :class="{'web-popularize':isWebPopularize}"
                    >{{$t('homePage.pageTitle')}}</div>
                    <div
                        class="actionContent"
                        v-if="isSelect"
                    ><span>{{$t('homePage.freeIntroduce')}}</span></div>
                    <div
                        class="actionContent"
                        v-else
                    >{{$t('homePage.recommendIntroduce')}}</div>
                </div>
                <div
                    ref="fixBoxRef"
                    class="noFixBoxClass"
                    :class="{topFixBoxClass:isTopFixBox}"
                >
                    <div
                        ref="transitionBox"
                        class="transitionBoxClass"
                        :class="{trasitionIngClass:isTopFixBox}"
                    ></div>
                    <div
                        ref="topPaddingRef"
                        :class="{'wechat-topPadding':$config.isWechatPlatform}"
                    ></div>
                    <!--自选和推荐-->
                    <div class="selectTypeBox">
                        <div class="tabBoxClass">
                            <cube-tab-bar
                                v-model="selectedLabelDefault"
                                :data="tabs"
                                :showSlider="true"
                                @change="changeType"
                            ></cube-tab-bar>
                        </div>
                        <div
                            v-show="isSelect"
                            @click="toOptionPage"
                            class="settingBox"
                        >
                            <div
                                v-if="guiderShow"
                                @click="guiderShow=false"
                                class="tipBoxClass"
                            >
                                <div class="arrowBoxClass"></div>
                                <div class="tipContentClass">{{$t('homePage.HandicapGuide')}}</div>
                            </div>
                            <span>{{$t('homePage.HandicapManage')}}</span>
                            <img
                                style="width: 0.4rem;margin-left: 0.05rem;position: relative;"
                                src="./homePage/img/new-setting@2x.png"
                            />
                        </div>
                    </div>

                    <!--产品滑动-->
                    <div
                        v-show="isShowProductScroll()"
                        class="productBox"
                    >
                        <!-- 推荐选项-->
                        <div
                            v-show="!isSelect"
                            class="recommendBox"
                        >
                            <div class="lineView"></div>
                            <!--<div class="BottomView"></div>-->
                            <div class="recommendTap">
                                <div class="recommandDate">{{recommandDate}}</div>
                                <div class="rightButton">
                                    <div
                                        @click="toShowShop"
                                        class="recommendButton"
                                        style="padding-right: 0.32rem;"
                                    >
                                        <div
                                            class="normalTitle"
                                            :class="{selectTitle:isShowShop}"
                                        >
                                            <div class="normalTitelText">{{shopSelect}}</div>
                                        </div>

                                        <div style="display:flex;align-items: center;">
                                            <img
                                                :class="{selectImg:isShowShop}"
                                                style="transition: transform 0.2s;width: 0.16rem;height: 0.24rem;"
                                                :src="isShowShop?arrowup:arrowdown"
                                            />
                                        </div>
                                    </div>
                                    <div
                                        @click="toShowType"
                                        class="recommendButton"
                                    >
                                        <div
                                            class="normalTitle"
                                            :class="{selectTitle:isShowType}"
                                        >
                                            <div class="normalTitelText">{{typeSelect}}</div>
                                        </div>
                                        <div style="display:flex;align-items: center;">
                                            <img
                                                :class="{selectImg:isShowType}"
                                                style="transition: transform 0.2s;width: 0.16rem;height: 0.24rem;"
                                                :src="isShowType?arrowup:arrowdown"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            v-show="isShowSort"
                            class="productSortBox"
                        >
                            <draggable
                                v-show="isSelect"
                                @end="selectEnd"
                                style="display: flex;width: 100%;flex-wrap: wrap;"
                                v-model="groupTapList"
                                :options="{delay:200,group:'people',animation:150,draggable:'.sortProductItem',ghostClass:'sortable-ghost',chosenClass:'chosenClass',scroll:true,scrollSensitivity:200}"
                            >
                                <div
                                    :key="index"
                                    v-for="(item,index) in groupTapList"
                                    @click="selectProductType(item)"
                                    :class="{allProductItem:index==0?true:false,sortProductItem:index!=0?true:false}"
                                >
                                    <div
                                        class="sortContent"
                                        :class="{sortProductItemSelect:item.select}"
                                    >{{item.name}}</div>
                                </div>
                            </draggable>
                            <div
                                v-show="!isSelect"
                                style="display: flex;width: 100%;flex-wrap: wrap;"
                            >
                                <div
                                    :key="index"
                                    v-for="(item,index) in (shopAndType?allShop:allType)"
                                    @click="shopAndType?selectShop(item):selectType(item)"
                                    class="shopAndTypeItem"
                                >
                                    <div
                                        class="sortContent"
                                        :class="{shopAndTypeItemSelect:item.select}"
                                    >{{item.name}}</div>
                                </div>
                            </div>
                        </div>
                        <div
                            v-show="isSelect"
                            class="leftScrollBox"
                        >
                            <div
                                class="productScrollList"
                                v-show="!isShowSort"
                            >
                                <div class="transitionLineBox"></div>
                                <div class="productTypeList">
                                    <div
                                        v-show="true"
                                        v-for="(item,index) in groupTapList"
                                        @click="selectProductType(item,index)"
                                        :class="{productTypeItemSelect:item.select?true:false}"
                                        class="productTypeItem"
                                        :key="index"
                                    >{{item.name}}</div>
                                </div>
                            </div>
                            <div
                                class="sortTipClass"
                                v-show="isShowSort"
                            >
                                <div class="sortTipName">{{$t('homePage.sortTitle')}}</div>
                                <div class="sortTipAction">{{$t('homePage.sortAction')}}</div>
                            </div>
                        </div>
                        <div
                            v-show="isSelect"
                            style="box-sizing: border-box;display: flex;align-items: center;margin-left: 0.24rem;"
                        >
                            <img
                                :class="{rightArrowDirection:isShowSort}"
                                @click="toSortButton"
                                style="transition: transform 0.1s;width: 0.28rem;padding: 0 0.06rem;"
                                src="./homePage/img/new-arrow.png"
                            />
                        </div>
                    </div>
                    <!--日期选择-->
                    <div
                        v-show="isSelect"
                        @click="showDateSelect"
                        class="dateTipClass"
                    >
                        <div
                            v-show="isShowDate"
                            class="dateSelectBox"
                        >
                            <ul class="dateSelectList">
                                <li
                                    v-for="(item,index) in dateList"
                                    class="dateSelectItem"
                                    @click="selectDate(item)"
                                    :key="index"
                                >
                                    <span :class="{curentSelectItem:item.isSelect}">{{item.is_cur == '1'?`${$t('homePage.today')} `:''}}{{item.date}} {{item.week}}</span>
                                    <img
                                        v-if="item.isSelect"
                                        style="width: 0.44rem;margin-right: 0.28rem;"
                                        src="./homePage/img/new-radio@2x.png"
                                    />
                                </li>
                            </ul>
                        </div>
                        <div
                            v-show="isSelect"
                            style="display: flex;align-items: center;"
                        >
                            <span class="leftDateClass">{{recordCurentDate.is_cur == '1'?`${$t('homePage.today')} `:''}}{{recordCurentDate.date}} {{recordCurentDate.week}}</span>
                            <img
                                style="margin-left: 0.15rem;"
                                class="rightImgClass"
                                :src="isShowDate?calendarSelect:calendarNormal"
                            />
                        </div>

                        <span
                            v-show="!isSelect"
                            class="leftDateClass"
                        >{{scrollCurentData}}</span>
                        <div
                            v-show="isSelect"
                            style="display: flex;align-items: center;"
                        >
                            <img
                                :class="{refreshIng:isRefresh}"
                                @click.stop="toRefresh"
                                style="padding: 0.3rem 0;width: 0.38rem;"
                                src="./homePage/img/new-refresh.png"
                            />
                        </div>
                    </div>
                </div>
                <div
                    v-show="!isShowCommonTip()"
                    @scroll="listScroll($event)"
                    @touchmove="listBoxMove"
                    @touchstart="listTouchStart"
                    @touchend="listTouchEnd"
                    ref="panelListBox"
                    class="productListView"
                    :class="{panelListBox:isTopFixBox}"
                >
                    <SelectView
                        @toPayAction="toPayAction"
                        @toProductDetail="toProductDetail"
                        v-if="isSelect"
                        :key="productIndex"
                        :productItem="productItem"
                        :updatePriceItem="priceBoxList[productIndex]"
                        v-for="(productItem,productIndex) in groupListData"
                        :isNoMessge="productItem.messages.rows.length==0"
                    >
                        <MessageView
                            slot="messageSlot"
                            :authAction="aopAction"
                            @showStatistics="showStatistics"
                            @showNumberWave="showNumberWave"
                            @toShowHistory="toShowHistory"
                            :isHavePrice="false"
                            :key="index"
                            :productInfo="productItem"
                            :messageInfo="item"
                            :data-time="item.created_at"
                            v-for="(item,index) in productItem.messages.rows"
                        ></MessageView>
                        <!--$config.isWechatPlatform && productIndex==0-->
                        <WechatNotice
                            v-if="(!bindWechat && !isWechatPlatform() && productIndex==0) && !isWebPopularize"
                            slot="wechatNoticeSlot"
                            title="【开通微信通知】第一时间获取更高级的盯盘攻略玩法。"
                            @toWechatNotice="toWechatNotice"
                        ></WechatNotice>
                        <WechatNotice
                            v-if="(isWechatPlatform() &&(getPlatformCode()!=='PF14') && productIndex==0) && !isWebPopularize"
                            :isShowBtn="false"
                            slot="wechatNoticeSlot"
                            imgurl="static/img/warning/ad01.png"
                            @toWechatNotice="toWechatNotice"
                        ></WechatNotice>
                        <!-- 首页推广页面banner -->
                        <WechatNotice
                            v-if="isWebPopularize && productIndex==0"
                            :isShowBtn="false"
                            slot="wechatNoticeSlot"
                            imgurl="static/img/warning/ad01.gif"
                            @toWechatNotice="popularizeLink"
                        ></WechatNotice>
                        <MessageView
                            v-if="(productItem.messages.rows.length>=5 && !isWebPopularize)"
                            slot="detailMessageSlot"
                            :productInfo="productItem"
                            :isMoreButton="(productItem.messages.rows.length>=5)"
                        ></MessageView>
                    </SelectView>
                    <div
                        v-if="!isSelect"
                        class="productListItemBox"
                    >
                        <!--  -->
                        <!-- <WechatNotice
                            :needMargin="false"
                            v-if="isWechatPlatform()"
                            :title="getAdTitle()"
                            imgurl="static/img/warning/ad02.png"
                            @toWechatNotice="toWechatNotice"
                        ></WechatNotice> -->
                        <!-- $config.isWechatPlatform -->
                        <div
                            class="homepage-recommed"
                            v-if="$config.isWechatPlatform && getPlatformCode()!='PF14' || isWebPopularize"
                        >
                            <img
                                src="static/img/warning/ad02.gif"
                                @click="toSeOpenAccount"
                            ></div>
                        <!--  -->
                        <div
                            class="priceNoticeList"
                            v-for="(dateItem,groupIndex) in handleMessageList"
                            :key="groupIndex"
                        >
                            <div
                                v-show="groupIndex!=0"
                                class="messageTimeClass"
                                :data-time="dateItem.date"
                            >
                                <div>{{getDaysFromDateString(dateItem.date)}}</div>
                            </div>
                            <MessageView
                                :class="{firstItemClass:(index==0?true:false),wechatFirstItemClass:((index==0 && groupIndex==0) && isWechatPlatform() &&(getPlatformCode()!=='PF14'))}"
                                :authAction="aopAction"
                                :isSelect="false"
                                :data-sontype="item.type!=5?'':item.extend.type"
                                :data-listsymbol="item.type!=5?'':item.extend.symbol_list"
                                :data-dateindex="groupIndex"
                                :data-index="index"
                                :data-id="item.symbol_id"
                                :data-type="item.type"
                                @showStatistics="showStatistics"
                                :key="index"
                                @showNumberWave="showNumberWave"
                                @toShowHistory="toShowHistory"
                                :messageInfo="item"
                                v-for="(item,index) in dateItem.messageList"
                            >
                                <!--<div>{{item.changeRate}}</div>-->
                                <!--<div>{{item.twoChangeRate}}</div>-->
                                <!--<div>{{item.twoSymbolId}}</div>-->
                                <!--<div>{{item.oneSymbolId}}</div>-->
                            </MessageView>
                        </div>
                    </div>
                    <div
                        v-show="!isSelect"
                        ref="refreshIngBox"
                        style="background-color: #292933;height: 0.9rem;box-sizing: border-box;display: flex;justify-content: center;align-items: center;"
                    >
                        <refresh-loading :isShow="(isScrollBottom && !isSelect)"></refresh-loading>
                    </div>
                </div>
                <div v-show="isShowCommonTip()">
                    <div class="authBox">
                        <img
                            class="authImg"
                            :src="commonTipImg"
                        />
                        <div class="authTipTitle">{{commonTipTitle}}</div>
                        <div
                            v-show="(commonTipButtonTitle!='needHide')"
                            class="authTipButton"
                            @click="commonTipAction"
                        >{{commonTipButtonTitle}}</div>
                    </div>
                </div>

                <history-view
                    @closeFinish="closeFinish"
                    ref="popnumbeAnimation"
                    :isShow="isShowHistory"
                    :infoModel="recordSelectMessageExtend"
                ></history-view>

                <div
                    @touchmove.prevent
                    @click="commonAction"
                    v-show="isShowCommonMask"
                    class="commonMask"
                ></div>

                <!-- 授权 -->
                <!-- 非微信 -->
                <div>
                    <!-- 授权弹出层 -->
                    <LoginPop
                        class="warning-author-pop"
                        @authSuccessAfter="authSuccessAfterHandle"
                        :isShow="isAuthStart"
                        :isAuth="isAuthStart"
                        @hide="loginPopHideHandle"
                    />
                    <!-- 为登录、游客弹出层 -->
                    <AuthPop
                        :isShow="loginPopVisible"
                        @cancle="AuthPopcancleHandle"
                    />
                </div>
                <!-- 微信登录注册框 isWeChatLogin-->
                <WeChatLogin
                    :show="isWeChatLogin"
                    @close="weChatLoginClose"
                    refreshPage="1"
                />
                <!-- 授权 -->
            </div>
            <pageFooter slot="page-footer" />
        </MainLayout>
        <!-- 历史公布影响统计 -->
        <div v-if="statisticsChartVisible">
            <StatisticsChart
                :visible="true"
                @close="statisticsChartClose"
                @maskClick="statisticsChartMaskClick"
                :symbol="statisticsSymbol"
                :recordId="Number(record_id)"
                :directType="statisticsChartDirect"
            />
        </div>
        <!-- 最新产品波动数据 -->
        <div v-if="waveVisible">
            <WaveDataTable
                :visible="waveVisible"
                @close="waveDataClose"
                @maskClick="waveMaskClick"
                :symbol="statisticsSymbol"
                :recordId="Number(record_id)"
            />
        </div>
        <!-- web版推广页 广告 -->
        <img
            src="static/img/warning/popularize_pop.png"
            class="web-popularize-ad"
            v-if="isWebPopularize"
        />
        <cube-popup
            type="my-popup"
            ref="popularizeAd"
            :maskClosable="true"
        >
            <img src="static/img/warning/popularize_pop.png" />
        </cube-popup>
    </div>
</template>

<script>
import SelectView from "../components/SelectView";
import WechatNotice from "../components/WechatNotice";
import RefreshLoading from "../components/RefreshLoading";
import HistoryView from "../components/HistoryView";
import MessageView from "../components/MessageView";
import calendarNormal from "./homePage/img/new-calendar@2x.png";
import calendarSelect from "./homePage/img/new-calendar-select@2x.png";
import needmessage from "./homePage/img/new-needmessage.png";
import needauth from "./homePage/img/new-needauth.png";
import needproduct from "./homePage/img/new-needproduct.png";
import arrowup from "./homePage/img/new-shop_blue.png";
import arrowdown from "./homePage/img/new-shop_noblue.png";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import request from "@services/documentary.js";
import PageFooter from "@warning/components/PageFooter";
import draggable from "vuedraggable";
import i18n from '@warning/i18n'
import { getSelectOptions } from "../mapConfig.js";
import {
    isWebPopularize,
    commonError,
    getSearchParams,
    numberFixed,
    getMoneyAmount,
    getPropertyForObject,
    getDataFoxAxiosRequest,
    getInfoFromSessionStorage,
    backToApp,
    isPlatformCodeSe,
    saveInfoToSessionStorage,
    getIsNotificationNeedOpen,
    isIos,
    getInfoFromApp,
    getPlatformCode,
    getDeviceModel,
    getStickyTopValue,
    createVconsoleScript,
    getSymbos,
    getAuthStatu,
    setCookie,
    getCookie,
    getAccountType,
    trackEventGeneral,
    getNewPlatform,
    isWechatBind,
    goAppLogin,
    isWechatPlatform,
    isFirstVisite,
    isIaiTraderApp,
    getSymbolInfoById,
    getSymbolInfoByEname,
    noticeToast,
    cookieForFirstShowNotice
} from "@public/js/util.js";
const globalConsts = require("@public/js/consts.js");
export default {
    name: "homePage",
    components: {
        PageFooter,
        draggable,
        MessageView,
        HistoryView,
        RefreshLoading,
        //历史公布影响统计
        StatisticsChart: () => import("@warning/components/StatisticsChart"),
        // 最新产品波动数据
        WaveDataTable: () => import("@warning/components/WaveDataTable"),
        WechatNotice,
        SelectView
    },
    data() {
        return {
            isWebPopularize: false,
            bindWechat: true,
            guiderShow: false,
            // 历史影响统计类型 tab的当前选中index
            statisticsChartDirect: 1,
            bodystartY: 0,
            isLoadAllShop: true, //控制第一次获取所有类型
            watchTime: 0, //watch--websocket更新太频繁 会卡 约定10-15次回调才更新一次
            waveVisible: false,
            statisticsSymbol: 101,
            // 事件预警图表显示隐藏
            statisticsChartVisible: false,
            recommendIndexOffsetTop: {}, //记录所有dom的index下标+dom的offsetTop，解决滑动
            recommendAllPriceKey: {}, //按symbol_id生成对象，key为symbol_id value为该symbol_id分布的所有位置。。。
            recommendPartKey: [], //记录当前屏幕下的显示的几个行情dom，websocket只更新这四个ui，避免不显示区域更新dom
            rateNumber: 4,
            startTouch: {},
            priceBoxList: [],
            recordSelectTop: false, //是否触发第一个产品
            recordTimer: {},
            firstCreateTime: true,
            recordSelectWebsocketList: [], //记录 自选 行情列表id
            recordRecommendWebsocketList: [], //记录 推荐 行情列表id
            isRefresh: false,
            // 授权
            isAuthStart: false,
            loginPopVisible: false,
            isWeChatLogin: false,
            getSelectOptions: getSelectOptions,
            getSymbolInfoById: getSymbolInfoById,
            isButtonRresh: false,
            isScrollBottom: false, //是否出发底部刷新
            isAlreadyRresh: false,
            selfSelectMessage: [],
            handleMessageList: [],
            arrowup: arrowup,
            arrowdown: arrowdown,
            shopLenght: 4,
            allShop: [{ symbol: "0", name: this.$t('homePage.allBtnTitle'), select: true }],
            allType: [
                { symbol: "0", name: this.$t('homePage.allBtnTitle'), select: true },
                { symbol: "3", name: this.$t('homePage.priceChange'), select: false },
                { symbol: "5", name: this.$t('homePage.major_Thing'), select: false },
                { symbol: "4", name: this.$t('homePage.k_form'), select: false },
                { symbol: "6", name: this.$t('homePage.signal_recommend'), select: false }
            ],
            recordSelectMessageExtend: { symbol_id: "" }, //记录选中信息
            isShowCommonMask: false, //显示公共蒙层

            isShowHistory: false, //是否显示历史弹窗
            commonTipImg: needauth, //共用空占位
            commonTipTitle: "服务授权后，可添加自选异动盯盘", //共用空占位
            commonTipButtonTitle: "点击授权", //共用空占位

            isAuth: false, //是否授权
            isLogined: false, //是否登录
            isGuest: false,

            isHaveProduct: true, //是否有品种
            isHaveMessage: true, //是否有消息
            isHaveDeployMessage: true,
            isSelect: true, //是否选择"自选"，否则'推荐'  //默认展示自选
            scrollCurentData: this.getDaysFromDateString(), //推荐 滚动显示日期,
            recommandDate: this.getDaysFromDateString(),
            recordLastDate: "",
            recordWebsocketKeyIndex: {}, //记录websocket 定位匹配item下标 快速更新数据
            calendarNormal: calendarNormal, //日历图片切换
            calendarSelect: calendarSelect, //日历图片切换
            isShowDate: false, //是否显示下来选择日期
            isShowSort: false, //是否显示下来排序品种
            position: top,
            messageParams: {
                platform: "PF12",
                userid: "",
                account: "",
                symbol: "",
                date: "",
                cursor: 0,
                wmid: 0,
                pageSize: 20
            },
            creatPaddingTime: false,
            creatTime: false,
            isTopFixBox: false,
            dateList: [],
            groupTapList: [{ name: this.$t('homePage.allBtnTitle'), symbol: "all", select: true }],
            groupListData: [],
            isShowShop: false,
            isShowType: false,
            shopAndType: true, //默认渲染市场
            recordSelectItem: {}, //记录品种选中
            recordCurentDate: { date: this.getDaysFromDateString() }, //记录当前日期
            recordShopSelect: {}, //记录市场选中
            recordTypeSelect: {}, //记录类型选中
            selectedLabelDefault: "select",
            getMessageListParam: {
                type: "0",
                m_type: "0",
                pageSize: "10",
                cursor: "0"
            },
            //记录固定头部的总高度
            topFixHeight: "",
            //记录头部和功能描述的总高度
            topAndPageAcHeight: "",
            tabs: [
                {
                    label: this.$t('homePage.freeTab'),
                    value: "select"
                },
                {
                    label: this.$t('homePage.recommendTab'),
                    value: "unselect"
                }
            ],
            record_id: ""
        };
    },
    mounted() {
        // this.authTrigger()
        // document.body.addEventListener('touchstart',this.bodyTouchstart, {passive: false})
        // document.body.addEventListener('touchmove',this.bodyTouchmove, {passive: false})
        var that = this;
        this.isAuth = this.$config.isLogined();
        try {
            this.topAndPageAcHeight = document.getElementsByTagName("header")[0].offsetHeight +
                this.$refs.pageTitleBox.offsetHeight +
                "px";

        } catch (e) {
            console.error(e.message)
        }

        setTimeout(() => {
            this.topFixHeight = this.$refs.fixBoxRef.offsetHeight;
        }, 1500);
        noticeToast(this);

        // 显示一次价格盯盘引导页 ///////////////////////
        cookieForFirstShowNotice({
            cookieConfig: {
                key: globalConsts.cookies.homePageGuideKey,
                version: 1
            },
            callback: function () {
                that.$nextTick(function () {
                    that.guiderShow = true;
                });
            }
        });
    },
    watch: {
        getSymbolsData: function (val, oldValue) {
            const { symbol, changeRate, new_price, symbolInt, ask, bid } = val;
            try {
                if (this.isSelect) {
                    var item = this.groupListData[
                        this.recordWebsocketKeyIndex[symbolInt]
                    ];
                    if (!!item) {
                        var oldItem = this.priceBoxList[
                            this.recordWebsocketKeyIndex[symbolInt]
                        ];
                        if (changeRate != undefined && changeRate != null) {
                            oldItem.isUp = !JSON.stringify(changeRate).startsWith("-");
                        }
                        parseFloat(new_price) - parseFloat(oldItem.new_price) > 0
                            ? (oldItem.priceUp = true)
                            : (oldItem.priceUp = false);
                        parseFloat(ask) - parseFloat(oldItem.ask) > 0
                            ? (oldItem.askUp = true)
                            : (oldItem.askUp = false);
                        parseFloat(bid) - parseFloat(oldItem.bid) > 0
                            ? (oldItem.bidUp = true)
                            : (oldItem.bidUp = false);
                        oldItem.new_price = new_price;
                        oldItem.ask = ask;
                        oldItem.bid = bid;
                        oldItem.changeRate = (changeRate * 100).toFixed(2) + "%";
                        this.priceBoxList[
                            this.recordWebsocketKeyIndex[symbolInt]
                        ].changeRate = (changeRate * 100).toFixed(2) + "%";
                        this.groupListData[
                            this.recordWebsocketKeyIndex[symbolInt]
                        ].changeRate = (changeRate * 100).toFixed(2) + "%";
                    }
                } else {
                    //获取本symbol—id在屏幕窗口上显示几个。。。当需要获取屏幕显示的几个作为websorket更新的对象时可以使用
                    this.recommendPartKey.forEach((updateItemInfo, index) => {
                        let oneSymbolId = "";
                        let twoSymbolId = "";
                        let isMorePrice = updateItemInfo.symbol.indexOf(","); //重要事件单个item有两个行情入口
                        let updateItem = this.handleMessageList[updateItemInfo.groupIndex]
                            .messageList[updateItemInfo.listIndex];
                        if (isMorePrice) {
                            oneSymbolId = updateItemInfo.symbol.split(",")[0];
                            twoSymbolId = updateItemInfo.symbol.split(",")[1];
                            if (oneSymbolId == symbolInt) {
                                updateItem.oneSymbolId = oneSymbolId;
                                updateItem.changeRate = (changeRate * 100).toFixed(2) + "%";
                                updateItem.changeRateIsUp = !JSON.stringify(
                                    changeRate
                                ).startsWith("-");
                                if (updateItem.changeRateIsUp) {
                                    updateItem.changeRate = `+${updateItem.changeRate}`;
                                }
                            } else if (twoSymbolId == symbolInt) {
                                updateItem.twoSymbolId = twoSymbolId;
                                updateItem.twoChangeRate = (changeRate * 100).toFixed(2) + "%";
                                updateItem.twoChangeRateIsUp = true;
                                updateItem.twoChangeRateIsUp = !JSON.stringify(
                                    changeRate
                                ).startsWith("-");
                                if (updateItem.twoChangeRateIsUp) {
                                    updateItem.twoChangeRate = `+${updateItem.twoChangeRate}`;
                                }
                            }
                        } else {
                            if (updateItemInfo.symbol == symbolInt) {
                                updateItem.changeRate = (changeRate * 100).toFixed(2) + "%";
                                updateItem.changeRateIsUp = !JSON.stringify(
                                    changeRate
                                ).startsWith("-");
                                if (updateItem.changeRateIsUp) {
                                    updateItem.changeRate = `+${updateItem.changeRate}`;
                                }
                            }
                        }
                    });
                    // return

                    // var updateInfoList = this.recommendAllPriceKey[symbolInt]
                    // if (updateInfoList == undefined) {
                    //   return
                    // }
                    // updateInfoList.forEach((dateItem, index) => {
                    //   dateItem.messageListIndex.forEach((messageItem, messageIndex) => {
                    //     var messageViewItem = this.handleMessageList[dateItem.dateIndex].messageList[messageItem]
                    //     if (messageViewItem.type == 5) {
                    //       if (messageViewItem.extend.type == 3) {
                    //         var oneId = getSymbolInfoByEname(messageViewItem.extend.symbol_list.split(',')[0]).id[0]
                    //         var twoId = getSymbolInfoByEname(messageViewItem.extend.symbol_list.split(',')[1]).id[0]
                    //         if (oneId == symbolInt) {
                    //           messageViewItem.oneSymbolId = oneId
                    //           messageViewItem.changeRate = (changeRate * 100).toFixed(2) + '%'
                    //
                    //           if (changeRate != undefined && changeRate != null) {
                    //             messageViewItem.changeRateIsUp = !(JSON.stringify(changeRate).startsWith('-'));
                    //             if (messageViewItem.changeRateIsUp) {
                    //               messageViewItem.changeRate = `+${messageViewItem.changeRate}`
                    //             }
                    //           }
                    //         }
                    //         if (twoId == symbolInt) {
                    //           messageViewItem.twoSymbolId = twoId
                    //           messageViewItem.twoChangeRate = (changeRate * 100).toFixed(2) + '%'
                    //           messageViewItem.twoChangeRateIsUp = true
                    //           if (changeRate != undefined && changeRate != null) {
                    //             messageViewItem.twoChangeRateIsUp = !(JSON.stringify(changeRate).startsWith('-'));
                    //             if (messageViewItem.twoChangeRateIsUp) {
                    //               messageViewItem.twoChangeRate = `+${messageViewItem.twoChangeRate}`
                    //             }
                    //           }
                    //         }
                    //       }
                    //     } else {
                    //       messageViewItem.changeRate = (changeRate * 100).toFixed(2) + '%'
                    //       if (changeRate != undefined && changeRate != null) {
                    //         messageViewItem.changeRateIsUp = !(JSON.stringify(changeRate).startsWith('-'));
                    //         if (messageViewItem.changeRateIsUp) {
                    //           messageViewItem.changeRate = `+${messageViewItem.changeRate}`
                    //         }
                    //       }
                    //     }
                    //   })
                    // })
                }
            } catch (e) { }
        },
        // websocket建立并为打开状态发送默认订阅数据
        websockForSymbolsState: function (newValue, oldValue) {
            const t = this;
            if (newValue == 1 && oldValue == 4) {
                if (t.isSelect) {
                    t.symbolsWebSocketSendMsg({
                        names: t.recordSelectWebsocketList,
                        type: "modify"
                    });
                } else {
                    t.symbolsWebSocketSendMsg({
                        names: t.recordRecommendWebsocketList,
                        type: "modify"
                    });
                }
                // websocket重链
            } else if (newValue == 0) {
                // 建立websocket连接（行情数据）
                setTimeout(function () {
                    t.createWebSocketForSymbols();
                }, 4000);
            }
        }
    },
    computed: {
        ...mapState(["websockForSymbolsState"]),
        ...mapGetters(["getSymbolsData"]),
        getShowHeader() {
            if (this.isWebPopularize || this.$config.isWechatPlatform) {
                return false;
            }
            return !this.isTopFixBox
        },
        shopSelect: function () {
            var allTitle = [];
            this.allShop.forEach(item => {
                if (item.select) {
                    allTitle.push(item.name);
                }
            });
            return this.allShop[0].select ? this.$t('homePage.allShopTitle') : allTitle.join("、");
        },
        typeSelect: function () {
            var allTitle = [];
            this.allType.forEach(item => {
                if (item.select) {
                    allTitle.push(item.name);
                }
            });
            return this.allType[0].select ? this.$t('homePage.allTypeTitle') : allTitle.join("、");
        }
    },
    created() {
        if (isWebPopularize()) {
            this.isWebPopularize = true;
        }
        this.recordTypeSelect = this.allType[0];
        this.recordShopSelect = this.allShop[0];

        this.getWechatStatu();
        this.createWebSocketForSymbols();
        // this.getGroupData(true)
        this.getUserAuthStatusRequest();

        if (this.$route.query.tabIndex) {
            if (this.$route.query.tabIndex == 1) {
                //展示自选
                this.selectedLabelDefault = "select";
                this.isSelect = true;
            } else {
                //展示市场
                this.selectedLabelDefault = "unselect";
                this.isSelect = false;
                this.setSingularTypeByUrlParm()
            }
        } else {
            //默认展示自选
            this.setSingularTypeByUrlParm()
        }
    },
    beforeRouteLeave(to, from, next) {
        this.symbolsWebSocketSendMsg({ names: [], type: "modify" });
        next();
    },
    destroyed() {
        clearInterval(this.recordTimer); // 清除定时器
        this.recordTimer = null;
    },
    i18n,
    methods: {
        popularizeLink() {
            if (this.isWebPopularize) {
                location.href = "https://m.se6868a.com/lp147_ty_D024BW_P032AX_201908s50.html?utm_source=iaimyself&utm_medium=Pick-TG-PC&utm_campaign=iai_M035JW&utm_content=lp147_D024BW_P032AX&utm_term=11"
            }
        },
        toSeOpenAccount() {
            // pc首页推广
            if (this.isWebPopularize) {
                location.href = "https://m.se6868x.com/lp194_cg_D024BW_P035JW_mail00.html?utm_source=iaimyself&utm_medium=Trading-market-PC-TG&utm_campaign=iai_M035JW&utm_content=lp192_D024BW_P035JW&utm_term=191224"
            } else {
                location.href = "https://m.se6868a.com/lp147_ty_D024BW_P032AX_201908s50.html?utm_source=iaimyself&utm_medium=50&utm_campaign=iai_M035JW&utm_content=lp147_D024BW_P032AX&utm_term=11"
            }

        },
        //如果地址栏有参数 singularType 默认选择推荐 下重要事件
        setSingularTypeByUrlParm() {
            let _singularType = getSearchParams(globalConsts.urlParamsKeys.singularType.name);
            if (_singularType == globalConsts.urlParamsKeys.singularType.value.importantEvent) {
                // const _allType = this.allType.concat([])
                //     _allType[2].isSelect = true;
                //     _allType[0].isSelect = false;
                //     _allType[0].select = false;
                //     this.allType = _allType
                //     this.isShowType = true
                //     this.selectType(this.allType[2])
                this.selectType(this.allType[2])
                return
            }
            this.getMessageData();
        },
        isWechatPlatform() {
            return isWechatPlatform()
        },
        getAdTitle() {
            return isWechatPlatform() ? '广告' : '【开通微信通知】第一时间获取更高级的盯盘攻略玩法。'
        },
        getDaysFromDateString(dateStr) {
            let dateList = [
                this.$t('homePage.sunday'),
                this.$t('homePage.monday'),
                this.$t('homePage.tuesday'),
                this.$t('homePage.wednesday'),
                this.$t('homePage.thursday'),
                this.$t('homePage.friday'),
                this.$t('homePage.saturday')
            ];
            let todayDate = new Date();
            let todayStr = `${todayDate.getFullYear()}-${todayDate.getMonth() +
                1}-${todayDate.getDate()}`;
            if (!!dateStr) {
                let paramDate = new Date(dateStr);
                if (dateStr == todayStr) {
                    return `${this.$t('homePage.today')} ${dateStr} ${dateList[todayDate.getDay()]}`;
                } else {
                    return `${dateStr} ${dateList[paramDate.getDay()]}`;
                }
            } else {
                return `${this.$t('homePage.today')} ${todayStr} ${dateList[todayDate.getDay()]}`;
            }
        },
        getReadyShowDom(domList, beginIndex, length) {
            var needList = domList.slice(beginIndex, length);
            this.recommendPartKey = [];
            var allSymbol = [];
            needList.forEach((dom, index) => {
                if (dom.dataset.type == "4" || dom.dataset.type == "3") {
                    allSymbol.push({
                        symbol: dom.dataset.id,
                        groupIndex: dom.dataset.dateindex,
                        listIndex: dom.dataset.index
                    });
                } else if (dom.dataset.type == "5") {
                    if (dom.dataset.sontype == "3") {
                        allSymbol.push({
                            symbol: this.getMoreId(dom.dataset.listsymbol, true),
                            groupIndex: dom.dataset.dateindex,
                            listIndex: dom.dataset.index
                        });
                    }
                }
            });
            this.recommendPartKey = allSymbol;
        },
        getWechatStatu() {
            request.isWechatEntyShow()
                .then(({ wx_show = "", wx_bind = "" }) => {
                    // 未开通  wx_bind:1//1绑定 0未绑定
                    if (wx_bind == 0) {
                        this.bindWechat = false;
                    }
                })
                .catch(e => {
                    commonError(e, this);
                });
        },
        isShowWechatNotice() {
            // 微信平台
            if (isWechatPlatform) return true;
            if (this.isSelect && !this.bindWechat && this.isAuth) {
                return true;
            } else {
                return false;
            }
        },
        toWechatNotice() {
            if (isWechatPlatform()) {
                location.href = "https://m.se6868x.com/lp194_cg_D024BW_P035JW_mail00.html?utm_source=iaimyself&utm_medium=Optional&utm_campaign=iai_M035JW&utm_content=lp192_D024BW_P035JW&utm_term=191224"
            } else {
                this.$router.push({
                    name: "weChatNotice"
                });
            }
        },
        toProductDetail(symbolId) {
            this.$router.push({
                name: "productDetailPage",
                query: {
                    symbol: symbolId
                }
            });
        },
        bodyTouchstart(e) {
            this.bodystartY = e.touches[0].pageY;
            console.log("body-touchstart=====" + this.bodystartY);
        },
        bodyTouchmove(e) {
            let endY = e.touches[0].pageY; //记录手指触摸的移动中的坐标
            console.log("body-touchmove=====" + endY);
            console.log("document.body.scrollTop=====" + document.body.scrollTop);

            if (isIos()) {
                if (!this.isTopFixBox) {
                    return;
                }
                let listTop = this.$refs.panelListBox.scrollTop; //
                let ch = this.$refs.panelListBox.clientHeight;
                let scrollH = this.$refs.panelListBox.scrollHeight;
            }
        },
        bodyTouchmove(e) {
            let endY = e.touches[0].pageY; //记录手指触摸的移动中的坐标
            console.log("body-touchmove=====" + endY);
            console.log("document.body.scrollTop=====" + document.body.scrollTop);

            if (isIos()) {
                if (!this.isTopFixBox) {
                    return;
                }
                let listTop = this.$refs.panelListBox.scrollTop; //
                let ch = this.$refs.panelListBox.clientHeight;
                let scrollH = this.$refs.panelListBox.scrollHeight;
            }
        },
        setAllShop(idList) {
            idList.forEach((id, index) => {
                if (id == 1) {
                    this.allShop.push({ symbol: "1", name: this.$t('homePage.exchange'), select: false });
                } else if (id == 2) {
                    this.allShop.push({ symbol: "2", name: this.$t('homePage.commodity'), select: false });
                } else if (id == 3) {
                    this.allShop.push({ symbol: "3", name: this.$t('homePage.precious_metal'), select: false });
                } else if (id == 4) {
                    this.allShop.push({ symbol: "4", name: this.$t('homePage.exponent'), select: false });
                }
            });
        },
        handleTimeList(data) {
            var finalItem = {};
            var allList = [];
            var testId = [];
            //日期分组算法
            data.forEach((item, index) => {
                testId.push(item.symbol_id);
                var time = item.created_at.replace(/ \d{2}:\d{2}:\d{2}/, "");
                if (finalItem.hasOwnProperty(time)) {
                    finalItem[time].push(item);
                } else {
                    finalItem[time] = [];
                    finalItem[time].push(item);
                    allList.push({ date: time, messageList: finalItem[time] });
                }
            });
            this.handleMessageList = allList;
            this.handleKeyWhere(allList);
        },
        handleKeyWhere(dataList, isAll = true) {
            //记录每个key在不同日期的分布
            try {
                var finalItem = {};

                //key分组算法，优化websocket匹配key-快速更新websocket
                dataList.forEach((dateItem, dateIndex) => {
                    dateItem.messageList.forEach((messageItem, messageIndex) => {
                        var time = messageItem.created_at.replace(/ \d{2}:\d{2}:\d{2}/, "");
                        if (messageItem.type == 5) {
                            if (messageItem.extend.type == 3) {
                                var oneId = getSymbolInfoByEname(
                                    messageItem.extend.symbol_list.split(",")[0]
                                ).id[0];
                                var twoId = getSymbolInfoByEname(
                                    messageItem.extend.symbol_list.split(",")[1]
                                ).id[0];
                                if (
                                    finalItem.hasOwnProperty(oneId) ||
                                    finalItem.hasOwnProperty(twoId)
                                ) {
                                    if (finalItem.hasOwnProperty(oneId)) {
                                        var alreadyItem = {};
                                        finalItem[oneId].forEach(
                                            (keyListItem, keyListItemIndex) => {
                                                if (keyListItem.date == time) {
                                                    alreadyItem = keyListItem;
                                                }
                                            }
                                        );
                                        if (Object.keys(alreadyItem).length == 0) {
                                            var newKeyItem = {
                                                dateIndex: dateIndex,
                                                messageListIndex: [],
                                                date: dateItem.date
                                            };
                                            newKeyItem.messageListIndex.push(messageIndex);
                                            finalItem[messageItem.symbol_id].push(newKeyItem);
                                        } else {
                                            alreadyItem.messageListIndex.push(messageIndex);
                                        }
                                    }
                                    if (finalItem.hasOwnProperty(twoId)) {
                                        var alreadyItem = {};
                                        finalItem[twoId].forEach(
                                            (keyListItem, keyListItemIndex) => {
                                                if (keyListItem.date == time) {
                                                    alreadyItem = keyListItem;
                                                }
                                            }
                                        );
                                        if (Object.keys(alreadyItem).length == 0) {
                                            var newKeyItem = {
                                                dateIndex: dateIndex,
                                                messageListIndex: [],
                                                date: dateItem.date
                                            };
                                            newKeyItem.messageListIndex.push(messageIndex);
                                            finalItem[messageItem.symbol_id].push(newKeyItem);
                                        } else {
                                            alreadyItem.messageListIndex.push(messageIndex);
                                        }
                                    }
                                } else {
                                    if (!!oneId) {
                                        var finalList = [];
                                        var oneNewKeyItem = {
                                            dateIndex: dateIndex,
                                            messageListIndex: [],
                                            date: dateItem.date
                                        };
                                        oneNewKeyItem.messageListIndex.push(messageIndex);
                                        finalList.push(oneNewKeyItem);
                                        finalItem[oneId] = finalList;
                                    }
                                    if (!!twoId) {
                                        var twofinalList = [];
                                        var twoNewKeyItem = {
                                            dateIndex: dateIndex,
                                            messageListIndex: [],
                                            date: dateItem.date
                                        };
                                        twoNewKeyItem.messageListIndex.push(messageIndex);
                                        twofinalList.push(twoNewKeyItem);
                                        finalItem[twoId] = twofinalList;
                                    }
                                }
                            }
                        } else {
                            if (finalItem.hasOwnProperty(messageItem.symbol_id)) {
                                var alreadyItem = {};
                                finalItem[messageItem.symbol_id].forEach(
                                    (keyListItem, keyListItemIndex) => {
                                        if (keyListItem.date == time) {
                                            alreadyItem = keyListItem;
                                        }
                                    }
                                );
                                if (Object.keys(alreadyItem).length == 0) {
                                    var newKeyItem = {
                                        dateIndex: dateIndex,
                                        messageListIndex: [],
                                        date: dateItem.date
                                    };
                                    newKeyItem.messageListIndex.push(messageIndex);
                                    finalItem[messageItem.symbol_id].push(newKeyItem);
                                } else {
                                    alreadyItem.messageListIndex.push(messageIndex);
                                }
                            } else {
                                var finalList = [];
                                var newKeyItem = {
                                    dateIndex: dateIndex,
                                    messageListIndex: [],
                                    date: dateItem.date
                                };
                                newKeyItem.messageListIndex.push(messageIndex);
                                finalList.push(newKeyItem);
                                finalItem[messageItem.symbol_id] = finalList;
                            }
                        }
                    });
                });
                isAll
                    ? (this.recommendAllPriceKey = finalItem)
                    : (this.recommendPartKey = finalItem);
            } catch (e) { }
        },
        getMoreId(nameStr, isJoin = true) {
            var idList = [];
            nameStr.split(",").forEach((item, index) => {
                if (index <= 1) {
                    idList.push(
                        isJoin
                            ? getSymbolInfoByEname(item).id[0]
                            : JSON.stringify(getSymbolInfoByEname(item).id[0])
                    );
                }
            });
            return isJoin ? idList.join(",") : idList;
        },
        // 事件预警
        waveMaskClick() {
            this.waveVisible = false;
        },
        waveDataClose() {
            this.waveVisible = false;

            if (this.isSelect) {
                this.symbolsWebSocketSendMsg({
                    names: this.recordSelectWebsocketList,
                    type: "modify"
                });
            } else {
                this.symbolsWebSocketSendMsg({
                    names: this.recordRecommendWebsocketList,
                    type: "modify"
                });
            }
        },
        statisticsChartMaskClick() {
            this.statisticsChartVisible = false;
        },
        statisticsChartClose() {
            this.statisticsChartVisible = false;
        },
        listTouchEnd(e) { },
        listBoxMove(e) {
            console.log("listbox--touchmove事件没有挂壁");

            var endPoint = e.changedTouches[0];
            //计算终点与起点的差值
            var y = endPoint.clientY - this.startTouch.clientY;

            if (Math.abs(y) > 5) {
                if (y > 0) {
                    if (
                        this.$refs.panelListBox.scrollTop == 0 &&
                        this.$refs.panelListBox.scrollHeight ==
                        this.$refs.panelListBox.offsetHeight &&
                        this.isTopFixBox
                    ) {
                        this.isTopFixBox = false;
                        this.$refs.topPaddingRef.style.height = 0;
                    }
                } else {
                }
            }
        },
        listTouchStart(e) {
            this.startTouch = e.touches[0];
            console.log("listbox--touchstart事件没有挂壁");
        },
        getTopHeight() {
            return this.$refs.fixBoxRef.offsetHeight + "px";
        },
        // 调用接口查看是否授权
        getUserAuthStatusRequest() {
            this.isLogined = this.$config.isLogined();
            const t = this;
            request.checkProductAuth().then(({ data }) => {
                const { status = "" } = data;
                t.isAuth = status == 1 ? true : false;
                t.isGuest = status == -5 ? true : false;
                sessionStorage.removeItem(globalConsts.auth.sessionStoryKey);
                saveInfoToSessionStorage(
                    { value: status },
                    globalConsts.auth.sessionStoryKey
                );
            });
        },
        backApp() {
            // iaiTrade app
            if (isIaiTraderApp()) {
                history.back();
            } else {
                backToApp();
            }
        },
        getDate() {
            var date = new Date();
            return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        },
        toRefresh() {
            this.isRefresh = true;
            this.getGroupData(false, this.recordCurentDate.date);
        },
        shopAllMessage(item, productIndex) {
            item.showAll = !item.showAll;
            this.priceBoxList[productIndex].showAll = !this.priceBoxList[productIndex]
                .showAll;
            this.groupListData = [].concat(this.groupListData);
        },
        setNumberToMessgeList() { },
        getName() {
            if (
                this.getChineseName(this.recordSelectMessageExtend.symbol_id) ==
                undefined
            ) {
                return "- -";
            } else {
                return this.getChineseName(this.recordSelectMessageExtend.symbol_id)
                    .cname;
            }
        },
        commonAction() {
            if (this.isShowShop || this.isShowType) {
                this.isShowCommonMask = false;
                this.isShowShop = false;
                this.isShowType = false;
                this.isShowSort = false;
            }

            if (this.isShowSort || this.isShowDate) {
                this.isShowCommonMask = false;
                this.isShowSort = false;
                this.isShowDate = false;
            }
        },
        //======================触发授权流程===================
        // 是否登录
        // 调转登录
        goToLogin() {
            if (getNewPlatform()) {
                this.isWeChatLogin = true;
            } else {
                if (this.isWebPopularize) {
                    this.$refs.popularizeAd.show()
                } else {
                    this.$router.push({ name: "login", query: { loginAfterTo: "index" } });
                }

            }
        },
        isAuthed() {
            //app 未登录
            if (this.$config.userFromType() == "app") {
                // 未登录
                if (!this.$config.isLogined()) {
                    //iai-trade app
                    if (isIaiTraderApp()) {
                        // 跳转登录界面（原生app,url拦截）
                        goAppLogin(this.$router.history.current.path);
                        return false;
                    }
                    //微信服务号
                    if (isWechatPlatform()) {
                        this.isWeChatLogin = true;
                    } else {
                        this.loginPopVisible = true;
                    }
                    return false;
                } else {
                    return true;
                    // 登录后再校验是否授权，如果已校验未登录弹出未登录不提示授权
                }
                // web 未登录
            } else {
                if (!this.$config.isLogined()) {
                    this.goToLogin();
                    return false;
                } else {
                    return true;
                }
            }
        },
        authTrigger() {
            if (this.isAuthed()) {
                this.isLogined = true;
            } else {
                this.isLogined = false;
                return false;
            }
            // 从localstorage获取保存的授权状态，为-1 提示授权
            //微信
            if (isWechatPlatform() && !isWechatBind()) {
                this.isAuthForApp();
                return false;
                //非微信
            } else {
                if (getAuthStatu() === globalConsts.auth.statu.fail) {
                    if (isWechatBind() && getNewPlatform()) {
                    } else {
                        this.isAuthForApp();
                        return false;
                    }
                } else {
                    return true;
                }
            }
        },
        isAuthForApp() {
            // PF00新平台
            if (getNewPlatform() && !isWechatBind()) {
                this.isWeChatLogin = true;
                //01 02 03等老平台
            } else {
                this.isAuthStart = true;
            }
        },
        authSuccessAfterHandle() {
            const t = this;
            request.checkProductAuth().then(({ data }) => {
                const { status = "" } = data;
                t.isAuth = status == 1 ? true : false;
                t.isGuest = status == -5 ? true : false;
                sessionStorage.removeItem(globalConsts.auth.sessionStoryKey);
                saveInfoToSessionStorage(
                    { value: status },
                    globalConsts.auth.sessionStoryKey
                );
            });
            this.getGroupData(true);
        },
        loginPopHideHandle(data) {
            this.isAuthStart = false;
        },
        AuthPopcancleHandle() {
            this.loginPopVisible = false;
        },
        // 隐藏wechatlogin
        weChatLoginClose() {
            this.isWeChatLogin = false;
        },
        //==============是否授权 end============================

        getChineseName(symbol) {
            var item = getSymbolInfoById(symbol);
            var infoArray = item.id;
            if (item == null || item == undefined) {
                return { cname: "- -", ename: "- -" };
            }
            if (!!infoArray) {
                return { cname: infoArray[1], ename: item.uname };
            }
        },
        toPayAction(symbol) {
            if (!this.isAuth || !this.$config.isLogined()) {
                this.authTrigger();
                return;
            }

            if (isIos()) {
                location.href = `https://gts2tubiao/${symbol}`;
            } else {
                window.open(
                    `https://gts2tubiao/${symbol}`,
                    "tubiao",
                    "mobile",
                    "_blank"
                );
            }
        },
        getMessageData(isBottom = false) {
            if (!isBottom) {
                this.getMessageListParam.cursor = "0";
            }
            let userInfo = getInfoFromSessionStorage() || {};
            this.getMessageListParam.platform = getPlatformCode();
            this.getMessageListParam.userid = userInfo.userid;
            this.getMessageListParam.account = userInfo.account;
            var currentSelectShop = [];
            var currentSelectType = [];
            this.allShop.forEach(item => {
                if (item.select) {
                    currentSelectShop.push(item.symbol);
                }
            });
            this.allType.forEach(item => {
                if (item.select) {
                    currentSelectType.push(item.symbol);
                }
            });
            this.getMessageListParam.m_type = currentSelectShop.join(",");
            this.getMessageListParam.type = currentSelectType.join(",");

            request.homePageRecommendMessage({ ...this.getMessageListParam }).then(
                res => {
                    const resData = getDataFoxAxiosRequest(res, this);
                    if (resData) {
                        if (this.isLoadAllShop) {
                            //首次加载
                            this.isLoadAllShop = false;
                            this.shopLenght = resData.types.length;
                            this.setAllShop(resData.types);
                        }
                        this.getMessageListParam.cursor = resData.cursor;
                        if (isBottom) {
                            if (
                                resData.rows.length == 0 &&
                                this.selfSelectMessage.length != 0
                            ) {
                                //防止循环
                                this.$refs.panelListBox.scrollTo(
                                    0,
                                    this.$refs.panelListBox.scrollHeight -
                                    (this.$refs.panelListBox.offsetHeight +
                                        this.$refs.refreshIngBox.offsetHeight)
                                );
                            }

                            var allSymbol = [];
                            resData.rows.forEach((item, index) => {
                                item.oneSymbolId = "";
                                item.changeRate = "";
                                item.changeRateIsUp = false;
                                item.twoSymbolId = "";
                                item.twoChangeRateIsUp = false;
                                item.twoChangeRate = "";
                                if (item.type == "4" || item.type == "3") {
                                    allSymbol.push(JSON.stringify(item.symbol_id));
                                } else if (item.type == "5") {
                                    if (item.extend.type == "3") {
                                        var oneId = getSymbolInfoByEname(
                                            item.extend.symbol_list.split(",")[0]
                                        ).id[0];
                                        var twoId = getSymbolInfoByEname(
                                            item.extend.symbol_list.split(",")[1]
                                        ).id[0];

                                        if (!!oneId) {
                                            allSymbol.push(JSON.stringify(oneId));
                                        }
                                        if (!!twoId) {
                                            allSymbol.push(JSON.stringify(twoId));
                                        }
                                    }
                                }
                            });

                            //底部加载添加
                            this.selfSelectMessage = this.selfSelectMessage.concat(
                                resData.rows
                            );

                            //处理数据源，分组数据
                            this.handleTimeList(this.selfSelectMessage);
                            var recordAllSymbol = []; //记录所有推荐行情id，当websocket断开重链时使用
                            this.selfSelectMessage.forEach((item, index) => {
                                if (item.type == "4" || item.type == "3") {
                                    recordAllSymbol.push(JSON.stringify(item.symbol_id));
                                } else if (item.type == "5") {
                                    if (item.extend.type == "3") {
                                        var oneId = getSymbolInfoByEname(
                                            item.extend.symbol_list.split(",")[0]
                                        ).id[0];
                                        var twoId = getSymbolInfoByEname(
                                            item.extend.symbol_list.split(",")[1]
                                        ).id[0];
                                        if (!!oneId) {
                                            recordAllSymbol.push(JSON.stringify(oneId));
                                        }
                                        if (!!twoId) {
                                            recordAllSymbol.push(JSON.stringify(twoId));
                                        }
                                    }
                                }
                            });

                            this.recordRecommendWebsocketList = recordAllSymbol;
                            this.symbolsWebSocketSendMsg({ names: allSymbol, type: "add" });
                        } else {
                            if (resData.rows.length != 0) {
                                this.scrollCurentData = resData.rows[0].created_at;
                            }
                            //判断消息条数
                            if (resData.rows.length == 0) {
                                this.isHaveDeployMessage = false;
                                this.isTopFixBox = false;
                                this.$refs.topPaddingRef.style.height = "0";
                            } else {
                                this.isHaveDeployMessage = true;
                            }
                            try {
                                this.$refs.panelListBox.scrollTo(0, 5);
                            } catch (e) {
                                console.error(e.message)
                            }

                            var allSymbol = [];
                            resData.rows.forEach((item, index) => {
                                item.oneSymbolId = "";
                                item.changeRate = "";
                                item.changeRateIsUp = false;
                                item.twoSymbolId = "";
                                item.twoChangeRateIsUp = false;
                                item.twoChangeRate = "";
                                if (item.type == 4 || item.type == 3) {
                                    allSymbol.push(JSON.stringify(item.symbol_id));
                                } else if (item.type == "5") {
                                    if (item.extend.type == "3") {
                                        var oneId = getSymbolInfoByEname(
                                            item.extend.symbol_list.split(",")[0]
                                        ).id[0];
                                        var twoId = getSymbolInfoByEname(
                                            item.extend.symbol_list.split(",")[1]
                                        ).id[0];
                                        if (!!oneId) {
                                            allSymbol.push(JSON.stringify(oneId));
                                        }
                                        if (!!twoId) {
                                            allSymbol.push(JSON.stringify(twoId));
                                        }
                                    }
                                }
                            });

                            //不是上拉刷新放直接替换
                            this.selfSelectMessage = resData.rows;

                            setTimeout(() => {
                                let slice = Array.prototype.slice;
                                var domList = slice.call(
                                    document.querySelectorAll(".priceNoticeItem")
                                );
                                this.getReadyShowDom(domList, 0, 6);
                            }, 1000);

                            //处理数据源，分组数据
                            this.handleTimeList(this.selfSelectMessage);
                            this.recordRecommendWebsocketList = allSymbol;
                            this.symbolsWebSocketSendMsg({
                                names: allSymbol,
                                type: "modify"
                            });
                        }
                        this.isScrollBottom = false;
                    } else {
                        if (isBottom) {
                            if (this.selfSelectMessage.length != 0) {
                                this.$refs.panelListBox.scrollTo(
                                    0,
                                    this.$refs.panelListBox.scrollHeight -
                                    (this.$refs.panelListBox.offsetHeight +
                                        this.$refs.refreshIngBox.offsetHeight)
                                );
                            }
                        }
                        this.isScrollBottom = false;
                    }
                },
                error => {
                    if (isBottom) {
                        if (this.selfSelectMessage.length != 0) {
                            this.$refs.panelListBox.scrollTo(
                                0,
                                this.$refs.panelListBox.scrollHeight -
                                (this.$refs.panelListBox.offsetHeight +
                                    this.$refs.refreshIngBox.offsetHeight)
                            );
                        }
                    }
                    this.isScrollBottom = false;
                }
            );
        },
        toShowShop() {
            if (this.isShowType) {
                this.isShowType = false;
                this.isShowCommonMask = false;
                this.isShowSort = false;
            }
            this.isShowCommonMask = !this.isShowCommonMask;
            this.isShowType = false;
            this.shopAndType = true;
            this.isShowShop = !this.isShowShop;
            this.isShowSort = !this.isShowSort;
        },
        toShowType() {
            if (this.isShowShop) {
                this.isShowShop = false;
                this.isShowCommonMask = false;
                this.isShowSort = false;
            }
            this.isShowCommonMask = !this.isShowCommonMask;
            this.shopAndType = false;
            this.isShowType = !this.isShowType;
            this.isShowSort = !this.isShowSort;
        },

        addClass(isAdd = true) {
            //添加homePageNoTouch 去除touch对z-index的影响
            if (isAdd) {
                document
                    .getElementsByClassName("page-layout")[0]
                    .classList.add("homePageNoTouch");
            } else {
                document
                    .getElementsByClassName("page-layout")[0]
                    .classList.remove("homePageNoTouch");
            }
        },
        commonTipAction() {
            if (this.commonTipButtonTitle == this.$t('homePage.authBtnTitle')) {
                this.authTrigger();
            } else if (this.commonTipButtonTitle == this.$t('homePage.addFreeBtnTitle')) {
                this.$router.push({ name: "optionalPage", query: { isShow: 1 } });
            } else if (this.commonTipButtonTitle == "needHide") {
            }
        },
        aopAction() {
            if (!this.isAuth || !this.$config.isLogined()) {
                this.authTrigger();
                return true;
            }
        },
        showStatistics(item) {
            if (!this.isWebPopularize) {
                if (!this.isAuth || !this.$config.isLogined()) {
                    this.authTrigger();
                    return;
                }
            }
            // survey_price 预测值  //previous_price前值  //actual_price公布值
            //没有公布值默认值显示 第一个tab选项
            const {
                extend: {
                    record_id = "",
                    survey_price = "",
                    actual_price = "",
                    previous_price = ""
                } = {}
            } = item;
            // 选择历史统计的方向 2发布>预测  1发布<预测  3发布==等于预测
            let statisticsChartDirect = 2;
            if (actual_price !== null) {
                const _actual_price = Number(actual_price);
                const _survey_price = Number(survey_price);
                if (_actual_price < _survey_price * (1 - 0.1)) {
                    statisticsChartDirect = 1;
                } else if (_actual_price > _survey_price * (1 + 0.1)) {
                    statisticsChartDirect = 2;
                } else {
                    statisticsChartDirect = 3;
                }
            }

            this.statisticsChartDirect = statisticsChartDirect;
            this.record_id = record_id;
            this.statisticsSymbol = item.symbol_id;
            this.statisticsChartVisible = true;
        },
        showNumberWave(item) {
            if (!this.isAuth || !this.$config.isLogined()) {
                this.authTrigger();
                return;
            }
            const { extend: { record_id = "" } = {} } = item;
            this.record_id = record_id;
            this.statisticsSymbol = item.symbol_id;
            this.waveVisible = true;
        },
        toShowHistory(item) {
            this.isShowHistory = true;
            this.recordSelectMessageExtend = item;
            // setTimeout(() => {
            //   this.$refs.popnumbeAnimation.$refs.popnumbeAnimation.style.bottom=0
            //   this.addClass()}, 100)
        },
        closeFinish() {
            this.isShowHistory = false;
        },
        isShowProductScroll() {
            if (this.isSelect) {
                if (this.isAuth) {
                    if (this.isHaveProduct) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            } else {
                return true;
            }
        },
        isShowCommonTip() {
            if (this.isSelect == false) {
                if (this.isHaveDeployMessage == false) {
                    this.commonTipImg = needmessage;
                    this.commonTipTitle = this.$t('homePage.noRecommendDataTitle');
                    this.commonTipButtonTitle = "needHide";
                    return true;
                } else {
                    return false;
                }
            } else {
                if (!this.isAuth || !this.isLogined) {
                    this.commonTipImg = needauth;
                    this.commonTipTitle = this.$t('homePage.authTitle');
                    this.commonTipButtonTitle = this.$t('homePage.authBtnTitle');
                    return false;
                } else {
                    if (this.isHaveProduct == false) {
                        this.commonTipImg = needproduct;
                        this.commonTipTitle = this.$t('homePage.addFreeTitle')
                        this.commonTipButtonTitle = this.$t('homePage.addFreeBtnTitle');
                        return true;
                    } else {
                        if (this.isHaveMessage == false) {
                            this.commonTipImg = needmessage;
                            this.commonTipTitle = this.$t('homePage.noRecommendDataTitle');
                            this.commonTipButtonTitle = "needHide";
                            return false;
                        } else {
                            return false;
                        }
                    }
                }
            }
        },
        changeType(value) {
            this.isShowCommonMask = false; //隐藏公用蒙层
            this.isShowDate = false;
            this.isShowShop = false;
            this.isShowSort = false;
            this.isShowType = false;
            if (value == "select") {
                if (!this.isAuth || !this.$config.isLogined()) {
                    this.isTopFixBox = false;
                    this.$refs.topPaddingRef.style.height = "0";
                }
                this.isSelect = true;
                this.symbolsWebSocketSendMsg({
                    names: this.recordSelectWebsocketList,
                    type: "modify"
                });
                this.$router.push({name:'homePage',query:Object.assign({},this.$route.query,{tabIndex:1})})

            } else {
                this.isSelect = false;
                this.isButtonRresh = true;
                this.getMessageData();

               this.$router.push({name:'homePage',query:Object.assign({},this.$route.query,{tabIndex:0})})
            }
            setTimeout(() => {
                this.$refs.panelListBox.style.top = this.getTopHeight();
            }, 100);
        },
        homePageScroll($event) {
            console.log("首页滑动距离====" + $event.target.scrollTop);
        },
        listScroll($event) {
            if ($event.target.scrollTop == "0") {
                if (this.recordSelectTop) {
                    this.recordSelectTop = false;
                    this.$refs.panelListBox.scrollTo(0, 5);
                    return;
                }
                this.$refs.topPaddingRef.style.height = 0;
                this.$refs.transitionBox.style.height = 0;
                this.isTopFixBox = false;
                // this.addClass(false)
            }

            //推荐选项专用 ----当需要日期悬停时，必须通过这样的计算方式获取
            if (!this.isSelect) {
                let slice = Array.prototype.slice;
                var domList = slice.call(document.querySelectorAll(".priceNoticeItem"));
                try {
                    domList.forEach((domItem, domIndex) => {
                        if (
                            parseInt($event.target.scrollTop) < parseInt(domItem.offsetTop)
                        ) {
                            // var dataItem = JSON.parse(domItem.dataset.item)
                            // var needList = domList.slice(domIndex-1,domIndex+4)
                            this.getReadyShowDom(domList, domIndex - 1, domIndex + 4);
                            // this.recommendPartKey = []
                            // var allSymbol =[]
                            // console.log(JSON.parse(needList[0].dataset.item).type_name)
                            // needList.forEach((dom,index)=>{
                            //   var showItem =  JSON.parse(dom.dataset.item)
                            //   console.log(dom.dataset.dateindex+'组')
                            //   console.log(dom.dataset.index+'下标')
                            //   if (dom.dataset.type == '4' || dom.dataset.type == '3') {
                            //     allSymbol.push({symbol:dom.dataset.id,groupIndex:dom.dataset.dateindex,listIndex:dom.dataset.index})
                            //   }else if(dom.dataset.type == '5' ){
                            //     if (dom.extend.type=='3'){
                            //       allSymbol.push({symbol:this.getMoreId(dom.extend.symbol_list,true),groupIndex:dom.dataset.dateindex,listIndex:dom.dataset.index})
                            //     }
                            //   }
                            // })
                            this.recommendPartKey = allSymbol;
                            // console.log(this.recommendPartKey)
                            foreach.break = new Error("StopIteration");
                        }
                    });
                } catch (e) { }
            }

            if (!this.isSelect) {
                //推荐选项专用 ----当需要日期悬停时，必须通过这样的计算方式获取
                let slice = Array.prototype.slice;
                var domList = slice.call(
                    document.querySelectorAll(".messageTimeClass")
                );
                // console.log('已经滑动==',$event.target.scrollTop)
                // console.log(domList)
                try {
                    domList.forEach((domItem, domIndex) => {
                        // console.log(domItem)
                        if (
                            parseInt($event.target.scrollTop) > parseInt(domItem.offsetTop) ||
                            parseInt($event.target.scrollTop) == parseInt(domItem.offsetTop)
                        ) {
                            // console.log('进来更新')
                            this.recommandDate = this.getDaysFromDateString(
                                domItem.dataset.time
                            );
                            // foreach.break = new Error("StopIteration");
                        }
                    });
                } catch (e) { }
            }

            var distance =
                parseInt($event.target.clientHeight) +
                parseInt($event.target.scrollTop) -
                parseInt($event.target.scrollHeight);
            if (distance >= -2 && distance <= 1) {
                //兼容一下iOS和Android
                console.log("触发底部");
                if (this.isScrollBottom) {
                    return;
                }

                if (!this.isSelect) {
                    this.isScrollBottom = true;
                    this.isButtonRresh = false;
                    this.getMessageData(true);
                }
            } else {
                this.isScrollBottom = false;
            }
        },
        ...mapMutations(["symbolsWebSocketSendMsg", "websocketClose"]),
        ...mapActions(["createWebSocketForSymbols"]),
        selectDate(item) {
            this.recordCurentDate.isSelect = false;
            item.isSelect = true;
            this.recordCurentDate = item;
            this.getGroupData(false, this.recordCurentDate.date);
        },
        selectEnd(evt) {
            var item = this.groupTapList[evt.newIndex];
            if (item == null) {
                return;
            }
            let userInfo = getInfoFromSessionStorage() || {};
            var sortParam = {};
            sortParam.platform = getPlatformCode();
            sortParam.userid = userInfo.userid;
            sortParam.account = userInfo.account;
            sortParam.symbol = item.symbol;
            sortParam.sort = evt.newIndex;
            request.homePageGroupSort({ ...sortParam }).then(res => {
                const resData = getDataFoxAxiosRequest(res, this);
                if (resData) {
                }
            });
        },
        showDateSelect() {
            if (!this.isSelect || !this.isAuth) {
                return;
            }
            this.isShowCommonMask = !this.isShowCommonMask;
            this.isShowDate = !this.isShowDate;
        },
        getGroupData(isFirstLoad = false, date = "", loading = true) {
            let userInfo = getInfoFromSessionStorage() || {};
            request.homePageGroupSelect(
                getPlatformCode(),
                userInfo.userid,
                userInfo.account,
                !isFirstLoad ? date : null,
                loading
            )
                .then(
                    res => {
                        this.isRefresh = false;
                        const resData = getDataFoxAxiosRequest(res, this);
                        if (resData) {
                            //定时刷新
                            if (this.firstCreateTime) {
                                this.firstCreateTime = false;
                                this.recordTimer = setInterval(() => {
                                    // if (this.isSelect) {
                                    //     this.getGroupData(false, this.recordCurentDate.date, false)
                                    // }
                                }, 10000);
                            }

                            //处理是否隐藏产品滚动列表
                            if (resData.rows.length == 0) {
                                this.isHaveProduct = false;
                            } else {
                                this.isHaveProduct = true;
                            }

                            var allSymbol = []; //记录所有的产品id
                            var allMessageLength = 0;

                            resData.rows.forEach((item, index) => {
                                item.changeRate = "- -";
                            });

                            this.groupListData = resData.rows;

                            if (isFirstLoad) {
                                //处理日期
                                this.dateList = [];
                                resData.dates.forEach(dateItem => {
                                    dateItem.isSelect = false;
                                    this.dateList.push(dateItem);
                                });
                                this.recordCurentDate = this.dateList[0];
                                this.recordCurentDate.isSelect = true;

                                //处理行情
                                resData.rows.forEach((productItem, index) => {
                                    productItem.isUp = false;
                                    productItem.new_price = "- -";
                                    productItem.priceUp = false;
                                    productItem.ask = "- -";
                                    productItem.askUp = false;
                                    productItem.bid = "- -";
                                    productItem.bidUp = false;
                                    productItem.changeRate = "- -";
                                });
                                this.priceBoxList = Object.assign([], resData.rows);
                                //处理tab列表
                                this.groupTapList = [
                                    { name: this.$t('homePage.allBtnTitle'), symbol: "all", select: true }
                                ];
                                this.recordSelectItem = this.groupTapList[0]; //记录首次选中按钮
                            }
                            //处理tap选中
                            this.groupListData.forEach((item, index) => {
                                //首次加载页面...
                                if (isFirstLoad) {
                                    //控制tab选项和tab选项是否选中
                                    item.select = false;
                                    this.groupTapList.push(item);
                                }

                                //统计所有总信息条数
                                allMessageLength = allMessageLength + item.messages.rows.length;

                                this.recordWebsocketKeyIndex[item.symbol] = index;
                                allSymbol.push(JSON.stringify(item.symbol));
                            });

                            //首次必须发送
                            if (isFirstLoad && this.isSelect) {
                                this.symbolsWebSocketSendMsg({
                                    names: allSymbol,
                                    type: "modify"
                                });
                            }
                            //判断消息条数
                            if (allMessageLength == 0) {
                                this.isHaveMessage = false;
                                this.isTopFixBox = false;
                                this.$refs.topPaddingRef.style.height = 0;
                            } else {
                                this.isHaveMessage = true;
                            }
                            this.recordSelectWebsocketList = allSymbol;
                        }
                    },
                    error => {
                        this.isRefresh = false;
                    }
                );
        },
        getPlatformCode() {
            return getPlatformCode()
        },
        getSymbolData(data) {
            let userInfo = getInfoFromSessionStorage() || {};
            this.messageParams.platform = getPlatformCode();
            this.messageParams.userid = userInfo.userid;
            this.messageParams.account = userInfo.account;
            this.messageParams.date = data.max;
            // this.messageParams.symbol = '110'
            request.homePageSymbolMessage({ ...this.messageParams }).then(res => {
                const resData = getDataFoxAxiosRequest(res, this);
                if (resData) {
                }
            });
        },
        mainScroll(scrollTop) {
            //pc版推广
            if (isWebPopularize()) {
                return false
            }
            if (this.isTopFixBox) {
                return;
            }
            if (scrollTop == undefined) {
                return;
            }
            if (scrollTop >= this.$refs.pageTitleBox.offsetTop) {
                this.$refs.transitionBox.style.height = "0";
                if (this.isSelect) {
                    if (!(this.isHaveProduct == false)) {
                        this.$refs.topPaddingRef.style.height = 0.6 + "rem";
                        this.$refs.panelListBox.style.top = this.getTopHeight();
                        this.isTopFixBox = true;
                        setTimeout(() => {
                            this.$refs.panelListBox.scrollTo(0, 5); //解决头部触发问题
                        }, 100);
                    }
                } else {
                    if (this.isHaveDeployMessage) {
                        this.$refs.topPaddingRef.style.height = 0.6 + "rem";
                        this.$refs.panelListBox.style.top = this.getTopHeight();
                        this.isTopFixBox = true;
                        setTimeout(() => {
                            this.$refs.panelListBox.scrollTo(0, 5); //解决头部触发问题
                        }, 100);
                    }
                }
            } else {
                this.$refs.topPaddingRef.style.height = "0";
                this.$refs.transitionBox.style.height = 0;
            }
        },
        // 是否是03业务，返回03业务platformCode
        is03SePlatFormCode() {
            return isPlatformCodeSe();
        },
        toOptionPage() {
            this.guiderShow = false;
            if (this.isAuth && this.isLogined) {
                this.$router.push({ name: "optionalPage" });
            } else {
                this.authTrigger();
            }
        },
        toSortButton() {
            this.isShowCommonMask = !this.isShowCommonMask;
            this.isShowSort = !this.isShowSort;
            this.isShowDate = false;
        },
        selectProductType(item, index) {
            this.isShowCommonMask = false; //隐藏公用蒙层
            this.isShowSort = false; //隐藏排序
            this.isShowDate = false;

            this.recordSelectItem.select = false;
            item.select = true;
            this.recordSelectItem = item;
            this.$forceUpdate();
            if (item.symbol != "all") {
                if (index == 1) {
                    this.recordSelectTop = true;
                }
                if (this.isTopFixBox) {
                    document
                        .getElementById(item.symbol)
                        .scrollIntoView({ block: "start", behavior: "smooth" });
                } else {
                    // 是否是web推广页
                    if (this.isWebPopularize) {
                        return false
                    }
                    this.$refs.transitionBox.style.height = "0";
                    this.$refs.topPaddingRef.style.height = 0.6 + "rem";
                    this.$refs.panelListBox.style.top = this.getTopHeight();
                    this.isTopFixBox = true;
                    setTimeout(() => {
                        document
                            .getElementById(item.symbol)
                            .scrollIntoView({ block: "start", behavior: "smooth" });
                    }, 300);
                }
            }
        },
        selectShop(item) {
            this.recordShopSelect.select = false;
            item.select = true;
            this.recordShopSelect = item;
            // if (this.recordShopSelect.symbol != item.symbol && this.recordShopSelect.symbol == '0') {
            //     this.recordShopSelect.select = false
            // }
            // if (item.symbol == '0') {
            //     this.allShop.forEach((eachItem) => {
            //         eachItem.select = false
            //     })
            //     item.select = true
            //     this.recordShopSelect = item;
            //     this.isButtonRresh = true
            //     this.getMessageData()
            //     return
            // }
            // item.select = !item.select
            // this.$forceUpdate();

            //判断所有反选
            // var recordArray = [];
            // this.allShop.forEach((eachItem) => {
            //     if (eachItem.symbol != '0' && eachItem.select == false) {
            //         recordArray.push(eachItem)
            //     }
            // })
            // if (recordArray.length == this.shopLenght) {
            //     this.allShop[0].select = true
            //     this.recordShopSelect = this.allShop[0]
            // }

            this.isButtonRresh = true;
            this.getMessageData();
        },
        selectType(item) {
            this.recordTypeSelect.select = false;
            item.select = true;
            this.recordTypeSelect = item;
            // if (this.recordTypeSelect.symbol != item.symbol && this.recordTypeSelect.symbol == '0') {
            //     this.recordTypeSelect.select = false
            // }
            // if (item.symbol == '0') {
            //     this.allType.forEach((eachItem) => {
            //         eachItem.select = false
            //     })
            //     item.select = true
            //     this.recordTypeSelect = item;
            //     this.isButtonRresh = true
            //     this.getMessageData()
            //     return
            // }
            //
            // item.select = !item.select
            // this.$forceUpdate();
            //
            // //判断所有反选
            // var recordArray = [];
            // this.allType.forEach((eachItem) => {
            //     if (eachItem.symbol != '0' && eachItem.select == false) {
            //         recordArray.push(eachItem)
            //     }
            // })
            // if (recordArray.length == 4) {
            //     this.allType[0].select = true
            //     this.recordTypeSelect = this.allType[0]
            // }

            this.isButtonRresh = true;
            this.getMessageData();
        }
    }
};
</script>
<style lang="scss">
.web-popularize {
    padding-top: 30px !important;
}
@media screen and (min-width: 1300px) {
    .leftScrollBox {
        .productScrollList {
            width: 100%;
            overflow-x: hidden !important;
        }
    }
}
.homepage-recommed {
    padding: 0.28rem 0.28rem 0.12rem 0.28rem;
    background: #292933;
    img {
        width: 100%;
        border-radius: 0.08rem;
    }
}
.selectTypeBox .cube-tab div {
    font-weight: bold;
}

.cube-rate-item {
    margin-right: 1px !important;
}
.homePageNoTouch {
    -webkit-overflow-scrolling: auto !important;
}
.iosFix {
    position: fixed !important;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
.selectTypeBox .cube-tab {
    /*margin-left: 0.32rem;*/
    padding: 0.2rem 0 !important;
    /*font-size:0.36rem;*/
    /*font-weight:800;*/
    /*color:rgba(235,235,245,0.3);*/
    /*line-height:0.48rem;*/
    /*!*margin-bottom: 0.09rem;*!*/
}
.selectTypeBo .cube-tab-bar {
    justify-content: space-between !important;
}
/*.selectTypeBox .cube-tab:first-child{*/
/*margin-left:0;*/
/*}*/
.selectTypeBox .cube-tab-bar-slider:after {
    background-color: #3385ff !important;
}
.selectTypeBox .cube-tab-bar-slider {
    background-color: #3385ff !important;
}
/*.selectTypeBox .cube-tab_active{*/
/*color:rgba(255,255,255,1);*/

/*}*/

.noFixBoxClass .cube-scroll-content {
    /*width: 100%;*/
}

.priceNoticeList:last-child {
    margin-bottom: 0 !important;
}
.priceNoticeList .firstItemClass {
    .noticeRightContentBox {
        padding-top: 0.3rem !important;
    }
    .noticeLeftLineBox {
        padding-top: 0.3rem !important;
    }
    .leftNoticeCircle {
        top: 0.41rem !important;
    }
}
.priceNoticeList .wechatFirstItemClass {
    .noticeRightContentBox {
        padding-top: 0 !important;
    }
    .noticeLeftLineBox {
        padding-top: 0 !important;
    }
    .leftNoticeCircle {
        top: 0rem !important;
    }
    .leftNoticeCircle {
        top: 0.1rem !important;
    }
}
</style>

<style scoped lang="scss">
.web-popularize-ad {
    position: fixed;
    bottom: 6px;
    right: 6px;
    border-radius: 10px;
    overflow: hidden;
}
.wechat-topPadding {
    height: 0 !important;
}
.homePageHavePadding {
    /*position: fixed !important;*/
    /*left: 0;*/
    /*top: 0;*/
    /*bottom: 0;*/
    /*right: 0;*/
}
.homePageClass {
    background-color: #24242e;
    /*height: 100vh;*/
    .tranditionPopNumber {
        /*bottom: 0 !important;*/
    }
    .popNumber {
        transition: bottom ease-out 0.3s;
        .reasonBox {
            border-bottom: 0.02rem solid rgba(35, 35, 43, 1);
            padding-bottom: 0.32rem;
            margin-top: 0.48rem;
            .reasonName {
                font-size: 0.32rem;
                font-weight: 800;
                color: rgba(255, 255, 255, 1);
                line-height: 0.32rem;
                margin-bottom: 0.24rem;
            }
            .reasonContent {
                display: flex;
                justify-content: space-between;
                .reasonTitle {
                    font-size: 0.24rem;
                    font-weight: 400;
                    color: rgba(235, 235, 245, 0.3);
                    line-height: 0.24rem;
                    margin-bottom: 0.08rem;
                }
                .reasonNumber {
                    font-size: 0.32rem;
                    font-weight: 500;
                    color: rgba(235, 235, 245, 0.85);
                    line-height: 0.32rem;
                }
            }
        }
        .conditionBox {
            .conditionName {
                font-size: 0.32rem;
                font-weight: 800;
                color: rgba(255, 255, 255, 1);
                line-height: 0.32rem;
                margin-bottom: 0.13rem;
            }
            .conditionDetail {
                font-size: 0.28rem;
                font-weight: 400;
                color: rgba(235, 235, 245, 0.6);
                line-height: 0.42rem;
            }
        }
        .popNumberTitleBox {
            position: relative;
            .closeImgClass {
                width: 0.36rem;
                right: 0.28rem;
                top: 0;
                bottom: 0;
                margin: auto 0;
                position: absolute;
            }
            box-sizing: border-box;
            height: 0.88rem;
            font-size: 0.28rem;
            font-weight: 500;
            color: rgba(235, 235, 245, 0.85);
            line-height: 0.88rem;
            text-align: center;
            border-bottom: 0.02rem solid rgba(35, 35, 43, 1);
        }
        .popContentClass {
            padding: 0.28rem;
            color: rgba(255, 255, 255, 1);
            .historyBox {
                margin-top: 0.32rem;
                .historyTitle {
                    height: 0.32rem;
                    font-size: 0.32rem;
                    font-weight: 800;
                    color: rgba(255, 255, 255, 1);
                    line-height: 0.32rem;
                    margin-bottom: 0.16rem;
                }
                .historyNumerBox {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-sizing: border-box;
                    height: 0.6rem;
                    font-size: 0.26rem;
                    font-weight: 500;
                    color: rgba(235, 235, 245, 0.6);
                    .numberClass {
                        color: rgba(235, 235, 245, 0.85);
                    }
                }
                .popTipBox {
                    margin-top: 0.36rem;
                    font-size: 0.24rem;
                    font-weight: 400;
                    color: rgba(235, 235, 245, 0.3);
                    line-height: 0.36rem;
                }
                .isExpire {
                    background: rgba(86, 86, 102, 1) !important;
                    color: rgba(61, 61, 77, 1) !important;
                }
                .popButtonBox {
                    margin-top: 0.36rem;
                    box-sizing: border-box;
                    height: 0.92rem;
                    background: rgba(51, 133, 255, 1);
                    border-radius: 0.06rem;
                    font-size: 0.36rem;
                    font-weight: 800;
                    color: rgba(255, 255, 255, 1);
                    line-height: 0.92rem;
                    text-align: center;
                }
            }
        }
        position: fixed;
        bottom: -100vh;
        left: 0;
        right: 0;
        background-color: #292933;
        z-index: 600;
    }
    .commonMask {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 20;
    }
    .historyMask {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 200;
    }
    .maskBox {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 600;
    }
    .pageTitleBoxClass {
        z-index: 22;
        padding: 0 0.28rem;
        background-color: #2e2e3b;
        .actionName {
            font-size: 0.6rem;
            font-weight: 600;
            color: rgba(255, 255, 255, 1);
            line-height: 0.7rem;
            margin-bottom: 0.01rem;
        }
        .actionContent {
            font-size: 0.28rem;
            /*font-weight: 500;*/
            color: rgba(235, 235, 245, 0.6);
            line-height: 0.42rem;
            margin-bottom: 0.08rem;
        }
    }
    // padding-top: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;

    .noFixBoxClass {
        position: relative;
        padding: 0 0.28rem;
        z-index: 22;
        background-color: #2e2e3b;
        .transitionBoxClass {
            position: absolute;
            left: 0;
            top: 0;
            width: 1rem;
            height: 0.88rem;
            background-color: transparent;
            transition: height ease-out 0.3s;
        }
        .trasitionIngClass {
            position: relative;
        }
    }
    .productListView {
        min-height: 70vh;
    }
    .panelListBox {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 1.2rem;
        overflow-y: scroll;
        /*padding: 0 0.28rem;*/
        background-color: #24242e;
    }
    .noSelect {
        padding-top: 0.28rem;
    }
    .authBox {
        height: 70vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        .authImg {
            width: 2.4rem;
            margin-top: 1.28rem;
        }
        .authTipTitle {
            padding: 0 0.8rem;
            text-align: center;
            box-sizing: border-box;
            /*height: 0.48rem;*/
            font-size: 0.32rem;
            font-weight: 400;
            color: rgba(235, 235, 245, 0.3);
            line-height: 0.48rem;
            margin-top: 0.16rem;
        }
        .authTipButton {
            box-sizing: border-box;
            height: 0.8rem;
            padding: 0 0.7rem;
            background: rgba(51, 133, 255, 1);
            border-radius: 0.4rem;
            font-size: 0.34rem;
            font-weight: 800;
            color: rgba(255, 255, 255, 1);
            line-height: 0.8rem;
            text-align: center;
            margin-top: 0.24rem;
        }
    }
    .topFixBoxClass {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        z-index: 100;
        transition: top 2s;
        padding: 0 0.28rem;
        background-color: #2e2e3b;
        /*-webkit-overflow-scrolling: touch ;*/
        /*background-color: transparent;*/
    }

    .horizontal-scroll-list-wrap {
        .cube-scroll-content {
            /*display: inline-block;*/
        }
    }

    .selectTypeBox {
        .tabBoxClass {
            height: 0.88rem;
            width: 1.8rem;
        }
        .settingBox {
            position: relative;
            .tipBoxClass {
                text-align: center;
                box-sizing: border-box;
                display: flex;
                z-index: 500;
                right: -0.1rem;
                bottom: -1.1rem;
                position: absolute;
                background: #3385ff;
                justify-content: center;
                align-items: center;
                height: 0.88rem;
                width: 3.64rem;
                border-radius: 0.06rem;
                .arrowBoxClass {
                    position: absolute;
                    right: 0.2rem;
                    top: -3px;
                    width: 12px;
                    height: 10px;
                    text-align: center;
                    background: #3385ff;
                    transform: rotate(45deg);
                }
                .tipContentClass {
                    flex-grow: 1;
                    font-size: 0.28rem;
                    font-weight: 500;
                    color: rgba(255, 255, 255, 1);
                }
            }
            display: flex;
            align-items: center;
            color: rgba(235, 235, 245, 0.85);
            font-size: 0.28rem;
        }

        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #2e2e3b;
    }
    .productBox {
        .recommendBox {
            flex-grow: 1;
            box-sizing: border-box;
            height: 0.8rem;
            /*margin-top: 0.05rem;*/
            position: relative;
            .lineView {
                position: absolute;
                top: 0;
                height: 0.02rem;
                left: -0.28rem;
                right: -0.28rem;
                background-color: rgba(35, 35, 43, 1);
            }
            .BottomView {
                position: absolute;
                bottom: 0;
                height: 0.02rem;
                left: -0.28rem;
                right: -0.28rem;
                background-color: rgba(35, 35, 43, 1);
            }
            .recommendTap {
                .recommandDate {
                    font-size: 0.26rem;
                    font-weight: 400;
                    color: rgba(235, 235, 245, 0.6);
                    line-height: 0.36rem;
                }
                .rightButton {
                    display: flex;
                    .recommendButton {
                        .selectTitle {
                            color: #4c94ff !important;
                            /*white-space: nowrap;*/
                            /*text-overflow: ellipsis;*/
                            /*overflow: hidden;*/
                        }
                        .normalTitle {
                            margin-right: 0.08rem;
                            flex: 1;
                            display: flex;
                            align-items: center;
                            color: rgba(235, 235, 245, 0.85);

                            .normalTitelText {
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                overflow: hidden;
                                line-height: 150%;
                            }
                        }
                        .selectImg {
                            transform: rotate(-180deg);
                        }
                        box-sizing: border-box;
                        display: flex;
                        justify-content: space-between;
                        align-items: stretch;
                        /*padding: 0.28rem 0;*/
                        font-size: 0.26rem;
                        font-weight: 500;
                        color: rgba(235, 235, 245, 0.85);
                    }
                    .recommendButton:first-child {
                        /*border-right: 0.02rem solid rgba(35, 35, 43, 1);*/
                    }
                }
                height: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        }
        box-sizing: border-box;
        height: 0.8rem;
        position: relative;
        .productSortBox {
            .sortProductItemSelect {
                background: rgba(235, 235, 245, 0.85) !important;
                color: #2e2e3b !important;
            }
            .shopAndTypeItemSelect {
                color: rgba(46, 46, 59, 1) !important;
                background: rgba(235, 235, 245, 0.85) !important;
            }

            .allSortProductItemSelect {
                /*position: relative;*/
                background: rgba(235, 235, 245, 0.85) !important;
                color: #2e2e3b !important;
            }
            .allSortProductItemSelect:before {
                /*content: "";*/
                /*position: absolute;*/
                /*height: 0.02rem;*/
                /*width: 0.52rem;*/
                /*bottom: 0.08rem;*/
                /*left: 0;*/
                /*right: 0;*/
                /*margin: 0 auto;*/
                /*background: rgba(51, 133, 255, 1);*/
            }
            .chosenClass {
                flex: 0 1 25%;
                box-sizing: border-box;
                padding: 0.1rem 0.06rem;
                .sortContent {
                    box-sizing: border-box;
                    text-align: center;
                    background: #292933 !important;
                    font-size: 0.26rem;
                    font-weight: 500;
                    line-height: 0.68rem;
                    color: white !important;
                    height: 0.68rem;
                    border-radius: 0.06rem;
                }
            }
            display: flex;

            .allProductItem {
                overflow: hidden;
                flex: 0 1 25%;
                box-sizing: border-box;
                padding: 0.1rem 0.06rem;
                .sortContent {
                    box-sizing: border-box;
                    text-align: center;
                    background: rgba(235, 235, 245, 0.06);
                    border-radius: 0.06rem;
                    font-size: 0.26rem;
                    font-weight: 500;
                    line-height: 0.68rem;
                    color: rgba(235, 235, 245, 0.3);
                    height: 0.68rem;
                    border-radius: 0.06rem;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }

            .shopAndTypeItem {
                flex: 0 1 25%;
                box-sizing: border-box;
                padding: 0.1rem 0.06rem;
                .sortContent {
                    box-sizing: border-box;
                    text-align: center;
                    background: rgba(235, 235, 245, 0.06);
                    border-radius: 0.06rem;
                    font-size: 0.26rem;
                    font-weight: 500;
                    line-height: 0.68rem;
                    color: rgba(235, 235, 245, 0.3);
                    height: 0.68rem;
                    border-radius: 0.06rem;
                }
            }

            .sortProductItem {
                overflow: hidden;
                flex: 0 1 25%;
                box-sizing: border-box;
                padding: 0.1rem 0.06rem;
                .sortContent {
                    box-sizing: border-box;
                    text-align: center;
                    background: rgba(235, 235, 245, 0.06);
                    border-radius: 0.06rem;
                    font-size: 0.26rem;
                    font-weight: 500;
                    line-height: 0.68rem;
                    color: rgba(235, 235, 245, 0.3);
                    height: 0.68rem;
                    border-radius: 0.06rem;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            padding: 0.2rem 0.22rem 0.22rem 0.22rem;
            z-index: 500;
            position: absolute;
            left: -0.28rem;
            right: -0.28rem;
            background-color: #292933;
            top: 100%;
        }
        .leftScrollBox {
            .productScrollList {
                width: 100%;
                overflow-x: scroll;
            }
            display: flex;
            align-items: center;
            height: 0.85rem;
            .sortTipClass {
                height: 0.48rem;
                padding: 0.16rem 0;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                height: 0.24rem;
                font-size: 0.24rem;
                font-weight: 400;
                color: rgba(255, 255, 255, 1);
                line-height: 0.24rem;
                .sortTipName {
                    color: #ffffff;
                }
                .sortTipAction {
                    color: rgba(235, 235, 245, 0.3);
                    margin-left: 0.1rem;
                }
            }
            position: relative;
            .transitionLineBox {
                box-sizing: border-box;
                z-index: 9;
                width: 0.4rem;
                position: absolute;
                right: 0;
                bottom: 0;
                top: 0;
                margin: auto 0;
                /*height:0.48rem;*/
                background: linear-gradient(
                    -90deg,
                    rgba(46, 46, 59, 1) 0%,
                    rgba(46, 46, 59, 0) 100%
                );
            }
            flex: 1 1 auto;
            width: 20px;
            .productTypeList {
                flex-grow: 1;
                flex-wrap: nowrap;
                display: flex;
                box-sizing: border-box;
                align-items: center;
                justify-content: flex-start;
                padding: 0.16rem 0;
                .productTypeItem {
                    flex: 0 0 auto;
                    box-sizing: border-box;
                    height: 0.48rem;
                    font-size: 0.26rem;
                    font-weight: 500;
                    color: rgba(235, 235, 245, 0.3);
                    line-height: 0.48rem;
                    margin-left: 0.2rem;
                    text-align: center;
                    padding: 0 0.16rem;
                    background-color: rgba(235, 235, 245, 0.06);
                    border-radius: 0.06rem;
                }
                .productTypeItemSelect {
                    background: #ebebf5 !important;
                    opacity: 0.5;
                    color: #2e2e3b;
                    font-weight: 800;
                    color: rgba(41, 41, 51, 1);
                }
            }
            .productTypeList .productTypeItem:first-child {
                margin-left: 0;
            }
        }

        .rightArrowDirection {
            transform: rotate(180deg);
        }

        background-color: #2e2e3b;
        display: flex;
        align-items: stretch;
    }

    .dateTipClass {
        height: 0.72rem;
        box-sizing: border-box;
        position: relative;
        .dateSelectBox {
            overflow-y: scroll;
            max-height: 8rem;
            .dateSelectList {
                :last-child {
                    border-bottom: none !important;
                }
                padding: 0 0 0 0.28rem;
                .dateSelectItem {
                    .curentSelectItem {
                        color: rgba(255, 255, 255, 1);
                    }
                    box-sizing: border-box;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.22rem 0;
                    height: 0.88rem;
                    font-size: 0.3rem;
                    font-weight: 400;
                    color: rgba(235, 235, 245, 0.3);
                    line-height: 0.42rem;
                    border-bottom: 0.02rem solid rgba(31, 31, 38, 1);
                }
            }

            z-index: 500;
            position: absolute;
            left: -0.28rem;
            right: -0.28rem;
            background-color: #292933;
            top: 100%;
        }
        display: flex;
        justify-content: space-between;
        padding: 0.16rem 0;
        align-items: center;
        .refreshIng {
            animation: refreshing 0.5s Linear;
        }
        @keyframes refreshing {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(180deg);
            }
        }

        .leftDateClass {
            font-size: 0.24rem;
            font-weight: 400;
            color: rgba(235, 235, 245, 0.6);
            line-height: 0.24rem;
        }
        .rightImgClass {
            width: 0.4rem;
            height: 0.4rem;
        }
    }

    .productListItemBox {
        background-color: #24242e;
        .priceBox {
            padding: 0.2rem 0;
            margin-bottom: 0.2rem;
            .priceTopBox {
                display: flex;
                align-items: center;
                justify-content: space-between;
                .priceValue {
                    font-size: 0.32rem;
                    font-weight: 800;
                    color: rgba(255, 255, 255, 0.85);
                    line-height: 0.54rem;
                }
                .priceValueName {
                    font-size: 0.32rem;
                    font-weight: 500;
                    color: rgba(235, 235, 245, 0.3);
                    line-height: 0.54rem;
                    margin-left: 0.08rem;
                }
            }

            .priceRightBox {
                justify-content: space-between;
                display: flex;
                align-items: center;
                .priceValueBox {
                    width: 1.28rem;
                    .priceValue {
                        font-size: 0.28rem;
                        font-weight: 500;
                        color: rgba(255, 89, 89, 1);
                        line-height: 0.42rem;
                    }
                    .priceValueName {
                        font-size: 0.22rem;
                        font-weight: 500;
                        color: rgba(235, 235, 245, 0.3);
                        line-height: 0.34rem;
                    }
                }
                .smallPriceValueBox {
                    text-align: right;
                    width: 0.88rem;
                    .priceValue {
                        color: #7acc7a;
                        font-size: 0.28rem;
                        line-height: 0.42rem;
                    }
                    .priceValueName {
                        font-size: 0.22rem;
                        font-weight: 500;
                        color: rgba(235, 235, 245, 0.3);
                        line-height: 0.34rem;
                    }
                }
            }
        }
        .priceNoticeList {
            background-color: #292933;
            .messageTimeClass {
                font-size: 0.24rem;
                font-weight: 400;
                color: rgba(235, 235, 245, 0.6);
                line-height: 0.36rem;
                padding: 0.16rem 0;
                border-bottom: 1px solid rgba(0, 0, 0, 0.25);
            }
            padding: 0 0.28rem 0.4rem 0.28rem;
            margin-bottom: 0.16rem;
        }
    }
    .productListItemBox .priceNoticeList:last-child {
        margin-bottom: 0 !important;
    }
}
</style>
