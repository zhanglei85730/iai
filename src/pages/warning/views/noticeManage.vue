<template>
    <div>
        <MainLayout
            :title="$route.meta.title"
            :isShowHeader="true"
            :headerStyle="$config.headerStyle"
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
                <div class="switch-set">
                    <div class="switch-item">
                        <div class="switch-left">
                            提醒时间
                        </div>
                        <div
                            class="switch-right"
                            @click="showMutiPicker"
                        >
                            <span class="time-select-result">{{getBegin}}-{{getEnd}}</span>
                            <img
                                src="static/img/warning/arrow@2x.png"
                                class="arrow-right"
                            />
                        </div>
                    </div>
                    <!-- 自设价格盯盘  -->
                    <div class="switch-item">
                        <div class="switch-left">
                            价格盯盘
                        </div>
                        <div
                            class="switch-right"
                            @click="switchChange('')"
                        >
                            <cube-switch v-model="s_price">
                            </cube-switch>
                        </div>
                    </div>
                    <!-- 自设指标盯盘 -->
                    <div class="switch-item">
                        <div class="switch-left">
                            指标盯盘
                        </div>
                        <div
                            class="switch-right"
                            @click="switchChange('')"
                        >
                            <cube-switch v-model="s_index">
                            </cube-switch>
                        </div>
                    </div>
                    <!-- 行情异动 -->
                    <div class="switch-item">
                        <div class="switch-left">
                            行情异动
                        </div>
                        <div
                            class="switch-right"
                            @click="switchChange('market_movement_count','market_movement')"
                        >
                            <cube-switch v-model="market_movement">
                            </cube-switch>
                        </div>
                    </div>
                    <!-- 形态指标 -->
                    <div class="switch-item">
                        <div class="switch-left">
                            K线形态
                        </div>
                        <div
                            class="switch-right"
                            @click="switchChange('kline_form_count','kline_form')"
                        >
                            <cube-switch v-model="kline_form">
                            </cube-switch>
                        </div>
                    </div>
                    <!-- event -->
                    <div class="switch-item">
                        <div class="switch-left">
                            重要事件
                        </div>
                        <div
                            class="switch-right"
                            @click="switchChange('')"
                        >
                            <cube-switch v-model="event">
                            </cube-switch>
                        </div>
                    </div>
                    <!-- 胜率指标 -->
                    <div class="switch-item">
                        <div class="switch-left">
                            信号推荐
                        </div>
                        <div
                            class="switch-right"
                            @click="switchChange('index_count','index')"
                        >
                            <cube-switch v-model="index">
                            </cube-switch>
                        </div>
                    </div>

                </div>
                <!-- page bottom -->
                <div class="page-bottom-tip">关闭对应类型，自选将只展示该类型的盯盘消息，不再进行APP及微信通知推送</div>
            </div>
        </MainLayout>
    </div>
</template>
<script>
import i18n from '@warning/i18n'
import { getPriceWarningNameByTrigger, getWarningCondition, getPriceTriggerTypeByCode, priceWarningQuery } from '../mapConfig.js'
import request from "@services/documentary.js";
import { getInfoFromSessionStorage, getPlatformCode, getDataFoxAxiosRequest,iConsole } from '@public/js/util.js'
const globalConsts = require('@public/js/consts.js')
export default {
    components: {

    },
    data() {
        return {
            selectedVal: ['', ''],
            selectedText: ['', ''],
            selectedIndex: [0, 0],
            selectedIndex_copy: [0, 0],
            begin: '00:00',
            end: '00:00',
            market_movement: false,
            kline_form: false,
            event: false,
            index: false,
            s_price: false,
            s_index: false,
            market_movement_count: false,
            kline_form_count: false,
            index_count: false,
            beginText: '',
            endText: '',
        }
    },
    methods: {
        getUserInfo(symbol) {
            let userInfo = getInfoFromSessionStorage() || {};
            return {
                userid: userInfo.userid,
                account: userInfo.account,
                platform: getPlatformCode()
            };
        },
        tipAddSymbolWarning(type = '', typeState) {
            let name = ''
            switch (type) {
                case 'market_movement_count': {
                    name = '行情异动';
                    break;
                }
                case 'kline_form_count': {
                    name = 'K线形态';
                    break;
                }
                case 'index_count': {
                    name = '信号推荐';
                    break;
                }
            }
            const t = this;
            this.$createDialog({
                type: 'confirm',
                title: '提示',
                content: `您未开启任何“${name}”，请在“盯盘管理”中添加自选产品后开启“${name}”`,
                confirmBtn: {
                    text: '去开启',
                    active: true,
                    disabled: false,
                    href: 'javascript:;'
                },
                cancelBtn: {
                    text: '取消',
                    active: false,
                    disabled: false,
                    href: 'javascript:;'
                },
                onConfirm: () => {
                    t[typeState] = false
                    t.warningConfSet()
                    setTimeout(function () {
                        t.$router.push('/optionalPage')
                    }, 300)

                },
                onCancel: () => {
                    t[typeState] = false
                    // t.backFunc()
                }
            }).show()
        },
        getData() {
            const t = this;
            request.getFavoritesOption({ ...this.getUserInfo() }).then(res => {
                const resData = getDataFoxAxiosRequest(res, this);
                if (resData && resData.hasOwnProperty('symbols')) {
                    const filterResult = resData.symbols.filter(({ market_movement_count = 0 }) => {
                        return market_movement_count != 0 ? true : false
                    })
                    resData.symbols.forEach(({ market_movement_count = 0, kline_form_count = 0, index_count = 0 }) => {
                        if (!t.market_movement_count && market_movement_count > 0) {
                            t.market_movement_count = true
                        }
                        if (!t.kline_form_count && kline_form_count > 0) {
                            t.kline_form_count = true
                        }
                        if (!t.index_count && index_count > 0) {
                            t.index_count = true
                        }
                    })
                }
            }).catch(function(e){
                iConsole(e)
            })
        },
        //返回按钮
        backFunc() {
            this.$router.go(-1)
        },
        showMutiPicker() {
            const t = this;
            let timeArr = []
            for (let i = 0; i <= 24; i++) {
                timeArr.push({ text: i < 10 ? `0${i}:00` : `${i}:00`, value: i })
            }
            const column1 = timeArr.concat([])
            column1.pop()
            const column2 = timeArr.concat([])
            column2.shift()
            if (!this.mutiPicker) {
                this.mutiPicker = this.$createPicker({
                    title: '选择提醒时间',
                    data: [column1, column2],
                    onSelect: t.selectHandle,
                    onCancel: t.cancelHandle,
                    selectedIndex: t.selectedIndex,
                    onChange: t.changeHandle
                })
            }
            this.mutiPicker.show()
        },
        changeHandle(a, b, c) {
            //debugger
        },
        selectHandle(selectedVal, selectedIndex, selectedText) {
            const t = this;
            if (selectedVal[0] >= selectedVal[1]) {
                this.$createDialog({
                    type: 'alert',
                    title: t.$t('noticeManage.tipTitle01'),
                    content: t.$t('noticeManage.tipContent01'),
                    confirmBtn: {
                        text: t.$t('noticeManage.tipButton01'),
                    },
                }).show()
                let _bgeinTextIndex = 0
                let _endTextIndex = 0
                this.mutiPicker.data[0].forEach(({ text = '' }, index) => {
                    if (text === t.beginText) {
                        _bgeinTextIndex = index
                    }
                })
                this.mutiPicker.data[1].forEach(({ text = '' }, index) => {
                    if (text === t.endText) {
                        _endTextIndex = index
                    }
                })
                this.selectedIndex = [_bgeinTextIndex, _endTextIndex]
                // return false
                setTimeout(function () {
                    t.mutiPicker.$updateProps({
                        selectedIndex: t.selectedIndex
                    })
                }, 200)



            } else {
                this.selectedIndex_copy = selectedIndex;
                this.selectedIndex = selectedIndex
                this.selectedVal = selectedVal;
                this.selectedText = selectedText;
                this.begin = selectedVal[0]
                this.end = selectedVal[1];
                this.warningConfSet()
            }
        },
        cancelHandle() {
            // this.$createToast({
            //     type: 'correct',
            //     txt: 'Picker canceled',
            //     time: 1000
            // }).show()
        },
        getSet() {
            let userInfo = getInfoFromSessionStorage() || {};
            const { userid = '', account = '', platform = getPlatformCode() } = userInfo
            request.warningConfGet({ userid, account, platform }).then(({ data } = {}) => {
                const { begin='', end='', event='', index='', kline_form='', market_movement='', s_index='', s_price='' } = data.data;
                this.begin = begin;
                this.end = end;
                this.selectedIndex = [begin, end - 1];
                this.selectedIndex_copy = [begin, end - 1]
                this.event = Boolean(event);
                this.index = Boolean(index);
                this.kline_form = Boolean(kline_form);
                this.market_movement = Boolean(market_movement);
                this.s_index = Boolean(s_index);
                this.s_price = Boolean(s_price);
            }).catch(function(e){
                iConsole(e)
            })
        },
        warningConfSet() {
            let userInfo = getInfoFromSessionStorage() || {};
            const { userid = '', account = '', platform = getPlatformCode() } = userInfo
            const param = {
                userid,
                account,
                platform,
                begin: this.begin,
                end: this.end,
                market_movement: Number(this.market_movement),
                kline_form: Number(this.kline_form),
                event: Number(this.event),
                index: Number(this.index),
                s_price: Number(this.s_price),
                s_index: Number(this.s_index)
            }
            request.warningConfSet(param).then(({ data } = {}) => {

            })
        },
        // 1行情异动 2k线形态  3信号推荐
        switchChange(type = '', typeState = '') {
            const t = this;
            if (type != '' && !this[type]) {
                t.tipAddSymbolWarning(type, typeState);
                return false
            }
            setTimeout(function () {
                t.warningConfSet()
            }, 300)
        }
    },
    created() {
        this.getSet()
        this.getData()
    },
    mounted() {

    },
    computed: {
        getTimeRange() {
            return this.selectedText.join(' - ');
        },
        getBegin() {
            const result = this.begin < 10 ? `0${this.begin}:00` : `${this.begin}:00`
            this.beginText = result
            return result;

        },
        getEnd() {
            const result = this.end < 10 ? `0${this.end}:00` : `${this.end}:00`
            this.endText = result
            return result
        }
    },
    watch: {
        selectedText(newval, oldval) {

        }
    },
    i18n
}
</script>
<style lang="scss" scoped>
@import "@public/css/warningGlobal.scss";
.arrow-right {
    width: 0.18rem;
    height: 0.36rem;
    margin-left: 0.3rem;
}
.time-select-result {
    color: rgba(235, 235, 245, 0.3);
}
.switch-set {
    padding-left: $commonSpace;
    .switch-item {
        &:first-child {
            border-top: none;
        }
    }
    background: rgba(41, 41, 51, 1);
}
.switch-item {
    width: 100%;
    height: 1rem;
    display: flex;
    justify-items: center;
    justify-content: space-between;
    border-top: 1px solid rgba(0, 0, 0, 0.25);
}
.common-header-left-icon {
    width: 0.44rem;
    margin-top: 0.2rem;
}
.switch-left,
.switch-right {
    justify-items: center;
    align-items: center;
    flex: 1;
    display: flex;
    line-height: 1rem;
}
.switch-right {
    justify-content: flex-end;
    padding-right: $commonSpace;
    display: flex;
    align-items: center;
}
.switch-left {
    font-size: $commonFsContent;
    color: #ebebf5;
}
.switch-item {
    display: flex;
}
.page-bottom-tip {
    font-size: 0.24rem;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(235, 235, 245, 0.3);
    line-height: 0.36rem;
    margin: 0.24rem $commonSpace 0;
}
</style>
<style lang="scss">
// 全局选择日期控件
.switch-set {
    .cube-switch .cube-switch-ui::before {
        background-color: #2e2e3b !important;
    }
    .cube-switch .cube-switch-ui::after {
        background-color: #fff !important;
    }
    .cube-switch .cube-switch-ui {
        border-width: 2px !important;
    }
    .cube-tip-close {
        display: none !important;
    }
    .cube-tip {
        background: #2e2e3b;
    }
    .cube-tip-angle:before {
        border-color: #2e2e3b !important;
    }
}
.cube-picker-choose .cube-picker-content {
    top: 0 !important;
}
.cube-picker-content > .border-bottom-1px {
    top: 0;
    background: linear-gradient(
        360deg,
        rgba(41, 41, 51, 0) 0%,
        rgba(41, 41, 51, 1) 100%
    ) !important;
}
.cube-picker-content > .border-top-1px {
    bottom: 0;
    background: linear-gradient(
        360deg,
        rgba(41, 41, 51, 1) 0%,
        rgba(41, 41, 51, 0) 100%
    ) !important;
}
.cube-picker-panel {
    height: 260px !important;
    background: #292933 !important;
}
.cube-popup-mask {
    background-color: #030303;
    opacity: 0.6;
}
</style>

