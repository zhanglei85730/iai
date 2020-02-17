<template>
    <div>
        <MainLayout
            :title="$route.meta.title"
            :headerStyle="$config.headerStyle"
            class="common-layout-back2"
            :isShowBackWord="false"
            :centerMoreDom="true"
            :backBtnFun="backAction"
            @mainScrollBoxScrollTop="mainScroll"
        >
            <div slot="headerCenter">
                <div>
                    <div style="line-height: 100%;font-size:0.36rem;">{{getChineseName(symbol).cname}}</div>
                    <div style="font-size:0.2rem;line-height: 100%;margin-top: 0.06rem;">{{getChineseName(symbol).ename}}</div>
                </div>
            </div>
            <div
                slot="page-body"
                class="detailPageClass"
            >

                <div
                    ref="priceBoxFix"
                    class="priceBoxArea"
                    :style="{top:$config.newUserFromType()==1?'1.28rem':'0.88rem'}"
                >
                    <div class="priceBox">
                        <div class="priceRightBox">
                            <div class="priceValueBox">
                                <div
                                    :style="{color:priceInfo.askUp == true ? '#7ACC7A' : '#FF6666'}"
                                    class="priceValue"
                                >{{priceInfo.ask}}</div>
                                <div class="priceValueName">{{$t('homePage.selectView.buyPrice')}}</div>
                            </div>
                            <div class="priceValueBox">
                                <div
                                    :style="{color:priceInfo.bidUp == true ? '#7ACC7A' : '#FF6666'}"
                                    class="priceValue"
                                >{{priceInfo.bid}}</div>
                                <div class="priceValueName">{{$t('homePage.selectView.sellPrice')}}</div>
                            </div>
                            <div class="priceValueBox">
                                <div
                                    :style="{color:priceInfo.priceUp == true ? '#7ACC7A' : '#FF6666'}"
                                    class="priceValue"
                                >{{priceInfo.new_price}}</div>
                                <div class="priceValueName">{{$t('homePage.selectView.newestPrice')}}</div>
                            </div>
                            <div class="smallPriceValueBox">
                                <div
                                    class="priceValue"
                                    :style="{color:priceInfo.isUp == true ? '#7ACC7A' : '#FF6666'}"
                                >{{priceInfo.changeRate}}</div>
                                <div class="priceValueName">{{$t('homePage.selectView.quote_change')}}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    ref="analysisAreaRef"
                    class="analysisArea"
                >
                    <div class="analysisTitleBox">
                        <div class="analysisLeftTitle">{{$t('homePage.productDetail.shop_mood')}}</div>
                        <div class="analysisRightTitle">{{$t('homePage.productDetail.time_once')}}：{{market_sentiment.updated_at}}</div>
                    </div>
                    <div class="percentageBox">
                        <div
                            class="leftTitleTip"
                            @click="toShowTip"
                        >
                            <div>{{$t('homePage.productDetail.analazy')}}</div>
                            <img
                                style="width: 0.32rem;"
                                src="./homePage/img/new-questionmask.png"
                            />
                        </div>
                        <div class="rightPercentageView">
                            <div class="percentageTitle">
                                <div class="percentageLeftTitle">
                                    <div class="upTitle">{{$t('homePage.productDetail.single_many')}}</div>
                                    <div
                                        class="upTitlePercentage"
                                        style="margin-left: 0.1rem;"
                                    >{{(market_sentiment.positive_prob * 100).toFixed(2) + '%'}}</div>
                                </div>
                                <div class="percentageRightTitle">
                                    <div class="downPercentage">{{(market_sentiment.negative_prob * 100).toFixed(2) + '%'}}</div>
                                    <div
                                        class="downTitle"
                                        style="margin-left: 0.1rem;"
                                    >{{$t('homePage.productDetail.single_blank')}}</div>
                                </div>
                            </div>
                            <div class="percentageLine">
                                <div
                                    class="leftLine"
                                    :style="{flexGrow:market_sentiment.positive_prob}"
                                ></div>
                                <div
                                    class="rightLine"
                                    :style="{flexGrow:market_sentiment.negative_prob}"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    ref="scrollListTopFix"
                    class="listTopClass"
                    :class="{scrollTopFixClass:isTopFixBox}"
                    :style="{top:$config.newUserFromType()==1?'2.36rem':'1.96rem'}"
                >
                    <div class="overseeTitle">{{$t('homePage.productDetail.warnChange')}}</div>
                    <div class="productTypeList">
                        <div
                            v-show="true"
                            v-for="(item,index) in groupTapList"
                            @click="selectProductType(item,index)"
                            :class="{productTypeItemSelect:item.select?true:false}"
                            class="productTypeItem"
                        >{{item.name}}</div>
                    </div>
                    <!--日期选择-->
                    <div
                        @click="showDateSelect"
                        class="dateTipClass"
                    >
                        <div
                            v-show="isShowDate"
                            class="dateSelectBox"
                        >
                            <ul class="dateSelectList">
                                <li
                                    v-for="item in dateList"
                                    class="dateSelectItem"
                                    @click="selectDate(item)"
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
                        <div style="display: flex;align-items: center;">
                            <img
                                :class="{refreshIng:isRefresh}"
                                @click.stop="toRefresh"
                                style="padding: 0.3rem 0;width: 0.38rem;"
                                src="./homePage/img/new-refresh.png"
                            >
                        </div>
                    </div>
                </div>
                <!--<div-->
                <!--ref="pageTitleBox"-->
                <!--class="pageTitleBoxClass"-->
                <!--&gt;-->
                <!--<div class="actionName" @click="toDetailPage()">市场情绪</div>-->
                <!--<div class="actionContent">IAI Trade实时监测各产品的价格及成交情况，捕捉盘中异动信号，帮投资者第一时间捕捉交易机会或规避风险</div>-->
                <!--</div>-->
                <div
                    ref="fixBoxRef"
                    class="noFixBoxClass"
                    :class="{topFixBoxClass:isTopFixBox}"
                    :style="{top:$config.newUserFromType()==1?'4.64rem':'4.24rem'}"
                >
                    <div
                        ref="panelListBox"
                        class="listAreaClass"
                        @scroll="listScroll($event)"
                        @touchmove="listBoxMove"
                        @touchstart="listTouchStart"
                    >
                        <div v-show="!isShowBlankView()">
                            <div class="productListItemBox">
                                <div class="priceNoticeList">
                                    <MessageView
                                        :authAction="aopAction"
                                        @showStatistics="showStatistics"
                                        @showNumberWave="showNumberWave"
                                        @toShowHistory="toShowHistory"
                                        :isHavePrice="false"
                                        :key="index"
                                        :messageInfo="item"
                                        :data-time="item.created_at"
                                        v-for="(item,index) in selfSelectMessage"
                                    ></MessageView>
                                </div>
                            </div>
                            <div v-show="!isShowBlankView()"
                                ref="refreshIngBox"
                                style="height: 0.9rem;box-sizing: border-box;display: flex;justify-content: center;align-items: center;"
                            >
                                <refresh-loading :isShow="isScrollBottom "></refresh-loading>
                            </div>
                        </div>
                        <div
                            v-show="isShowBlankView()"
                            class="blankClass"
                            :style="{paddingTop:(isHaveMessage==false && isTopFixBox ==false)?'1.2rem':'0'}"
                        >
                            <BlankView :action="toSetNotice" :buttonTitle="buttonTitle"
                                :img="commonTipImg"
                                :content="viewContent"
                            ></BlankView>
                        </div>
                    </div>
                </div>

                <history-view
                    @closeFinish="closeFinish"
                    ref="popnumbeAnimation"
                    :isShow="isShowHistory"
                    :infoModel="recordSelectMessageExtend"
                ></history-view>

                <!--<div-->
                <!--@touchmove.prevent-->
                <!--v-show="isShowDate"-->
                <!--class="listMask"-->
                <!--&gt;</div>-->
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
            <div slot="page-footer">
                <div class="bottom-menu-box">
                    <div
                        @click="menuAction(1)"
                        class="bottom-menu-item"
                        style="border-right: 0.02rem solid #292933;"
                    >
                        <img
                            style="width: 0.4rem; margin-right: 0.04rem;"
                            src="./homePage/img/new-detail-setting.png"
                        />
                        <span>{{$t('homePage.productDetail.HandicapManage')}}</span>
                    </div>
                    <div
                        @click="menuAction(2)"
                        class="bottom-menu-item"
                    >
                        <img
                            style="width: 0.4rem; margin-right: 0.04rem;"
                            src="./homePage/img/new-detail-pricesee.png"
                        />
                        <span>{{$t('homePage.productDetail.price_monitor')}}</span>
                    </div>
                    <div
                        @click="menuAction(3)"
                        class="bottom-menu-item"
                        style="border-left: 0.02rem solid #292933;"
                        v-if="!isWechatPlatformState"
                    >
                        <img
                            style="width: 0.4rem; margin-right: 0.04rem;"
                            src="./homePage/img/new-detail-chart.png"
                        />
                        <span>{{$t('homePage.productDetail.goChart')}}</span>
                    </div>
                </div>
            </div>

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

    </div>
</template>

<script>
  import i18n from '@warning/i18n'
import StatisticsChart from '@warning/components/StatisticsChart'
import WaveDataTable from '@warning/components/WaveDataTable'
import HistoryView from "../components/HistoryView";
import RefreshLoading from "../components/RefreshLoading";
import MessageView from "../components/MessageView";
import BlankView from "../components/BlankView";
import calendarNormal from "./homePage/img/new-calendar@2x.png";
import calendarSelect from "./homePage/img/new-calendar-select@2x.png";
import needmessage from "./homePage/img/new-needmessage.png";
import needauth from "./homePage/img/new-needauth.png";
import needproduct from "./homePage/img/new-needproduct.png";
import arrowup from "./homePage/img/new-arrow-color.png";
import arrowdown from "./homePage/img/new-arrow-down.png";


import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import request from "@services/documentary.js";
import PageFooter from "@warning/components/PageFooter";
import draggable from "vuedraggable";

import { getSelectOptions } from "../mapConfig.js";
import {
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
    getSymbolInfoByEnName,
} from "@public/js/util.js";

const globalConsts = require("@public/js/consts.js");
export default {
    name: "productDetailPage",
    components: {
        MessageView,
        PageFooter,
        draggable,
        BlankView,
        RefreshLoading,
        HistoryView,
        StatisticsChart,
        WaveDataTable

    },
    data() {
        return {
            isWechatPlatformState:false,
            recordSelectType: '0',
            symbol: '',
            statisticsChartDirect: 2,
            waveVisible: false,
            statisticsSymbol: 101,
            // 事件预警图表显示隐藏
            statisticsChartVisible: false,

            priceInfo: {
                new_price: "- -",
                ask: "- -",
                bid: "- -",
                changeRate: "- -"
            },
            isHaveMessage: false,
            market_sentiment: { positive_prob: 0, negative_prob: 0 },
            getSymbolMessageParams: {
                is_index: this.$route.query.isInfo ? '1' : '0',
                symbol: '',
                date: "",
                cursor: "0",
                wmid: "0",
                pageSize: "10",
                type: "0"
            },
            isNoMoreData: false, //上拉刷新没有更多信息
            startTouch: {},
            priceBoxList: [],
            recordSelectTop: false, //是否触发第一个产品
            recordTimer: {},
            firstCreateTime: true,
            recordSelectWebsocketList: [], //记录 自选 行情列表id
            isRefresh: false,
            // 授权
            isAuthStart: false,
            loginPopVisible: false,
            isWeChatLogin: false,

            isScrollBottom: false, //是否出发底部刷新
            getSelectOptions: getSelectOptions,
            getSymbolInfoById: getSymbolInfoById,
            isButtonRresh: false,
            isAlreadyRresh: false,
            selfSelectMessage: [],
            arrowup: arrowup,
            arrowdown: arrowdown,
            recordSelectMessageExtend: { symbol_id: "" }, //记录选中信息
            isShowCommonMask: false, //显示公共蒙层
            isShowHistoryMask: false, //显示历史蒙层 z-index层级不同
            isShowHistory: false, //是否显示历史弹窗
            commonTipImg: needmessage, //共用空占位
            commonTipTitle: "服务授权后，可添加自选异动盯盘", //共用空占位
            commonTipButtonTitle: "点击授权", //共用空占位

            isAuth: false, //是否授权
            isLogined: false, //是否登录

            isHaveProduct: true, //是否有品种
            isHaveMessage: true, //是否有消息
            isHaveDeployMessage: true,
            isSelect: true, //是否选择"自选"，否则'推荐'
            scrollCurentData: this.getDate(), //推荐 滚动显示日期
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
            groupTapList: [
              { name: this.$t('homePage.allBtnTitle'), symbol: "0", select: true },
              { name: this.$t('homePage.price_monitor'), symbol: "1", select: false },
              { name: this.$t('homePage.signalWarning'), symbol: "2", select: false },
              { name: this.$t('homePage.priceChange'), symbol: "3", select: false },
              { name: this.$t('homePage.k_form'), symbol: "4", select: false },
              { name: this.$t('homePage.major_Thing'), symbol: "5", select: false },
              { name: this.$t('homePage.signal_recommend'), symbol: "6", select: false }
            ],
            groupListData: [],
            isShowShop: false,
            isShowType: false,
            shopAndType: true, //默认渲染市场
            recordSelectItem: {}, //记录品种选中
            recordCurentDate: { date: this.getDate() }, //记录当前日期
            recordShopSelect: {}, //记录市场选中
            recordTypeSelect: {}, //记录类型选中
            selectedLabelDefault: "unselect",
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
            record_id: '',
            confs:{
              event: 0,
              index: 0,
              kline_form: 0,
              market_movement: 0,
              s_index: 0,
              s_price: 0
            },
            isAlreadyOpenNotice:true
        };
    },
    mounted() {
        this.isAuth = this.$config.isLogined();
        this.recordSelectItem = this.groupTapList[0];

        setTimeout(() => {
            this.topFixHeight = this.$refs.fixBoxRef.offsetHeight;
        }, 1500);
    },
    watch: {
        getSymbolsData: function (val, oldValue) {
            const { symbol, changeRate, new_price, symbolInt, ask, bid } = val;

            if ((symbolInt == this.symbol) && (this.waveVisible == false && this.statisticsChartVisible == false)) {
                if (changeRate != undefined && changeRate != null) {
                    this.priceInfo.isUp = !JSON.stringify(changeRate).startsWith("-");
                }
                parseFloat(new_price) - parseFloat(this.priceInfo.new_price) > 0
                    ? (this.priceInfo.priceUp = true)
                    : (this.priceInfo.priceUp = false);
                parseFloat(ask) - parseFloat(this.priceInfo.ask) > 0
                    ? (this.priceInfo.askUp = true)
                    : (this.priceInfo.askUp = false);
                parseFloat(bid) - parseFloat(this.priceInfo.bid) > 0
                    ? (this.priceInfo.bidUp = true)
                    : (this.priceInfo.bidUp = false);

                this.priceInfo.new_price = new_price
                this.priceInfo.ask = ask
                this.priceInfo.bid = bid
                this.priceInfo.changeRate = (changeRate * 100).toFixed(2) + "%";
            }
        },
        // websocket建立并为打开状态发送默认订阅数据
        websockForSymbolsState: function (newValue, oldValue) {
            const t = this;
            if (newValue == 1 && oldValue == 4) {
                this.symbolsWebSocketSendMsg({
                    names: [`${this.symbol}`],
                    type: "modify"
                });
                // websocket重链
            } else if (newValue == 0) {
                // 建立websocket连接（行情数据）
                console.log("重连开始");
            }
        }
    },
    i18n,
    computed: {
        ...mapState(["websockForSymbolsState"]),
        ...mapGetters(["getSymbolsData"]),
         buttonTitle(){
           if(((this.recordSelectType=='1' || this.recordSelectType=='2') && !this.isAlreadyOpenNotice)){
              return this.$t('homePage.productDetail.to_set')
           }else if(!this.isAlreadyOpenNotice){
             return this.$t('homePage.productDetail.to_open')
           }else {
             return 'null'
           }
         },
         viewContent(){
           if(((this.recordSelectType=='1' || this.recordSelectType=='2') && !this.isAlreadyOpenNotice)){
             return  this.$t('homePage.productDetail.view_setting')
           }else if(!this.isAlreadyOpenNotice){
             return  this.$t('homePage.productDetail.view_open')
           }else {
             return this.$t('homePage.productDetail.noRecommendDataTitle')
           }
         }
    },
    destroyed() {
        this.websocketClose();
    },
    created() {
        //授权判断
        this.getUserAuthStatusRequest()
        //index?goPage=8&symbolCode=CADJPY&isInfo=1
        this.createWebSocketForSymbols();

        if (this.$route.query.isInfo) {
            let symbolId = getSymbolInfoByEnName(this.$route.query.symbolCode).id[0]
            this.symbol = symbolId
            this.getSymbolMessageParams.symbol = symbolId
        } else {
            this.symbol = this.$route.query.symbol
            this.getSymbolMessageParams.symbol = this.symbol
        }

        this.symbolsWebSocketSendMsg({
            names: [`${this.symbol}`],
            type: "modify"
        });
        this.getGroupData(this.symbol);
        // 是否是微信平台
        this.isWechatPlatformState=isWechatPlatform()?true:false
    },
    destroyed() {
        clearInterval(this.recordTimer); // 清除定时器
        this.recordTimer = null;
    },
    methods: {
        toSetNotice(){
          if (this.recordSelectType==2){
            this.$router.push({
              path: '/advanceAssign'
            })
          }else{
            this.$router.push({
              path: '/priceWarning/main',
              query: {
                setWarningSymbol: this.getChineseName(this.symbol).ename,
                backPage: 'productDetail'
              }
            })
          }
        },
        aopAction() {
            if (!this.isAuth || !this.$config.isLogined()) {
                this.authTrigger()
                return true
            }
        },
        // 调用接口查看是否授权
        getUserAuthStatusRequest() {
            this.isLogined = this.$config.isLogined();
            const t = this;
            request.checkProductAuth().then(({ data }) => {
                const { status = '' } = data;
                t.isAuth = status == 1 ? true : false;
                sessionStorage.removeItem(globalConsts.auth.sessionStoryKey)
                saveInfoToSessionStorage({ value: status }, globalConsts.auth.sessionStoryKey)
            })
        },
        //======================触发授权流程===================
        // 是否登录
        // 调转登录
        goToLogin() {
            if (getNewPlatform()) {
                this.isWeChatLogin = true
            } else {
                this.$router.push({ name: 'login', query: { loginAfterTo: 'productDetailPage' } })
            }
        },
        isAuthed() {
            //app 未登录
            if (this.$config.userFromType() == 'app') {
                // 未登录
                if (!this.$config.isLogined()) {
                    //iai-trade app
                    if (isIaiTraderApp()) {
                        // 跳转登录界面（原生app,url拦截）
                        goAppLogin(this.$router.history.current.path);
                        return false
                    }
                    //微信服务号
                    if (getNewPlatform()) {
                        this.isWeChatLogin = true
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
                    return true
                }
            }
        },
        authTrigger() {
            if (this.isAuthed()) {
                this.isLogined = true
            } else {
                this.isLogined = false;
                return false;            }
            // 从localstorage获取保存的授权状态，为-1 提示授权
            if (getAuthStatu() === globalConsts.auth.statu.fail) {
                if (isWechatBind() && getNewPlatform()) {

                } else {
                    this.isAuthForApp();
                    return false;
                }
            } else {
                return true
            }
        },
        isAuthForApp() {
            // PF00新平台
            if (getNewPlatform() && !isWechatBind()) {
                this.isWeChatLogin = true
                //01 02 03等老平台
            } else {
                this.isAuthStart = true;
            }

        },
        authSuccessAfterHandle() {
            const t = this;
            request.checkProductAuth().then(({ data }) => {
                const { status = '' } = data;
                t.isAuth = status == 1 ? true : false;
                sessionStorage.removeItem(globalConsts.auth.sessionStoryKey)
                saveInfoToSessionStorage({ value: status }, globalConsts.auth.sessionStoryKey)
            })
            this.getGroupData(this.symbol)
        },
        loginPopHideHandle(data) {
            this.isAuthStart = false
        },
        AuthPopcancleHandle() {
            this.loginPopVisible = false
        },
        // 隐藏wechatlogin
        weChatLoginClose() {
            this.isWeChatLogin = false
        },
        //==============是否授权 end============================
        backAction() {
            if (this.$route.query.isInfo) {
                backToApp()
            } else {
                this.$router.replace({
                    name: 'homePage',
                    query: {
                        tabIndex: '1'
                    }
                })
            }
        },
        showStatistics(item) {
            if (!this.isAuth || !this.$config.isLogined()) {
                this.authTrigger()
                return
            }
            const { extend: { record_id = '', survey_price = '', actual_price = "", previous_price = "" } = {} } = item
            const value = actual_price !== null ? Number(actual_price) - Number(survey_price) : 2
            // 选择历史统计的方向 2发布>预测  1发布<预测  3发布==等于预测
            let statisticsChartDirect = 0
            if (value > 0) {
                statisticsChartDirect = 2
            } else if (value == 0) {
                statisticsChartDirect = 3
            } else if (value < 0) {
                statisticsChartDirect = 1
            }
            this.statisticsChartDirect = statisticsChartDirect
            this.record_id = record_id
            this.statisticsSymbol = item.symbol_id
            this.statisticsChartVisible = true;
        },
        showNumberWave(item) {
            if (!this.isAuth || !this.$config.isLogined()) {
                this.authTrigger()
                return
            }

            const { extend: { record_id = '' } = {} } = item
            this.record_id = record_id
            this.statisticsSymbol = item.symbol_id
            this.waveVisible = true
        },
        // 事件预警
        waveMaskClick() {
            this.waveVisible = false
        },
        waveDataClose() {
            this.waveVisible = false

            this.symbolsWebSocketSendMsg({
                names: [`${this.symbol}`],
                type: "modify"
            });
        },
        statisticsChartMaskClick() {
            this.statisticsChartVisible = false
        },
        statisticsChartClose() {
            this.statisticsChartVisible = false
        },
        toShowHistory(item) {
            this.isShowHistory = true;
            this.recordSelectMessageExtend = item;
        },
        closeFinish() {
            this.isShowHistory = false;
        },
        toShowTip() {
            this.creatAlert(1);
        },
        creatAlert(type) {
            var title = type == 1 ? this.$t('homePage.productDetail.analazy_number') : `交易情绪`;
            var content =
                type == 1
                    ? this.$t('homePage.productDetail.analazy_alert')
                    : ``;
            this.$createDialog({
                title: title,
                content: content,
                confirmBtn: {
                    text: this.$t('homePage.productDetail.know_title'),
                    active: true,
                    disabled: false,
                    href: "javascript:;"
                },
                onConfirm: () => { }
            }).show();
        },
        menuAction(index) {
            if (index == 1) {
                if (!this.isAuth || !this.$config.isLogined()) {
                    this.authTrigger()
                    return
                }
                this.$router.push({ name: "optionalPage" });
            } else if (index == 2) {
                // if (!this.isAuth || !this.$config.isLogined()) {
                //     this.authTrigger()
                //     return
                // }
                this.$router.push({
                    path: "/priceWarning/main",
                    query: {
                        setWarningSymbol: this.getChineseName(this.symbol).ename,
                        backPage: "homePage"
                    }
                });
            } else {
                if (!this.isAuth || !this.$config.isLogined()) {
                    this.authTrigger()
                    return
                }
                this.toPayAction(this.getChineseName(this.symbol).ename);
            }
        },
        listTouchEnd(e) { },
        listBoxMove(e) {
            if (this.isShowDate) {
                return;
            }
            console.log("listBoxMove");
            var endPoint = e.changedTouches[0];
            //计算终点与起点的差值
            var y = endPoint.clientY - this.startTouch.clientY;

            if (Math.abs(y) > 5) {
                if (y > 0) {
                    if (this.$refs.panelListBox.scrollTop == 0) {
                        this.isTopFixBox = false;
                        // alert('触发结束置顶')
                        // this.$refs.topPaddingRef.style.height = 0
                    }
                } else {
                }
            }
        },
        listTouchStart(e) {
            this.startTouch = e.touches[0];
            console.log("startTouch");
        },
        getTopHeight() {
            return this.$refs.fixBoxRef.offsetHeight + "px";
        },
        getDate() {
            var date = new Date();
            return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        },
        toRefresh() {
            this.getSymbolMessageParams.type = this.recordSelectType
            this.getSymbolMessageParams.cursor = 0;
            this.getSymbolMessageParams.wmid = 0;
            this.isRefresh = true;
            this.getSymbolMessageData(false, true);
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
        listScroll($event) {
            console.log($event.target.scrollTop);
            if ($event.target.scrollTop == "0") {
                this.isTopFixBox = false;
            }
            //元素总滚动高度
            console.log("scrollTop元素已经滑动=======" + $event.target.scrollTop);
            console.log(
                "offsetHeight滑动窗口大小=======" + $event.target.offsetHeight
            );
            console.log(
                "scrollHeight可滚动总大小=======" + $event.target.scrollHeight
            );
            console.log("offsetTop??=======" + $event.target.offsetTop);
            var distance =
                parseInt($event.target.clientHeight) +
                parseInt($event.target.scrollTop) -
                parseInt($event.target.scrollHeight);
            console.log("distance=======" + distance);
            if (distance >= -2 && distance <= 1) {
                //兼容一下iOS和Android
                console.log("触发底部");
                // if (this.isNoMoreData){
                //   return
                // }
                if (this.isScrollBottom) {
                    return;
                }
                this.isScrollBottom = true;
                this.isButtonRresh = false;
                this.getSymbolMessageData(true, false);
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

            this.getSymbolMessageParams.date = item.date;
            this.getSymbolMessageParams.cursor = 0;
            this.getSymbolMessageParams.wmid = 0;
            this.getSymbolMessageData();
        },
        selectEnd(evt) {
            console.log(evt.newIndex);

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
                    console.log(resData);
                }
            });
        },
        showDateSelect() {
            setTimeout(() => {
                this.$refs.fixBoxRef.classList.add("changeZindex");
            }, 200);
            this.isTopFixBox = true;
            if (!this.isSelect || !this.isAuth) {
                return;
            }
            this.isShowCommonMask = !this.isShowCommonMask;
            this.isShowDate = !this.isShowDate;
        },
        getGroupData(symbol) {
            request.detailPageGroupDetail({
                is_index: this.$route.query.isInfo ? '1' : '0',
                pageSize: 10,
                symbol: symbol,

                ...this.getUserInfo()
            })
                .then(
                    res => {
                        const resData = getDataFoxAxiosRequest(res, this);
                        if (resData) {
                            this.market_sentiment = resData.market_sentiment;
                            if (
                                resData.messages.cursor == "-1" &&
                                resData.messages.wmid == "-1"
                            ) {
                                this.isNoMoreData = true;
                            }

                            //判断是否有消息
                            if (resData.messages.rows.length == 0) {
                                this.isHaveMessage = false;
                            } else {
                                this.isHaveMessage = true;
                            }
                            this.selfSelectMessage = resData.messages.rows;
                            this.confs =  resData.confs
                            this.getSymbolMessageParams.cursor = resData.messages.cursor;
                            this.getSymbolMessageParams.wmid = resData.messages.wmid;
                            //处理日期
                            this.dateList = [];
                            resData.dates.forEach(dateItem => {
                                dateItem.isSelect = false;
                                this.dateList.push(dateItem);
                            });
                            this.recordCurentDate = this.dateList[0];
                            this.recordCurentDate.isSelect = true;
                            this.getSymbolMessageParams.date = this.recordCurentDate.date;
                        }
                    },
                    error => {

                    }
                );
        },
        getUserInfo(symbol) {
            let userInfo = getInfoFromSessionStorage() || {};
            return {
                userid: userInfo.userid,
                account: userInfo.account,
                platform: getPlatformCode()
            };
        },
        getSymbolMessageData(isBottom = false, loading = true) {
            request
                .homePageSymbolMessage({
                    loading: loading,
                    ...this.getUserInfo(),
                    ...this.getSymbolMessageParams
                })
                .then(
                    res => {
                        const resData = getDataFoxAxiosRequest(res, this);
                        this.isRefresh = false
                        if (resData) {
                            //判断是否还有数据
                            // if (resData.cursor =='-1' && resData.wmid =='-1'){
                            //   this.isNoMoreData =true
                            // }else {
                            //   this.isNoMoreData =false
                            // }
                            //记录页面请求值
                            this.getSymbolMessageParams.cursor = resData.cursor;
                            this.getSymbolMessageParams.wmid = resData.wmid;

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
                                this.selfSelectMessage = this.selfSelectMessage.concat(
                                    resData.rows
                                );
                            } else {
                                if (this.selfSelectMessage.length != 0) {
                                    this.$refs.panelListBox.scrollTo(0, 5);
                                }
                                if (resData.rows.length == 0) {
                                    this.isHaveMessage = false;
                                } else {
                                    this.isHaveMessage = true;
                                }

                                this.selfSelectMessage = resData.rows;
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
                        this.isRefresh = false
                    }
                );
        },
        mainScroll(scrollTop) {
            console.log("mainSrcoll====" + scrollTop);
            console.log("analysisArea ===" + this.$refs.analysisAreaRef.offsetHeight);
            // return

            if (scrollTop == undefined) {
                return;
            }
            if (scrollTop >= this.$refs.analysisAreaRef.offsetHeight) {
                // this.$refs.topPaddingRef.style.height = 0.6 + 'rem'
                // this.$refs.panelListBox.style.top = this.getTopHeight()
                this.isTopFixBox = true;
            } else {
            }
        },
        selectProductType(item, index) {
            this.handleNoticeState(item.symbol)

            this.recordSelectType = item.symbol
            this.isTopFixBox = true;


            this.isShowCommonMask = false; //隐藏公用蒙层
            this.isShowDate = false; //隐藏

            this.recordSelectItem.select = false;
            item.select = true
            this.recordSelectItem = item

            this.getSymbolMessageParams.type = item.symbol
            this.getSymbolMessageParams.cursor = 0;
            this.getSymbolMessageParams.wmid = 0;
            this.getSymbolMessageData(false, true);
        },
        handleNoticeState(type){
          switch (type) {
            case '0':
              this.isAlreadyOpenNotice = true
              break
            case '1':
            this.isAlreadyOpenNotice = this.confs.s_price==1?true:false
            break
            case '2':
              this.isAlreadyOpenNotice = this.confs.s_index==1?true:false
              break
            case '3':
              this.isAlreadyOpenNotice = this.confs.market_movement==1?true:false
              break
            case '4':
              this.isAlreadyOpenNotice = this.confs.kline_form==1?true:false
              break
            case '5':
              this.isAlreadyOpenNotice = this.confs.event==1?true:false
              break
            case '6':
              this.isAlreadyOpenNotice = this.confs.index==1?true:false
              break
          }
        },
        isShowBlankView(){
         return  ((this.recordSelectType=='1' || this.recordSelectType=='2') && !this.isHaveMessage)|| (((!this.isHaveMessage && this.isAlreadyOpenNotice) || !this.isAlreadyOpenNotice ) )
        }
    }
};
</script>
<style>
.homePageNoTouch {
    -webkit-overflow-scrolling: auto !important;
}
.selectTypeBox .cube-tab {
    /*margin-left: 0.32rem;*/
    padding: 0.2rem 0;
    /*font-size:0.36rem;*/
    /*font-weight:800;*/
    /*color:rgba(235,235,245,0.3);*/
    /*line-height:0.48rem;*/
    /*!*margin-bottom: 0.09rem;*!*/
}
.selectTypeBo .cube-tab-bar {
    justify-content: space-between !important;
}

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
</style>

<style scoped lang="scss">
.bottom-menu-box {
    height: 1rem;
    box-sizing: border-box;
    font-size: 0.28rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 0.28rem;
    display: flex;
    padding: 0.3rem 0;
    background: rgba(49, 49, 61, 1);
    .bottom-menu-item {
        flex: 1 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        /*padding: 0.16rem 0;*/
    }
}
.detailPageClass {
    padding-top: 1.08rem;
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
        z-index: 10;
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

    .changeZindex {
        z-index: 8;
    }
    .noFixBoxClass {
        min-height: 70vh;
        /*position: relative;*/
        padding: 0 0.28rem;
        background-color: #292933;

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
        /*min-height: 70vh;*/
    }
    .panelListBox {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 1.2rem;
        overflow-y: scroll;
        padding: 0 0.28rem;
        background-color: #24242e;
    }
    .noSelect {
        padding-top: 0.28rem;
    }

    .topFixBoxClass {
        position: fixed;
        left: 0;
        top: 4.24rem;
        right: 0;
        min-height: auto !important;
        bottom: 1rem;
        /*z-index: 100;*/
        /*transition: top 2s;*/
        background-color: #292933;
        /*padding: 0 0.28rem;*/
        display: flex;
        flex-direction: column;
        align-items: stretch;
        /*-webkit-overflow-scrolling: touch ;*/
        /*background-color: transparent;*/

        .listAreaClass {
            position: relative;
            z-index: 5 !important;
            flex-grow: 1;
            height: 20px;
            overflow-y: scroll;
            .blankClass {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                width: 100%;
            }
        }
    }

    .horizontal-scroll-list-wrap {
        .cube-scroll-content {
            /*display: inline-block;*/
        }
    }

    .productBox {
    }

    .dateTipClass {
        height: 0.72rem;
        box-sizing: border-box;
        position: relative;
        .dateSelectBox {
            overflow-y: scroll;
            max-height: 7rem;
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
            z-index: 600;
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

    .priceBoxArea {
        z-index: 22;
        height: 1.08rem;
        box-sizing: border-box;
        position: fixed;
        left: 0;
        width: 100%;
        top: 0.88rem;
        background-color: #292933;
        padding: 0.2rem 0.28rem 0 0.28rem;
        .priceBox {
            border-bottom: 0.02rem solid #23232b;
            box-sizing: border-box;
            height: 100%;
            .priceTopBox {
                display: flex;
                align-items: center;
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
                        line-height: 100%;
                    }
                    .priceValueName {
                        font-size: 0.22rem;
                        font-weight: 500;
                        color: rgba(235, 235, 245, 0.3);
                        line-height: 100%;
                        margin-top: 0.06rem;
                    }
                }
                .smallPriceValueBox {
                    text-align: right;
                    /*width: 0.88rem;*/
                    .priceValue {
                        font-weight: 500;
                        color: #7acc7a;
                        font-size: 0.28rem;
                        line-height: 100%;
                    }
                    .priceValueName {
                        color: #797d8c;
                        font-size: 0.22rem;
                        font-weight: 500;
                        line-height: 100%;
                        margin-top: 0.06rem;
                        color: rgba(235, 235, 245, 0.3);
                    }
                }
            }
        }
    }
    .analysisArea {
        margin-bottom: 0.16rem;
        background-color: #292933;
        padding: 0.32rem 0.28rem;
        .analysisTitleBox {
            margin-bottom: 0.32rem;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            .analysisLeftTitle {
                font-size: 0.36rem;
                font-weight: 800;
                color: rgba(255, 255, 255, 1);
            }
            .analysisRightTitle {
                font-size: 0.24rem;
                font-weight: 400;
                color: rgba(235, 235, 245, 0.3);
            }
        }
        .percentageBox {
            display: flex;
            align-items: stretch;
            .leftTitleTip {
                margin-right: 0.2rem;
                font-size: 0.28rem;
                font-weight: 500;
                color: rgba(235, 235, 245, 0.6);
                display: flex;
                align-items: center;
            }
            .rightPercentageView {
                flex-direction: column;
                align-items: stretch;
                display: flex;
                flex: 1;
                .percentageTitle {
                    font-size: 0.24rem;
                    font-weight: 500;
                    display: flex;
                    color: #ffffff;
                    justify-content: space-between;
                    align-items: center;
                    .percentageLeftTitle {
                        display: flex;
                        .upTitle {
                            color: #7acc7a;
                        }
                    }
                    .percentageRightTitle {
                        display: flex;
                        .downTitle {
                            color: #ff6666;
                        }
                    }
                }
                .percentageLine {
                    background-color: #43bf43;
                    margin-top: 0.06rem;
                    display: flex;
                    height: 0.06rem;
                    .leftLine {
                        background-color: #43bf43;
                    }
                    .rightLine {
                        background-color: #ff4d4d;
                    }
                }
            }
        }
    }
    .listTopClass {
        background-color: #292933;
        box-sizing: border-box;
        height: 2.28rem;
        padding: 0 0.28rem;
        .overseeTitle {
            padding: 0.32rem 0 0.1rem 0;
            font-size: 0.36rem;
            font-weight: 800;
            color: rgba(255, 255, 255, 1);
        }
        .productTypeList {
            flex-grow: 1;
            flex-wrap: nowrap;
            overflow-x: scroll;
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
    .scrollTopFixClass {
        position: fixed;
        top: 1.96rem;
        width: 100%;
        left: 0;
        z-index: 15;
    }

    .productListItemBox {
        .priceNoticeList {
            border-bottom: 0.02rem solid #535366;
            padding-bottom: 0.2rem;
            .priceNoticeItem {
                position: relative;
                display: flex;
                align-items: stretch;
                .noticeLeftLineBox {
                    flex-grow: 0;
                    flex-shrink: 0;
                    position: relative;
                    display: flex;

                    flex-direction: column;
                    align-items: center;
                    box-sizing: border-box;
                    width: 0.12rem;
                    .noticeItemLineTop {
                        width: 0.01rem;
                        height: 0.1rem;
                        background-color: rgba(164, 164, 207, 0.05);
                    }
                    .noticeItemLineBottom {
                        flex: 1;
                        width: 0.02rem;
                        background-color: rgba(164, 164, 207, 0.05);
                    }
                    .leftNoticeCircle {
                        border: 0.03rem solid rgba(103, 103, 115, 1);
                        box-sizing: border-box;
                        position: absolute;
                        top: 0.54rem;
                        left: 0;
                        width: 0.12rem;
                        height: 0.12rem;
                        border-radius: 50%;
                        background-color: #24242e;
                    }
                }
                .noticeRightContentBox {
                    flex: 1;
                    display: flex;
                    padding: 0.44rem 0 0 0;
                    .noticeItemLeftBox {
                        flex: 1;
                        .leftNoticeTimeBox {
                            display: flex;
                            align-items: center;
                            .leftNoticeTimeContent {
                                font-size: 0.24rem;
                                font-weight: 500;
                                color: rgba(235, 235, 245, 0.3);
                                line-height: 0.36rem;
                                margin-left: 0.2rem;
                            }
                            .lastNumberMessage {
                                .showAllClassNormal {
                                    width: 0.28rem;
                                    margin-left: 0.1rem;
                                    transition: transform 0.2s;
                                }
                                .showAllIng {
                                    transform: rotate(-180deg);
                                }
                                margin-left: 0.2rem;
                                font-size: 0.24rem;
                                font-weight: 400;
                                color: rgba(235, 235, 245, 0.6);
                                line-height: 0.36rem;
                                display: flex;
                                align-items: center;
                            }
                            .lastNumberMessage > img {
                                /*vertical-align: top;*/
                            }
                        }
                        .leftNoticeContent {
                            line-height: 0.46rem;
                            margin-left: 0.2rem;
                            font-size: 0.3rem;
                            /*font-weight: 500;*/
                            color: rgba(235, 235, 245, 0.85);
                            line-height: 0.46rem;
                        }
                        .klineBox {
                            margin-top: 0.12rem;
                            display: flex;
                            align-items: center;
                            margin-left: 0.2rem;
                            .historyNumber {
                                display: flex;
                                align-items: center;
                                margin-right: 0.12rem;
                                background: rgba(81, 81, 97, 0.3);
                                padding: 0.08rem 0.14rem;
                                display: flex;
                                box-sizing: border-box;
                                align-items: center;
                                height: 0.52rem;
                                font-size: 0.24rem;
                                font-weight: 500;
                                color: rgba(235, 235, 245, 0.85);
                                line-height: 0.52rem;
                                border-radius: 0.06rem;
                                img {
                                    vertical-align: top;
                                    margin-right: 0.06rem;
                                }
                            }
                            .isExpire {
                                background: rgba(86, 86, 102, 1) !important;
                                color: rgba(61, 61, 77, 1) !important;
                            }
                            .toPayOrder {
                                width: 1.4rem;
                                height: 0.52rem;
                                box-sizing: border-box;
                                border-radius: 0.06rem;
                                background: rgba(51, 133, 255, 1);
                                line-height: 0.52rem;
                                font-size: 0.24rem;
                                font-weight: 400;
                                color: rgba(255, 255, 255, 1);
                                text-align: center;
                            }
                        }
                        .scoreListBox {
                            margin-top: 0.1rem;
                            margin-left: 0.2rem;
                            display: flex;
                            align-items: center;
                            .scoreSelectImg {
                                width: 0.5rem;
                            }
                            .scoreNormalImg {
                                width: 0.18rem;
                                background-color: green;
                            }
                        }
                        .tagListBox {
                            margin-top: 0.2rem;
                            margin-left: 0.2rem;
                            display: flex;
                            align-items: center;
                            .tagClass {
                                padding: 0.2rem;
                                background-color: gray;
                                color: white;
                                border-radius: 0.05rem;
                            }
                        }
                    }
                    .noticeItemImg {
                        width: 0.32rem;
                        height: 0.32rem;
                    }
                }
            }
            .priceNoticeItem:first-child {
                .noticeRightContentBox {
                    padding: 0;
                }
                .noticeLeftLineBox {
                    flex-grow: 0;
                    flex-shrink: 0;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    box-sizing: border-box;
                    width: 0.12rem;
                    .leftNoticeCircle {
                        border: 0.03rem solid rgba(103, 103, 115, 1);
                        box-sizing: border-box;
                        position: absolute;
                        top: 0.1rem;
                        left: 0;
                        width: 0.12rem;
                        height: 0.12rem;
                        border-radius: 50%;
                        background-color: #24242e;
                    }
                    .noticeItemLineTop {
                        width: 0.01rem;
                        height: 0.1rem;
                        background-color: rgba(164, 164, 207, 0.05);
                    }
                }
            }
        }
    }
    .productListItemBox .priceNoticeList:last-child {
        border-bottom: none !important;
    }
}
@supports (bottom: constant(safe-area-inset-top)) or
    (bottom: env(safe-area-inset-top)) {
    .ios-app-layout {
        .priceBoxArea {
            top: calc(0.88rem + constant(safe-area-inset-top)) !important;
            top: calc(0.88rem + env(safe-area-inset-top)) !important;
        }
        .bottom-menu-box {
            padding-bottom: constant(safe-area-inset-bottom);
            padding-bottom: env(safe-area-inset-bottom);
        }
    }
}
</style>
