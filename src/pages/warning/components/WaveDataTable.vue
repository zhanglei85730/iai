<template>
    <MaskPop
        :visible="visible"
        @maskClick="maskClickHandle"
        class="wave-data-container"
        position="bottom"
    >
        <div slot="content">
            <div class="ehart-box">
                <div class="ehart-header">
                    <i
                        class="cubeic-close ehart-header-close"
                        @click="closeChartPop"
                    ></i>
                    <div class="ehart-header-text">{{getTitle}}<br />
                        <div class="ehart--header-text-sub">{{waveData | getPublicTime}}</div>
                    </div>

                </div>
                <!--  tableBodyHeight="300px" -->
                <TableData
                    :columns="getTableHeadData"
                    :dataSource="getTableData"
                    :isShowHeader="false"
                    class="common-table-space table-box history-public-data-table"
                    :isEdit="false"
                    :loading="true"
                    @fixedcellClick="fixedCellHandle"
                >
                    <div slot="title">
                        自选股
                    </div>
                </TableData>
            </div>
        </div>
    </MaskPop>

</template>
<script>
import i18n from '@warning/i18n'
import request from '@services/documentary.js'
import { getInfoFromSessionStorage, getPlatformCode, getDataFoxAxiosRequest, getSymbolInfoByEnName, getSymbolInfoById, linkToAppChart } from '@public/js/util.js'
const globalConsts = require('@public/js/consts.js')
import TableData from '@components/TableData'
import MaskPop from '@components/MaskPop.vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
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
        }
    },
    components: {
        TableData,
        MaskPop
    },
    data() {
        const t = this;
        return {
            loading: true,
            waveData: {},
            tableData: [

            ],
            tableHead: [
                {
                    title: t.$t('waveDataTable.productTitle'),
                    dataIndex: 'symbolCname',
                },
                {
                    title: t.$t('waveDataTable.newestPublish'),
                    dataIndex: 'publishPrice',
                },
            ],
            // 
            order: '',
            reverse: 'default',//排序默认0 升序、 1降序
            // 产品对应的最新价格
            newPrices: []
        }
    },
    created() {
        document.querySelector('body').classList.add('overflow-hidden')
    },
    methods: {
        ...mapMutations(['symbolsWebSocketSendMsg', 'updateDataStoreForSocket', 'websocketClose']),
        ...mapActions(['createWebSocketForSymbols']),
        fixedCellHandle(data = {}) {
            const { symbolCname = '' } = data;
            if (symbolCname != '') {
                if (this.$config.isWechatPlatform) return false
                linkToAppChart(symbolCname)
            }
        },
        setBodyOverAuto() {
            document.querySelector('body').classList.remove('overflow-hidden')
        },
        //   发送订阅websock行情信息
        toSymbolWebSocketsendMessage() {
            if (this.newPrices.length == 0) return [];
            const symbolsArr = []
            this.newPrices.forEach(({ symbol = '' } = {}) => {
                const _symbolItem = getSymbolInfoByEnName(symbol)
                try {
                    if (_symbolItem) {
                        symbolsArr.push(String(_symbolItem.id[0]))
                    }
                } catch (e) {
                    console.error(`${symbol}在产品接口里找不到对应的数据`)
                }
            })
            this.symbolsWebSocketSendMsg({
                names: symbolsArr,
                type: 'add',
                diff: false
            })
        },
        getParmasSort() {
            const { order = '', reverse = '' } = this;
            let _order = ''
            switch (order) {
                case 'fieldName0': {
                    _order = '1min';
                    break;
                }
                case 'fieldName1': {
                    _order = '5min';
                    break;
                }
                case 'fieldName2': {
                    _order = '15min';
                    break;
                }
                case 'fieldName3': {
                    _order = '30min';
                    break;
                }
                case 'fieldName4': {
                    _order = '60min';
                    break;
                }
                default: {
                    _order = ''
                }
            }
            return reverse == 'default' ? { order: '', sort: '' } : { sort: reverse, order: _order }
        },
        getEventInfluence() {
            const t = this;
            const userInfo = getInfoFromSessionStorage(globalConsts.userInfoKeyNameInStore);
            if (!userInfo) return false;
            const { userid = '', account = '' } = userInfo
            const params = {
                record_id: t.recordId,
                userid,
                account,
                platform: getPlatformCode(),
                symbol: this.$props.symbol,
                ...this.getParmasSort(),
            }
            request.eventInfluence(params).then((res) => {
                const resData = getDataFoxAxiosRequest(res, this);
                if (!resData) return false;
                const { info: { extend } = {} } = resData;
                const { symbol_list = '' } = extend;
                let newPricceArr = [];
                try {
                    const symbolArr = symbol_list.split(',');
                    newPricceArr = symbolArr.map((item) => {
                        return { symbol: item, newPrice: 0 }
                    })
                } catch (e) {
                    newPricceArr = []
                }
                // resData.newPrices = newPricceArr
                t.newPrices = newPricceArr
                t.waveData = resData;
                t.toSymbolWebSocketsendMessage()

            })
        },
        maskClickHandle() {
            this.setBodyOverAuto()
            this.$emit('maskClick')
        },
        closeChartPop() {
            this.setBodyOverAuto()
            this.$emit('close')
        },
        getPlaceholderForTableTd() {
            const placeholderForTableTd = globalConsts.placeholderForTableTd;
            return `<span style="color:rgba(235,235,245,0.15)">${placeholderForTableTd}</span>`
        },
        // 对数据进行排序
        getSortByField(fieldValue, index) {
            var point = [1, 3, 5, 6, 97, 2]
            points.sort(function (a, b) { return a - b });
            this.waveData.filter((item, _index) => {
                return index == _index
            })
        },
        // 判断是否上涨下跌
        judgeUpOrDown(value, fieldName, rowData) {
            const { symbolCname = '' } = rowData;
            // const symbolItem = symbolCname==''?getSymbolInfoByEnName(symbolCname);
            let fixedNumber = this.getFixedNumber(symbolCname)
            const operation = fieldName == 'price_change' ? 100 : 1
            const symbolChar = fieldName == 'price_change' ? '%' : ''
            const className = fieldName == 'price_change' ? 'price-change' : 'point-change'
            const _fixedNumber = fieldName == 'price_change' ? 3 : 1
            const unit = fieldName == 'point_change' ? '点' : ''
            if (!isNaN(value)) {
                if (Number(value) > 0) {
                    return `<span class="common-up-color ${className}">+${(value * operation).toFixed(_fixedNumber)}${symbolChar}${unit}</span>`
                } else if (Number(value) == 0) {
                    return `<span class="common-equal-color ${className}">${(value * operation).toFixed(_fixedNumber)}${symbolChar}${unit}</span>`
                } else {
                    return `<span class="common-down-color ${className}">${(value * operation).toFixed(_fixedNumber)}${symbolChar}${unit}</span>`
                }
            } else {
                return value
            }
        },
        //table数据排序
        tableSort({ sortTitle = '', sort = '', dataIndex = '' }, index) {
            const { category = [] } = this.waveData
            let _index = 0
            category.forEach((item, index) => {
                if (item == sortTitle) {
                    _index = index
                }
            })
            this.order = `fieldName${_index}`;
            let reverse = 'default'
            switch (sort) {
                case 'default': {
                    reverse = 0;
                    break;
                }
                case 'asc': {
                    reverse = 1;
                    break;
                }
                case 'desc': {
                    reverse = 'default';
                    break;
                }
            }
            this.reverse = reverse;
            this.getEventInfluence()
        },
        // 获取小数位数
        getFixedNumber(symbolEnname) {
            const _symoblInfo = getSymbolInfoByEnName(symbolEnname);
            if (_symoblInfo) {
                try {
                    return _symoblInfo.id[4]
                } catch (e) {
                    return 3
                }
            } else {
                return 3
            }
        }
    },
    filters: {
        getPublicTime({ info: { publish_time = '' } = {} }) {
            return `${publish_time}公布后统计第N分钟波幅`
        },
    },
    computed: {
        ...mapGetters(['getSymbolsData']),
        getTitle() {
            try {
                const { info: { extend = {} } = {} } = this.waveData;
                const { title = "" } = extend
                return title
            } catch (e) {
                return '最新产品分钟波动数据'
            }
        },
        // 获取table head data
        getTableHeadData() {
            const t = this;
            this.newPrices
            const { category = [], data = [] } = this.waveData;
            const _getPlaceholderForTableTd = t.getPlaceholderForTableTd()
            const categoryHeaderPartB = category.map((item, index) => {
                // 判断排序的className
                let sortClassName = globalConsts.tableStyle.default;
                //
                let sortType = 'default'
                let _sortFieldName = ''

                switch (t.order) {
                    case 'fieldName0': {
                        _sortFieldName = '1分';
                        break;
                    }
                    case 'fieldName1': {
                        _sortFieldName = '5分';
                        break;
                    }
                    case 'fieldName2': {
                        _sortFieldName = '15分';
                        break;
                    }
                    case 'fieldName3': {
                        _sortFieldName = '30分';
                        break;
                    }
                    case 'fieldName4': {
                        _sortFieldName = '60分';
                        break;
                    }
                }
                if (_sortFieldName == item) {
                    if (t.reverse == 0) {
                        sortClassName = globalConsts.tableStyle.sortUp
                        sortType = globalConsts.tableStyle.sortAsc
                    } else if (t.reverse == 1) {
                        sortClassName = globalConsts.tableStyle.sortDown
                        sortType = globalConsts.tableStyle.sortDesc
                    }
                }
                return {
                    title: `<span class="table-header-txt">${item}</span>${sortClassName}`,
                    dataIndex: `fieldName${index + 1}`,
                    render: function (item, rowData) {
                        const { point_change = '-', price_change = '-' } = item;
                        const point_change_value = point_change == '' || point_change === null ? _getPlaceholderForTableTd : point_change
                        const price_change_value = price_change == '' || price_change === null ? _getPlaceholderForTableTd : price_change
                        return `${t.judgeUpOrDown(price_change_value, 'price_change', rowData)}<br/>${t.judgeUpOrDown(point_change_value, 'point_change', rowData)}`
                    },
                    sort: sortType,
                    sortTitle: item,
                    onClick: function (columnData, index) {
                        t.tableSort(columnData, index)
                    },
                }
            })
            const categoryHeaderPartA = [{
                title: t.$t('waveDataTable.productTitle'),
                dataIndex: 'symbolCname',
                fixed: true,
                render: function (value, row = {}, keyName) {
                    //background-image: urlPrefix("static/img/warning/icon_data_small@2x.png");
                    const _symoblInfo = getSymbolInfoByEnName(value);
                    return _symoblInfo ? `<img src="static/img/warning/new-price-blue.png" style="width:0.22rem;margin-right:0.1rem"/>${_symoblInfo.id[1]}<br/><span style="font-size:12px;color:rgba(235,235,245,0.3);margin-left:0.3rem">${value}</span>` : value
                },
                style: {
                    width: '120px'
                }
            },
            {
                title: t.$t('waveDataTable.newestPublish'),
                dataIndex: 'publishPrice',
                render: function (value = '', row = {}, keyName) {
                    const { symbolCname = '' } = row
                    const fixedNumber = t.getFixedNumber(symbolCname)
                    // 公布价格
                    let publishPrice = ''
                    let newPrice = '0'
                    try {
                        publishPrice = value !== null ? (Number(value)).toFixed(fixedNumber) : _getPlaceholderForTableTd
                    } catch (e) {
                        publishPrice = _getPlaceholderForTableTd
                    }
                    //最新价
                    if (t.newPrices.length > 0) {
                        const filterResult = t.newPrices.filter((item) => {
                            return item.symbol == symbolCname
                        });
                        if (filterResult.length > 0) {
                            try {
                                newPrice = (Number(filterResult[0].newPrice)).toFixed(fixedNumber)
                            } catch (e) {
                                newPrice = filterResult[0].newPrice
                            }

                        }
                    }
                    return `${newPrice}<br/><span style="color:rgba(235,235,245,0.3);font-size:0.22rem">${publishPrice}</span>`
                },
                style: {
                    width: '120px',
                    textAlign: 'left'
                }
            }]
            return categoryHeaderPartA.concat(categoryHeaderPartB)
        },
        // 获取table  data
        getTableData() {
            this.order
            this.reverse
            const { category = [], data = [] } = this.waveData;
            let tableData = []
            const tableDataPartB = data.forEach((indexData, index) => {
                const _rowData = { symbolCname: indexData.name, publishPrice: indexData.price_then }
                indexData.data.forEach((item, innerIndex) => {
                    _rowData[`fieldName${innerIndex + 1}`] = item
                })
                tableData.push(_rowData)
            })
            return tableData
        }
    },
    mounted() {
        const t = this
        this.getEventInfluence()

    },
    watch: {
        getSymbolsData: function (val, oldValue) {
            const t = this;
            // ask 买入价 bid卖出价
            const { new_price = '', changeRate = '', symbolInt, ask = 0, bid = 0 } = val;
            const symbolItem = getSymbolInfoById(symbolInt)
            const _newPrices = [].concat(t.newPrices)
            if (!!symbolItem) {
                const { uname = '' } = symbolItem;
                if (t.newPrices.length > 0) {
                    const newPriceArr = t.newPrices.map((item) => {
                        const _newItem = Object.assign({}, item)
                        if (_newItem.symbol === uname) {
                            _newItem.newPrice = new_price
                        }
                        return _newItem
                    })
                    t.newPrices = newPriceArr
                }

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
    }
}
</script>
<style lang="scss" scoped>
@import "@public/css/global.scss";
.ehart--header-text-sub {
    color: $commonFsDarkColor;
    font-size: $commonFsSmall;
    padding-top: 0.08rem;
}
.ehart-box {
    color: #fff;
    background-color: $commonBackgroundDark;
    // margin-top: 10vh;
    height: 90%;
    // width:100vh;
    overflow: hidden;
    padding: 0.28rem;
    // box-shadow: inset 20px 10px 50px #f60;
}
.ehart-header {
    // height: 0.88rem;
    // line-height: 0.88rem;
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
    padding-bottom: 0.18rem;
}

.table-box {
    // height:200px;
    // overflow: auto
}
</style>
<style lang="scss">
.wave-data-container {
    .table-fixed-left {
        // width: 80px !important;
        // overflow: hidden;
    }
}
.history-public-data-table {
    font-weight: normal;
    .price-change {
        font-size: 0.28rem;
    }
    .point-change {
        font-size: 0.22rem;
        margin-top: 0.1rem;
    }
    .list-wrapper-header {
        .list-item-cont-inner {
            // display: flex!important;
            justify-content: center;
            justify-items: center;
            position: relative;
            .column-sort-icon {
                // position: absolute;
                // top:-6px;
                // right:20px
            }
            .table-header-txt {
                display: inline-block;
                vertical-align: middle;
            }
        }
    }
}
</style>