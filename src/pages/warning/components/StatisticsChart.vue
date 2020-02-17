<template>
    <MaskPop
        :visible="visible"
        @maskClick="maskClickHandle"
        class="statistics-chart-container"
        position="bottom"
    >
        <div
            slot="content"
            style="height:100%"
        >
            <div class="ehart-box">
                <div class="top-sticky">
                    <div class="ehart-header">
                        <i
                            class="cubeic-close ehart-header-close"
                            @click="closeChartPop"
                        ></i>
                        <div class="ehart-header-text">{{getTitle}}</div>
                    </div>
                    <!-- <div><router-link :to="{name:'bangtest'}">测试</router-link></div> -->
                    <div class="tab-box">
                        <cube-tab-bar
                            v-model="selectedLabel"
                            show-slider
                            @click="tabClick"
                        >
                            <cube-tab
                                v-for="(item, index) in tabs"
                                :icon="item.icon"
                                :label="item.label"
                                :key="item.label"
                            >
                            </cube-tab>
                        </cube-tab-bar>
                    </div>
                </div>
                <div class="ehart-body" :class="{'statistics-tweb-popularize':isWebPopularize}">
                    <!-- 近3年共出现{{getCount}}次“公布=预测”，且公布后产品波动如下： -->
                    <h2 class="chart-title">{{$t('statisticsChart.recent3YearTimes01')}}{{getCount}}{{$t('statisticsChart.recent3YearTimes02')}}</h2>
                    <div class="chart-sub-title">
                        <div class="chart-sub-title-left">{{$t('statisticsChart.unit')}}{{getUnit}}</div>
                        <div class="chart-sub-title-right">
                            <MySwitch
                                :data="chartTypeSwitchData"
                                :selectValue="switchSelectValue"
                                class="tab-custom-box-gray"
                                @select="expireSelectHandle"
                            />
                        </div>
                    </div>
                    <VeLine
                        :extend="getEchartData"
                        height="300px"
                        ref='veLine1'
                        :loading="false"
                        :settings="chartSettings"
                    />
                    <h2 class="chart-title">{{$t('statisticsChart.dataExpalen')}}</h2>
                    <dl class="data-explain">
                        <dt
                            class="data-explain-title"
                            v-if="getBullSymbos.length>0"
                        >{{$t('statisticsChart.goodForMore')}}</dt>
                        <dd
                            class="data-explain-info"
                            v-if="getBullSymbos.length>0"
                        >
                            <div
                                class="data-explain-info-item"
                                v-for="(item,index) in getBullSymbos"
                                :key="index"
                                @click="linkToAppChart(item)"
                            >
                                <span
                                    class="dot"
                                    :style="getColorBySymbol(item)"
                                ></span>{{item}}
                            </div>

                        </dd>
                        <dt
                            class="data-explain-title"
                            v-if="getBearSymbos.length>0"
                        >{{$t('statisticsChart.goodForEmpety')}}</dt>
                        <dd
                            class="data-explain-info"
                            v-if="getBearSymbos.length>0"
                        >
                            <div
                                class="data-explain-info-item"
                                v-for="(item,index) in getBearSymbos"
                                :key="index"
                                @click="linkToAppChart(item)"
                            >
                                <span
                                    class="dot"
                                    :style="getColorBySymbol(item)"
                                ></span>{{item}}
                            </div>
                        </dd>
                        <!-- getShockSymbos -->
                        <dt
                            class="data-explain-title"
                            v-if="getShockSymbos.length>0"
                        >{{$t('statisticsChart.shockChange')}}</dt>
                        <dd
                            class="data-explain-info"
                            v-if="getShockSymbos.length>0"
                        >
                            <div
                                class="data-explain-info-item"
                                v-for="(item,index) in getShockSymbos"
                                :key="index"
                                @click="linkToAppChart(item)"
                            >
                                <span
                                    class="dot"
                                    :style="getColorBySymbol(item)"
                                ></span>{{item}}
                            </div>
                        </dd>
                    </dl>
                    <div class="bottom-tip">{{$t('statisticsChart.bottomTip')}}</div>
                </div>
            </div>
        </div>
    </MaskPop>
</template>
<script>
import i18n from '@warning/i18n'
import MaskPop from '@components/MaskPop.vue'
import MySwitch from '@warning/components/Switch.vue'
import VeLine from 'v-charts/lib/line'
import request from '@services/documentary.js'
import { getInfoFromSessionStorage, getPlatformCode, getDataFoxAxiosRequest, isIos, getSymbolInfoByEname,isWechatPlatform,isWebPopularize } from '@public/js/util.js'
const globalConsts = require('@public/js/consts.js')

export default {
    i18n,
    props: {
        visible: {
            type: Boolean,
            default: false,
            required: true
        },
        symbol: {
            type: Number,
            default: 102,
            required: true
        },
        recordId: {
            type: Number,
            default: 0,
            required: true
        },
        directType: {
            type: Number,
            default: 0,
            required: true
        }
    },
    components: {
        MaskPop,
        VeLine,
        MySwitch
    },

    data() {
        const t=this;
        this.chartSettings = {
            yAxisType: ['percent'],
            digit: 3
        }
        return {
            isWebPopularize:false,
            direction: 1,
            switchSelectValue: 1,
            chartTypeSwitchData: [
                { text: t.$t('statisticsChart.showByWave'), value: 1 },
                { text: t.$t('statisticsChart.showByDot'), value: 2 }
            ],
            selectedLabel: '公布>预测',
            tabs: [{
                label: '公布>预测',
                heroes: [],
                direction: 2
            }, {
                label: '公布<预测',
                heroes: [],
                direction: 1
            }, {
                label: '公布=预测',
                heroes: [],
                direction: 3
            }],
            // category = [], data = [], info
            staticsData: { category: [], data: [], info: {} },
            // 利多、利空、震荡颜色 symbol_list返回的产品索引对应以下颜色索引

            stylesArr: ['#3385FF', '#00CCCC', '#FF6C22', '#F942CC', '#FFBF00', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']
        }
    },
    methods: {
        setBodyOverAuto() {
            document.querySelector('body').classList.remove('overflow-hidden')
        },
        linkToAppChart(symbol) {
            // console.log('symbols=' + symbol)
            if(this.$config.isWechatPlatform){
               return false
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
        getUnitHandle() {
            return this.switchSelectValue == 2 ? this.$t('statisticsChart.unitDot') : '%'
        },
        getEventEffectStatics() {
            const t = this;
            let userInfo = getInfoFromSessionStorage(globalConsts.userInfoKeyNameInStore);
            // 是否是web推广页面
            if(!isWebPopularize()){
               if (!userInfo) return false;
            }else{
                userInfo={}
            }
            const { userid = '', account = '' } = userInfo
            const params = {
                record_id: t.recordId,
                userid,
                account,
                direction: t.direction,
                platform: getPlatformCode(),
                symbol: t.$props.symbol
            }
            request.eventEffectStatics(params).then((res) => {
                const resData = getDataFoxAxiosRequest(res, this);
                if (!resData) return false;
                t.staticsData = resData;
                this.$nextTick(_ => {
                    this.$refs[`veLine1`].echarts.resize()
                })

            })
        },
        maskClickHandle() {
            this.setBodyOverAuto()
            this.$emit('maskClick')
        },
        expireSelectHandle({ index, value }) {
            this.switchSelectValue = value;
        },
        // type1 波幅 type2 点数显示

        tabClick(data) {
            const result = this.tabs.filter(({ label = "", direction = '' }) => {
                return data == label
            })
            if (result.length > 0) {
                this.direction = result[0].direction
            }
            this.getEventEffectStatics()

        },
        closeChartPop() {
            this.setBodyOverAuto()
            this.$emit('close')
        },
        startReset() {
            this.direction = 1,
                this.switchSelectValue = 1,
                this.selectedLabel = this.tabs[0].label
            this.getEventEffectStatics()
        },
        // 通种symbol同种颜色
        getColorBySymbol(symbol) {
            const { info: { extend } } = this.staticsData;
            let indexColor = 0

            try {
                const { info: { extend } } = this.staticsData;
                const symbolsArr = extend.symbol_list.split(',')

                symbolsArr.filter((item, index) => {
                    if (item == symbol) {
                        indexColor = index
                        return index
                    }
                })
                return { background: this.stylesArr[indexColor] }
            } catch (e) {
                return { background: this.stylesArr[indexColor] }
            }
        }
    },
    computed: {
        getTitle() {
            try {
                const { info: { extend = {} } = {} } = this.staticsData;
                const { title = "" } = extend
                return title
            } catch (e) {
                return this.$t('statisticsChart.historyDataStatistics')
            }
        },
        getCount() {
            const { info: { count } = {} } = this.staticsData;
            return count
        },
        getUnit() {
            return this.switchSelectValue == 2 ? this.$t('statisticsChart.unitDot') : '%'
        },
        getEchartData() {
            const t = this;
            const { category = [], data = [], info = {} } = this.staticsData
            const { extend: { symbol_list } = {} } = info
            const textColor = "#5c5f67";
            // 波幅系列数据
            let upDownRatesSeriesData = [];
            // 点数系列数据
            let legendData = [];
            try {
                legendData = symbol_list ? symbol_list.split(',') : [];
            } catch (e) {
                legendData = [];
            }
            let pointSeriesData = [];
            // 利润数据
            let profitData = [];
            data.forEach(({ data: itemData = [], name = '' }) => {
                upDownRatesSeriesData.push({
                    name,
                    type: 'line',
                    data: itemData.map(item => Number(item.up_down_rate))
                })
                pointSeriesData.push({
                    name,
                    type: 'line',
                    data: itemData.map(item => Number(item.point))
                })
                profitData = itemData.map(item => {
                    return item.profit
                })
            })
            /////////
            ///
            ////
            const options = {
                color: t.stylesArr,
                title: {
                    text:t.$t('statisticsChart.lineTitle') ,
                    show: true
                },
                tooltip: {
                    confine: true,
                    trigger: 'axis',
                    formatter: function (params, ticket, callback) {
                        const { dataIndex = '' } = params[0]
                        const { data: chartData = [] } = t.staticsData
                        const profitArr = []
                        chartData.map((chartdataItem) => {
                            chartdataItem.data.forEach((subItem, index) => {
                                const { profit = '' } = subItem
                                if (dataIndex === index) {
                                    profitArr.push(profit)
                                }
                            })
                        })
                        const axisValue = params[0].axisValue
                        const titleName = t.getUnit == '%' ? t.$t('statisticsChart.options.title01') : t.$t('statisticsChart.options.title02')
                        const result = params.map((item, index) => {
                            const { marker = '', seriesName = '', data } = item
                            let className = '';
                            let opreateSymbol = '';
                            if (Number(data) > 0) {
                                className = ';color:#7ACC7A'
                                opreateSymbol = '+'
                            } else if (Number(data) < 0) {
                                className = ';color:#FF6666'
                                opreateSymbol = ''
                            }
                            const _profit = isNaN(profitArr[index]) ? '--' : (Number(profitArr[index])).toFixed(2);
                            const _value = t.getUnit == '%' ? (data * 100).toFixed(3) : data.toFixed(1);
                            return `
                            <div style="display:flex;width:210px;font-size:12px">
                            <span style="flex:2;text-align:left">${marker}${seriesName}</span>
                            <span style="flex:2;text-align:right${className}">${opreateSymbol}${_value}${t.getUnit}</span>
                            <span style="flex:2;text-align:right">$${_profit}</span>
                            </div>
                            `
                        })
                        const titleHtml = `
                            <div style="display:flex;width:220px">
                            <span style="flex:1;text-align:left;font-size:0.2rem;color:rgba(235,235,245,0.3)">${t.$t('statisticsChart.options.product')}</span>
                            <span style="flex:1;text-align:right;font-size:0.2rem;color:rgba(235,235,245,0.3)">${t.$t('statisticsChart.options.upOrDown')}<</span>
                            <span style="flex:1;text-align:right;font-size:0.2rem;color:rgba(235,235,245,0.3)">${t.$t('statisticsChart.options.profit')}</span>
                            </div>
                        `
                        return `<div style="font-size:0.24rem;color:rgba(235,235,245,0.6);">${t.$t('statisticsChart.options.recent3YearsTimes01')}${axisValue}${t.$t('statisticsChart.options.recent3YearsTimes02')}${titleName}</div>
                            ${titleHtml}
                           ${result.join('')}
                        `
                    }
                },
                legend: {
                    // selectedMode:false,
                    data: legendData,
                    bottom: '0px',
                    icon: 'circle',
                    textStyle: {
                        color: '#7d8088',
                        fontSize: 12
                    },
                    left: 20,
                    right: 20,
                    itemGap: 6,
                    padding: 0,
                    itemWidth: 6
                },
                grid: {
                    top: '6%',
                    left: 14,
                    right: 30,
                    bottom: '10%',
                    containLabel: true,
                    borderColor: "#111",
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    nameGap: 0,
                    type: 'category',
                    boundaryGap: false,
                    data: category,
                    axisLabel: {
                        align: 'center',
                        interval: 0,
                        padding: [10, 0, 0, 0],
                        margin: 0,
                        show: true,
                        verticalAlign: 'top',
                        textStyle: {
                            color: textColor,
                        },
                        fontSize: 10,
                        formatter: function (value, index) {
                            return `公布${value}`
                        },
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: textColor,
                            width: 1,
                            type: 'solid'
                        }
                    },

                },
                yAxis: {
                    // max: function (value) {
                    //     return parseInt(value.max) + 1;
                    // },
                    type: 'value',
                    axisLabel: {
                        formatter: function (value, index) {
                            if (t.switchSelectValue == 1) {
                                return (value * 100).toFixed(2)
                            } else if (t.switchSelectValue == 2) {
                                return (value).toFixed(1)
                            }

                        },
                        color: textColor
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: textColor,
                            width: 1,
                            type: 'solid'
                        }
                    }
                },
                series: this.switchSelectValue == 1 ? upDownRatesSeriesData : pointSeriesData
            }
            return options
        },
        // 利多品种
        getBullSymbos() {
            const { info: { extend = {} } } = this.staticsData;
            const { bull = "" } = extend
            return !!bull ? bull.split(',') : []
        },
        // 利空品种
        getBearSymbos() {
            const { info: { extend = {} } } = this.staticsData;
            const { bear = "" } = extend
            return !!bear ? bear.split(',') : []
        },
        //shock
        getShockSymbos() {
            const { info: { extend = {} } } = this.staticsData;
            const { shock = "" } = extend
            return !!shock ? shock.split(',') : []
        },
    },
    mounted() {
        this.getEventEffectStatics();
    },

    created() {
        if(isWebPopularize()){
           this.isWebPopularize=true
        }
        const t = this;
        this.direction = t.$props.directType
        const result = this.tabs.filter(({ direction = 2 }) => {
            return direction == t.directType
        })
        if (result.length > 0) {
            this.selectedLabel = result[0].label
        } else {
            this.selectedLabel = this.tabs[0].label
        }
        document.querySelector('body').classList.add('overflow-hidden')

    },
    watch: {
        symbol(newval, oldval) {
            // this.startReset()
        },
        // direction(newval, oldval) {
        //     this.getEventEffectStatics()
        // },
        visible(newvalue, oldval) {
            if (newvalue) {
                this.startReset()
            }
        }
    }
}

</script>
<style lang="scss" scoped>
@import "@public/css/global.scss";
.tab-box {
    margin-top: 0.22rem;
}
.top-sticky {
    position: fixed;
    width: 100%;
    background: #2e2e3b;
    z-index: 100;
}
.bottom-tip {
    height: 0.24rem;
    font-size: 0.24rem;
    font-weight: 500;
    color: rgba(235, 235, 245, 0.3);
    line-height: 0.24rem;
    padding: 0.36rem 0.28rem;
}
// iphone 刘海屏
@media only screen and (device-width: 375px) and (device-height: 812px) {
    .bottom-tip {
        padding-bottom: 0.5rem;
    }
}
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
    .bottom-tip {
        padding-bottom: 0.5rem;
    }
}
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) {
    .bottom-tip {
        padding-bottom: 0.5rem;
    }
}
.data-explain {
    padding: 0 0.28rem;
}
.data-explain-title {
    color: rgba(235, 235, 245, 0.6);
    font-size: $commonFsSmall;
    margin-top: 0.24rem;
}
.data-explain-info {
    margin-top: 0.12rem;
    font-size: $commonFsSmall;
}
.data-explain-info-item {
    background: rgba(49, 49, 61, 1);
    margin-right: 0.1rem;
    height: 0.52rem;
    line-height: 0.52rem;
    padding: 0 0.1rem;
    display: inline-block;
    border-radius: 0.12rem;
    color: rgba(235, 235, 245, 0.4);
    background-image: urlPrefix("static/img/warning/icon_data_small@2x.png");
    background-position: right center;
    background-repeat: no-repeat;
    background-size: 0.3rem;
    padding-right: 0.36rem;
    // &::before {
    //     content: "";
    //     display: inline-block;
    //     width: 0.12rem;
    //     height: 0.12rem;
    //     background: #fff;
    //     border-radius: 0.12rem;
    //     margin-right: 0.1rem;
    // }
    .dot {
        content: "";
        display: inline-block;
        width: 0.12rem;
        height: 0.12rem;
        background: #fff;
        border-radius: 0.12rem;
        margin-right: 0.1rem;
        position: relative;
        top: -1px;
    }
}
.chart-title {
    margin: 0.32rem 0 0 0.28rem;
}
.ehart-body {
    padding-top: 1.6rem;
    margin-top: 0.32rem;
    .cube-tab {
        font-size: $commonFsMedium;
    }
}
.chart-sub-title {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-left: 0.28rem;
    height: 0.5rem;
    margin-top: 0.2rem;
    .chart-sub-title-left {
        color: rgba(235, 235, 245, 0.3);
        font-size: $commonFsSmall; //最小
    }
}
.ehart-box {
    color: #fff;
    background-color: $commonBackgroundDark;
    // margin-top: 10vh;
    // height: 100%;
    // width:100vh;
    overflow: hidden;
}
.ehart-header {
    height: 0.88rem;
    line-height: 0.88rem;
    border-bottom: 1px solid #24242e;
    position: relative;
    .ehart-header-close {
        position: absolute;
        right: 0.2rem;
        color: #8b8e99;
    }
}
.ehart-header-text {
    text-align: center;
    color: #fff;
    font-size: $commonFsTitleMedium;
}
</style>
<style lang="scss">
.statistics-chart-container {
    .mask-content {
        height: 82vh !important;
        overflow: auto;
    }
    .cube-tab {
        font-size: 0.28rem;
    }
}
.statistics-tweb-popularize{
    margin-top:0!important;
    padding-top:0!important
}
// .ehart-body .ve-line div:first-child div:nth-child(2) {
//     background: rgba(49, 49, 61, 0.95);
//     box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.2);
// }
</style>