<template>
    <div class="table-data-container" @scroll="scrollHandle" ref="tableDataContainer">
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
        <div v-if="isTableVisible">
            <div class="list-wrapper-table">
                    <!-- 表头 -->
                    <div class="list-wrapper-row list-wrapper-header" :class="{'sticky':isSticky}" ref="tableHeader">
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
                                v-for="(item,index) in columns"
                                :key="index"
                                class="list-item"
                                :style="getColumnsStyle(item)"
                                @click="tableHeadHandle(item,index)"
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
</template>
<script>
export default {
    props: {
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
        }
    },
    data() {
        return {
            isSticky:false,
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
            hasFixedIndexArr: []
        }
    },
    methods: {
        scrollHandle(){
            const t=this;
            console.log(t.$refs.tableHeader.offsetTop,t.$refs.tableDataContainer.scrollTop)
            this.$refs.tableDataContainer.onscroll=function(){
               if(t.$refs.tableDataContainer.scrollTop>t.$refs.tableHeader.offsetTop){
                    t.isSticky=true
               }else{
                   t.isSticky=false
               }
            }
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
        tableVisibileHandle() {
            this.isTableVisible = !this.isTableVisible
        },
        // 数据点击事件回调
        itemEventHandle(data, columns) {
            this.$emit('cellClick', data, columns, { name: this.name })
        },
        
    },
    computed: {
        tableData: function () {
            const t = this;
            const sortResltData = [];
            const newItem = {};
            //将table的行数据根据table column的顺序排序
            const hasFixedIndexArr = [];
            t.columns.forEach(({ dataIndex, fixed = false }, index) => {
                newItem[dataIndex] = '';
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
                sortResltData.push(Object.assign({ tableId: index }, _newItem))
            });
            if (hasFixedIndexArr.length > 0) {
                hasFixedIndexArr.map((item, index) => {
                    sortResltData[index]['fixed'] = true

                })
            }
            this.hasFixedIndexArr = hasFixedIndexArr;
            return sortResltData
        }
    },
    created: function () {
        this.isTableVisible = this.$props.visible
    },
    mounted: function () {
        // this.$refs.scroll.disable()
        const t=this;
        this.scrollHandle()
    },
    watch: {
        tableResetSelectId(newval, oldval) {
            this.selectData = [];
            this.selectRows = []
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@public/css/warningGlobal.scss";
.sticky{
    position: fixed!important;
    top:0;
    left:0;
    z-index: 100
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
    overflow:auto;
    .list-wrapper-row {
        border-bottom: 1px solid $commonBorderColor;
        position: relative;
    }
    .list-item {
        display: inline-block;
        width: 100px;
        padding-right: 0.2rem;
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
        position: relative;
        .list-item {
            height: 1rem;
            .list-item-cont-inner {
                line-height: 0.36rem;
            }
        }
    }
    .list-wrapper-header {
        color: $commonFsColorGray;
        font-size: $commonFsSmall;
        .list-item {
            min-height: 0.33rem;
            padding-top: 0.22rem;
            padding-bottom: 0.22rem;
            // background:#000
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
.list-wrapper{
    position: relative;
    white-space: nowrap;
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
            background:#000
        }
    }
}
</style>
