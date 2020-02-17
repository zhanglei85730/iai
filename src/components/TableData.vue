<template>
    <div
        class="table-data-container"
        ref="tableDataContainer"
    >
        <div v-if="isShowHeader">
            <div v-if="$slots.hasOwnProperty('tableHeader')">
                <slot name='tableHeader'></slot>
            </div>
            <div
                class="table-data-title"
                v-else
                @click="tableVisibileHandle"
            >
                <div class="table-data-title-left">
                    <div
                        class="table-data-title-txt"
                        v-if="$slots.hasOwnProperty('title')"
                    >
                        <slot name='title'></slot>
                    </div>
                    <div
                        class="table-data-title-txt"
                        v-else
                    >{{title}}</div>
                </div>
                <div class="table-data-title-right">
                    <img
                        :src="$config.imagePathPrefix+'arrow_down@3x.png'"
                        class="table-head-right-icon"
                        :class="{'table-head-right-icon-up':isTableVisible}"
                    />
                </div>
            </div>
        </div>
        <div
            v-if="isTableVisible"
            class="table-warp"
            :style="{'paddingLeft':fixedColumsWidth+'px'}"
        >
            <!--  -->
            <div
                class="border-shadow"
                :style="{'height':tableBodyHeight}"
            ></div>
            <!--  -->
            <!-- =====================固定表头================= -->
            <div
                class="table-fixed-left list-wrapper-table"
                v-if="getFixedColumnsData.length>0"
            >
                <!-- table thead -->
                <div class="table-fixed-head list-wrapper-row list-wrapper-header">
                    <ul class="list-wrapper">
                        <li
                            class="list-item"
                            v-for="(item,index) in getFixedColumnsData"
                            :key="index"
                            :style="getColumnsStyle(item)"
                        >
                            <div class="list-item-cont-box">
                                <div
                                    class="list-item-cont-inner"
                                    v-html="item.title"
                                ></div>
                            </div>
                        </li>
                    </ul>
                </div>
                <!-- table tbody -->
                <div
                    class="table-fixed-body list-wrapper-body"
                    ref="fixedScroll"
                    :style="{'height':tableBodyHeight}"
                >
                    <div
                        class="list-wrapper-row list-wrapper-body"
                        v-for="(outerItem,outerIndex) in getFixedBodyData"
                        :key="outerIndex"
                    >
                        <ul class="table-row list-wrapper">
                            <li
                                class="table-td list-item"
                                v-for="(item,key,index) in outerItem"
                                :key="index"
                                :style="{width:getFixedTdWidth(key,index)}"
                                v-show="index<=getFixedColumnsData.length"
                            >
                                <div
                                    class="list-item-cont-box"
                                    @click="cellClickHandle(outerItem)"
                                >
                                    <div
                                        class="list-item-cont-inner"
                                        v-html="getItemValueForFixed(item,outerItem,outerIndex,key)"
                                    >
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div
                class="list-wrapper-table"
                ref="tableWarp"
            >
                <!-- 表头 -->
                <div
                    class="list-wrapper-row list-wrapper-header"
                    ref="tableThead"
                    :style="{width:tableHeadWidth+'px'}"
                >
                    <ul class="list-wrapper">
                        <!-- 删除 -->
                        <li
                            class="list-item  table-opreate-cell table-data-delete"
                            v-if="isEdit"
                        >
                            <div class="list-item-cont-box">
                                <div class="list-item-cont-inner">
                                    <!-- <div class="table-data-delete-radio"></div> -->
                                </div>
                            </div>
                        </li>
                        <!-- 内容 -->
                        <li
                            v-for="(item,index) in getTableColumns"
                            :key="index"
                            class="list-item"
                            :style="getColumnsStyle(item)"
                            @click="tableHeadHandle(item,index)"
                            :class="{'fixed-cell':index==0}"
                        >
                            <div class="list-item-cont-box">
                                <div
                                    class="list-item-cont-inner"
                                    v-html="item.title"
                                ></div>
                            </div>
                        </li>
                    </ul>
                </div>
                <!-- table body -->
                <div
                    class="table-tbody"
                    :style="{width:tableHeadWidth+'px','height':tableBodyHeight}"
                    ref="tableMainScroll"
                >
                    <div
                        class="list-wrapper-row list-wrapper-body"
                        v-for="(rowsData,index) in tableData"
                        :key="index"
                    >
                        <ul class="list-wrapper">
                            <!-- 删除 -->
                            <li
                                class=" table-opreate-cell list-item table-data-delete"
                                v-if="isEdit"
                            >
                                <div class="list-item-cont-box">
                                    <div class="list-item-cont-inner">
                                        <div
                                            class="table-data-delete-radio"
                                            :class="{'table-data-delete-radio-selected':isSelectClassName(index)}"
                                            @click="selectHandle(rowsData,index)"
                                        ></div>
                                    </div>
                                </div>
                            </li>
                            <li
                                v-for="(item,rowsDatakey,rowsDataIndex) in rowsData"
                                :key="rowsDataIndex"
                                class="list-item"
                                :style="getItemStyle(rowsData,rowsDatakey)"
                                @click="itemEventHandle(dataSource[index],rowsDatakey)"
                                v-show="getTableCellShow(rowsDatakey)"
                                :class="{'fixed-cell':rowsDataIndex==1}"
                            >
                                <div
                                    class="list-item-cont-box"
                                    :class="{fixed:hasFixedIndexArr.indexOf(rowsDataIndex)>-1}"
                                >
                                    <!-- <div class="list-item-cont-inner">{{ getItemValue(item,rowsDatakey)}}</div> -->
                                    <div
                                        class="list-item-cont-inner"
                                        v-html="getItemValue(item,dataSource[index],rowsDatakey)"
                                    ></div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        tableBodyHeight: {
            type: String,
            required: false,
            height: 'auto'
        },
        dataSource: {
            type: Array,
            required: true,
            default: []
        },
        columns: {
            type: Array,
            required: true,
            default: []
        },
        title: {
            type: String,
            required: false,
            default: '表格标题'
        },
        isShowHeader: {
            type: Boolean,
            required: false,
            default: true
        },
        name: {
            type: String,
            required: false,
            default: ''
        },
        isEdit: {
            type: Boolean,
            required: false,
            default: false
        },
        // table选择重置id,改变这个数据就会重置
        tableResetSelectId: {
            type: Number,
            required: false,
            default: 0
        },
        // 表格是否显示
        visible: {
            type: Boolean,
            required: false,
            default: true
        },
        isLoading: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data() {
        return {
            isDoScrollRight: false,
            timer01: '',
            timer02: '',
            isStartScrollBack: false,
            isSticky: false,
            data: [
                '中国平安 601318.SH',
                '0190608',
                '20190608',
                '预案',
                '1834.32',
                '1834.32',
                '34.32',
            ],
            tableHeadData: [
                '股票', '公告日期', '截止日期', '进程', '回购数量(万股)', '回购金额(万元)', '最高价', '最低价'
            ],
            // table是否显示
            isTableVisible: true,
            scrollOptions: {
                eventPassthrough: 'vertical'
            },
            //选择的index
            selectData: [],
            // 选择的行数据
            selectRows: [],
            // 保存含有fixed的字段index
            hasFixedIndexArr: [],
            tableWidth: 'auto',
        }
    },
    methods: {
        cellClickHandle(data) {
            this.$emit('fixedcellClick', data)
        },
        getWidthFormStyle({ width = '80px' } = {}) {
            const value = width.match(/\d*/)[0]
            try {
                if (value !== '') {
                    return Number(value)
                } else {
                    return 80
                }
            } catch (e) {
                console.error(e.message)
            }

        },
        getFixedTdWidth(key, index) {
            try {
                const { style = {} } = this.getFixedColumnsData[index]
                const { width = '100px' } = style
                return width
            } catch (e) {
                return '100px'
            }
        },
        tableMainScroll() {
            this.$refs.fixedScroll.scrollTop = this.$refs.tableMainScroll.scrollTop
        },
        // table头部点击
        tableHeadHandle(item, index) {
            const { onClick = () => { }, render, ...rest } = item;
            onClick(rest, index)
        },
        getTableCellShow(rowsDatakey) {
            const result = this.columns.filter(({ dataIndex = '' }) => {
                return rowsDatakey == dataIndex
            })
            return result.length > 0 ? true : false
        },
        isSelectClassName(index) {
            return this.selectData.indexOf(index) > -1
        },
        // table row 选择
        selectHandle(rowsData, index) {
            if (this.selectData.indexOf(index) > -1) {
                // 选择的数据index
                this.selectData = this.selectData.filter((item) => {
                    return item != index
                })
                // 处理选择的数据
                this.selectRows = this.selectRows.filter(({ tableId }) => {
                    return tableId != index
                })
            } else {
                this.selectRows = this.selectRows.concat([rowsData])
                this.selectData = this.selectData.concat([index])
            }
            this.$emit('selectRows', this.selectRows)
        },
        // 设置数据单元格样式
        getItemStyle(item, key) {
            const result = this.columns.filter((columnsDataItem) => {
                const { style = '' } = columnsDataItem
                return columnsDataItem.dataIndex == key
            })
            if (result.length > 0) {
                return result[0].hasOwnProperty('style') ? result[0].style : {}
            }
        },
        // 设置列样式
        getColumnsStyle({ headerStyle = {}, style: { width = '' } = {} }) {
            if (width !== '') {
                return Object.assign(headerStyle, { width })
            } else {
                return headerStyle
            }
        },
        // 获取item的值
        getItemValue(value = '--', item, key) {
            const result = this.columns.filter(({ dataIndex = '', render = () => { } }) => {
                return dataIndex == key
            });
            if (result.length > 0) {
                //    如果有render回调函数
                if (result[0].hasOwnProperty('render')) {
                    return result[0].render(value, item, key)
                } else {
                    return value
                }
            }
        },
        // 获取item的值
        getItemValueForFixed(value = '--', item, index, key) {
            const result = this.columns.filter(({ dataIndex = '', render = () => { } }) => {
                return dataIndex == key
            });
            if (result.length > 0) {
                //    如果有render回调函数
                if (result[0].hasOwnProperty('render')) {
                    const tableDataItem = this.tableData.length > 0 ? Object.assign(item, this.tableData[index]) : item
                    return result[0].render(value, tableDataItem, key)
                } else {
                    return value
                }
            }
        },
        tableVisibileHandle() {
            this.isTableVisible = !this.isTableVisible
        },
        // 数据点击事件回调
        itemEventHandle(data, columns) {
            this.$emit('cellClick', data, columns, { name: this.name })
        },

    },
    computed: {
        // 获取冻结列数据
        getFixedColumnsData() {
            const result = this.columns.filter(({ fixed = false, style = {} } = {}) => {
                return !!fixed
            })
            console.log("fixedHead" + JSON.stringify(result));
            return result

        },
        // 获取冻结表格数据
        getFixedBodyData() {
            //   {
            //         stock_a: '股票a1',
            //         stock_b: '股票b1',
            //         stock_c: '股票c1',
            //         stock_d: '股票a1',
            //         stock_e: '股票b1',
            //         stock_f: '股票c1',
            //         stock_g: '股票a1',
            //         stock_j: '股票b1',
            //         stock_h: '股票c1',
            //     },
            const fixedColum = this.columns.filter(({ fixed = false, style = {} } = {}) => {
                return !!fixed
            })
            const fixedBodyData = []
            this.dataSource.map((item) => {
                const _row = {}
                fixedColum.forEach(({ dataIndex = '' }) => {
                    for (let key in item) {
                        if (key === dataIndex) {
                            _row[dataIndex] = item[key]
                        }
                    }
                })
                fixedBodyData.push(_row)
            })
            console.log("fixedTable" + JSON.stringify(fixedBodyData))
            return fixedBodyData
        },
        getTableColumns() {
            return this.columns.filter(item => !item.hasOwnProperty('fixed'))
        },
        tableHeadWidth() {
            let conutWidth = 0;
            const t = this;
            this.columns.forEach(({ dataIndex, fixed = false, style = {} } = {}, index) => {
                if (!fixed) {
                    console.log('列宽：' + t.getWidthFormStyle(style))
                    conutWidth += t.getWidthFormStyle(style)
                }
            })
            return conutWidth
        },
        // 获取冻结列总宽度
        fixedColumsWidth() {
            let conutWidth = 0;
            const t = this;
            this.columns.forEach(({ dataIndex, fixed = false, style = {} } = {}, index) => {
                if (fixed) {
                    conutWidth += t.getWidthFormStyle(style)
                }
            })
            return conutWidth
        },
        tableData: function () {
            const t = this;
            const sortResltData = [];
            const newItem = {};
            //将table的行数据根据table column的顺序排序
            const hasFixedIndexArr = [];

            t.columns.forEach(({ dataIndex, fixed = false, style = {} } = {}, index) => {
                // const { width = 100 } = style
                if (!fixed) {
                    newItem[dataIndex] = '';
                }
                if (fixed === true) {
                    // 加1是要去除删除列（隐藏列）
                    hasFixedIndexArr.push(index + 1)
                }
            })
            // 将table column之外的行数据字段添加到末尾（table行数据的字段必须跟column的字段顺序一一对应）
            t.dataSource.forEach((tableDataItem, index) => {
                // t.columns[index]
                const _dataItem = Object.assign({ tableId: index }, newItem, tableDataItem);
                let _newItem = {};
                for (let key in _dataItem) {
                    if (newItem.hasOwnProperty(key)) {
                        _newItem[key] = _dataItem[key];
                    }
                }
                if (!tableDataItem.hasOwnProperty('fixed')) {
                    sortResltData.push(Object.assign({ tableId: index }, _newItem))
                }
            });
            if (hasFixedIndexArr.length > 0) {
                hasFixedIndexArr.map((item, index) => {
                    sortResltData[index]['fixed'] = true

                })
            }
            this.hasFixedIndexArr = hasFixedIndexArr;
            return sortResltData
        },
        scrollToRight() {
            const t = this;
            this.$nextTick(() => {
                t.$refs.tableMainScroll.addEventListener('scroll', t.tableMainScroll);
                // t.$refs.tableWarp.scrollLeft = 100
                t.timer02 = setInterval(function () {
                    let value = t.$refs.tableWarp.scrollLeft >= 50 ? 4 : 20;
                    t.$refs.tableWarp.scrollLeft = t.$refs.tableWarp.scrollLeft + value;
                    if (t.$refs.tableWarp.scrollLeft >= 130) {
                        clearInterval(t.timer02);
                        t.isStartScrollBack = true
                    }
                }, 40)
            })
        }
    },
    created() {
        this.isTableVisible = this.$props.visible
    },
    mounted() {
        // this.scrollToRight()


    },
    watch: {
        dataSource(newval, oldval) {
            if (newval.length > 0 && !this.isDoScrollRight) {
                this.scrollToRight();
                this.isDoScrollRight = true
            }
        },
        tableResetSelectId(newval, oldval) {
            this.selectData = [];
            this.selectRows = []
        },
        isStartScrollBack(newval, oldval) {
            const t = this;
            try {
                if (newval) {
                    // 滚动条滑动提示用户这里可以滑动
                    t.timer01 = setInterval(function () {
                        let value = t.$refs.tableWarp.scrollLeft <= 20 ? 4 : 20;
                        t.$refs.tableWarp.scrollLeft = t.$refs.tableWarp.scrollLeft - value;
                        if (t.$refs.tableWarp.scrollLeft <= 0) {
                            clearInterval(t.timer01)
                        }
                    }, 40)
                }
            } catch (e) {

            }

        }
    }
}
</script>

<style lang="scss" scoped>
@import "@public/css/warningGlobal.scss";
.table-fixed-body {
    overflow: scroll;
}
.border-shadow {
    position: absolute;
    right: -0.28rem;
    top: -16px;
    width: 30px;
    z-index: 1000;
    width: 60px;
    height: 1000px;
    background: linear-gradient(
        -90deg,
        rgba(41, 41, 51, 1) 0%,
        rgba(41, 41, 51, 0) 100%
    );
}
.table-warp {
    position: relative;
    .table-fixed-left {
        position: absolute;
        left: 0;
        top: 0;
        background: $commonBackgroundDark;
    }
}
.table-tbody {
    overflow: auto;
    // height: 300px;
}
.sticky {
    position: fixed !important;
    top: 0;
    left: 0;
    z-index: 100;
}
.table-data-delete-radio {
    border: 1px solid #4c94ff;
    width: 0.36rem;
    height: 0.36rem;
    border-radius: 0.36rem;
}
.table-data-delete-radio-selected {
    background: #4c94ff;
    position: relative;
    &:after {
        content: "√";
        color: #fff;
        font-size: 12px;
        // position:absolute;
        // left:0;
        // top:0;
        text-align: center;
        display: block;
        line-height: 0.36rem;
        height: 0.36rem;
        margin-top: 2px;
        transform: rotate(10deg);
    }
}
.table-data-container {
    margin-top: 0.28rem;
}
.table-head-right-icon {
    transform: rotate(180deg);
    width: 0.28rem;
    height: 0.36rem;
    vertical-align: middle;
}
.table-head-right-icon-up {
    transform: rotate(0deg);
}
.list-wrapper-table {
    // padding: 0 $commonFsMedium;
    position: relative;
    overflow: auto;
    .list-wrapper-row {
        border-bottom: 1px solid $commonBorderColor;
        position: relative;
    }
    .list-item {
        display: inline-block;
        width: 80px;
        padding-right: 0.2rem;
        box-sizing: border-box;
        white-space: pre-wrap;
        font-size: $commonFsMedium;
        position: relative;
        .list-item-cont-box {
            display: table;
            width: 100%;
            height: 100%;
            .list-item-cont-inner {
                display: table-cell;
                vertical-align: middle;
            }
        }
    }
    .fixed {
        // position: fixed;
        left: 0;
        top: 10px;
    }
    .table-opreate-cell {
        width: 0.4rem;
    }
    .list-wrapper-body {
        color: #fff;
        overflow: hidden;
        position: relative;
        .list-item {
            height: 1rem;
            .list-item-cont-inner {
                // line-height: 0.36rem;
            }
        }
    }
    .list-wrapper-header {
        color: $commonFsColorGray;
        height: 1rem;
        overflow: hidden;
        font-size: $commonFsSmall;
        .list-item {
            min-height: 0.33rem;
            padding-top: 0.22rem;
            padding-bottom: 0.22rem;
            background: $commonBackgroundDark;
        }
    }
}

.table-data-title {
    display: flex;
    height: 1rem;
    line-height: 1rem;
    padding: 0 $commonSpace;
    border: 1px solid $commonBorderColor;
    border-left: none;
    border-right: none;
    .table-data-title-txt {
        font-size: $commonFsContent;
        color: #fff;
    }
    .table-data-title-left {
        flex: 1;
        text-align: left;
    }
    .table-data-title-right {
        flex: 1;
        text-align: right;
    }
}
.event-table {
    td {
        width: 150px;
    }
}
.list-wrapper {
    position: relative;
    white-space: nowrap;
    // padding-left: 130px;
    // .fixed-cell {
    //     position: absolute;
    //     left: 0;
    //     // top:0
    //     z-index: 100;
    //     background: $commonBackgroundDark;
    //     // color:#4c94ff
    // }
}
</style>
<style lang="scss">
// 一定不要加scope
.horizontal-scroll-list-wrap {
    .cube-scroll-content {
        display: inline-block;
        .list-wrapper {
            white-space: nowrap;
            // position: relative;
        }
        .list-item {
            display: inline-block;
        }
    }
}
</style>