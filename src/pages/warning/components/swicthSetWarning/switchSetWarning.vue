<template>
    <div class="switch-set-contanier">
        <v-touch
            @swipeleft="onSwipeLeft(index)"
            @swiperight="onSwipeRight(index)"
            :swipe-options="{direction: 'horizontal'}"
            v-for="(item,index) in data"
            :key="index"
            class="switch-set-touch"
        >
            <div
                class="switch-set"
                :data-delete-id="index"
                :class="{'delete-mark':item.hasOwnProperty('deleteMark')}"
            >

                <div
                    class="switch-set-left"
                    @click="selectDrop(item,index)"
                >
                    <div class="switch-set-label">{{item | getLableName}}</div>
                    <img
                        src="./images/unfold_small@3x.png"
                        class="switch-set-arrow"
                        v-if="isShowArrow(item)"
                    />
                </div>
                <div
                    class="switch-set-center"
                    :id="renderId"
                >
                    <input
                        :placeholder="item | getPlaceholder"
                        class="switch-set-input"
                        v-model="item.condition.params.point"
                        @keyup="inputChange(item,index,$event)"
                        @keydown="inputKeydown"
                        @blur="inputBlurHandle(item,index,'point')"
                        v-if="item.warning_type==102"
                        type="number"
                        v-number
                    />
                    <input
                        :placeholder="item | getPlaceholder"
                        class="switch-set-input"
                        v-model="item.condition.params.target"
                        @keyup="inputChange(item,index,$event,'target')"
                        @keydown="inputKeydown"
                        @blur="inputBlurHandle(item,index)"
                        type="number"
                        v-else
                    />
                    <!-- 输入价格与最新价提示 item.diffValue-->
                    <div
                        class="input-price-tip"
                        v-show="getShowTip(item)"
                    >
                        {{item.inputTip}}
                        <span class="input-price-tip-arrow"></span>
                    </div>
                </div>
                <!--  :class="{'flex-align-right':!priceSelectFilter(item)}" -->
                <div class="switch-set-right">
                    <!-- 最新价选择 -->
                    <div
                        class="switch-set-select"
                        @click="setlectPriceHandle(item,index)"
                        v-if="priceSelectFilter(item)"
                    >
                        <img src="./images/icon_44_location@2x.png" />
                    </div>
                    <!-- warningType 510 、511单位选择 -->
                    <div
                        class="unit-select"
                        v-if="item.condition.trigger==510 || item.condition.trigger==511 || item.condition.trigger==502 || item.condition.trigger==503"
                        @click="unitSelectHandle(item,index,$event)"
                    >

                        <span class="unit-select-value">{{ getFlatName(item)}} </span>
                        <img
                            src="./images/unfold_small@3x.png"
                            class="switch-set-arrow unit-select-arrow"
                        />
                    </div>
                    <div>
                        <cube-switch
                            v-model="item.isvalid"
                            @input="switchChange"
                        >
                        </cube-switch>
                    </div>
                    <!-- 删除 -->
                    <div
                        class="switch-item-delete"
                        @click="deleteItemHandle(item,index)"
                    >
                    </div>
                </div>

            </div>
        </v-touch>
    </div>

</template>
<script>

import warningCoreData from '@warning/warningDataConfig'
import { getPriceWarningNameByTrigger, getWarningCondition, getPriceTriggerTypeByCode, priceWarningQuery } from '../../mapConfig.js'
import { iConsole, } from '@public/js/util.js'
export default {
    props: {
        data: {
            type: Array,
            required: true,
            default: []
        },
        priceVarData: {
            type: Object,
            required: true,
            default: {}
        },
        renderId: {
            type: Number,
            required: true,
            default: 1
        }
    },
    watch:{
        renderId(){
            this.data=[]
        }

    },
    computed: {
        getSwitchValue() {

        }
    },
    directives: {
    },
    methods: {
        switchChange(data) {
            this.$emit('switchChange')
        },
        inputBlurHandle(item, index) {
            if (item.hasOwnProperty('isShowTip')) {
                item['isShowTip'] = false;
            }
            this.$emit('inputBlur', item, index)
        },
        getShowTip({ isShowTip = false }) {
            return isShowTip
        },
        inputKeydown(e) {
            this.$emit('inputKeydown')
        },
        inputChange(item, index, target, type) {
            this.$emit('inputChange', item, index, target, type)
        },
        priceSelectFilter({ condition: { params } = {} }) {
            const { type = '' } = params;
            const arr = [5001, 5002, 5003, 5011, 5012, 5013]
            return arr.indexOf(Number(type)) >= 0
        },
        getFlatName({ condition: { params } = {} }) {
            const { flag = 1 } = params;
            return flag == 0 ? '%' : '点'
        },
        unitSelectHandle(item, index, e) {
            this.$emit('unitSelect', item, index, e)
        },
        onSwipeRight(index) {
            this.$emit('swipeRight', index)
        },
        onSwipeLeft(index) {
            this.$emit('swipeLeft', index)
        },
        // 删除数据
        deleteItemHandle(item, index) {
            this.$emit('delete', item, index)
        },
        setlectPriceHandle(item, index) {
            this.$emit('selectPrice', item, index);
        },
        // 根据触发类型返回是否显示下拉箭头
        isShowArrow({ condition = {} }) {
            const { params = {} } = condition
            const { type = '' } = params;
            return type == '' ? false : true
        },
        selectDrop(item, index) {
            const t = this;
            const { condition = {}, isvalid = 0 } = item
            if (!this.isShowArrow(item)) return false;
            const { trigger = '', params = {} } = condition;
            // 获取当前选择的类型（下拉选择的select）
            let selectIndex = 0;
            const selectData = getPriceTriggerTypeByCode(trigger);
            let actionSheetTitle = '';
            switch (trigger) {
                case 500: {
                    actionSheetTitle = '选择价格类型';
                    break;
                }
                case 501: {
                    actionSheetTitle = '选择价格类型';
                    break;
                }
                case 510: {
                    actionSheetTitle = '选择幅度类型';
                    break;
                }
                case 511: {
                    actionSheetTitle = '选择幅度类型';
                    break;
                }
                default: {
                    actionSheetTitle = '选择类型'
                }
            }
            selectData.forEach(({ type }, index) => {
                if (type == params.type) {
                    selectIndex = index
                }
            })
            // 创建选择项
            this.$createActionSheet({
                title: actionSheetTitle,
                active: selectIndex,
                data: selectData.map(item => ({ content: item.text, ...item })),
                onSelect: (selectItem, selectIndex) => {
                    t.data[index].condition.params.type = selectItem.type;
                    item.condition.params.target = ''
                },
                onCancel: () => {
                    // this.$createToast({
                    //     txt: `Clicked canceled`,
                    //     type: 'warn',
                    //     time: 1000
                    // }).show()
                }
            }).show()
        }
    },
    filters: {

        // 匹配单位code
        getLableName({ condition: { params, trigger = '' }, warning_type = '' }) {
            const priceTrigger = warningCoreData.triggerType
            const { type = '', target = '' } = params;
            let warningItem = '';
            // 末尾添加“至”字类型
            const _changeTextTypeArr = [5001, 5002, 5003, 5011, 5012, 5013];
            if (type == '' && trigger != '') {
                warningItem = getWarningCondition(trigger, warning_type)
                if (!!warningItem) {
                    return warningItem.text
                } else {
                    return ''
                }
            } else {
                try {
                    if (_changeTextTypeArr.indexOf(type) >= 0) {
                        // return getPriceWarningNameByTrigger(type).text + '至'
                        return getPriceWarningNameByTrigger(type).text
                    } else {
                        return getPriceWarningNameByTrigger(type).text
                    }
                    // return getPriceWarningNameByTrigger(type).text
                } catch (e) {
                    return '';
                    iConsole('获取触发类型出错了')
                }
            }
        },
        // 获取input placeholder
        getPlaceholder({ condition: { params = {} }, comment = '', trigger = '' }) {
            const { type = '', flag = 1 } = params;
            const { addPriceWarningData = [], triggerData = [] } = warningCoreData.newPriceWarningConfig
            if (type !== '') {
                if (trigger == 510 || trigger == 511) {
                    return flag == 1 ? '0.0' : '0.00'
                } else {
                    const filterByType = priceWarningQuery({ table: 'triggerData', field: 'type', value: type });
                    return filterByType[0].placeholder
                }

            } else {
                // 上涨超过、下跌超过
                if (trigger == 502 || trigger == 503) {
                    return flag == 1 ? '0.0' : '0.00'
                }
            }


        }
    },
    mounted() {
        this.$refs.myPopup4.show()
    },
    directives: {
        number: {
            // 指令的定义
            update: function (el, binding, vnode) {
                //    debugger
            }
        }
    }
    //
}
</script>
<style lang="scss" scoped>
@import "@public/css/warningGlobal.scss";
.switch-set-touch {
    width: 100%;
}
.switch-set {
    display: flex;
    justify-content: space-between;
    margin-left: $commonSpace;
    height: 1rem;
    padding-right: $commonSpace;
    align-items: center;
    border-bottom: 1px solid $commonColorDarkBalck;
    font-size: $commonFsMedium;
    // border-bottom: 2px solid $commonColorDarkBalck;
}
.switch-set-contanier {
    .switch-set-touch {
        &:first-child {
            .switch-set {
                // border-top: 2px solid $commonColorDarkBalck;
            }
        }
    }
}
.switch-set-center {
    flex: 3;
    position: relative;
}
.switch-set-left {
    display: flex;
    flex: 3;
}
.switch-set-right {
    // flex: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 2rem;
}
.switch-set-input {
    background: none;
    border: none;
    box-sizing: border-box;
    // padding: 0 16px;
    width: 100%;
    color: #fff;
}
.switch-set-select {
    img {
        width: 0.44rem;
    }
}
.switch-set-label {
    color: #fff;
}
.switch-set-arrow {
    width: 0.24rem;
    height: 0.32rem;
    margin-left: 6px;
}
.flex-align-right {
    justify-content: flex-end;
}
.unit-select {
    margin-right: 10px;
    margin-top: -3px;
}
.unit-select-value {
    color: $commonFsColorGray2;
    font-size: $commonFsSmall;
    vertical-align: middle;
}
.switch-item-delete {
    background-color: $commonFsColorRed;
    background-image: urlPrefix("static/img/warning/delete@2x.png");
    background-size: 0.44rem;
    background-repeat: no-repeat;
    background-position: center center;
    height: 1rem;
    width: 1.8rem;
    display: none;
    margin-left: 0.44rem;
}
.delete-mark {
    padding-right: 0;
    margin-left: 0;
    .switch-item-delete {
        display: block;
    }
    .switch-set-left {
        display: none;
    }
    .switch-set-input {
        padding-left: 0;
    }
    .switch-set-center {
        flex: 2;
    }
    .switch-set-right {
        width: auto;
        flex: 3;
    }
}
.set-price-warning-mask {
    position: absolute;
    width: 100vh;
    width: 100vw;
    background: #000;
    z-index: 2000;
}
.input-price-tip {
    position: absolute;
    left: -50px;
    top: -40px;
    // min-width: 2.68rem;
    padding: 0 12px;
    height: 0.62rem;
    line-height: 0.62rem;
    background: #707180;
    border-radius: 0.5rem;
    color: #202029;
    font-size: $commonFsSmall;
    white-space: nowrap;
    text-align: center;
    .input-price-tip-arrow {
        width: 10px;
        height: 10px;
        background: #707180;
        position: absolute;
        bottom: -4px;
        left: 50%;
        margin-left: -5px;
        transform: rotate(45deg);
    }
}
// .switch-set-left,
// .switch-set-right,
// .switch-set-center {
//     pointer-events: none;
// }
// .switch-set-right {
//     .cube-switch {
//         pointer-events: fill;
//     }
// }
.unit-select-arrow {
    // margin-top:2px;
    margin-left: 0;
    position: relative;
    top: 3px;
}
</style>
<style lang="scss">
.cube-switch .cube-switch-ui::before {
    background-color: #2e2e3b !important;
}
.switch-set {
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
</style>