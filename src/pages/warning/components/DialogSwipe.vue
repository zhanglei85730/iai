<template>
    <cube-popup
        type="my-popup"
        :ref="$props.sialogSwipeRef"
    >

        <div class="dialog-swipe-containeer">
            <v-touch
                @swipeleft="onSwipeLeft"
                @swiperight="onSwipeRight"
                :swipe-options="{direction: 'horizontal'}"
            >
                <div class="dialog-swipe-box">
                    <div
                        class="dialog-swipe-item"
                        v-show="currentIndex==index"
                        v-for="(item,index) in slotCount"
                        :key="index"
                    >
                        <slot :name="`swipe-item-${index}`"></slot>
                    </div>
                </div>
            </v-touch>
            <div class="swipe-dots-box">
                <span
                    v-for="(item,index) in slotCount"
                    :key="index"
                    class="swipe-dots-item"
                    :class="{'current':currentIndex==index}"
                ></span>
            </div>
        </div>
        <div class="dialog-swipe-center">
            <img
                src="static/img/warning/modal_button_close@2x.png"
                class="dialog-swipe-close"
                @click="closePopup"
            />
        </div>

    </cube-popup>
</template>
<script>
import { trackEventGeneral } from '@public/js/util.js'
const globalConsts = require('@public/js/consts.js')
export default {
    data() {
        return {
            currentIndex: 0,
        }
    },
    props: {
        slotCount: {
            type: Number,
            required: true,
            default: 2
        },
        sialogSwipeRef: {
            type: String,
            required: true,
        },
        changeId: {
            type: Number,
            required: true,
        }
    },
    mounted: function () {
        // this.$refs.dialogSwipe.show()
    },
    methods: {
        closePopup() {
            this.$refs[this.$props.sialogSwipeRef].hide()
        },
        showPopup(refId) {
            const component = this.$refs[refId]
            component.show()
        },
        onSwipeLeft() {
            if (this.currentIndex < this.$props.slotCount - 1) {
                this.currentIndex = this.currentIndex + 1
            }
        },
        onSwipeRight() {
            if (this.currentIndex >= 1) {
                this.currentIndex = this.currentIndex - 1
            }
        },
        getTrackEventName(tabIndex = 0) {
            let _currentTabType = '';
            // 综合评分
            if (this.sialogSwipeRef == globalConsts.dialogSwipeRefName.allScore) {
                switch (tabIndex) {
                    // 超短线
                    case 0: {
                        _currentTabType = 'View_Sore_info';
                        break;
                    }
                    //短线
                    case 1: {
                        _currentTabType = 'View_Winrate_info';
                        break
                    }
                    // 做空
                    case 2: {
                        _currentTabType = 'View_Expect_info';
                        break
                    }
                }
                // 下单盈亏比说明
            } else if (this.sialogSwipeRef == globalConsts.dialogSwipeRefName.winOrLoss) {
                switch (tabIndex) {
                    // 查看【盈亏分布图】说明
                    case 0: {
                        _currentTabType = 'View_LPMap_info';
                        break;
                    }
                    //查看【下单盈亏】说明
                    case 1: {
                        _currentTabType = 'View_Ratio_info';
                        break
                    }
                    // 查看【预估收益点数】说明
                    case 2: {
                        _currentTabType = 'View_ExpectPoint_info';
                        break
                    }
                    // 查看【通知平均等待时间】说明
                    case 3: {
                        _currentTabType = 'View_NoticeTime_info';
                        break
                    }
                    // 查看【止损止盈点数区间】说明
                    case 4: {
                        _currentTabType = 'View_LPRange_info';
                        break
                    }
                }
            }
            return _currentTabType
        }
    },
    watch: {
        changeId(newval, oldval) {
            this.showPopup(this.$props.sialogSwipeRef)
        },
        currentIndex(val, oldval) {
            // 数据埋点手指切换
            const evnetName = this.getTrackEventName(val);
            if (evnetName !== '') {
                trackEventGeneral(evnetName)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.dialog-swipe-containeer {
    width: 6rem;
    min-height: 4rem;
    background: #2e2e3b;
    border-radius: 0.14rem;
    color: #8b8e99;
    padding: 0.4rem;
    box-sizing: border-box;
    font-size: 0.26rem;
    line-height: 0.39rem;
    overflow: auto;
}
.dialog-swipe-box {
    min-height: 5rem;
    overflow: auto;
}
.swipe-dots-box {
    text-align: center;
    .swipe-dots-item {
        display: inline-block;
        width: 0.12rem;
        height: 0.12rem;
        border-radius: 0.12rem;
        margin: 0 0.1rem;
        background: rgba(255, 255, 255, 0.2);
    }
    .current {
        background: #fff;
    }
}
.dialog-swipe-center {
    text-align: center;
    margin-top: 0.6rem;
}
.dialog-swipe-close {
    width: 0.96rem;
}
</style>


