<template>
    <!-- 我的预警页面 -->
    <div class="chart-info-data-container">
        <div
            ref='swipe'
            class="swipe-box"
            :v-if="data.length>0"
        >
            <div
                class="chart-info-item"
                :class="{'not-price-warning-item':getWarningType(item)==20 || getWarningType(item)==30,'swipe-item-current':(isSwipeItemHaveFlag(item) && item.isSwipe) || (swipeIndex===index && item.isSwipe)}"
                v-for="(item,index) in data"
                :key="item.id"
                :data-symbol="item.symbol"
                :data-index="index"
                @touchstart="onTouchstartHandle(data,item,index,$event)"
                @touchend="onTouchendHandle(data,item,index,$event)"
                 @click="clickHandle(item)"
            >
            <!-- :data-offset-top="$refs[item.id].offsetTop" -->
                <div :class="{'chart-info-item-left': true, 'item-disabled': item.run_status == 0,'snapshot-bottom-padding':item.hasOwnProperty('snapshot') && item.snapshot!==null && (dataType==1 || dataType==2)}">
                    <div class="kline-box-title flex-box">
                        <div class="kline-box-title-txt flex-box-item">
                            <!-- <div class="item-title-icon" v-if="isSwipe"></div> -->
                            {{getSymbolInfoById(item.symbol)}}<span class="warning-symbol-ename">{{getSymbolEnameInfoById(item.symbol)}}</span>
                        </div>
                        <div class="kline-box-title-right flex-box-item">
                            <div class="top-right-txt">{{getWarningTypeCname(item.warning_type)}}
                                <img
                                    src="static/img/warning/icon_edit_small@3x.png"
                                    class="edit-icon"
                                    v-if="item.hasOwnProperty('snapshot') && item.snapshot==null && dataType==1"
                                />
                            </div>
                            <!-- <div
                                class="kline-box-btn"
                                v-if="dataType==1"
                            > {{getSelectOptionsByValue({type:'expiry',value:getProperty({
                                objectData:item.setting,
                                propertyName:'expire'
                                })})}}<span class="mask-trangle-btn"></span></div> -->
                            <!-- 去下单按钮暂时注释掉 不知道跳哪里去下单 ^00^ -->
                            <!-- <button
                                class="kline-box-btn go-deal"
                                v-if="dataType==0 && $config.userFromType()==$config.visitDeviceType.fromApp"
                                @click="goAppDeal(item)"
                            >{{$t('common').goDealBtn}}</button> -->
                        </div>
                    </div>

                    <ul
                        class="chart-info-data"
                        v-if="getWarningType(item)==10"
                         @click="clickHandle(item)"
                    >
                        <!-- 价格预警(价格已涨至) -->
                        <li
                            class="chart-info-li"
                            v-if="getWarningType(item)==10 && item.warning_type==101"
                        >
                            <div class="chart-info-title">
                                {{getTriggeredCondition(item)}}</div>
                            <div class="chart-info-li-num current-day-expire">
                                {{getWarningPrice(item)}}
                            </div>
                            <!-- 指标预警 -->
                        </li>
                        <li
                            class="chart-info-li"
                            v-if="item.warning_type==102"
                        >
                            <div class="chart-info-title">基准价格</div>
                            <div class="chart-info-li-num current-day-expire">
                                {{item.setting.params.price}}
                            </div>
                            <!-- 指标预警 -->
                        </li>
                        <!-- only 价格预警（反弹预警、回落预警） -->
                        <li
                            class="chart-info-li right-no-border"
                            v-if="item.warning_type==103 || item.warning_type==104"
                        >
                            <div class="chart-info-title">{{getReboundWarnInfo(item).triggerName}}</div>
                            <div class="chart-info-li-num">
                                {{getReboundWarnInfo(item).value}}
                            </div>
                        </li>
                        <li
                            class="chart-info-li right-no-border"
                            v-if="item.warning_type==102 || item.warning_type==103 || item.warning_type==104"
                        >
                            <div class="chart-info-title">
                                {{getTriggeredCondition(item)}}</div>
                            <div class="chart-info-li-num">
                                {{item.setting.params.point}}
                            </div>
                        </li>
                        <!-- 最新价 -->
                        <li
                            class="chart-info-li"
                            v-if="getWarningType(item)==10 && dataType!=2"
                        >
                            <div class="chart-info-title">{{$t('dataWarningDetail_page').newestPrice}}</div>
                            <div class="chart-info-li-num">
                                {{getProperty({
                                objectData:item,
                                propertyName: 'new_price'
                                })}}
                            </div>
                        </li>

                    </ul>
                    <!-- 非指标预警与组合预警下面一行 -->
                    <ul
                        class="chart-info-data chart-info-data-bottom"
                        v-if="getWarningType(item)==20 || getWarningType(item)==30"
                    >
                        <li class="chart-info-li">
                            <div class="chart-info-title">{{$t('dataWarningDetail_page').triggleCondtionLabel}}</div>
                            <div class="chart-info-li-num">
                                <span v-if="item.cycle == 1">1分钟</span>
                                <span v-else>{{getSelectOptionsByValue({type:'cycle',value:getProperty({
                                    objectData:item,
                                    propertyName:'cycle'
                                    })})}}</span>K线，{{getTriggeredCondition(item)}}
                            </div>
                        </li>
                        <li
                            class="chart-info-li middle"
                           
                        >
                        <!--  v-if="dataType!=2" -->
                            <div class="chart-info-title" v-if="dataType!=2">最新价</div>
                            <div class="chart-info-li-num current-day-expire" v-if="dataType!=2">
                                {{getProperty({
                                objectData:item,
                                propertyName:'new_price'
                                })}}
                            </div>
                        </li>
                        <li class="chart-info-li last">
                            <div class="chart-info-title">信号</div>
                            <div class="chart-info-li-num current-day-expire">
                                {{getValueByCode(item)}}
                            </div>
                        </li>
                    </ul>
                    <div
                        class="kline-box-title-sub"
                        v-if="dataType==0 && item.run_status == 1"
                    >
                        <span class="trigger-time">{{getTriggerTime(item)}}时通知，{{getLongTimeFormatHHMM(item.overdue_time)}}后失效</span>
                        <button
                            class="kline-box-btn go-deal"
                            v-if="showBtn && $config.userFromType()==$config.visitDeviceType.fromApp && !isWechatPlatform"
                            @click="goAppDeal(item)"
                        >{{$t('common').goDealBtn}}</button>
                    </div>                    
                    <div
                        class="kline-box-title-sub"
                        v-if="dataType==0 && item.run_status == 0"
                    >
                        <span class="trigger-time">{{getTriggerTime(item)}}时通知，已失效</span>
                        <button
                            class="kline-box-btn go-deal"
                            @click="goWinningList(item)"
                            v-if="showBtn && $config.userFromType()==$config.visitDeviceType.fromApp"
                        >{{$t('common').warningAgain}}</button>
                    </div>
                    <div
                        class="kline-box-title-sub"
                        v-if="dataType==1"
                    >
                        <div class="ft-bottom-left">
                            {{getSelectOptionsByValue({type: getWarningType(item)==10 ?'priceFrequency': 'frequency',value:getProperty({
                                objectData:item,
                                propertyName:'frequency'
                                })})}}，已触发{{item.trigger_count_result || 0}}次</div>
                        <div class="ft-bottom-right">{{getLongTimeFormat(item.expire_at)}}后过期</div>
                    </div>
                    <div
                        class="kline-box-title-sub"
                        v-if="dataType==2"
                    >
                        <div class="ft-bottom-left">共触发{{item.trigger_count_result}}次
                            <span v-if="item.trigger_total_point && viewDataAccount!==''">，累计可收益<span :class="item.trigger_total_point>0?'red':'green'"> {{item.trigger_total_point}}</span>点</span>
                        </div>
                        <div class="ft-bottom-right">{{item.expire_at_time}}已过期</div>
                    </div>
                    <!-- <div
                        class="kline-box-title-sub border-top"
                        v-if="(getWarningType(item)==20 || getWarningType(item)==30) && dataType==0 && item.trigger_point"
                    >
                        <div class="ft-bottom-left">通知后持仓{{getSelectOptionsByValue({type:'cycle',value:getProperty({
                                    objectData:item,
                                    propertyName:'cycle'
                                    })})}}可收益<span :class="item.trigger_point>0?'red':'green'">{{item.trigger_point}}</span>点</div>
                    </div> -->
                    <!-- 盯盘说明信息 -->
                    <div v-if="item.hasOwnProperty('snapshot') && item.snapshot!==null && (dataType==1 || dataType==2)">
                        <div
                            class="win-loss-info-box"
                            v-if="index==tabContentItemExplodeIndex"
                        >
                            <WinLossInfo
                                :data="item.snapshot"
                                @tipHandle="tipClickHandle"
                            />
                        </div>

                        <!-- 底部箭头 -->
                        <CardBottomArrow @clicHandle="tabListItemExplode(index)" style="padding-bottom:0.3rem" :isArrowUp="index==tabContentItemExplodeIndex"/>
                    </div>
                </div>

                <div class="chart-info-item-right swipe-operate-btns-box swipe-item-opreate">
                    <!-- <div
                        class="swipe-operate-btn swipe-operate-modify"
                        @click.stop="onModify(item)"
                    >
                        <img
                            :src="$config.imagePathPrefix+'edit@2x.png'"
                            class="swipe-operate-btn-icon"
                        >
                    </div> -->
                    <button
                        class="swipe-operate-btn swipe-operate-delete common-visible-text"
                        @click.stop="onDelete(item)"
                    >
                        {{$t('common').deleteSetedWarningBtn}}
                    </button>
                </div>
            </div>
        </div>
        <!--popup 图表 end-->
    </div>
</template>
<script>
import { commonError, getDataFoxAxiosRequest, getPropertyForObject, getSymbolInfoById, getWarningSort, goAppTrage, getSymbolUiCode, getPlatformCode, trackEventGeneral, isIos,getAccount,isWechatPlatform } from '@public/js/util.js'
import { getWarningConfig, getSelectOptions, getWarningCondition } from '../mapConfig.js'
import i18n from '@warning/i18n';
import globalConsts from '@public/js/consts.js'
import WinLossInfo from './WinLossInfo.vue'
import CardBottomArrow from '@warning/components/CardBottomArrow'

const moment = require('moment');

export default {
    components: {
        WinLossInfo,
        CardBottomArrow,
    },
    data() {
        const t=this;
        return {
            isWechatPlatform:false,
            // 底部箭头信息内容index
            tabContentItemExplodeIndex:-1,
             isArrowUp:true,
            
            // 开始滑动的点
            startPoint: '',
            // 被滑动的data中index
            swipeIndex: '',
            showBtn: true,
            //一键盯盘 下面信息是否显示
            yjdpVisibleIndex: -1,
            viewDataAccount:'',
        }
    },
    props: {
        data: {
            type: Array,
            required: true,
            default: []
        },
        // 点击后跳转地址
        toUrl: {
            type: String,
            required: false,
            default: '/riskTipContent'
        },
        // 点击按钮是否执行默认事件,为fase则不会执行默认事件 注册documentary事件
        isDefaultEvent: {
            type: Boolean,
            required: false,
            default: true
        },
        isSwipe: {
            type: Boolean,
            required: false,
            default: true
        },
        // 数据类型 实时监控：1/今日已触发：0
        dataType: {
            type: Number,
            required: true,
            default: 1
        },
        // 重置数据
        isReset: {
            type: Boolean,
            required: false,
            default: false
        },
        // 重置删除状态，改变这值就会取消删除选择状态
        resetSelectId: {
            type: Number,
            required: false,
            default: 0
        },
    },
    methods: {
        tipClickHandle() {
            this.$emit('tipDialog','1')
        },       
        tabListItemExplode(index, item) {
            this.tabContentItemExplodeIndex = this.tabContentItemExplodeIndex == index ? -1 : index
            this.yjdpVisibleIndex = this.yjdpVisibleIndex == index ? -1 : index
        },
        // 去交易
        goAppDeal(item) {
            const { symbol = '', warning_type = '' } = item;
            if (symbol == '') return;
            const symbolInfo = getSymbolInfoById(symbol);
            // 如果为false,中断执行
            if (!symbolInfo || !symbolInfo.hasOwnProperty('uname')) return;
            let uname = symbolInfo.uname;
            const platformCode = getPlatformCode();
            // 跳转行情图表
            function toTubiao(unameValue) {
                if (unameValue != '') {
                    if (isIos()) {
                        location.href = `https://gts2tubiao/${unameValue}`;
                    } else {
                        window.open(`https://gts2tubiao/${unameValue}`, 'tubiao', 'mobile', "_blank");
                    }
                }
            }
            const symbolUiCode = getSymbolUiCode(symbol);
            // 主要用于01 pmgold、02 fx app等提供goTrage方法跳转去下单
            // console.log(symbolUiCode)
            // if (symbolUiCode.length > 0) {
            //     const { uicode = [] } = symbolUiCode[0];
            //     const isGoSuccess = goAppTrage(uicode[1]);
            //     console.log('isGoSuccess=' + isGoSuccess)
            //     if (!isGoSuccess) {
            //         toTubiao(uname)
            //     }
            //     // 主要用于01 pm app,没提供goTrage方法无法跳转行情
            // } else {
            //     toTubiao(uname)
            // }
            toTubiao(uname)
        },
        // 跳转到胜率榜
        goWinningList({warning_type=''}) {
                const warningType = getWarningSort(warning_type);
                console.log('warningType='+warningType)
                console.log('warningType='+JSON.stringify(warningType))
                
                 if(warningType.code==10){
                      this.$router.push(`/advanceAssign?tabName=${this.$t("pageTitle.dataWarning")}`)
                 }else{
                      this.$router.push('/winList')
                 }
        },
        // 反弹预警监控价格，回落预警价格高于信息
        getReboundWarnInfo({ warning_type = '', setting = {} } = {}) {
            const { params = {} } = setting;
            const { high = '', low = '', point = '' } = params
            if (warning_type == '103') {
                return {
                    triggerName: this.$t('dataWarningDetail_page').lowPrice,
                    value: low
                }
            } else if (warning_type == '104') {
                return {
                    triggerName: this.$t('dataWarningDetail_page').hightPrice,
                    value: high
                }
            }
        },
        //根据code判断预警类型
        getWarningType({ warning_type = '' }) {
            if (warning_type == '') return '';
            const { code = '' } = getWarningSort(warning_type);
            if (code !== '') {
                return code
            } else {
                return ''
            }
        },
        getWarningPrice({ warning_type, setting = {} } = {}) {
            try {
                const { params } = setting;
                const { target = '', point = '', high = '', low = '' } = params;
                let warningPrice = '';
                if (warning_type == '101') {
                    warningPrice = target
                } else if (warning_type == '102') {
                    warningPrice = point
                } else if (warning_type == '103') {
                    warningPrice = point
                } else if (warning_type == '104') {
                    warningPrice = point
                }
                return warningPrice

            } catch (e) {
                console.error(e.message)
            }
        },
        // 获取触发时间(已触发)
        getTriggerTime(item) {
            if (item.hasOwnProperty('created_at')) {
                const date = moment(item.created_at).format('YYYY-MM-DD HH:mm')
                // const date = item.created_at;
                return date.slice(11, 16)
            } else {
                return ''
            }
        },
        // 获取过期时间
        getExpiredTime(item) {
            if (item.hasOwnProperty('expire_at_time')) {
                const date = item.expire_at_time;
                return date.slice(5, 16).replace('-', '.')
            } else {
                return ''
            }
        },
        getLongTimeFormat(val) {
            if (val) {
                const time = new Date(val * 1000);
                let month = time.getMonth() + 1;
                let date = time.getDate();
                let hours = time.getHours();
                let minus = time.getMinutes();
                if (hours === 23 && minus === 59) {
                    hours = '24';
                    minus = '0'
                }
                return `${month > 9 ? month : '0' + month}.${date > 9 ? date : '0' + date} ${hours > 9 ? hours : '0' + hours}:${minus > 9 ? minus : '0' + minus}`
            }
            return '';
        },
        getLongTimeFormatHHMM(val) {
            if (val) {
                const time = new Date(val * 1000);
                let hours = time.getHours();
                let minus = time.getMinutes();
                return `${hours > 9 ? hours : '0' + hours}:${minus > 9 ? minus : '0' + minus}`
            }
            return '';
        },
        // 获取预警类型中文名
        getWarningTypeCname(warningType) {
            try {
                return warningType && getWarningConfig(warningType)[0].title
            } catch (e) {
                console.error(e.message)
            }
        },
        // 获取预警设置参数的设置中文条件
        getSelectOptionsByValue(params) {
            const result = getSelectOptions(params)
            return result.length > 0 ? result[0].text : ''
        },
        // 通过id获取symbol信息（这里主要功能是中文名）
        getSymbolInfoById(id) {
            const symbols = getSymbolInfoById(id);
            if (symbols) {
                const { id = [] } = symbols
                return id[1]
            } else {
                return '';
            }
        },
        // 通过id获取symbol信息（这里主要功能是英文名）
        getSymbolEnameInfoById(id) {
            const symbols = getSymbolInfoById(id);
            if (symbols) {
                const { uname = '' } = symbols
                return uname
            } else {
                return '';
            }
        },
        // 修改
        onModify(params) {
            this.$emit('modifyItem', Object.assign({}, params, { dataType: this.dataType }));
        },
        // 修改
        clickHandle(params) {
            const {snapshot=null}=params
            if (this.dataType ==1 && snapshot==null) {
                this.$emit('clickItem', Object.assign({}, params, { dataType: this.dataType }))
            }
        },
        // 删除
        onDelete(params, e) {
            this.$emit('deleteItem', params)
        },
        getProperty(params) {
            return getPropertyForObject(params)
        },
        onTouchstartHandle(data, item, index, e) {
            if (this.dataType != 1) {
                return;
            }
            this.startPoint = e.touches[0]
        },
        onTouchendHandle(data, item, index, e) {
            const t = this;
            if (t.startPoint == '') return false;
            const endPoint = e.changedTouches[0];
            const changedX = parseInt(endPoint.clientX - this.startPoint.clientX);
            let isSwipeing = false;
            // 滑动距离
            const threshold = 60;
            const newData = data.concat([]);

            if (changedX < 0 && Math.abs(changedX) > threshold) {
                if (!isSwipeing) {
                    newData[index] = Object.assign({}, item, { isSwiped: true });
                    // t.data = newData;
                    t.$emit('updateItemData', newData);
                    t.swipeIndex = index
                    isSwipeing = true;
                }
            } else if (changedX > 0 && Math.abs(changedX) > threshold) {
                /**
                 * t.swipeIndex==index 是为了保存状态，数据会刷新
                 *  */
                if (item.hasOwnProperty('isSwiped') && item.isSwiped == true || t.swipeIndex == index) {
                    newData[index] = Object.assign({}, item, { isSwiped: false });
                    // t.data = newData;
                    t.$emit('updateItemData', newData);
                    isSwipeing = false;
                    t.swipeIndex = '';
                    t.startPoint = '';
                }
            }
        },
        // 检查滑动项是否有滑动标识 swipeCurrent: true
        isSwipeItemHaveFlag({ isSwiped = false }) {
            return isSwiped
        },
        // 获取已触发的条件类型
        getTriggeredCondition({ symbol, warning_type = '', setting } = {}) {
            // console.log(setting)
            const { trigger = "" } = setting;
            const data = getWarningCondition(trigger, warning_type);
            return data !== false ? data.text : ''
        },
        // 获取已触发的触发值
        getTriggeredTarget({ setting: { params = {} } } = {}) {
            const { target = '' } = params;
            return target
        },
        // 预警价格是否显示（已触发不显示，除了价格预警以外不显示）
        isWaringPriceShow({ warning_type = '' } = {}) {
            const isExceptPriceWaring = /^[2-9]{1}\d*$/.test(warning_type);
            if (isExceptPriceWaring) {
                return false;
            } else {
                return this.dataType !== 0
            }
        },

        getValueByCode({ symbol, warning_type = '', setting } = {}) {
            const { trigger = "" } = setting;
            const data = getWarningCondition(trigger, warning_type);
            return data !== false ? data.emptyOrMore : ''
        }
    },
    created(){
        // 特点账号才能查看收益点数
        const viewDataAccount = getAccount();
        if(viewDataAccount==globalConsts.specialAccounts.fx.viewData){
            this.viewDataAccount=viewDataAccount
        }
        if(isWechatPlatform()){
            this.isWechatPlatform=true;
        }
    },
    watch: {
        // 清楚删除状态
        resetSelectId(newval, oldval) {
            this.swipeIndex = ''
        },
        // 监听dataType==0
        dataType(val, oldval) {
            if (val == 0) {
                setTimeout(() => {
                    this.showBtn = true
                }, 400)
            } else {
                this.showBtn = false
            }
            this.tabContentItemExplodeIndex=-1
        },
    },
    i18n
}

</script>

<style scoped lang="scss">
@import "@public/css/mobileGlobal.scss";
$disabledTxtColor: #8b8e99;
.win-loss-info-box {
    // padding-top:0.1rem;
    border-top: 1px solid #454557;
    margin-top: 0.18rem;
    clear: both;
}
.snapshot-bottom-padding{
    padding-bottom:0!important
}
.chart-info-data-container {
    .item-title-icon {
        display: inline-block;
        width: 0.44rem;
        height: 0.44rem;
        line-height: 0.44rem;
        text-align: center;
        vertical-align: middle;
        color: #fff;
        background: urlPrefix("static/img/warning/dot_con@2x.png") no-repeat;
        background-size: contain;
        position: relative;
        border-radius: 0.44rem;
        padding-right: 8px;
        margin-top: -3px;
    }
    .kline-box-title-sub {
        margin-top: 0.2rem;
        color: #fff;
        font-size: $commonFsSmall;
        line-height: 0.6rem;
        min-height: 0.3rem;
        overflow: hidden;
        &.border-top {
            border-top: 1px solid #454557;
            .ft-bottom-left {
                margin-top: 0.16rem;
            }
        }
    }
    .chart-info-item {
        display: flex;
        display: -webkit-box;
        display: -webkit-flex;
        padding-left: $commonSpace;
        padding-right: $commonSpace;
        margin-top: 0.24rem;
    }
    .warning-symbol-ename {
        margin-left: 0.04rem;
        font-size: 0.3rem;
        color: $disabledTxtColor;
    }
    .kline-box-title {
        color: #fff;
    }
    .kline-box-title-right {
        text-align: right;
        margin-top: 0.06rem;
        .top-right-txt {
            font-size: 0.24rem;
            color: $disabledTxtColor;
        }
    }
    .kline-box-btn {
        font-size: $commonFsSmall;
        text-align: center;
        float: right;
        padding: 4px 6px;
        background: #fff;
        color: #333;
        border-radius: 3px;
        position: relative;
        .mask-trangle-btn {
            position: absolute;
            left: -12px;
            width: 24px;
            top: -10px;
            height: 12px;
            background: $commonBackgroundDark;
            -webkit-transform: rotate(45deg);
            transform: rotate(-45deg);
        }
    }
    .kline-box-title-txt {
        font-size: 0.34rem;
        font-weight: bold;
        white-space: nowrap;
        color: #f0f0f0;
    }
    .chart-info-img {
        width: 100%;
    }
    .chart-info-data {
        display: flex;
        display: -webkit-box;
        display: -webkit-flex;
        margin-top: 0.35rem;
        position: relative;
        li:last-child {
            flex: 3;
            -webkit-box-flex: 3;
            -webkit-flex: 3;
            text-align: right;
            border-right: none;
            .chart-info-data,
            .chart-info-title,
            .chart-info-li-num {
                text-align: right;
                margin-right: 0;
            }
        }
        li:first-child {
            .chart-info-title,
            .chart-info-li-num {
                margin-left: 0;
                text-align: left;
            }
        }
        .chart-info-li {
            flex: 1;
            -webkit-box-flex: 1;
            -webkit-flex: 1;
            font-size: $commonFsMedium;
            border-right: 1px solid $commonBorderColor;
            .chart-info-li-num {
                margin: 0.08rem 0.2rem 0;
                white-space: normal;
            }
        }
        .chart-info-li.middle {
            position: absolute;
            right: 0.6rem;
        }
        .chart-info-title {
            color: $disabledTxtColor;
            white-space: nowrap;
            font-size: $commonFsSmall;
            margin: 0 0.2rem 0;
            margin-right: 0.3rem;
        }
        .chart-info-li-num {
            color: #fff;
            font-size: $commonFsSmallMedium;
            line-height: 0.28rem;
        }
        .right-no-border {
            border-right: none;
        }
    }
    // 非价格预警
    .not-price-warning-item {
        .chart-info-data {
            padding-bottom: 0.14rem;
        }
        .chart-info-data-bottom {
            margin-top: 0.35rem;
            border-top: 1px solid #3d3d4d;
            .chart-info-li {
                border: 0;
                flex: 1;
                -webkit-box-flex: 1;
                -webkit-flex: 1;
                &:last-child {
                    flex-shrink: 1;
                }
            }
        }
    }

    .swipe-operate-btns-box {
        display: flex;
        display: -webkit-box;
        display: -webkit-flex;
        flex-direction: row;
    }
    .swipe-operate-modify {
        background: $commonColorBlur;
    }
    .swipe-operate-delete {
        border: none;
        background: $commonFsColorRed url("~static/img/warning/delete@2x.png")
            center center no-repeat;
        background-size: 0.44rem 0.44rem;
    }
    .chart-info-item-right,
    .chart-info-item-left {
        width: 100%;
    }
    .chart-info-item-left {
        flex: 3;
        -webkit-box-flex: 3;
        -webkit-flex: 3;
        padding: 0.32rem 0.28rem;
        // padding-bottom:0;
        border-radius: 0.08rem;
        background-color: $commonBorderColor;
    }
    .chart-info-item-right {
        flex: 1;
        -webkit-box-flex: 1;
        -webkit-flex: 1;
    }
    .trigger-time {
        font-size: 0.24rem;
        color: $disabledTxtColor;
    }
    .item-disabled {
        .kline-box-title-txt,
        .chart-info-li-num {
            color: $disabledTxtColor;
        }
    }

    //swipe
    .swipe-box {
        .swipe-item-padding-right {
            padding-right: 20px;
        }
        .swipe-operate-btn {
            height: 1rem;
            width: 1rem;
            border-radius: 50%;
            margin-left: 0.42rem;
            text-align: center;
            position: relative;
            align-items: stretch;
        }
        .swipe-item-opreate {
            display: none;
            align-items: center;
        }
        .swipe-item-current .swipe-item-opreate {
            display: flex;
            display: -webkit-box;
            display: -webkit-flex;
            // flex-direction: column
        }
        .current-day-expire {
            font-size: $commonFsSmall !important;
        }
        .swipe-item-current {
            margin-left: -0.8rem;
            margin-right: 0;
            padding-right: 0;
        }
        .swipe-operate-btn-icon {
            height: 0.44rem;
            position: absolute;
            top: 50%;
            margin-top: -0.22rem;
            left: 50%;
            margin-left: -0.22rem;
        }
    }
    .go-deal {
        background: $commonColorBlur;
        color: #fff;
        text-align: center;
        line-height: 0.6rem;
        border-radius: 0.3rem;
        border: none;
        padding: 0 0.42rem;
    }
    .ft-bottom-left,
    .ft-bottom-right {
        line-height: 0.24rem;
        color: $disabledTxtColor;
    }
    .ft-bottom-left {
        float: left;
        .red {
            color: $commonFailColor;
        }
        .green {
            color: $commonSuccessColor;
        }
    }
    .ft-bottom-right {
        float: right;
    }
}
.edit-icon {
    width: 0.32rem;
    vertical-align: middle;
    position: relative;
    top: -2px;
}
</style>
