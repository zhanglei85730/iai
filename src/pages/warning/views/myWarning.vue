<template>
    <!-- 指标预警-->
    <div>
        <MainLayout
            :title="$route.meta.title"
             :isShowHeader="!$config.isWechatPlatform && !$config.isIaiTraderApp"
            :headerStyle="$config.headerStyle"
            class="common-layout-back my-warning-layout"
            :isShowBackWord="false"
            :isScroll="true"
            @mainScrollBoxScrollTop="mainScroll"
            :backBtnTxt="$route.query.backTitle"
            :backBtnFun="backFunc"
            :flexSet="{center:6}"
            :navPosition="is03SePlatFormCode()?'top':'bottom'"
            name='myWarning'
        >
            <!-- 微信平台不显示返回按钮 -->
            <div
                slot="header-left"
                v-if="isWechatPlatform"
            >

            </div>
            <div
                slot="header-right"
                class="common-flex-column-row myWarning-right"
            >
                <div v-if="!isWechatPlatform">
                    <FeedBack />
                </div>
            </div>

            <div
                slot="page-body"
                class="my-warning"
                >
                <div class="my-dp-container" id='myWarningScrollBox'  :class="{'padding-top-for-app':$config.userFromType()=='app'}">
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
                                :useTransition="useTransition"
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
                        <!-- 开通微信通知 -->
                        <OpenWeChatNoticeEntry
                            v-if="wechatEntryVisible && !isWechatPlatform"
                            class="open-wechat-entry"
                        />
                        <cube-tab-panels
                            v-model="selectedLabel"
                            ref="advListPanel"
                        >
                            <cube-tab-panel
                                v-for="(item, index) in tabs"
                                :label="item.label"
                                :key="item.label"
                            >
                                <div v-if="!isAuthGuide && !authStartVisible">
                                    <div
                                        v-if="index === 0"
                                        :style="getPanelHeight"
                                    >
                                        <cube-scroll
                                            ref="scroll1"
                                            :data="triggeredData"
                                            :pullDownRefresh="true"
                                            :options="getScrollOption"
                                            @pulling-down="onPullingDown"
                                            @pulling-up="onPullingUp"
                                            :scrollEvents="['scroll','before-scroll-start','scroll-end']"
                                            @before-scroll-start="beforeScrollStartHandle"
                                            @scroll-end="beforeScrollEndHandle"
                                            :style="getPanelHeight"
                                        >
                                            <DataList
                                                :data="triggeredData"
                                                :dataType="dataType"
                                                @deleteItem="onDeleteItem"
                                                @modifyItem="onModifyItem"
                                                @clickItem="onModifyItem"
                                            />
                                            <div
                                                class="no-data"
                                                v-if="triggeredData.length==0"
                                            >
                                                <img
                                                    :src="$config.imagePathPrefix+'icon_no_following@2x.png'"
                                                    class="no-data-icon"
                                                >
                                                <p class="no-data-text">{{$t('myWarning_page').haveNotData}}</p>
                                            </div>
                                            <!-- <div
                                                v-if="triggeredData.length!=0 && isTriggeredLoadAllData"
                                                class="operate-tip"
                                            >{{$t('myWarning_page').loadDone}}</div> -->
                                            <!-- 脚步说明 -->
                                            <MyWarningFooter v-if="triggeredData.length>0" />
                                        </cube-scroll>
                                    </div>
                                    <div
                                        v-if="index === 1"
                                        :style="getPanelHeight"
                                    >
                                        <cube-scroll
                                            ref="scroll2"
                                            :data="dataListData"
                                            :pullDownRefresh="true"
                                            :options="getScrollOption"
                                            @pulling-down="onPullingDown"
                                            @pulling-up="onPullingUp"
                                            :scrollEvents="['scroll','before-scroll-start','scroll-end']"
                                            @before-scroll-start="beforeScrollStartHandle"
                                            @scroll-end="beforeScrollEndHandle"
                                        >
                                            <DataList
                                                :data="dataListData"
                                                :isSwipe="isEditStatus"
                                                :dataType="dataType"
                                                @deleteItem="onDeleteItem"
                                                @modifyItem="onModifyItem"
                                                @clickItem="onModifyItem"
                                                :resetSelectId="resetSelectId"
                                                @updateItemData="updateItemData"
                                            />
                                            <div
                                                class="operate-tip"
                                                v-if="dataListData.length>0 && dataType==1"
                                            >{{$t('myWarning_page').deleteModifyTip}}</div>
                                            <div
                                                class="no-data"
                                                v-if="dataListData.length==0"
                                            >
                                                <img
                                                    :src="$config.imagePathPrefix+'icon_no_following@2x.png'"
                                                    class="no-data-icon"
                                                >
                                                <p class="no-data-text">{{$t('myWarning_page').notSetWarning}}</p>
                                            </div>
                                        </cube-scroll>
                                    </div>
                                    <div
                                        v-if="index === 2"
                                        :style="getPanelHeight"
                                        :class="isExpiredLoadAllData ? 'loadAll': ''"
                                    >
                                        <cube-scroll
                                            ref="scroll3"
                                            :data="expiredData"
                                            :pullDownRefresh="true"
                                            :options="getScrollOption"
                                            @pulling-down="onPullingDown"
                                            @pulling-up="onPullingUp"
                                            :scrollEvents="['scroll','before-scroll-start','scroll-end']"
                                            @before-scroll-start="beforeScrollStartHandle"
                                            @scroll-end="beforeScrollEndHandle"
                                        >
                                            <DataList
                                                :data="expiredData"
                                                :dataType="dataType"
                                                @deleteItem="onDeleteItem"
                                                @modifyItem="onModifyItem"
                                                @clickItem="onModifyItem"
                                                @tipDialog="tipDialogHandle"
                                            />
                                            <!-- 底部说明 -->
                                            <div
                                                class="mywarning-footer-info"
                                                v-if="expiredData.length>0"
                                            >
                                                <p class="mywarning-footer-info-item01">{{$t('myWarning_page.footerTip01')}}
                                                </p>
                                                <p class="mywarning-footer-info-item02">{{$t('myWarning_page.footerTip02')}}</p>
                                                <p class="mywarning-footer-info-item03">{{$t('myWarning_page.footerTip03')}}</p>
                                            </div>
                                            <!--  -->
                                            <div
                                                class="no-data"
                                                v-if="expiredData.length==0"
                                            >
                                                <img
                                                    :src="$config.imagePathPrefix+'icon_no_following@2x.png'"
                                                    class="no-data-icon"
                                                >
                                                <p class="no-data-text">{{$t('myWarning_page').havaNoExpiredData}}</p>
                                            </div>
                                            <!-- <div
                                                v-if="expiredData.length!=0 && isExpiredLoadAllData"
                                                class="operate-tip"
                                            >{{$t('myWarning_page').loadDone}}</div> -->
                                        </cube-scroll>
                                    </div>
                                </div>
                                <!-- 未登录/游客 提示内容 isNewPlatform -->
                                <!-- 新平台 -->
                                <div v-if="isNewPlatform">
                                    <div
                                        class="no-auth-login-container no-data"
                                        v-if="authStartVisible || isAuthGuide"
                                    >
                                        <p class="no-auth-login-txt no-data-text">{{$t('myWarning_page.noLoginTipText')}}</p>
                                        <cube-button
                                            @click='goAuthHandle'
                                            primary
                                            class="no-data-go-set-waring"
                                        >{{$t('myWarning_page.loginAndRegister')}}</cube-button>
                                    </div>
                                </div>
                                <!-- 老平台 -->
                                <div v-else>
                                    <div
                                        class="no-auth-login-container no-data"
                                        v-if="authStartVisible || isAuthGuide"
                                    >
                                        <p class="no-auth-login-txt no-data-text">{{$t('myWarning_page.authTip')}}</p>
                                        <cube-button
                                            @click='goAuthHandle'
                                            primary
                                            class="no-data-go-set-waring"
                                        >{{$t('common').goAuthText}}</cube-button>
                                    </div>
                                </div>

                            </cube-tab-panel>
                        </cube-tab-panels>
                    </div>
                </div>
            </div>

            <pageFooter slot="page-footer" />
        </MainLayout>
        <!-- 未登录、游客提示登录或注册真实账号 -->
        <AuthPop
            :isShow="loginPopVisible"
            @cancle="AuthPopcancleHandle"
        />
        <!-- 授权提示 -->
        <LoginPop
            class="warning-author-pop"
            :isShow="isAuthStart"
            :isAuth="isAuthStart"
            @hide="loginPopHideHandle"
            @authSuccess="authSuccessHandle"
        />
        <!--popup 图表-->
        <DialogSwipe
            :slotCount="4"
            sialogSwipeRef='winLossInfo'
            :changeId='winLossInfoDialog'
        >
            <div slot="swipe-item-0">
                <div class="score-rate  chart-bottom-tip">
                    <h2 class="common-dialog-swipe-title">{{$t('winList.billProfit.item02.text01')}}</h2>
                    <p>
                        {{$t('winList.billProfit.item02.text02')}}
                    </p>
                    <p>
                        {{$t('winList.billProfit.item02.text03')}}
                    </p>
                    <p> {{$t('winList.billProfit.item02.text04')}}
                    </p>
                </div>
            </div>
            <div slot="swipe-item-1">
                <div class="score-rate  chart-bottom-tip">
                    <h2 class="common-dialog-swipe-title">{{$t('winList.billProfit.item03.text01')}}</h2>
                    <p>{{$t('winList.billProfit.item03.text02')}}
                    </p>
                    <p> {{$t('winList.billProfit.item03.text03')}}</p>
                    <div class="bottom-info-txt">
                        {{$t('winList.billProfit.item03.text04')}}
                    </div>
                </div>
            </div>
            <div slot="swipe-item-2">
                <div class="score-rate  chart-bottom-tip">
                    <h2 class="common-dialog-swipe-title"> {{$t('winList.billProfit.item04.text01')}}</h2>
                    <p> {{$t('winList.billProfit.item04.text02')}}</p>
                    <p> {{$t('winList.billProfit.item04.text03')}}</p>
                    <div class="bottom-info-txt">{{$t('winList.billProfit.item04.text04')}}
                    </div>
                </div>
            </div>
            <div slot="swipe-item-3">
                <div class="score-rate  chart-bottom-tip">
                    <h2 class="common-dialog-swipe-title">{{$t('winList.billProfit.item05.text01')}}</h2>
                    <p>{{$t('winList.billProfit.item05.text02')}}</p>
                    <p>{{$t('winList.billProfit.item05.text03')}}</p>
                    <p>{{$t('winList.billProfit.item05.text04')}}</p>
                </div>
            </div>
        </DialogSwipe>
        <!-- 授权 -->
        <!-- 切换平台popup -->
        <!-- <PlatformChangePlane
            :visible="platformPlaneVisible"
            @select="platformChange"
            :data="platformData"
            @queryAuth="bindTip"
            @set="showPlatformPlane"
            :selectIndex='getPlatformSelectIndex'
            @maskClick="maskClickHandle"
        /> -->
        <!-- 微信登录注册框 isWeChatLogin-->
        <WeChatLogin
            :show="isWeChatLogin"
            @close="weChatLoginClose"
            refreshPage="3_1"
        />
    </div>
</template>

<script>
import request from '@services/documentary.js'
import DataList from '../components/DataList'
import { getDataFoxAxiosRequest, getWarningSort, getSymbolInfoById, saveInfoToSessionStorage, getPlatformCode, isPlatformCodeSe, isIos, backToApp, getAuthStatu, commonError, isWechatBind, getNewPlatform, isWechatPlatform, saveInfoToStorage, initPage, isFirstVisite, isIaiTraderApp, goAppLogin } from '@public/js/util.js'
import { getWarningConfig, getSelectOptions } from '../mapConfig.js'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import PageFooter from '@warning/components/PageFooter'
import OpenWeChatNoticeEntry from '@warning/components/OpenWeChatNoticeEntry'
import MyWarningFooter from '@warning/components/MyWarningFooter'
import FeedBack from '@warning/components/FeedBack'
import SetPlatform from '@warning/components/SetPlatform/index.js'
import DialogSwipe from '../components/DialogSwipe'
import i18n from '@warning/i18n';
const globalConsts = require('@public/js/consts.js')
export default {
    components: {
        DataList,
        PageFooter,
        MyWarningFooter,
        DialogSwipe,
        OpenWeChatNoticeEntry,
        FeedBack,
        SetPlatform,
    },
    data() {
        const t = this;
        return {
            // 选择的平台item
            platformItem: {},
            isWeChatLogin: false,
            isNewPlatform: false,
            isWechatPlatform: false,
            // 是否开通过微信通知，默认开通过
            wechatEntryVisible: false,
            authStartVisible: false,
            isAuthStart: false,
            loadingVisible: false,
            //监控中的数据是否全部翻页数据加载完成
            isMonitoringLoadAllData: false,
            //已触发的数据是否全部翻页数据加载完成
            isTriggeredLoadAllData: false,
            // 过期数据是否全部翻页数据加载完成
            isExpiredLoadAllData: false,
            // 监控中上拉翻页的当前页参数
            monitoringPageIndex: 1,
            //  已触发的上拉翻页的当前页参数
            triggeredPageIndex: 1,
            // 已过期的上拉翻页的当前页参数
            expiredPageIndex: 1,
            title: t.$t('myWarning_page').warning,
            selectedLabelSlots: t.$t('myWarning_page').shakeIndexWarning,
            // tabs: [{
            //     label: t.$t('myWarning_page').shakeIndexWarning,
            // }, {
            //     label: t.$t('myWarning_page').trendIndexWarning,
            // }],
            // 震荡
            ordersInfoTabCurrent: 2,
            dataListData: [],
            // 今日已触发的数据
            triggeredData: [],
            // 已过期盯盘
            expiredData: [],
            // 已触发总条数
            triggeredDataCount: 0,
            //是否编辑状态
            isEditStatus: true,
            //数据List类型
            dataType: 0,
            //是否重置列表数据删除状态（取消删除状态）
            resetSelectId: 0,
            // 定时器实例
            timer: '',
            expiredTimer: null,
            //需要更新的数据池，websocket推送的数据保存在这里，有更新则更新里面的数据
            // dataStoreForSocket:[]
            loadingVisible: false,
            loginPopVisible: false,
            isAuthGuide: false,
            resetTableSelected: 0,
            selectedLabel: t.$t('myWarning_page.realTimeMonitor'),
            isTabMenufixed: false,
            tabs: [
                {
                    label: t.$t('myWarning_page.dingpanNotice'),
                }, {
                    label: t.$t('myWarning_page.realTimeMonitor')
                }, {
                    label: t.$t('myWarning_page.dingpanExpired')
                }
            ],
            panelHeight: 0,
            loadNewPrice: true, // 延迟加载最新价格
            lastFormDataByNewPrice: [],
            useTransition: false,
            dialogswipe02ChangeId: -1,
            scrollTimer: '',
            // 自动更新websocket 定时器
            updateWebSocketTimer: '',
            // 是否可以更新websocket行情数据
            updateDataForWebSocket: true
        }
    },
    methods: {
        ...mapMutations(['symbolsWebSocketSendMsg', 'updateDataStoreForSocket', 'websocketClose']),
        ...mapActions(['createWebSocketForSymbols']),

        iaitraderAppSetHeight() {
            // let wrapperList=document.getElementsByClassName('cube-scroll-wrapper')
            let wrapperList  = document.querySelectorAll("#myWarningScrollBox .cube-scroll-wrapper")
            for (let x = 0; x < wrapperList.length; x++) {
                wrapperList[x].style.cssText = "height: calc(100vh - 90px);"
            }
        },
        // 隐藏wechatlogin
        weChatLoginClose() {
            this.isWeChatLogin = false
        },
        //授权成功
        authSuccessHandle() {
            this.$router.replace('/index')
        },
        loginPopHideHandle(data) {
            this.isAuthStart = false;
        },
        setIntervalHandle() {
            const t = this;
            t.updateDataForWebSocket = !t.updateDataForWebSocket;
            if (t.updateDataForWebSocket) {
                console.log('更新开始')
            } else {
                console.log('暂停更新')
            }
        },
        beforeScrollStartHandle() {
            console.log('fewfw')
            this.updateDataForWebSocket = false;
            const t = this;
            if (this.scrollTimer != '') {
                console.log('暂停更新')
                clearTimeout(t.scrollTimer)
            }
        },
        beforeScrollEndHandle() {
            const t = this;
            this.scrollTimer = setTimeout(() => {
                t.updateDataForWebSocket = true
                console.log('开始更新')
            }, 1500)
        },
        tipDialogHandle() {
            this.scoreDialogTipHandle('dialogswipe02ChangeId')
        },
        scoreDialogTipHandle(key) {
            this[key] = this[key] + 1;
        },
        goAuthHandle() {
            if (this.$config.userFromType() == 'app') {
                if (getNewPlatform()) {
                    // 跳转登录界面（原生app,url拦截）
                    if (isIaiTraderApp()) {
                        goAppLogin(this.$router.history.current.path);
                        return false
                    } else {
                        this.isWeChatLogin = true;
                    }
                } else {
                    if (this.isAuthGuide) {
                        this.loginPopVisible = true;
                        return false;
                        // web 未登录
                    }
                    if (this.authStartVisible) {
                        this.isAuthStart = true
                    }
                }

            } else {
                this.goToLogin();
            }

        },
        // 跳转转登录
        goToLogin() {
            this.$router.push({ name: 'login', query: { loginAfterTo: 'index' } })
        },
        AuthPopcancleHandle() {
            this.loginPopVisible = false;
        },
        //是否有权限查看我的预警
        isLoginAuth() {
            //app 未登录
            //this.$config.userFromType() == 'app'
            if (this.$config.userFromType() == 'app') {
                console.log('是否登录=' + this.$config.isLogined())
                // !this.$config.isLogined()
                if (!this.$config.isLogined()) {
                    this.isAuthGuide = true;
                    return false
                }
                console.log('登录状态=' + getAuthStatu())
                console.log('登录状态consts=' + globalConsts.auth.statu.fail)
                // 新平台
                if (isWechatBind()) {
                    //老平台
                } else {
                    if (getAuthStatu() == globalConsts.auth.statu.fail) {
                        this.authStartVisible = true
                    }
                }
                // web 未登录
            } else {
                if (!this.$config.isLogined()) {
                    this.goToLogin();
                    return false;
                }
            }
        },
        is03SePlatFormCode() {
            return isPlatformCodeSe()
        },
        // 去设置
        goSetWarning() {
            //跳转到首页
            this.$router.push('/index')
        },
        // 修改我的预警设置项
        onModifyItem(datapa) {
            const {
                // 预警类型
                warning_type = '',
                frequency = '',
                setting = {},
                symbol = '',
                id = '',
                userid = '',
                wpcid = '',
                created_at,
                cycle = '',
                dataType = 1,
            } = datapa;
            // dataType位0 已触发的预警 1 监控中的预警 ，触发后的预警不能修改
            if (dataType == 0) return;
            const { params, ...rest } = setting;
            const warningTypeItem = getWarningConfig(warning_type, this.$t('myWarning_page').modifyWarningSet)
            const frequencySelectItem = getSelectOptions({ type: 'frequency', value: frequency });
            const queryParams = {
                code: warning_type,
                symbol,
                name: this.$t('myWarning_page').nowPriceWarning,
                warningType: getWarningSort(warning_type).ename,
                frequencyNameKey: frequencySelectItem[0].value,
                frequencyName: frequencySelectItem[0].text,
                // 触发条件
                conditionNameKey: '',
                //有效期
                expiryNameKey: '',
                id,
                userid,
                wpcid,
                created_at,
                cycle,
                modify: true,
                // 返回路径
                backPath: 'myWarning',
                ...rest,
                ...params,
            }
            this.$router.replace({ name: 'dataWarningDetail', query: queryParams })
        },
        // 删除操作请求
        deleteRequest(params) {
            const { id = '', warning_type = '' } = params;
            if (id === '' || warning_type === '') return false;
            const t = this;
            request.riskWarningDelete({ id, warning_type }).then((res) => {
                const resData = getDataFoxAxiosRequest(res, t, true);
                if (resData) {
                    const { status = '', message = '' } = resData;
                    // 删除成功
                    if (status == 1) {
                        t.$createToast({
                            type: 'correct',
                            time: 1000,
                            txt: message ? message : t.$t('common').deleteSuccess
                        }).show()
                        // 刷新页面
                        this.resetSelectId = Math.round(Math.random() * 100)
                        t.onOrdersInfoTab(t.ordersInfoTabCurrent, t.dataType)
                        this.isEditStatus = false;
                    } else {
                        t.$createToast({
                            type: 'warn',
                            time: 1000,
                            txt: message ? message : t.$t('common').deleteFail
                        }).show()
                    }
                }

            })
        },
        //删除操作toast框
        onDeleteItem(params) {
            const t = this;
            t.$createDialog({
                type: 'alert',
                title: t.$t('common').myWarning,
                showClose: true,
                content: t.$t('common').areYouSureDelete,
                confirmBtn: {
                    text: t.$t('common').sureDeleteWarningBtn,
                    active: true,
                    disabled: false,
                    href: 'javascript:;'
                },
                onConfirm: () => {
                    t.deleteRequest(params)
                },
            }).show();
        },
        updateItemData(data) {
            if (this.dataType == 1) {
                this.dataListData = data;
            }
        },
        // 编辑按钮事件
        onEdit() {
            this.isEditStatus = !this.isEditStatus;
        },
        // 切换头部tab
        onOrdersInfoTab(index = 1, type = 1) {
            this.isEditStatus = false;
            this.dataType = type;
            let key = '';
            if (type == 0) {
                key = 'triggeredData';
                this.isEditStatus = false;
            } else if (type == 1) {
                key = 'dataListData';
                this.isEditStatus = true;
            } else if (type == 2) {
                key = 'expiredData';
            }
            const _query = this.$route.query;
            this.$router.push({ query: Object.assign(_query, { tabName: this.tabs[type].label }) });
            this.ordersInfoTabCurrent = index;
            if (type == 1 && this.dataListData.length == 0) {
                this.getMyWaringData(type, key);
            } else if (type == 2) {
                this.expiredData = [];
                this.getExpiredData({ isTimer: true, isFromTab: true });
                this.expiredPageIndex = 1;
            } else if (type == 0 && this.triggeredData.length == 0) { // 0
                this.timmerToRefresh()
            }
            if (type == 0 || type == 1) {
                this.clearTimer();
                this.startTimer();
            }
        },
        // 休市更新数据（从vuex dataStoreForSocket）
        /**
         * @description 将vuex保存的推送过的行情数据添加到与接口返回的数据symbol id相同的数据项上，
         * 解决休时情况下websocket一种symbol只推送一次，定时刷新没行情数据的问题
         * @param {Array} data 列表数据
         * @param {Boolen} isFilter 是否过滤匹配的数据，true只返回接口与vuex保存匹配成功的数据，
         * false 匹配不成功返回全部接口数据,默认false返回全部数据
         * @returns {Array}
         */
        formatListDataUseSavedSymbols(data, isSet = false) {
            const dataStoreForSocket = this.dataStoreForSocket;
            if (dataStoreForSocket.length == 0) return data;
            let dataList = data.concat([])
            const t = this;
            console.log('websocket 更新')
            dataStoreForSocket.forEach((outItem) => {
                const { new_price = '', changeRate = '', symbol, symbolInt } = outItem;
                dataList.forEach((innerItem, innerIndex) => {
                    innerItem.isSwipe = true;
                    const symbolInfo = getSymbolInfoById(innerItem.symbol);
                    if (symbolInfo !== false) {
                        if (symbolInfo.id[0] == symbolInt) {
                            // if (t.dataType == 2 && !dataList[innerIndex].new_price) {
                            //     dataList[innerIndex] = Object.assign({}, innerItem, { new_price, changeRate: (changeRate * 100).toFixed(2) + '%' })
                            // }
                            // if (t.dataType == 0 || t.dataType == 1) {
                            //     dataList[innerIndex] = Object.assign({}, innerItem, { new_price, changeRate: (changeRate * 100).toFixed(2) + '%' })
                            // }
                            // dataList[innerIndex] = Object.assign({}, innerItem, { new_price, changeRate: (changeRate * 100).toFixed(2) + '%' })
                            // t.$set()
                            // 是否采用vue set方法修改值
                            if (!isSet) {
                                dataList[innerIndex] = Object.assign({}, innerItem, { new_price, changeRate: (changeRate * 100).toFixed(2) + '%' });
                            } else {
                                let updateKeyName = '';
                                if (t.dataType == 0) {
                                    updateKeyName = 'triggeredData';
                                } else if (t.dataType == 1) {
                                    updateKeyName = 'dataListData';
                                } else if (t.dataType == 2) {
                                    updateKeyName = 'expiredData';
                                    // return;
                                }
                                try {
                                    t.$set(t[updateKeyName][innerIndex], 'new_price', new_price);
                                    t.$set(t[updateKeyName][innerIndex], 'changeRate', (changeRate * 100).toFixed(2) + '%');
                                } catch (e) {
                                    console.log(e.message)
                                }

                            }
                        }
                    }
                })
            })
            return dataList
        },
        // 清楚settimeout
        clearTimer() {
            if (this.timer !== '') {
                clearTimeout(this.timer);
            }
            if (this.expiredTimer) {
                clearTimeout(this.expiredTimer);
            }
            if (this.updateWebSocketTimer) {
                clearTimeout(this.updateWebSocketTimer);
            }
            if (this.scrollTimer) {
                clearTimeout(this.scrollTimer)
            };
        },
        // 开始定时刷新
        startTimer() {
            this.timmerToRefresh({ pagesize: 5, isTimer: true });
        },
        /*
        *定时刷新监控中的数据,解决监控中的数据已触发还再监控中标签页下
        *下拉刷新后用标签页下数据的总条数作为请求的pagesize,pageindex:1去请求监控中的数据
        */
        timmerToRefresh({ pagesize: pagesizeParams = '', isTimer = false } = {}, callback = () => { }) {
            const dataType = this.dataType;
            if (dataType == 2) {
                return;
            }
            const t = this;
            const defaultPagesSize = 5;
            const loginInfo = this.$config.getLoginInfo();
            if (!loginInfo) return false;
            let pageSize = 5, datakey = '';
            if (dataType == 1) {
                pageSize = t.dataListData.length <= defaultPagesSize ? defaultPagesSize : t.dataListData.length;
                datakey = 'dataListData';
            } else if (dataType == 0) {
                pageSize = t.triggeredData.length <= defaultPagesSize ? defaultPagesSize : t.triggeredData.length;
                datakey = 'triggeredData'
            }
            const { userid = '' } = loginInfo
            const params = {
                userid,
                is_listen: dataType,
                pageSize: pageSize,
                pageIndex: 1
            }
            request.riskWarningSelect(params).then((res) => {
                const resData = getDataFoxAxiosRequest(res, t);
                if (resData) {
                    const { rows = [], total = 0, pageIndex = 1, pageSize, count, triggerCount = 0 } = resData;
                    // t[datakey] = rows;
                    t[datakey] = t.formatListDataUseSavedSymbols(rows);
                    // 已触发数据总条数
                    if (dataType == 0) {
                        t.triggeredDataCount = count;
                        //监控中的请求
                    } else if (dataType == 1) {
                        t.triggeredDataCount = triggerCount;
                    }

                    // 请求成功回调
                    callback(t);
                    if (isTimer) {
                        t.timer = setTimeout(function () {
                            //刷新
                            t.timmerToRefresh({ isTimer: true });
                        }, 10 * 1000)
                    }
                    t.sendSymbolsMsg(t.dataType);
                }
            })
        },
        // 请求预警过的设置数据
        getMyWaringData(type = 1, key = 'dataListData', paramsData = {}) {
            const loginInfo = this.$config.getLoginInfo();
            if (!loginInfo) return false;
            const { userid = '' } = loginInfo
            const t = this;
            const defaultPagesSize = 5;
            const params = {
                userid,
                is_listen: type,
                pageSize: defaultPagesSize,
                pageIndex: type == 1 ? t.monitoringPageIndex : t.triggeredPageIndex
            }
            Object.assign(params, paramsData);
            return new Promise(resolve => {
                t.loadingVisible = true;
                request.riskWarningSelect(params).then((res) => {
                    const resData = getDataFoxAxiosRequest(res, t);
                    if (resData) {
                        const { rows = [], total = 0, pageIndex = 1, pageSize, count = 0 } = resData;
                        if (type == 1) {
                            if ((rows.length > 0 && pageIndex + 1 > t.monitoringPageIndex) || (t.dataListData.length == 0 && t.monitoringPageIndex == 1)) {
                                t[key] = this.duplicateRemoval(t[key].concat(t.formatListDataUseSavedSymbols(rows)));
                            } else if (rows.length == 0 && count == 0) {
                                t[key] = []
                            }
                            // 判断是否翻页到最后页
                            if ((count < pageIndex * pageSize) || rows.length == 0) {
                                t.isMonitoringLoadAllData = true;
                            } else {
                                t.isMonitoringLoadAllData = false;
                            }
                        } else if (type == 0) {
                            if ((rows.length > 0 && pageIndex + 1 > t.triggeredPageIndex) || (t.triggeredData.length == 0 && t.triggeredPageIndex == 1)) {
                                t[key] = this.duplicateRemoval(t[key].concat(t.formatListDataUseSavedSymbols(rows)));
                                t.triggeredDataCount = count
                            }
                            // 判断是否翻页到最后页
                            if ((count < pageIndex * pageSize) || rows.length == 0) {
                                t.isTriggeredLoadAllData = true;
                            } else {
                                t.isTriggeredLoadAllData = false;
                            }
                        }
                        // 判断是否有数据（展示去设置按钮
                        resolve(true)
                    } else {
                        // t[key] = t[key]
                    }
                    t.loadingVisible = false;
                    t.sendSymbolsMsg(type);
                })
            })
        },
        // 通过symbol名字订阅行情数据
        sendSymbolsMsg(dataType = 1) {
            const symbolNamesArray = [];
            let dataTypeKey = '';
            if (dataType == 1) {
                dataTypeKey = 'dataListData';
            } else if (dataType == 0) {
                dataTypeKey = 'triggeredData'
            } else if (dataType == 2) {
                dataTypeKey = 'expiredData'
            }
            if (this[dataTypeKey].length > 0) {
                this[dataTypeKey].forEach(item => {
                    const symbolInfo = getSymbolInfoById(item.symbol);
                    if (symbolInfo !== false) {
                        symbolNamesArray.push(String((symbolInfo.id)[0]))
                    }
                })
            }
            if (symbolNamesArray.length > 0) {
                this.symbolsWebSocketSendMsg({
                    names: Array.from(new Set(symbolNamesArray))
                })
            }
        },
        // 刷新上拉刷新
        refreshScroll() {
            this.$refs.scroll1[0].forceUpdate();
            //  刷新后必须执行refresh方法，不然会多次刷新
            this.$refs.scroll1[0].refresh();
        },
        // 上拉翻页加载
        onPullingUp() {
            const t = this;
            const dataType = t.dataType
            let key = 'triggeredData';
            let pageIndex = 1;
            if (dataType == 1) {
                key = 'dataListData';
                pageIndex = t.monitoringPageIndex += 1
            } else if (dataType == 0) {
                key = 'triggeredData';
                pageIndex = t.triggeredPageIndex += 1
            } else if (dataType == 2) {
                key = 'expiredData';
                pageIndex = t.expiredPageIndex += 1
            }
            if (dataType == 1 && t.isMonitoringLoadAllData) {
                this.$refs.scroll2[0].forceUpdate();
                this.$refs.scroll2[0].refresh();
                return false
            }
            if (dataType == 0 && t.isTriggeredLoadAllData) {
                this.$refs.scroll1[0].forceUpdate();
                this.$refs.scroll1[0].refresh();
                return false
            }
            if (dataType == 2 && t.isExpiredLoadAllData) {
                this.$refs.scroll3[0].forceUpdate();
                this.$refs.scroll3[0].refresh();
                return false
            }
            if (dataType == 2) {
                t.getExpiredData({ pageIndex }).then(res => {
                    this.$refs.scroll3[0].forceUpdate();
                    this.$refs.scroll3[0].refresh();
                })
            } else {
                t.getMyWaringData(dataType, key, { pageIndex }).then(data => {
                    t.refreshScroll()
                })
            }
        },
        // 下拉刷新事件
        onPullingDown() {
            const t = this;
            t.clearTimer()
            if (t.dataType == 2) {
                this.$refs.scroll3[0].forceUpdate();
                this.$refs.scroll3[0].refresh();
                t.getExpiredData({ isTimer: true, isFromTab: true });
            } else {
                t.timmerToRefresh({}, function (context) {
                    context.refreshScroll()
                    t.startTimer()
                })
            }
        },
        // 判断是否是03业务
        getPlatformCodeSe() {
            const platformCode = getPlatformCode();
            if (platformCode == globalConsts.platformNames.fx) {
                return false
            } else {
                return true
            }
        },
        // 获取symbol uicode(主要用于02业务去下单时跳转交易页面)
        getSymbolInfoByIdRequest() {
            const t = this;
            const platformCode = getPlatformCode();
            request.getSymbolId().then((res) => {
                const resData = getDataFoxAxiosRequest(res, t);
                if (!!resData) {
                    saveInfoToSessionStorage(resData, globalConsts.symbolsIdKeyInSessionStorage);
                }
            })
        },

        //获取吸附菜单的top值
        getStickyTopValue() {
            let topValue = this.$config.userFromType() == 'app' ? "1.2rem" : '0.8rem'
            if (this.$config.userFromType() == 'app') {
                if (isIos()) {
                    const platformCode = getPlatformCode();
                    if (platformCode == globalConsts.platformNames.fx || platformCode == globalConsts.platformNames.se) {
                        topValue = '0.8rem'
                    } else {
                        topValue = '1.2rem'
                    }
                } else {
                    topValue = '1.2rem'
                }
            } else {
                topValue = '0.8rem'
            }
            return {
                top: topValue
            }
        },
        mainScroll(scrollTop) {
            if (scrollTop >= this.$refs.advListNav.offsetTop) {
                this.isTabMenufixed = true
            } else {
                this.isTabMenufixed = false
            }
        },

        tabChanged(current) {
            let _index = 0;
            this.tabs.forEach((item, index) => {
                if (item.label === current) {
                    _index = index;
                }
            })
            if (_index === 0) { // 盯盘通知  type = 0
                this.onOrdersInfoTab(1, 0)
            } else if (_index === 1) { // 盯盘监控中  type = 1
                this.onOrdersInfoTab(2, 1);
            } else if (_index === 2) { // 盯盘已过期
                this.onOrdersInfoTab(3, 2);
            }
        },

        duplicateRemoval(list) {
            var obj = {};
            list = list.reduce(function (item, next) {
                obj[next.id] ? '' : obj[next.id] = true && item.push(next);
                return item;
            }, []);
            return list;
        },
        // 盯盘已过期接口
        getExpiredData({ pagesize: pagesize = 5, isTimer = false, isFromTab = false } = {}, callback = () => { }) {
            let t = this;
            let { userid = '' } = t.$config.getLoginInfo();
            let params = {
                userid: userid
            };
            if (isFromTab) {
                // params.pageSize = t.expiredData.length <= 5 ? 5 : t.expiredData.length;
                params.pageSize = 5;
                params.pageIndex = 1;
            } else {
                params.pageSize = pagesize;
                params.pageIndex = t.expiredPageIndex;
            }
            console.log('pageIndex', params.pageIndex);
            return new Promise(resolve => {
                request.getExpiredData(params).then((res) => {
                    const resData = getDataFoxAxiosRequest(res, t);
                    if (resData) {
                        // 设置
                        const { rows = [], total = 0, pageIndex = 1, pageSize, count = 0 } = resData;
                        const key = 'expiredData';
                        if (rows.length > 0) {
                            // 数据去重
                            t.expiredData = this.duplicateRemoval(t.expiredData.concat(t.formatListDataUseSavedSymbols(rows)));
                            // t[key] = rows;
                            // t[key] = t.formatListDataUseSavedSymbols(rows)
                        } else if (rows.length == 0 && total == 0) {
                            t.expiredData = []
                        }
                        // 判断是否翻页到最后页
                        if ((t.expiredData + total < pageIndex * pageSize) || rows.length == 0) {
                            t.isExpiredLoadAllData = true;
                        } else {
                            t.isExpiredLoadAllData = false;
                        }
                        t.sendSymbolsMsg(t.dataType);
                        callback(t);

                    }
                })
            })
        },
        //返回按钮
        backFunc() {
            history.go(-1)
        },
        openWechatNotice() {
            const t = this;
            // 是否开通过微信
            //isWechatEntyShow  isOpenWechatNotice
            request.isWechatEntyShow().then((data = {}) => {
                console.log('data55=' + JSON.stringify(data))
                const { wx_bind = 0 } = data
                // 没绑定显示绑定入口
                const _getPlatformCode = getPlatformCode()
                if (_getPlatformCode != globalConsts.platformNames.pm && _getPlatformCode != globalConsts.platformNames.pmglod) {
                    if (wx_bind == 0) {
                        t.wechatEntryVisible = true
                    }
                }
            }).catch(e => {
                // t.wechatEntryVisible = true
                commonError(e, this)
            })
        },
    },
    created: function () {
        const t = this;
        // 建立websocket连接（行情数据）
        this.createWebSocketForSymbols();
        this.isLoginAuth();
        const { tabName = '' } = this.$route.query;
        // TAB定位到 盯盘监控中
        if (tabName == this.tabs[1].label) {
            this.selectedLabel = tabName;
            this.onOrdersInfoTab(2, 1);
        } else if (tabName == this.tabs[0].label) {
            this.selectedLabel = tabName;
            this.onOrdersInfoTab(1, 0);
        } else if (tabName == this.tabs[2].label) {
            this.selectedLabel = tabName;
            this.onOrdersInfoTab(3, 2);
        } else {
            this.onOrdersInfoTab(2, 1);
        }
        // 是否开通过微信
        this.openWechatNotice()
        // iai-trader app
        if (isWechatPlatform()) {
            this.isWechatPlatform = true
        }
        // 是否是新平台
        if (getNewPlatform()) {
            this.isNewPlatform = true
        }
        this.getPlatformListRequest()

    },
    computed: {
        // ...mapState(['dataStoreForSocket','dialogSwipe']),
        ...mapState({
            winLossInfoDialog: (state) => state.dialogSwipe.winLossInfoDialog,
            dataStoreForSocket: (state) => state.dataStoreForSocket
        }),
        // 计算滚动条高度
        getPanelHeight() {
            return { height: this.panelHeight != 0 ? `${this.panelHeight}px` : 'auto' }
        },
        ...mapGetters(['getSymbolsData']),
        // 获取编辑状态
        getEditText() {
            return this.isEditStatus ? this.$t('common').complete : this.$t('common').edit
        },
        // 下拉刷新设置
        getScrollOption() {
            // 不刷新设置
            const canclePullUpLoad = { pullUpLoad: false }
            //刷新设置
            const doDrollUp = {
                pullUpLoad: {
                    threshold: 100,
                    txt: { more: '', noMore: '' }
                },
                pullDownRefresh: {
                    threshold: 100,
                    stop: 40,
                    txt: this.$t('common').updateSuccess
                }
            }
            if (this.dealType == 'now' && this.orderListCurrent.length == 0 ||
                this.dealType == 'history' && this.orderListHistory.length == 0
            ) {
                return canclePullUpLoad
            }
            return doDrollUp
        },
        // 获取今日已触发的条数
        getTriggeredCount() {
            return this.triggeredData.length
        }
    },
    mounted: function () {
        if (isIaiTraderApp() || this.$config.isWechatPlatform) {
            //iaitrader特殊处理，设置cube-scorll容器的高度
            this.iaitraderAppSetHeight()
        }
        const t = this;
        // 跳转去开户地址，先注释
        // t.getSymbolInfoByIdRequest()
        // 设置scroll区域滚动高度
        if (isPlatformCodeSe()) {
            t.panelHeight = document.body.clientHeight - document.getElementsByClassName('m-pageFooter')[0].offsetHeight - 45;
        } else {
            t.panelHeight = document.body.clientHeight - document.getElementsByTagName('header')[0].offsetHeight - document.getElementsByClassName('m-pageFooter')[0].offsetHeight - 45;
        }

        // // 根据url查询参数判断是否显示切换平台面板
        // if (this.$route.query.hasOwnProperty(globalConsts.urlParamsKeys.platformChangePlane.name)) {
        //     this.showPlatformPlane()
        // }
        // // 登录后,是否首次登录提示绑定
        // if (this.$config.isLogined()) {
        //     if (isFirstVisite(t)) {
        //         this.platformPlaneVisible = true;
        //     }
        // }

    },
    beforeDestroy: function () {
        this.clearTimer();
    },
    watch: {
        getSymbolsData: function (val, oldValue) {
            const t = this;
            const { new_price = '', changeRate = '', symbol, symbolInt } = val;
            let updateKeyName = '';
            if (t.dataType == 0) {
                updateKeyName = 'triggeredData';
            } else if (t.dataType == 1) {
                updateKeyName = 'dataListData';
            } else if (t.dataType == 2) {
                updateKeyName = 'expiredData';
                // return;
            }
            if (this[updateKeyName].length == 0) return false;
            // 更新保存的websocket推送过来的数据
            this.updateDataStoreForSocket(val);
            // 当前标签页的数据
            const currTabData = (this[updateKeyName]).concat([]);
            t.formatListDataUseSavedSymbols(currTabData, true)
            // this.lastFormDataByNewPrice = t.formatListDataUseSavedSymbols(currTabData,true)
            // if (this.lastFormDataByNewPrice.length > 0) {
            //     t[updateKeyName] = this.lastFormDataByNewPrice;
            // }
        },
        // $route(to, form) {
        //     this.getPlatformListRequest()
        // }
    },
    i18n
}
</script>
<style lang="scss">
@import "@public/css/warningGlobal.scss";
// 隐藏第一个tab数据
.my-warning{
    .cube-tab-bar{
        .cube-tab{
            &:first-child{
                display: none!important
            }
        }
    }
}
.open-wechat-entry {
    .open-wechat-entrance {
        margin-bottom: 0.05rem !important;
        margin-top: 0.1rem;
    }
}
.no-auth-login-txt {
    color: #fff;
    font-size: $commonFsMedium;
    line-height: 0.5rem;
}
.my-dp-container {
    .common-head-ad-box {
        height: 2.18rem;
        padding: 0.22rem 0.28rem 0.06rem 0.28rem;
        img {
            height: 100%;
        }
    }
    .second-menu {
        .cube-tab {
            padding: 0.22rem 0 !important;
            .sensors-track-button {
                font-size: 0.26rem;
                color: #8b8e99;
                padding: 0.01rem 0.16rem;
            }
        }
        .cube-tab-bar-slider:after {
            width: 100%;
        }
    }
    .groupListNav {
        transition-duration: 50ms;
        transition-timing-function: linear;
        z-index: 1;
        border-bottom: 1px solid $commonBorderColor;
        &.sticky {
            position: fixed;
            z-index: 90;
            width: 100%;
            background-color: rgb(46, 46, 59);
            transform: translateZ(0);
        }
        .cube-tab-bar {
            margin: 0 0.26rem;
        }
    }
}

.my-warning-header-edit {
    color: $commonColorBlur;
}
.my-warning-header-tab {
    .tab-custom-box {
        margin-left: 0;
        margin-right: 0;
    }
}
.my-warning-loading-icon {
    width: 100%;
    text-align: center;
    margin: 0 auto;
    margin-top: 1rem;
    width: 1rem;
    color: #ccc;
}
.no-data {
    text-align: center;
    width: 3.2rem;
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;
    .no-data-icon {
        width: 100%;
    }
    .no-data-text {
        color: $commonFsDarkColor;
        font-size: $commonFsContent;
        color: $commonFsDarkColor;
    }
    .no-data-go-set-waring {
        margin-top: 0.4rem;
        border-radius: 0.4rem;
        width: 3.2rem;
        height: 0.8rem;
        line-height: 0.8rem;
        padding: 0;
    }
}
.my-warning {
    .operate-tip {
        color: $commonFsDarkColor;
        font-size: $commonFsSmall;
        text-align: center;
        height: 0.72rem;
        line-height: 0.72rem;
        margin-top: 0.08rem;
    }
    height: 100%;
    .cube-scroll-list-wrapper {
        min-height: auto !important;
    }
    .before-trigger {
        color: $commonFsColorGray;
    }
    .no-auth-login-container {
        margin-top: 3rem !important;
    }
    .cube-pullup-wrapper .before-trigger {
        padding: 0;
    }
    .cube-pullup-wrapper .before-trigger {
        min-height: 1rem;
    }
    .cube-pulldown-loaded {
        color: #8b8e99;
    }
    .loadAll .cube-pullup-wrapper {
        display: none;
    }
}
// 移除tab切换动画
.my-dp-container /deep/ {
    .cube-tab-panels-group {
        transition: none !important;
        -moz-transition: none !important; /* Firefox 4 */
        -webkit-transition: none !important; /* Safari 和 Chrome */
        -o-transition: none !important;
    }
}
.myWarning-right {
    justify-content: flex-end;
}
.my-warning-layout {
    overflow: hidden;
    max-height: 100vh;
}
#myWarningScrollBox{
    padding-top:0px!important
}
</style>
