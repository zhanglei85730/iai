<template>
    <!-- 预警详情-->
    <div :class="{'page-container-app':$config.userFromType()=='app'}">
        <AuthPop
            :isShow="loginPopVisible"
            @cancle="authPopcancleHandle"
        />
        <!-- 授权弹出层 -->
        <LoginPop
            class="warning-author-pop"
            :isShow="isAuthStart"
            :isAuth="isAuthStart"
        />
        <MainLayout
            :title="getTitleName()"
            :headerStyle="$config.headerStyle"
            class="common-layout-back"
            :backBtnTxt="backTitle"
            :backBtnFun="backFunc"
            :isShowBottom="false"
            :isShowHeader="isShowHeader"
        >
            <div slot="header-right">
                <router-link
                    :to="getHelpPageName()"
                    :title="getTitleName()"
                >
                    <img
                        @click="warningHelpHandle"
                        src="static/img/warning/questions_icon2@2x.png"
                        class="common-header-right-icon"
                    />
                </router-link>
            </div>
            <div
                slot="page-body"
                class="warning-data-detail"
                @click="clickWarningDetalBody"
            >
                <SideSpace value="0.28rem">
                    <div slot="content">
                        <div class="common-head-ad-box">
                            <img :src="getWarnTypePic()" />
                        </div>
                    </div>
                </SideSpace>
                <!-- <cube-button @click="showDrawer">Show Drawer</cube-button> -->
                <div class="warning-seting-product-margin-top"></div>
                <div class="warning-seting-box warning-seting-product">
                    <div class="warning-seting-left">{{getPageI18n('selectProduct')}}</div>
                    <div
                        class="warning-seting-right"
                        @click="showDrawer('productDrawer')"
                    >
                        <div class="warning-seting-right-top warning-select-symbols-seting">
                            {{getProductName()}}
                        </div>
                        <div class="warning-seting-right-bottom">
                            {{getPageI18n('newestPrice')}}
                            <span
                                class="warning-seting-product-red"
                                :class="{'warning-seting-product-grey':changeRate===''}"
                            >
                                <span
                                    v-if="newPrice==''"
                                    class="warning-seting-product-underline"
                                    style="margin-right:0"
                                ></span>
                                {{newPrice}}
                            </span>
                            <span class="warning-seting-product-split">/</span>{{getPageI18n('changePrice')}} <span
                                class="warning-seting-product-underline"
                                v-if="changeRate==''"
                            ></span><span class="warning-seting-product-change">{{changeRate}}</span>
                        </div>
                    </div>
                    <div
                        class="warning-seting-right-arrow"
                        :class="{'warning-seting-right-arrow-visible':this.isModifyWarning()}"
                    >
                        <span
                            class="warning-seting-right-arrow-img warning-seting-arrow-icon"
                            v-if="!this.isModifyWarning()"
                        ></span>
                    </div>
                </div>
                <!-- =============================价格预警 start============================= -->
                <div
                    class="price-warning-box"
                    v-if="isPriceWarning()"
                >
                    <!-- 反弹预警及回落预警 -->
                    <div
                        class="warning-seting-box"
                        v-if="$route.query.code==103 | $route.query.code==104"
                    >
                        <div class="warning-seting-left">{{$route.query.code==103?getPageI18n('lowPrice'):getPageI18n('hightPrice')}}</div>
                        <div class="warning-seting-right">
                            <div class="warning-seting-right-top ios-input-parent-fix">
                                <input
                                    class="warning-form-input warning-form-input-price"
                                    :placeholder="getPageI18n($route.query.code==103? 'pleaseInputPriceLow': 'pleaseInputPriceHigh')"
                                    v-model="waringPriceLimit"
                                />
                            </div>
                            <!-- <div class="warning-seting-right-bottom warning-input-botom-tip">
                                {{getPageI18n('startWatch')}}
                            </div> -->
                        </div>
                        <div class="warning-seting-right-arrow"><span class=" warning-seting-input-daller warning-input-icon-doaller"></span></div>
                    </div>
                    <!--  触发条件（现价预警与涨跌预警共用）-->
                    <div
                        class="warning-seting-box"
                        v-if="$route.query.code=='101' | $route.query.code=='102'"
                    >
                        <div class="warning-seting-left">{{getPageI18n('triggleCondtionLabel')}}</div>
                        <div class="warning-seting-right">
                            <MySwitch
                                :selectValue="triggerSelectValue"
                                class="warning-form-tab-select"
                                @select="triggerSelectHandle"
                                :data="$route.query.code=='101'?triggerSelectData101:triggerSelectData102"
                            />
                        </div>
                    </div>
                    <!-- 现价预警-输入预警价格-->
                    <div
                        class="warning-seting-box last-child"
                        v-if="$route.query.code=='101'"
                    >
                        <div class="warning-seting-left">{{conditionName}}{{getPageI18n('toText')}}</div>
                        <div class="warning-seting-right ios-input-parent-fix">
                            <input
                                class="warning-form-input"
                                :placeholder="getPageI18n(triggerSelectValue == 500 ? 'inputWarningPriceUp' : 'inputWarningPriceDown')"
                                v-model="warningPriceInput"
                                @focus="inputFocusHandle"
                            />
                            <span class="warning-form-input-unit warning-input-icon-doaller icon-focus-space"></span>
                            <span
                                class="warning-form-input-unit warning-input-icon-focus"
                                @click="priceShowActive"
                                id="priceTip"
                            >
                                <cube-tip
                                    ref="priceInpuTip"
                                    :style="{right:'0',top:'0.67rem'}"
                                    direction="top"
                                    offsetRight="10px"
                                    class="fewfwefw"
                                >
                                    <div>{{$t('dataWarningDetail_page.newTextTip')}}</div>
                                </cube-tip>
                            </span>
                        </div>
                    </div>
                    <!-- 涨跌预警-上涨超过 -->
                    <div
                        class="warning-seting-box last-child"
                        v-if="$route.query.code=='102'"
                    >
                        <div class="warning-seting-left">{{conditionName}}</div>
                        <div class="warning-seting-right ios-input-parent-fix">
                            <input
                                class="warning-form-input"
                                :placeholder="getPageI18n('inputPoint')"
                                v-model="warningPriceInput"
                                @focus="inputFocusHandle"
                            />
                            <span class="warning-form-input-unit added-point icon-focus-space">{{getPageI18n('point')}}</span>
                            <span
                                class="warning-form-input-unit warning-input-icon-focus"
                                @click="riseShowActive"
                                id="pointTip"
                            >
                                <cube-tip
                                    ref="pointPriceTip"
                                    :style="{right:'0',top:'0.67rem'}"
                                    direction="top"
                                    offsetRight="10px"
                                >
                                    <div>{{$t('dataWarningDetail_page.newTextTip')}}</div>
                                </cube-tip>
                            </span>
                        </div>
                    </div>
                    <!-- 反弹预警-累计反弹 -->
                    <div
                        class="warning-seting-box last-child"
                        v-if="$route.query.code=='103'"
                    >
                        <div class="warning-seting-left">{{getPageI18n('totalRebound')}}</div>
                        <div class="warning-seting-right ios-input-parent-fix">
                            <input
                                class="warning-form-input"
                                :placeholder="getPageI18n('inputReboundPoint')"
                                v-model="addedPrice"
                            />
                            <span class="warning-form-input-unit added-point">{{getPageI18n('point')}}</span>
                        </div>
                    </div>
                    <!-- 现价预警-累计回落 -->
                    <div
                        class="warning-seting-box last-child"
                        v-if="$route.query.code=='104'"
                    >
                        <div class="warning-seting-left">{{getPageI18n('totalFall')}}</div>
                        <div class="warning-seting-right ios-input-parent-fix">
                            <input
                                class="warning-form-input"
                                :placeholder="getPageI18n('inpoutTotalFall')"
                                v-model="addedPrice"
                            />
                            <span class="warning-form-input-unit added-point">点</span>
                        </div>
                    </div>

                    <div
                        class="warning-seting-split"
                        v-if="$route.query.code=='101'||$route.query.code=='102'||$route.query.code=='103'||$route.query.code=='104'"
                    ></div>
                    <!--  提醒频率（价格盯盘4个共用）-->
                    <div class="warning-seting-box">
                        <div class="warning-seting-left">{{getPageI18n('remindFrequency')}}</div>
                        <div
                            class="warning-seting-right"
                            @click="showDrawer('priceFriquencyDrawer')"
                        >{{priceFrequencyName}}</div>
                        <div
                            class="warning-seting-right-arrow"
                            @click="showDrawer('priceFriquencyDrawer')"
                        ><span class="warning-seting-arrow-icon"></span>
                        </div>
                    </div>
                    <!--  触发条件（现价预警与涨跌预警共用）-->
                    <div class="warning-seting-box  last-child">
                        <div class="warning-seting-left">{{getPageI18n('expiry')}}</div>
                        <div class="warning-seting-right">
                            <MySwitch
                                :selectValue="expireSelectValue"
                                class="warning-form-tab-select"
                                @select="expireSelectHandle"
                                :data="priceExpireData"
                            />
                        </div>
                    </div>
                    <!--  -->
                </div>

                <!-- =============================价格预警End ================================-->
                <!-- =============================指标预警、组合预警start ================================-->
                <div
                    class="other-warning-box"
                    v-else
                >
                    <div
                        class="warning-seting-box"
                        v-if="!isPriceWarning()"
                    >
                        <div
                            class="warning-seting-left"
                            @click="onLabelTip(getPageI18n('circleLabel'),getPageI18n('questionsDescription').circleTxt)"
                        >{{getPageI18n('circleLabel')}}<img
                                :src="$config.imagePathPrefix+'exclamation_icon.png'"
                                class="warning-seting-left-icon"
                            ></div>
                        <div
                            class="warning-seting-right"
                            @click="showDrawer('cycleDrawer')"
                        >{{cycleName}}</div>
                        <div
                            class="warning-seting-right-arrow"
                            @click="showDrawer('cycleDrawer')"
                        ><span class="warning-seting-arrow-icon"></span></div>
                    </div>
                    <!-- 触发条件 -->
                    <div class="warning-seting-box warning-seting-product">
                        <div
                            class="warning-seting-left"
                            style="flex:2"
                            @click="onLabelTip(getPageI18n('triggleCondtionLabel'),getTriggerTipContent())"
                        >{{getPageI18n('triggleCondtionLabel')}}<img
                                :src="$config.imagePathPrefix+'exclamation_icon.png'"
                                class="warning-seting-left-icon"
                            ></div>
                        <div
                            class="warning-seting-right"
                            @click="showDrawer('conditionDrawer')"
                        >
                            <div class="warning-seting-right-top">{{conditionName}}</div>
                            <div class="warning-seting-right-bottom">{{conditionNameEmptyOrMore}}信号</div>
                        </div>
                        <div
                            class="warning-seting-right-arrow"
                            @click="showDrawer('conditionDrawer')"
                        ><span class="warning-seting-arrow-icon"></span></div>
                    </div>
                    <div
                        class="warning-seting-box"
                        v-if="!isPriceWarning()"
                    >
                        <div class="warning-seting-left">{{getPageI18n('frequencyLabel')}}</div>
                        <div
                            class="warning-seting-right"
                            @click="showDrawer('friquencyDrawer')"
                        >{{frequencyName}}</div>
                        <div
                            class="warning-seting-right-arrow"
                            @click="showDrawer('friquencyDrawer')"
                        ><span class="warning-seting-arrow-icon"></span></div>
                    </div>
                    <div class="warning-seting-box last-child">
                        <div class="warning-seting-left">{{getPageI18n('expiryLabel')}}</div>
                        <!-- <div
                            class="warning-seting-right"
                            @click="showDrawer('expireyDrawer')"
                        >{{expiryName}}</div>
                        <div
                            class="warning-seting-right-arrow"
                            @click="showDrawer('expireyDrawer')"
                        ><span class="warning-seting-arrow-icon"></span></div> -->
                        <div class="warning-seting-right">
                            <div class="static-text">{{getPageI18n('expiryWeek')}}</div>
                        </div>
                    </div>
                </div>
                <!-- =============================指标预警、组合预警end ================================-->
                <!-- 指标预警-周期（价格预警不显示） -->
                <!-- 指标预警-频率（价格预警不显示） -->
                <!-- <div class="common-split-line"></div> -->
                <!-- 风险提示 -->
                <SideSpace value="0.28rem">
                    <div
                        slot='content'
                        class="warning-risk-tip-bottom"
                    >
                        <p>
                            {{getPageI18n('footerTxt').risk}}</p>
                        <p>
                            {{getPageI18n('footerTxt').statement}}</p>
                    </div>
                </SideSpace>
                <button
                    class="submit-warn-btn"
                    :class="{'submit-warn-btn-ios-app-bangsscreen-pm':getCreateWarningBtnCssForIosAppPm()}"
                    @click="submitWarnBtn"
                >{{this.isModifyWarning()?getPageI18n('modiyfyWarning'):getPageI18n('createWarning')}}</button>
            </div>
        </MainLayout>
        <!-- mask -->
        <!-- <MaskPop :visible="maskPopVisible" /> -->
        <!-- drawer start 选择商品 -->
        <cube-drawer
            ref="productDrawer"
            :data="[productLevl1Data,productLevl2Data]"
            @change="productsChangeHandler"
            :selected-index="getProductDrawerIndex"
            @select="productSelectHandler"
            class="common-custorm-cube-drawer common-custorm-cube-drawer-style2"
            :class="{'common-custorm-cube-drawer-web':$config.userFromType()=='web'}"
            @cancel="onCancleDraw"
        >
            <div slot="title">
                <DrawerTitle
                    :title="getPageI18n('selectProduct')"
                    @drawerBack="hideDrawerBack('productDrawer')"
                />
            </div>
        </cube-drawer>
        <!-- 选择周期 -->
        <cube-drawer
            ref="cycleDrawer"
            :data="cycleData"
            :selected-index="cycleDrawerVisible"
            @select="cycleSelectHandler"
            class="common-custorm-cube-drawer"
            :class="{'common-custorm-cube-drawer-web':$config.userFromType()=='web'}"
            @cancel="onCancleDraw"
        >
            <div slot="title">
                <DrawerTitle
                    :title="getPageI18n('selectCircle')"
                    @drawerBack="hideDrawerBack('cycleDrawer')"
                />
            </div>
        </cube-drawer>
        <!-- 选择频率 -->
        <cube-drawer
            ref="friquencyDrawer"
            :data="frequencyData"
            :selected-index="frequencyDrawerIndex"
            @select="frequencySelectHandler"
            class="common-custorm-cube-drawer"
            :class="{'common-custorm-cube-drawer-web':$config.userFromType()=='web'}"
            @cancel="onCancleDraw"
        >
            <div slot="title">
                <DrawerTitle
                    :title="getPageI18n('selectFrequency')"
                    @drawerBack="hideDrawerBack('friquencyDrawer')"
                />
            </div>
        </cube-drawer>
        <!-- 选择触发条件 -->
        <cube-drawer
            ref="conditionDrawer"
            :data="conditionData"
            :selected-index="conditionDrawerIndex"
            @select="conditionSelectHandler"
            class="common-custorm-cube-drawer"
            :class="{'common-custorm-cube-drawer-web':$config.userFromType()=='web'}"
            @cancel="onCancleDraw"
        >
            <div slot="title">
                <DrawerTitle
                    :title="getPageI18n('selectTriggleCondtion')"
                    @drawerBack="hideDrawerBack('conditionDrawer')"
                />
            </div>
            <cube-drawer-panel
                v-for="(panel, index) in conditionData"
                :key="index"
                :index="index"
                :data="panel"
            >
                <cube-drawer-item
                    v-for="(item, i) in panel"
                    :item="item"
                    :key="i"
                    :index="i"
                >
                    <span>{{item.text}}（{{item.emptyOrMore}}信号）</span>
                </cube-drawer-item>
            </cube-drawer-panel>
        </cube-drawer>
        <!-- 选择有效期 -->
        <cube-drawer
            ref="expireyDrawer"
            :data="expiryData"
            :selected-index="expireDrawerIndex"
            @select="expireSelectHandler"
            class="common-custorm-cube-drawer"
            :class="{'common-custorm-cube-drawer-web':$config.userFromType()=='web'}"
            @cancel="onCancleDraw"
        >
            <div slot="title">
                <DrawerTitle
                    :title="getPageI18n('selectExpiry')"
                    @drawerBack="hideDrawerBack('expireyDrawer')"
                />
            </div>
        </cube-drawer>
        <!-- 价格盯盘提醒频率 -->
        <cube-drawer
            ref="priceFriquencyDrawer"
            :data="priceFrequencyData"
            :selected-index="priceFrequencyDrawerIndex"
            @select="priceFrequencySelectHandler"
            class="common-custorm-cube-drawer"
            :class="{'common-custorm-cube-drawer-web':$config.userFromType()=='web'}"
            @cancel="onCancleDraw"
        >
            <div slot="title">
                <DrawerTitle
                    :title="getPageI18n('selectFrequency')"
                    @drawerBack="hideDrawerBack('priceFriquencyDrawer')"
                />
            </div>
        </cube-drawer>
        <!--  -->
        <SelectActionSheet data="" />
        <!--  -->
        <!-- 微信登录注册框 isWeChatLogin-->
        <WeChatLogin
            :show="isWeChatLogin"
            @close="weChatLoginClose"
            refreshPage="5"
        />
    </div>
</template>

<script>

import request from '@services/documentary.js'
import { commonError, getDataFoxAxiosRequest, saveInfoToSessionStorage, getSymbolInfoById, getSymbolsBySort, getWarningSort, trackEvent, trackEventGeneral, encodURIForSpecial, decodURIForSpecial, getSymbolInfoByEname, iosKeyboardHide, getIsNotificationNeedOpen, getDeviceModel, userFromType, isIos, getPlatformCode, getAuthStatu, setCookie, getCookie, getInfoFromSessionStorage, iaiTraderControlApp, getNewPlatform, isFirstVisite, goAppLogin, isIaiTraderApp } from '@public/js/util.js'
import warningCoreData from '@warning/warningDataConfig'
import { getSelectOptions, getWarningConditionForSelectOptions, getSymbolSorts, getSymbolSortsIndex, getWarningCondition, getWarningConfig } from '../../mapConfig.js'
import SelectList from '../../components/SelectList'
import SelectActionSheet from '../../components/SelectActionSheet'
import DrawerTitle from '../../components/DrawerTitle'
import MySwitch from '../../components/Switch'
import MaskPop from '@components/MaskPop'
import { mapMutations, mapGetters, mapState, mapActions } from 'vuex';
import i18n from '@warning/i18n';
const regExp = require('@public/js/regular.js');
const consts = require('@public/js/consts.js');
const warningConsts = require("../../consts.js");

export default {
    components: {
        SelectList,
        DrawerTitle,
        MaskPop,
        MySwitch,
    },
    data() {
        const t = this;
        return {
            isShowHeader: true,
            isWeChatLogin: false,
            // 当前触发actionSheet显示时的触发类型
            saveCurrentTriggerType: '',
            priceActionSheetSelect: -1,
            pointActionSheetSelect: -1,
            newInputTipVisible: false,
            //现价盯盘价格阻尼位数据
            priceVarData: {},
            // 周期
            prisePickerData: [[]],
            prisePickerName: t.$t('common').oneHour,
            prisePickerNameKey: '2',
            loginPopVisible: false,
            // 开始授权
            isAuthStart: false,
            backTitle: t.$t('pageTitle').advanceAssign,
            //websocket
            webSocket: '',
            // 最新价
            newPrice: '',
            //涨跌幅
            changeRate: '',
            // 用户id用户登录后返回
            userLoginInfo: '',
            // 产品名
            productName: [t.$t('common').foreignExchange, t.$t('common').eurDoller],
            productNameKey: ['currency', 'EURUSD,1001'],
            // 周期
            cycleData: [[]],
            cycleName: t.$t('common').fiveMinute,
            cycleNameKey: '7',
            // 频率
            frequencyData: [[]],
            frequencyName: t.$t('common').tipOneTime,
            frequencyNameKey: '1',
            // 价格盯盘提醒评率
            priceFrequencyData: [[]],
            priceFrequencyName: t.$t('common').tipOneTime,
            priceFrequencyNameKey: '1',
            //有效期
            expiryData: [[]],
            expiryName: t.$t('common').onlyOneVirty,
            expiryNameKey: 'week',
            // 条件触发
            conditionData: [[]],
            conditionName: t.$t('common').goldFork,
            conditionNameKey: '600',
            conditionNameEmptyOrMore: '',
            // select层是否隐藏v-model值
            maskPopVisible: false,
            productDrawerIndex: [0, 0],
            productDrawerIndexChange: [0, -1],
            cycleDrawerVisible: [0],
            frequencyDrawerIndex: [0],
            expireDrawerIndex: [0],
            conditionDrawerIndex: [0],
            priceFrequencyDrawerIndex: [0],
            userName: '',
            password: '',
            // 预警价格输入
            warningPriceInput: '',
            // 现价预警触发条件选择
            // triggerSelectData101: [
            //     { text: '价格涨到', value: 500 },
            //     { text: '价格跌到', value: 501 },
            // ],
            triggerSelectData101: [
                { text: t.$t('dataWarningDetail_page').priceRiseTo, value: 500 },
                { text: t.$t('dataWarningDetail_page').priceFallTo, value: 501 },
            ],
            // 涨跌预警触发条件选择
            triggerSelectData102: [
                { text: t.$t('dataWarningDetail_page').riseOver, value: 502 },
                { text: t.$t('dataWarningDetail_page').fallOver, value: 503 },
            ],
            // 价格预警触发-选择value
            triggerSelectValue: 400,
            // 有效期-选择value
            expireSelectValue: 'week',
            // 累计回落及累计反弹输入值
            addedPrice: '',
            //累计回落及累计反弹的最低或最高输入值
            waringPriceLimit: '',
            // 保存商品格式化后的数据[{text:'',value:''}]供select
            productFormatData: [],
            //商品第一层数据
            productLevl1Data: [],
            //商品第二层数据
            productLevl2Data: [],
            // 产品的小数位数
            symbolDigit: 4,
            loginPopShow: false,
            priceExpireData: [
                { text: t.$t('dataWarningDetail_page').expiryDay, value: 'day' },
                { text: t.$t('dataWarningDetail_page').expiryWeek, value: 'week' }
            ]
        }
    },
    methods: {
        ...mapMutations(['symbolsWebSocketSendMsg']),
        ...mapActions(['createWebSocketForSymbols']),
        // 隐藏wechatlogin
        weChatLoginClose() {
            this.isWeChatLogin = false
        },
        clickWarningDetalBody(e) {
            const { target = {} } = e
            if (this.$refs.hasOwnProperty('priceInpuTip')) {
                if (target.id != 'riseTip') {
                    this.$refs.priceInpuTip.hide()
                }
            }
            if (this.$refs.hasOwnProperty('pointPriceTip')) {
                if (target.id != 'pointTip') {
                    this.$refs.pointPriceTip.hide()
                }
            }
        },
        showTip() {
            // 从cookie里获取阻力位tip是否显示过，没显示过才显示，只显示一次维持一个月
            const { code = '' } = this.$route.query
            const t = this;
            const newInputTipKey1 = getCookie(consts.cookies.newInputTipKey1);
            const newInputTipKey2 = getCookie(consts.cookies.newInputTipKey2);
            if (!Boolean(newInputTipKey1) && code == 101) {
                this.$refs.priceInpuTip.show();
                setCookie(consts.cookies.newInputTipKey1, true);
                setTimeout(function () {
                    t.$refs.priceInpuTip.hide();
                }, 5000)
            }
            if (!Boolean(newInputTipKey2) && code == 102) {
                this.$refs.pointPriceTip.show();
                setTimeout(function () {
                    t.$refs.pointPriceTip.hide();
                }, 5000)
                setCookie(consts.cookies.newInputTipKey2, true);
            }
        },
        // 判断newest图标是否显示过，只显示一次在cookie里标记
        getNewestTipVisible() {
            const { newestPriceTip = '', newestRiseTip = '' } = this.$route.query;
            if (!!newestPriceTip) {
                setCookie(consts.cookies.newestTipPriceSelKey, true);
            }
            if (!!newestRiseTip) {
                setCookie(consts.cookies.newestTipRiseSelKey, true);
            }
        },
        dialogAtrInfo() {
            return this.$createDialog({
                type: 'alert',
                title: '平均真实波幅ATR',
                content: '<div><p>IAI Trade 基于1小时K线统计近14天的平均真实波幅ATR，为您实时监控市场价格的波动性。</p><p style="margin-top:10px">由ATR倍数计算的支撑、阻力位，可视为有效的入场点，以及持仓后的止损、止盈点。</p><p style="margin-top:10px">ATR倍数越大，表示距现价越远，短期触破的机率越低。</p></div>',
                zIndex: 200,
                confirmBtn: {
                    text: '知道了',
                }
            })
        },
        // 清除选择的actionSheet index值
        resetActionSheetSelectIndex() {
            this.priceActionSheetSelect = -1;
            this.pointActionSheetSelect = -1;
        },
        // 请求获取symbol价格阻力位
        getAtrValueRequest() {
            let symbol = [];
            try {
                symbol = this.productNameKey[1].split(',');
            } catch (e) {
                return false;
            }
            const parmas = {
                platform: getPlatformCode(),
                symbol: symbol[1],
            }
            // 请求后重置选择的actionsheet index
            this.resetActionSheetSelectIndex()
            request.getAtrValue(parmas).then((res) => {
                const t = this;
                const data = getDataFoxAxiosRequest(res, t);
                if (!!data) {
                    t.priceVarData = data
                }
            }).catch(e => commonError(e, this))
        },
        //
        priceShowActive() {
            const t = this,
                arr = [1, 2, 3],
                _newPrice = Number(t.newPrice);
            let textType = '涨';
            let textType01 = '上涨'
            let titleString = "请选择阻力位价格"
            if (this.conditionNameKey == '501') {
                textType = '跌';
                textType01 = '下跌'
                titleString = '请选择支撑位价格'
            }
            //切换盯盘条件清除选择的状态
            if (this.saveCurrentTriggerType != this.triggerSelectValue) {
                this.resetActionSheetSelectIndex();
                this.saveCurrentTriggerType = this.triggerSelectValue;
            }
            const resultData = arr.map((item, index) => {
                const { value = '', point = '' } = t.priceVarData
                let price = (_newPrice + (index + 1) * value).toFixed(t.symbolDigit);
                if (t.conditionNameKey == '501') {
                    price = (_newPrice - (index + 1) * value).toFixed(t.symbolDigit);
                }
                const _point = Math.round(point * (index + 1));
                return {
                    content: `<div class="price-sheet-value">${price}</div><div  class="price-sheet-sub">${textType01}${index + 1}倍平均波幅ATR，距最新价${textType}${_point}点</div>`,
                    value: price,
                    class: 'price-sheet-select'
                }
            })

            const sheetData = this.$createSelectActionSheet({
                myClass: 'warning-sheet',
                title: titleString,
                active: -1,
                titleIcon: 'static/img/warning/exclamation_icon.png',
                onTitleIcon: (item, index) => {
                    t.dialogAtrInfo().show()
                },
                warninrType: '',
                zIndex: 100,
                data: resultData,
                onSelect: ({ value = '' }, index) => {
                    t.warningPriceInput = value
                    t.priceActionSheetSelect = index;
                },
                onCancel: () => {

                }
            }).show()
        },
        //
        riseShowActive() {
            const t = this,
                arr = [1, 2, 3],
                _newPrice = Number(t.newPrice);
            let textType = '涨';
            let textType01 = '上涨'
            let titleString = "请选择阻力位点数"
            if (this.conditionNameKey == '503') {
                textType = '跌';
                textType01 = '下跌'
                titleString = '请选择支撑位点数'
            }
            //切换盯盘条件清除选择的状态
            if (this.saveCurrentTriggerType != this.triggerSelectValue) {
                this.resetActionSheetSelectIndex();
                this.saveCurrentTriggerType = this.triggerSelectValue;
            }
            const resultData = arr.map((item, index) => {
                const { value = '', point = '' } = t.priceVarData
                let price = (_newPrice + (index + 1) * value).toFixed(t.symbolDigit);
                if (t.conditionNameKey == '503') {
                    price = (_newPrice - (index + 1) * value).toFixed(t.symbolDigit)
                }
                const _point = Math.round(point * (index + 1));
                return {
                    content: `<div class="price-sheet-value">${_point}点</div><div  class="price-sheet-sub">${textType01}${index + 1}倍平均波幅ATR，${textType}至${price}</div>`,
                    value: _point,
                    class: 'price-sheet-select'
                }
            })
            const sheetData =
                this.$createSelectActionSheet({
                    myClass: 'warning-sheet',
                    title: titleString,
                    active: -1,
                    titleIcon: 'static/img/warning/exclamation_icon.png',
                    onTitleIcon: (item, index) => {
                        t.dialogAtrInfo().show()
                    },
                    data: resultData,
                    onSelect: ({ value = '' }, index) => {
                        t.warningPriceInput = value;
                        t.pointActionSheetSelect = index;
                    },
                    onCancel: () => {

                    }
                }).show()
        },
        //ios app 01业务
        getCreateWarningBtnCssForIosAppPm() {
            const deviceModel = getDeviceModel();
            /////
            const _userFromType = userFromType()
            //
            const platformCode = getPlatformCode();
            let result = false;
            console.log("platformCode=" + platformCode)
            console.log("_userFromType=" + _userFromType)
            console.log("isIos()=" + isIos())
            console.log("consts.visitDeviceType.fromApp=" + consts.visitDeviceType.fromApp)
            console.log("deviceModel.isBangsScreen=" + deviceModel.isBangsScreen)
            console.log('consts.platformNames.pm=' + consts.platformNames.pm)
            if (_userFromType === consts.visitDeviceType.fromApp) {
                //刘海屏
                if (isIos()) {
                    // 刘海屏
                    if (deviceModel.isBangsScreen) {
                        // if (platformCode == consts.platformNames.pm || platformCode == consts.platformNames.pmglod) {
                        //     result = true
                        // }
                        return true
                    }
                }
            }
            console.log('result' + result)
            return result
        },
        //解决ios输入定位
        inputFocusHandle() {
            iosKeyboardHide()
        },
        authPopcancleHandle() {
            this.loginPopVisible = false
        },
        // 获取当前页面国际化数据
        getPageI18n(key) {
            return this.$t('dataWarningDetail_page')[key]
        },
        // 获取预警价格跟随切换开关变换文字
        getSwitchInputLable() {

        },
        // 预警帮助点击
        warningHelpHandle() {
            this.datatrackEvent('Questiontag');
        },
        //返回按钮
        backFunc() {
            const { backPath = '' } = this.$route.query
            if (backPath !== '') {
                this.$router.replace(`/${backPath}`)
                this.$router.push({ name: backPath, query: { tabName: this.$t('myWarning_page.realTimeMonitor') } })
            } else {
                this.$router.go(-1)
            }
        },
        // 获取title名
        getTitleName() {
            const { modify = '', code = '', name = '' } = this.$route.query

            // 如果是修改
            if (String(modify) === 'true' & code != '') {
                const warningTypeInfoArr = getWarningConfig(code, 'ww')
                return warningTypeInfoArr.length > 0 ? warningTypeInfoArr[0].title : '';
            } else {

                return name != '' ? decodURIForSpecial(name) : '';
            }
        },
        // 根据预警类型code获取相应触发条件说明
        getTriggerTipContent() {
            const { code = '', warningType = '' } = this.$route.query;
            const triggerSelectOptions = getWarningConditionForSelectOptions(code, warningType);
            let htmlStr = '';
            const { data = [] } = triggerSelectOptions[0]
            data.forEach(({ descriptions: { principle = '' }, text = '', triggerDescription = '' }) => {
                let muchString = '';
                if (text.length <= 5) {
                    muchString = 'create-warning-toast-title-short02'
                }
                htmlStr += `<div class='create-warning-toast-title ${muchString}'><span>${text}</span></div>
               <p class='create-warning-toast-p'>${triggerDescription}</p>`
            })
            return htmlStr;
        },
        //判断是否是修改预警
        isModifyWarning() {
            return String(this.$route.query.modify) == 'true' ? true : false
        },
        // 选择的商品名
        getProductName() {
            const productName = this.productName[1];
            try {
                if (productName.indexOf(' ') > -1) {
                    return productName.split(' ')[0]
                } else {
                    return productName
                }
            } catch (e) {
                return productName
            }
        },
        // 获取预警类型需要链接的页面
        getHelpPageName() {
            const { code = '' } = this.$route.query;
            if (code != '') {
                const queryObj = Object.assign(this.$route.query, { name: this.getTitleName() })
                if (getWarningSort(code).code == consts.priceWarningCode) {
                    //    return 'priceWarningHelp'
                    return { name: 'helpPriceWarning', query: queryObj }
                } else {
                    return { name: 'help', query: queryObj }
                }
            }
        },
        // 返回按钮文字
        getWarnningType() {
            const { warningType = '', backPath = '', modify = '' } = this.$route.query;
            let result = '';
            switch (warningType) {
                case 'priceWarning': {
                    result = this.$t('common').priceWarning;
                    break;
                }
                case 'indexWarning': {
                    result = this.$t('common').indexWarning;
                    break;
                }
                case 'combinationWarning': {
                    result = this.$t('common').combinationWarning;
                    break;
                }
                default: {
                    result = this.$t('common').intelligentWarning;
                }
            }
            // 只要是修改都返回我的预警页面，其它都返回上级
            this.backTitle = String(modify) === 'true' ? this.$t('common').myWarning : this.$t('pageTitle').advanceAssign
        },
        expireSelectHandle({ index, value }) {
            if (value == 'week') {
                this.datatrackEvent('Timeline_Week');
            }
            this.expireSelectValue = value;
        },
        //价格预警触发条件选择
        triggerSelectHandle({ text, value, index }) {
            this.triggerSelectIndex = index;
            this.triggerSelectValue = value;
            this.conditionNameKey = value;
            this.conditionName = text;
            // this.resetActionSheetSelectIndex()
            this.warningPriceInput = '';
        },
        // 是否时价格预警
        isPriceWarning() {
            return this.$route.query.warningType === 'priceWarning';
        },
        // 跳转到身份验证页面
        toValidateIdentity() {
            this.$router.push({ name: 'validateIdentity', query: { username: this.userName } })
        },
        // 标签提示
        onLabelTip(title, content) {
            const t = this;
            this.$createDialog({
                type: 'alert',
                title: title,
                // showClose: true,
                content: content,
                confirmBtn: {
                    text: t.$t('toastTxt').iKnowIt,
                    active: true,
                    disabled: false,
                    href: 'javascript:;'
                },
            }).show();
        },
        hideDrawerBack(refsKey) {
            this.isShowHeader = true;
            this.maskPopVisible = false;
            this.$refs[refsKey].hide()
        },
        showDrawer(refsKey) {
            const { modify = '' } = this.$route.query;
            // 如果是修改条件,不能选择商品
            if (this.isModifyWarning() && refsKey == 'productDrawer') {
                return false;
            }
            this.maskPopVisible = true;
            this.$refs[refsKey].show();
            this.isShowHeader = false;
        },
        changeHandler(index, item, selectedVal, selectedIndex, selectedText) {

        },
        // 商品change事件处理
        productsChangeHandler(index, item, selectedVal, selectedIndex, selectedText) {
            // this.productDrawerIndex = [selectedIndex[0],-1];
            this.productDrawerIndexChange = selectedIndex;
            this.productLevl2Data = this.productFormatData.filter((filterItem) => {
                return filterItem.sort == selectedVal[0]
            });
        },
        // 隐藏select
        drawerSelectHange() {
            this.isShowHeader = true
        },
        // 产品选择
        productSelectHandler(selectedVal, selectedIndex, selectedText) {
            //订阅行情数据
            const selectName = selectedVal[1].split(',')
            this.symbolsWebSocketSendMsg({
                names: [selectName[1]],
                type: 'modify'
            })
            //productDrawerIndex
            this.productDrawerIndex = selectedIndex;
            this.productName = selectedText;
            this.productNameKey = selectedVal;
            this.maskPopVisible = false;
            // 保存选择产品的小数位数
            this.setSymbolDigit(selectName[1]);
            // 选择商品后重置预警输入
            this.newPrice = '';
            this.changeRate = '';
            this.warningPriceInput = '';
            this.waringPriceLimit = '';
            this.addedPrice = '';
            this.datatrackEvent('Product');
            this.getAtrValueRequest()
            this.drawerSelectHange()
        },
        //埋点
        datatrackEvent(eventName = '') {
            const { warningType = '', code = '' } = this.$route.query;
            trackEvent({ eventName }, { code, warningType })
        },
        // 周期选择
        cycleSelectHandler(selectedVal, selectedIndex, selectedText) {
            this.datatrackEvent('Period')
            this.selectChangeState(selectedVal, selectedIndex, selectedText, 'cycleName', 'cycleDrawerVisible');
        },
        // 频率选择
        frequencySelectHandler(selectedVal, selectedIndex, selectedText) {
            this.datatrackEvent('Frequency')
            this.selectChangeState(selectedVal, selectedIndex, selectedText, 'frequencyName', 'frequencyDrawerIndex');
        },
        // 价格提醒频率选择
        priceFrequencySelectHandler(selectedVal, selectedIndex, selectedText) {
            this.datatrackEvent('PriceFrequency')
            this.selectChangeState(selectedVal, selectedIndex, selectedText, 'priceFrequencyName', 'priceFrequencyDrawerIndex')
            // 每天提醒一次，七天有效    0
            // 仅提醒一次，当日有效，七天有效
            if (selectedVal[0] === '0') {
                this.priceExpireData = [
                    { text: this.$t('dataWarningDetail_page').expiryWeek, value: 'week' }
                ];
                this.expireSelectValue = 'week';
            } else {
                this.priceExpireData = [
                    { text: this.$t('dataWarningDetail_page').expiryDay, value: 'day' },
                    { text: this.$t('dataWarningDetail_page').expiryWeek, value: 'week' }
                ];
            }

        },
        // 触发条件选择
        conditionSelectHandler(selectedVal, selectedIndex, selectedText) {
            let warningTypeInfo = getWarningConditionForSelectOptions(this.$route.query.code, this.$route.query.warningType)[0].data;
            let selectItem = {};
            warningTypeInfo.map(item => {
                if (selectedVal[0] === item.value) {
                    selectItem = item;
                }
            })
            this.conditionNameEmptyOrMore = selectItem.emptyOrMore;
            this.datatrackEvent('Condition');
            this.selectChangeState(selectedVal, selectedIndex, selectedText, 'conditionName', 'conditionDrawerIndex');

        },
        // 触发条件选择
        expireSelectHandler(selectedVal, selectedIndex, selectedText) {
            this.datatrackEvent('Timeline')
            this.selectChangeState(selectedVal, selectedIndex, selectedText, 'expiryName', 'expiryDrawerIndex')

        },
        // 选择drawer选项后改变状态
        selectChangeState(selectedVal, selectedIndex, selectedText, stateKey, indexKey) {
            if (!stateKey) return false;
            this[stateKey] = Array.isArray(selectedText) & selectedText.length > 0 ? selectedText[0] : '';
            this[stateKey + 'Key'] = Array.isArray(selectedVal) & selectedVal.length > 0 ? selectedVal[0] : '';
            this.maskPopVisible = false;
            this[indexKey] = selectedIndex;
            this.isShowHeader = true;
        },
        onCancleDraw() {
            this.maskPopVisible = false;
        },
        // 返回选择symbol信息
        getSelectSymbolInfo() {
            const info = (this.productNameKey[1]).split(',')
            return {
                ename: info[0],
                code: info[1]
            }
        },
        //提交前校验填写参数，成功返回true,失败false
        isValidateSubmitBeforeSuccess() {
            const { code = '', symbol = '' } = this.$route.query;
            const t = this;
            let inputTip = '';
            if (!code || !symbol) {
                inputTip = 'code或symbol不能为空'
            }
            // 现价预警、涨跌预警（验证价格预警是否填写预警价格）
            if (code == 101 & t.warningPriceInput === '') {
                inputTip = t.getToastTxt('triggerErrorTip101_01')
            }
            if (code == 102 & t.warningPriceInput === '') {
                inputTip = t.getToastTxt('triggerErrorTip101_02')
            }
            // 反弹预警
            if ((code == 103)) {
                if (t.waringPriceLimit === '') {
                    inputTip = t.getToastTxt('triggerErrorTip103_01')
                } else if (t.addedPrice === '') {
                    inputTip = t.getToastTxt('triggerErrorTip103_02')
                }
            }
            // 反弹预警
            if ((code == 104)) {
                if (t.waringPriceLimit === '') {
                    inputTip = t.getToastTxt('triggerErrorTip104_01')
                } else if (t.addedPrice === '') {
                    inputTip = t.getToastTxt('triggerErrorTip104_02')
                }
            }
            if (inputTip !== '') {
                t.$createDialog({
                    type: 'alert',
                    title: t.getPageI18n('createWarning'),
                    content: inputTip,
                    confirmBtn: {
                        text: t.$t('common').sureBtnText,
                        active: true,
                        disabled: false,
                        href: 'javascript:;'
                    },
                    onConfirm: () => {
                        // 执行授权,授权成功后执行回调
                        inputTip = ''
                    },
                }).show();
                return false;
            } else {
                return true
            }
        },
        // 提交预警成功以后流程
        submitWarningSuccess() {
            setTimeout(function () {
                getIsNotificationNeedOpen().then((data) => {
                    console.log('通知权限' + data)
                }, (err) => {
                    console.log(err)
                })
            }, 3000);
            this.$router.push({ name: 'myWarning', query: { tabName: this.$t('myWarning_page.realTimeMonitor') } })
        },
        // 调转登录
        goToIndex() {
            const userFromType = this.$config.userFromType()
            //  app
            if (consts.visitDeviceType.fromApp == userFromType) {
                this.loginPopShow = true
                //web
            } else {
                this.$router.push({ name: 'login', query: { loginAfterTo: '/index' } })
            }

        },
        // 获取国际化提示文字
        getToastTxt(key) {
            return this.$t('toastTxt')[key]
        },
        // 依据预警触发条件校验输入数据是否符合业务逻辑，如：上涨超过不能小于当前价格，下跌超过不能大于当前价格
        isValidateInputByTrigger() {
            const t = this;
            const { code = '', symbol = '', warningType = '', modify = false } = this.$route.query;
            const warningTypeInfo = getWarningConditionForSelectOptions(code, warningType);
            const { data: warningData = {} } = warningTypeInfo[0];
            // 提交预警校验错误提示信息
            let alertTipText = ''
            // 现价预警
            if (code == 101) {
                // 500 价格涨到条件
                if (t.triggerSelectValue == warningData[0].value) {
                    if ((Number(t.warningPriceInput) <= Number(t.newPrice))) {
                        alertTipText = t.getToastTxt('triggerErrorTip500')

                    }
                    // 501 价格跌到条件
                } else if (t.triggerSelectValue == warningData[1].value) {
                    if (Number(t.warningPriceInput) >= Number(t.newPrice)) {
                        alertTipText = t.getToastTxt('triggerErrorTip501')
                    }
                }
                //反弹预警 504

            } else if (code == 103) {
                if ((Number(t.waringPriceLimit) >= Number(t.newPrice))) {
                    alertTipText = t.getToastTxt('triggerErrorTip501')
                }
            } else if (code == 104) {
                if ((Number(t.waringPriceLimit) <= Number(t.newPrice))) {
                    alertTipText = t.getToastTxt('triggerErrorTip500')
                }
            }
            //检测输入合法性
            if (alertTipText == '' && (code == 101 || code == 102)) {
                if (regExp.numberInputValidate.test(t.warningPriceInput)) {
                    alertTipText = t.getToastTxt('inputErrorTip');
                }
            } else if (alertTipText == '' && code == 103) {
                if (regExp.numberInputValidate.test(t.addedPrice) || regExp.numberInputValidate.test(t.waringPriceLimit)) {
                    alertTipText = t.getToastTxt('inputErrorTip');
                }
            } else if (alertTipText == '' && code == 104) {
                if (regExp.numberInputValidate.test(t.waringPriceLimit) || regExp.numberInputValidate.test(t.addedPrice)) {
                    alertTipText = t.getToastTxt('inputErrorTip');
                }
            }
            if (alertTipText !== '') {
                t.$createDialog({
                    type: 'alert',
                    title: t.getPageI18n('createWarning'),
                    content: alertTipText,
                    confirmBtn: {
                        text: t.$t('common').sureBtnText,
                        active: true,
                        disabled: false,
                        href: 'javascript:;'
                    },
                    onConfirm: () => {
                        // 执行授权,授权成功后执行回调
                        alertTipText = ''
                    },
                }).show();
                return false;
            } else {
                return true
            }

        },
        // 调转登录
        goToLogin() {
            this.$router.push({ name: 'login', query: { loginAfterTo: 'index' } })
        },
        //提交预警
        submitWarnBtn() {
            const t = this, loginInfo = this.$config.getLoginInfo();
            // 校验授权开始

            if (this.$config.userFromType() == 'app') {
                if (!this.$config.isLogined()) {
                    // 新平台
                    if (getNewPlatform()) {
                        // 跳转登录界面（原生app,url拦截）
                        if (isIaiTraderApp()) {
                            goAppLogin(t.$router.history.current.path);
                            return false
                        } else {
                            this.isWeChatLogin = true;
                        }

                    } else {
                        this.loginPopVisible = true;
                    }
                    return false;
                }
                // 授权验证
                if (getAuthStatu() == consts.auth.statu.fail) {
                    this.isAuthStart = true;
                }
                // web 未登录
            } else {
                if (!this.$config.isLogined()) {
                    this.goToLogin();
                    return false;
                }
            }
            const { code = '', symbol = '', warningType = '', modify = false } = this.$route.query;
            // 预警类型信息
            const warningTypeInfo = getWarningConditionForSelectOptions(code, warningType);
            const { data: warningData = {} } = warningTypeInfo[0]
            const selectedSymbolInfo = t.getSelectSymbolInfo()
            let cycleNameKeyValue = t.cycleNameKey;
            // 周期
            let expireValue = this.expiryNameKey;
            let settingParams = { 'trigger': t.triggerSelectValue };
            let setingResult = {};
            let frequencyValue = '1';

            // 价格预警
            if (warningType === 'priceWarning') {
                setingResult = { trigger: t.conditionNameKey };
                expireValue = t.expireSelectValue;
                cycleNameKeyValue = 0;
                frequencyValue = this.priceFrequencyNameKey;
                // 根据预警类型参数
                if (code == 101) {
                    setingResult = Object.assign(settingParams, {
                        params: { target: t.warningPriceInput }
                    })
                }
                if (code == 102) {
                    setingResult = Object.assign(settingParams, {
                        params: { point: t.warningPriceInput, price: t.newPrice }
                    })
                }
                if (code == 103) {
                    setingResult = Object.assign(settingParams, {
                        params: { low: t.waringPriceLimit, point: t.addedPrice }
                    })
                }
                if (code == 104) {
                    setingResult = Object.assign(settingParams, {
                        params: { high: t.waringPriceLimit, point: t.addedPrice }
                    })
                }
                // 指标预警及其他预警
            } else {
                setingResult = Object.assign({ 'trigger': t.conditionNameKey }, { params: {} });
                frequencyValue = this.frequencyNameKey;

            }
            //校验输入条件是否为空（常规校验）
            const isVlidateSuccess = t.isValidateSubmitBeforeSuccess();
            if (!isVlidateSuccess) {
                return false
            }
            // 校验输入是否符合条件（严格）
            if (!t.isValidateInputByTrigger()) return;
            // 新增预警
            const addParams = {
                // userid: loginInfo.userid,
                symbol: selectedSymbolInfo.code,
                wpcid: '1',//平台推送渠道 例:1,2,3
                // platform: 'PF04',//平台 现有“PF04”
                cycle: cycleNameKeyValue,
                frequency: frequencyValue,
                warning_type: code,
                expire: expireValue,
                // expire_at: '1553413000',//过期时间： 例15012120120
                //配置参数 例 {"trigger": 500, "params": {"target": 1.175}} 指标预警没有target
                setting: JSON.stringify(setingResult),
            };            
            // 修改预警参数
            if (t.isModifyWarning()) {
                const { id = '', userid = '', wpcid = '', expire_at = '', created_at = '' } = this.$route.query;
                const modifyExtraParams = {
                    id,
                    userid,
                    wpcid,
                    // platform: 'PF04',
                    // created_at,
                    // expire_at
                }              
                const modifyParams = Object.assign({}, addParams, modifyExtraParams);
                request.riskWarningUpdate(modifyParams).then((res) => {
                    const data = getDataFoxAxiosRequest(res, t, true);
                    if (data) {
                        const { status = '', message = '', data: apiData } = data;
                        // 接口接口响应状态为-1为未登录状态提示登录 -3认证
                        if (status == consts.resStatus.noLogin) {
                            t.goToIndex();
                        } else if (status == consts.resStatus.success) {
                            t.$createToast({
                                txt: message ? message : t.getPageI18n('modifyWarningSuccess'),
                                type: 'correct'
                            }).show();
                            setTimeout(function () {
                                t.submitWarningSuccess();
                            }, 600)
                        } else {
                            t.$createDialog({
                                type: 'alert',
                                title: '提示',
                                content: message ? message : '修改盯盘失败',
                            }).show()
                        }
                    }
                }).catch(e => commonError(e, this))
                //新增预警
            } else {
                request.riskWarningAdd(addParams).then((res) => {
                    const {  data } = res
                    const { status = '', message = '', data: apiData } = data;
                    // 接口接口响应状态为-1为未登录状态提示登录 -3认证
                    if (status == -1) {
                        t.goToIndex()
                    } else if (status == 1) {
                        t.$createToast({
                            txt: message ? message : t.getPageI18n('setWarningSuccess'),
                            type: 'correct'
                        }).show();
                        //创建预警埋点
                        t.datatrackEvent('Create');
                        setTimeout(function () {
                            t.submitWarningSuccess();
                        }, 600)
                    } else {
                        t.$createDialog({
                            type: 'alert',
                            title: '提示',
                            content: message ? message : '创建盯盘失败',
                            confirmBtn:{
                                text: '知道了'
                            }
                        }).show()
                    }
                }).catch(e => commonError(e, this))
            }

        },
        //格式化websocket数据，获取data值
        formatSymbolsDataFormSS(source, isFormamt = true) {
            const data = isFormamt ? source.data : source
            if (isFormamt) {
                const msg = JSON.parse(data), { data: resData } = msg;
                return resData
            } else {
                return data
            }
        },
        // 处理接手到的websocket消息
        reciveInfoFromSocket(data) {
            try {
                const {   //最新价
                    new_price,
                    //涨跌额
                    // changeAmount,
                    changeRate,
                    // 货币对名称
                    symbol,
                    //涨跌幅
                } = this.formatSymbolsDataFormSS(data);
                // 只接受选择的货币对websocket名称推送的信息
                const productNameKeyResult = this.productNameKey[1].split(',')
                if (productNameKeyResult[0] === symbol) {
                    this.changeRate = (changeRate * 100).toFixed(2) + '%';
                    this.newPrice = new_price.toFixed(4);
                }
            } catch (e) {
                console.log(e.message)
            }

        },
        // 选择的产品symbol后，订阅行情数据 发送消息
        selectSymbolForSendCode() {
            if (this.productNameKey.length > 1) {
                const symbolCode = (this.productNameKey[1]).split(',');
                this.symbolsWebSocketSendMsg({ names: [symbolCode[1]], type: 'modify' })
            }
        },
        //获取已选择的symbol参数（从我的预警链接过来，将带过来的参数写进symbol选择项)
        setSelectedSymbol() {
            //modify 表示修改标志
            const { symbol, modify, frequencyNameKey } = this.$route.query;
            if (!modify | !symbol) return false;
            const symbolInfo = getSymbolInfoById(symbol);
            if (symbolInfo) {
                const { id, uname } = symbolInfo
                const sortIndex = getSymbolSortsIndex(id[2]);
                this.productName = [sortIndex.text, id[1]];
                if (sortIndex) {
                    this.productNameKey = [id[2], `${uname},${id[0]}`]
                    this.productDrawerIndex = [sortIndex.index, symbolInfo.index];
                }
                this.selectSymbolForSendCode()
            }
            // 每天提醒一次，七天有效    0
            // 仅提醒一次，当日有效，七天有效
            if (frequencyNameKey == '0') {
                this.priceExpireData = [
                    { text: this.$t('dataWarningDetail_page').expiryWeek, value: 'week' }
                ];
                this.expireSelectValue = 'week';
            } else {
                this.priceExpireData = [
                    { text: this.$t('dataWarningDetail_page').expiryDay, value: 'day' },
                    { text: this.$t('dataWarningDetail_page').expiryWeek, value: 'week' }
                ];
            }

        },
        // 设置商品小数点位数
        setSymbolDigit(symbolId) {
            const symbolInfo = getSymbolInfoById(symbolId);
            if (symbolInfo !== false) {
                this.symbolDigit = symbolInfo.id[4]
            }
        },
        // 获取触发条件已设置的参数(主要指修改，设置已设置过的参数为选择状态)
        setSelectedCondition() {
            const t = this;
            const { code = '', warningType = '', trigger = '', target = '', high = '', point = '', expire = '', modify = false, cycle = '', frequencyNameKey = '', priceFrequencyNameKey = '', symbol = '', low = '' } = t.$route.query;
            const warningSort = getWarningSort(code);
            const triggerSelectOptions = getWarningConditionForSelectOptions(code, warningType);
            // 如果是修改预警，目的是还原用户设置过的参数
            if (t.isModifyWarning()) {
                // 设置修改状态的title
                // 设置小数点
                t.setSymbolDigit(symbol);
                const warningTypeInfo = getWarningSort(code)
                if (warningTypeInfo.cname != '') {

                }
                // 根据预警类型返回触发条件
                if (code == 104) {
                    t.waringPriceLimit = high;
                    t.addedPrice = point;
                }
                if (code == 101) {
                    t.warningPriceInput = target;
                    if (trigger == 500) {
                        t.conditionName = t.triggerSelectData101[0].text
                    } else if (trigger == 501) {
                        t.conditionName = t.triggerSelectData101[1].text
                    }
                }
                if (code == 101 || code == 102 || code == 103 || code == 104) {
                    t.expireSelectValue = expire;
                    t.triggerSelectValue = trigger;

                    const priceFrequencyInfo = getSelectOptions({ type: 'priceFrequency', value: frequencyNameKey });
                    t.priceFrequencyDrawerIndex = priceFrequencyInfo != false ? [priceFrequencyInfo[0].index] : 0
                    t.priceFrequencyName = priceFrequencyInfo != false ? priceFrequencyInfo[0].text : '';
                    t.priceFrequencyNameKey = frequencyNameKey;
                }
                if (code == 103 & low !== '') {
                    t.waringPriceLimit = low;
                    t.addedPrice = point;
                }
                if (code == 102 & point !== '') {
                    t.warningPriceInput = point;
                }
                if (code == 102) {
                    if (trigger == 502) {
                        t.conditionName = t.triggerSelectData102[0].text
                    } else if (trigger == 503) {
                        t.conditionName = t.triggerSelectData102[1].text
                    }
                }
                // 除了价格预警以外的预警
                if (warningSort !== false & warningSort.ename !== 'priceWarning') {
                    const cycleInfo = getSelectOptions({ type: 'cycle', value: cycle });
                    const frequencyInfo = getSelectOptions({ type: 'frequency', value: frequencyNameKey });
                    const expireInfo = getSelectOptions({ type: 'expiry', value: expire });
                    //获取已设置过的触发条件信息
                    const triggerInfo = getWarningCondition(trigger, code);
                    //  触发条件
                    t.conditionDrawerIndex = triggerInfo != false ? [triggerInfo.index] : 0;
                    t.conditionName = triggerInfo !== false ? triggerInfo.text : '';
                    t.conditionNameKey = trigger;
                    t.conditionNameEmptyOrMore = triggerInfo.emptyOrMore;
                    //有效期
                    t.expireDrawerIndex = expireInfo != false ? [expireInfo[0].index] : 0
                    t.expiryName = expireInfo != false ? expireInfo[0].text : ''
                    t.expiryNameKey = expire
                    // 频率
                    t.frequencyDrawerIndex = frequencyInfo != false ? [frequencyInfo[0].index] : 0
                    t.frequencyName = frequencyInfo != false ? frequencyInfo[0].text : ''
                    t.frequencyNameKey = frequencyNameKey
                    // 设置周期选择状态
                    t.cycleDrawerVisible = cycleInfo != false ? [cycleInfo[0].index] : 0;
                    t.cycleNameKey = cycle
                    t.cycleName = cycleInfo != false ? cycleInfo[0].text : ''
                }
            } else {
                t.triggerSelectValue = triggerSelectOptions[0].data[0].value;
                t.conditionNameKey = triggerSelectOptions[0].data[0].value;
                if (warningType !== 'priceWarning') {
                    t.conditionName = triggerSelectOptions[0].data[0].text;
                    t.conditionNameEmptyOrMore = triggerSelectOptions[0].data[0].emptyOrMore;
                } else {
                    t.conditionName = triggerSelectOptions[0].data[0].text;
                }
            }
            //  （修改、新建）设置triger触发条件的select options
            t.conditionData = [triggerSelectOptions[0].data];
        },
        // 设置涨跌预警-现价预警触发条件默认值
        getTriggerSelectValue() {
            const { code } = this.$route.query;
            if (code == 101) {
                this.triggerSelectValue = this.triggerSelectData101[0].value
            } else if (code == 102) {
                this.triggerSelectValue = this.triggerSelectData102[0].value
            }
        },
        // 是否超过小数位数
        isOverDgits(str = '') {
            if (!str) return false;
            const dit = (String(str)).indexOf('.');
            if (dit > -1) {
                const ditCount = str.substr(dit + 1);
                return ditCount.length > Number(this.symbolDigit)
            } else {
                return false
            }
        },
        /**
         * @description 限定小数位数不能超过限定的小数位数
         * @param newValue 状态新值
         * @param oldValue 状态旧值
         * @param watchKey 状态key
         * @param isHaveSymbolDigit 是否需要根据symbol的小数位数校验输入值
         */
        numberWatch(newValue, oldValue, watchKey, isHaveSymbolDigit = true) {
            if (newValue !== "." && !regExp.number.test(Number(newValue))) {
                this[watchKey] = newValue.slice(0, -1);
                //数字
            } else {
                if (isHaveSymbolDigit && this.isOverDgits(newValue)) {
                    this[watchKey] = oldValue;
                } else {
                    if (this.symbolDigit == 0 && newValue.substr(-1, 1) == ".") {
                        this[watchKey] = oldValue;
                    } else {
                        this[watchKey] = newValue;
                    }
                }
            }
        },
        //app url有setWarningSymbol参数，设置商品的选中分类及订阅行情数据设置
        setWarningSymbolProductSelect(symbolName = '') {
            const t = this;
            if (symbolName == '') { return false; }
            const setWarningSymbolName = symbolName;
            const symbolInfo = getSymbolInfoByEname(setWarningSymbolName);
            const _productDrawerIndex = [];
            let symbolSelectNameArr = [];
            if (symbolInfo && symbolInfo.hasOwnProperty('id')) {
                symbolSelectNameArr = ['', `${symbolInfo.id[0]}`];
                //  设置选择的参数值
                t.productNameKey = [undefined, `${setWarningSymbolName},${symbolInfo.id[0]}`];
                t.productName = [undefined, `${symbolInfo.id[1]} ${setWarningSymbolName}`];
                // 找到被设置商品的一级分类
                t.productLevl1Data.forEach(({ value }, index) => {
                    if (symbolInfo.id[2] == value) {
                        _productDrawerIndex.push(index)
                    }
                })
                // 设置2级分类
                t.productLevl2Data = t.productFormatData.filter((filterItem) => {
                    return filterItem.sort == symbolInfo.id[2]
                });
                // 找到被设置商品在二级分类中的index
                t.productLevl2Data.forEach(({ value = '' }, levl2DataIndex) => {
                    if (value != '' && value.indexOf(',' > 0)) {
                        const symbolCode = value.split(',')[1];
                        if (symbolCode == symbolInfo.id[0] && _productDrawerIndex.length < 2) {
                            _productDrawerIndex.push(levl2DataIndex)
                        }
                    }
                })
                // 设置被选中商品
                t.productDrawerIndex = _productDrawerIndex;
                t.productDrawerIndexChange = _productDrawerIndex
            }
            // 返回发送订阅行情的信息
            return symbolSelectNameArr
        },
        // 订阅symbol行情，发送消息
        toSymbolWebSocketsendMessage() {
            const t = this;
            let symbolSelectNameArr = [];
            let warningSymbol = getInfoFromSessionStorage(consts.setWarningSymbolKey)
            if (this.$route.query.hasOwnProperty(consts.setWarningSymbolKey)) {
                warningSymbol = { value: this.$route.query[consts.setWarningSymbolKey] }
            }
            try {
                //app跳转url有setWarningSymbolKey参数表示要根据symbol的英文名称跳转到预警详情页面
                if (warningSymbol) {
                    symbolSelectNameArr = t.setWarningSymbolProductSelect(warningSymbol.value)
                } else {
                    symbolSelectNameArr = (t.productLevl2Data[t.productDrawerIndex[1]].value).split(',')
                }

            } catch (e) {
                symbolSelectNameArr = ['EURUSD', '102'];
            }
            this.symbolsWebSocketSendMsg({
                names: [symbolSelectNameArr[1]],
                type: 'modify'
            })
        },
        //设置默认外汇选择数据 //['currency', 'EURUSD,1001']
        setDefaultSymbol() {
            const defaultSymbol = getSymbolsBySort('currency');
            this.productNameKey = ['currency', `${defaultSymbol[0].uname},${defaultSymbol[0].id[0]}`];
            //['外汇', '欧元美元'],
            this.productName = [this.$t('common').foreignExchange, defaultSymbol[0].id[1]];
            // 如果地址栏有setWarningSymbol参数（根据url setWarningSymbol参数设置商品）或本地存储里有setWarningSymbol
            let warningSymbol = getInfoFromSessionStorage(consts.setWarningSymbolKey)
            if (this.$route.query.hasOwnProperty(consts.setWarningSymbolKey)) {
                warningSymbol = { value: this.$route.query[consts.setWarningSymbolKey] }
            }

            if (warningSymbol) {
                const symbolInfo = getSymbolInfoByEname(warningSymbol.value);
                if (symbolInfo) {
                    this.symbolDigit = symbolInfo.id[4]
                }
            } else {
                this.symbolDigit = defaultSymbol[0].id[4]
            }

        },
        // 获取预警类型说明图片
        getWarnTypePic() {
            const { code = '', warningType = '' } = this.$route.query;
            const triggerSelectOptions = getWarningConditionForSelectOptions(code, warningType);
            let picName = ''
            const { descriptions: { dealCase = '', example = '', imagesPath = '' } = {} } = triggerSelectOptions[0];
            //    现价预警及涨跌预警
            if (code == '101' || code == '102') {
                if (dealCase.length > 0) {
                    picName = dealCase[0].imagesPath[0]
                }
                //反弹预警及回落预警
            } else if (code == '103' || code == '104') {
                if (example != '' && imagesPath != '') {
                    picName = imagesPath[0]
                }
                /**
                 * 指标预警及组合预警 如果有多个触发提交取第一个触发条件的图片
                 */
            } else {
                const { data = [] } = triggerSelectOptions[0];
                if (data.length > 0) {
                    const { descriptions = {} } = data[0];
                    const { imagesPath = '' } = descriptions;
                    if (imagesPath != '' && imagesPath.length > 0) {
                        picName = imagesPath[0];
                    } else {
                        picName = 'a_key-drawing_2.1_MACD@2x.png'
                    }
                }
            }
            return this.$config.imagePathPrefix + picName
        },
    },
    mounted: function () {
        const t = this;
        iosKeyboardHide()
        // 获取symbols（商品设置项目）
        request.getRiskWarningSymbol().then((res) => {
            const resData = getDataFoxAxiosRequest(res, this)
            if (resData) {
                // cube drawer组件的数据格式为[[]]
                const belongSortData = [];
                const sortArr = getSymbolSorts();
                t.productLevl1Data = sortArr;
                const currentEname = sortArr[0].value;
                //{ uname = '', id = [] }
                const productDataSave = resData.map(({ uname = '', id = [] }) => {
                    // text: `${id[1]} ${uname}`
                    const newObj = { text: `${id[1]} ${uname}`, value: `${uname},${id[0]}`, sort: id[2] };
                    if (id[2] == currentEname) {
                        belongSortData.push(newObj)
                    };
                    return newObj
                })
                t.productFormatData = productDataSave;
                t.productLevl2Data = belongSortData;
                // 非修改状态
                if (!t.isModifyWarning()) {
                    t.toSymbolWebSocketsendMessage()
                }
            }
        })
        this.showTip()
        // 上级页面newest 标记
        this.getNewestTipVisible();
        this.getAtrValueRequest();
        // 登录后,是否首次登录提示绑定
        if (this.$config.isLogined()) {
            isFirstVisite(t)
        }
    },
    created: function () {
        // 如果没有登录信息返回首页
        const t = this, loginInfo = this.$config.getLoginInfo();
        // 建立websocket连接（行情数据）
        t.createWebSocketForSymbols();
        const selectOptions = getSelectOptions();
        //周期
        this.cycleData = [selectOptions.cycle];
        //频率
        this.frequencyData = [selectOptions.frequency];
        // 价格提醒频率
        this.priceFrequencyData = [selectOptions.priceFrequency];
        //有效期
        this.expiryData = [selectOptions.expiry];
        this.getWarnningType();
        const { modify = '' } = this.$route.query
        this.setSelectedCondition();
        if (t.isModifyWarning()) {
            // 设置选择的symbol(修改)
            this.setSelectedSymbol();
        } else {
            // 设置默认symbol(非修改)
            this.setDefaultSymbol();
            // 设置默认触发条件（非修改）
            this.getTriggerSelectValue();
        }
        this.getAtrValueRequest()
    },
    computed: {
        ...mapGetters(['getSymbolsData']),
        ...mapState(['webSocketReadyStateForSymbols', 'websockForSymbolsState']),
        // 商品select选择定位
        getProductDrawerIndex() {
            const t = this;
            const changeIndex = t.productDrawerIndexChange,
                selectIndex = t.productDrawerIndex;
            if (changeIndex[0] == selectIndex[0]) {
                return t.productDrawerIndex
            } else {
                return [changeIndex[0], -1]
            }
        }
    },
    watch: {
        warningPriceInput: function (newValue, oldValue) {
            iosKeyboardHide();
            this.numberWatch(newValue, oldValue, 'warningPriceInput')
        },
        waringPriceLimit: function (newValue, oldValue) {
            this.numberWatch(newValue, oldValue, 'waringPriceLimit')
        },
        addedPrice: function (newValue, oldValue) {
            this.numberWatch(newValue, oldValue, 'addedPrice')
        },
        getSymbolsData: function (val, oldValue) {
            const { symbol, changeRate, new_price, symbolInt } = val
            const productNameKeyResult = this.productNameKey[1].split(',')
            if (productNameKeyResult[1] == symbolInt) {
                this.changeRate = (changeRate * 100).toFixed(2) + '%';
                this.newPrice = new_price
            }
        },
        // websocket建立并为打开状态发送默认订阅数据
        websockForSymbolsState: function (newValue, oldValue) {
            const t = this;
            if (newValue == 1 && oldValue == 4) {
                t.toSymbolWebSocketsendMessage()
                // websocket重链
            } else if (newValue == 0) {
                // 建立websocket连接（行情数据）
                console.log("重连开始")
                setTimeout(function () {
                    t.createWebSocketForSymbols();
                }, 4000)

            }
        },
    },
    i18n
}

</script>
<style scoped lang="scss">
@import "@public/css/warningGlobal.scss";
$productLineHeight: 1.28rem;
$paddingBottomHeight: 1rem;
$inputMarginRight: 10px;
$arrowWidth: 0.18rem;
// 解决ios input输入后界面消失的问题
.ios-input-parent-fix {
    position: relative;
}
// cube-ui
.cube-dialog-main {
    width: 310px !important;
}
.warning-data-detail {
    height: calc(100% - 1rem);
    background-color: #202029;
    .side-space {
        padding-top: 0.2rem;
    }
    .warning-seting-product-change {
        color: $commonFsColorGray;
        margin-left: 6px;
    }
    .warning-seting-product-underline {
        display: inline-block;
        width: 30px;
        height: 2px;
        border-top: 1px solid $commonFsDarkColor;
        margin: 0 2px;
        position: relative;
        vertical-align: middle;
    }
    .warning-input-icon-doaller {
        background: urlPrefix("static/img/warning/icon_dollar.png") no-repeat;
        width: 0.18rem;
        height: 0.36rem;
        display: inline-block;
        background-size: contain;
        vertical-align: middle;
    }
    .warning-input-icon-focus {
        background: urlPrefix("static/img/warning/icon_44_location@2x.png")
            no-repeat;
        width: 0.44rem;
        height: 0.44rem;
        display: inline-block;
        background-size: contain;
        vertical-align: middle;
        position: relative;
    }
    .icon-focus-space {
        margin-right: 10px;
    }
    padding-bottom: $paddingBottomHeight;
    .warning-seting-box {
        display: flex;
        color: $commonForeFontColor;
        height: 1rem;
        line-height: 1rem;
        padding-left: $commonSpace;
        background-color: $commonBackgroundDark;
    }
    .last-child {
        border-bottom: none;
        .warning-seting-left,
        .warning-seting-right,
        .warning-seting-right-arrow {
            border-bottom: none;
        }
    }
    .warning-seting-left-icon {
        width: 0.32rem;
        vertical-align: middle;
        margin-left: 2px;
        margin-top: -4px;
    }
    .warning-seting-right-arrow {
        width: $arrowWidth;
        color: #666870;
        font-size: 14px;
        padding-right: $commonSpace;
        position: relative;
        border-bottom: 1px solid $commonBorderColor;
        .warning-seting-right-arrow-img {
        }
    }
    .warning-seting-right-arrow-visible {
        display: none;
    }
    .warning-seting-left {
        flex: 1;
        text-align: left;
        font-size: $commonFsContent;
        background: none;
        border: none;
        color: $commonForeFontColor;
        text-align: left;
        padding: 0;
        border-bottom: 1px solid $commonBorderColor;
        word-break: keep-all;
    }
    .warning-seting-right {
        flex: 3;
        text-align: right;
        white-space: nowrap;
        padding-right: $commonSpace;
        background: none;
        border: none;
        border-bottom: 1px solid $commonBorderColor;
        .static-text {
            margin-right: 0.46rem;
        }
    }
    .warning-seting-arrow-icon {
        display: inline-block;
        width: 0.18rem;
        height: 0.35rem;
        background: urlPrefix("static/img/warning/arrow@2x.png") center center
            no-repeat;
        background-size: contain;
        line-height: 1rem;
        vertical-align: middle;
    }
    .warning-seting-product-margin-top {
        margin-top: 0.2rem;
    }
    .warning-seting-product {
        height: $productLineHeight;
        .warning-seting-right {
            display: flex;
            flex-direction: column;
            line-height: $productLineHeight/2;
            overflow: hidden;
        }
        .warning-seting-right-top {
            overflow: hidden;
            text-overflow: ellipsis;
            padding-top: 0.12rem;
            font-size: $commonFsContent;
        }
        .warning-seting-right-top,
        .warning-seting-right-bottom {
            height: 0.8rem;
            // margin-left: 0.7rem;
        }
        @media screen and (max-width: 361px) {
            .warning-seting-right-top,
            .warning-seting-right-bottom {
                margin-left: 0rem;
            }
        }
        .warning-seting-right-bottom {
            font-size: $commonFsSmall;
            color: $commonFsColorGray;
            overflow: hidden;
            box-sizing: border-box;
            line-height: normal;
        }

        .warning-input-botom-tip {
            color: $commonFsColorGray;
        }
        .warning-seting-left {
            line-height: $productLineHeight;
        }
        .warning-seting-right-arrow {
            line-height: $productLineHeight;
            width: 0.18rem;
        }
        .warning-seting-input-daller {
            margin-left: 4px;
        }
        .warning-seting-product-red {
            color: $commonFsGreenColor;
            margin-left: 0;
        }
        .warning-seting-product-grey {
            color: $commonFsDarkColor;
        }
        .warning-seting-product-split {
            margin: 0 6px 0 4px;
        }
    }
    .warning-risk-tip-bottom {
        color: $commonFsColorGray;
        font-size: $commonFsSmall;
        line-height: 0.36rem;
        margin-top: 0.32rem;
        p {
            margin: 0.2rem 0 0.2rem 0;
            &:first-child {
                margin-top: 0;
            }
        }
    }
    .submit-warn-btn {
        height: $paddingBottomHeight;
        background: $commonColorBlur;
        color: $commonForeFontColor;
        text-align: center;
        line-height: $paddingBottomHeight;
        position: fixed;
        bottom: 0;
        width: 100%;
        z-index: 1;
        font-weight: bold;
        font-size: $commonFsTitleMedium;
        border: none;
    }
    .login-form-tip {
        color: $commonFsColorGray;
        font-size: 0.26rem;
        padding: 10px 0;
    }
    .common-popup-container {
        min-width: 308px;
        border-radius: 10px;
    }
    .warning-seting-split {
        height: 0.28rem;
    }
}
.see-risk-tip {
    font-size: 0.26rem;
}
.login-form-tip-risk-box {
    padding: 0 0 30px 0;
}
.login-form-box {
    width: 274px;
}
.warning-form-input {
    width: 70%;
    background: none;
    color: $commonFsColorGray;
    line-height: 0.6rem;
    outline: none;
    text-align: right;
    margin-right: $inputMarginRight;
    vertical-align: middle;
    caret-color: #5291ff;
}
.warning-form-input-price {
    width: 100%;
}
.warning-form-input-unit {
    color: #575766;
    font-size: $commonFsSmall;
}
.warning-form-tab-select {
    // margin-top: 0.2rem;
    float: right;
}
.submit-warn-btn-ios-app-bangsscreen-pm {
    bottom: 0.7rem !important;
}
</style>
<style lang="scss">
@import "@public/css/warningGlobal.scss";
.common-custorm-cube-drawer {
    .cube-drawer-main {
        width: 100%;
        max-width: 100%;
    }
    .cube-drawer-title {
        background: $commonBackgroundDark;
        padding-top: $appStatuBarHeight;
        height: $headerHeight;
        line-height: $headerHeight;
        border-bottom-color: $commonFsColorDarkGray;
    }
    .cube-drawer-item {
        color: $commonFsColorGray;
        &::after {
            border-bottom-color: $commonBorderColor;
            border-bottom-width: 2px;
        }
    }
    .cube-drawer-item:last-child {
        &::after {
            left: 0;
        }
    }
    .cube-drawer-item_active {
        background: none;
        background-image: urlPrefix("static/img/warning/drawer_right_icon.png");
        background-size: auto 50%;
        background-repeat: no-repeat;
        background-position: 94% center;
        color: $commonForeFontColor;
    }
}
// iphone 刘海屏
@media only screen and (device-width: 375px) and (device-height: 812px){
    .page-container-app .common-custorm-cube-drawer .cube-drawer-title {
        padding-top:0.8rem;
    }
}
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
    .page-container-app .common-custorm-cube-drawer .cube-drawer-title {
        padding-top: 0.8rem;
    }
}
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) {
    .page-container-app .common-custorm-cube-drawer .cube-drawer-title {
        padding-top: 0.8rem;
    }
}
.common-custorm-cube-drawer-web {
    .cube-drawer-title {
        padding-top: 0;
    }
}
.common-custorm-cube-drawer-style2 {
    .cube-drawer-title {
        border: none;
    }
    .cube-drawer-panels {
        background: $commonBackgroundDark;
        .cube-drawer-panel:first-child {
            background-color: $commonBackgroundDark;
            .border-bottom-1px::after {
                border: none;
            }
            .cube-drawer-item {
                color: $commonFsColorGray;
            }
            .cube-drawer-item_active {
                background-color: $commonFsColorDarkGray;
                color: $commonForeFontColor;
            }
        }
        .cube-drawer-panel:last-child {
            background-color: $commonFsColorDarkGray !important;
            margin-left: -160px;
            .cube-drawer-item {
                color: $commonFsColorGray;
                &::after {
                    border-bottom-color: #454557;
                }
            }
            .cube-drawer-item:last-child {
                &::after {
                    left: 20px;
                }
            }
            .cube-drawer-item_active {
                color: $commonForeFontColor;
            }
        }
    }
}
.create-warning-toast-title {
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-align: center;
    height: 0.45rem;
    line-height: 0.45rem;
    span {
        color: $commonFsColorGray;
        margin: 0 2px;
        font-size: $commonFsMedium;
        font-weight: bold;
        display: flex;
        width: 100%;
        &:after,
        &:before {
            content: " ";
            display: inline-block;
            height: 2px;
            width: 100%;
            flex: 1;
            border-bottom: 1px solid $commonBorderColor;
            position: relative;
            margin: 8px 0px 0;
            vertical-align: middle;
            margin-top: 8px;
        }
        &:after {
            margin-left: 4px;
        }
        &:before {
            margin-right: 4px;
        }
    }
}
.create-warning-toast-title-short02 {
    span {
        &:after,
        &:before {
            margin-top: 8px;
        }
        &:after {
            margin-right: 30px;
        }
        &:before {
            margin-left: 30px;
        }
    }
}

.create-warning-toast-p {
    text-align: left;
    font-size: 0.26rem;
    line-height: 0.39rem;
    margin-bottom: 0.2rem;
    color: $commonFsColorGray;
    display: block !important;
    // width: 100%;
}
.warning-data-detail {
    .warning-seting-right {
        .tab-custom-box {
            margin-right: 0 !important;
            margin-top: 0.24rem;
        }
    }
}
@media only screen and (max-height: 600px) {
    .warning-data-detail .warning-risk-tip-bottom {
        padding-bottom: 1.3rem !important;
    }
}
</style>
<style lang="scss">
@import "@public/css/coverStyle.scss";
</style>
