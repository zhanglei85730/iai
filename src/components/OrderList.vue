<template>
    <!-- 订单信息 -->
    <div class="data-show-container">
        <div v-if="data.length>0">
            <ul
                class="data-show-ul"
                v-for="(item,index) in data"
                :key="index"
            >
                <div
                    v-for="(innerItem,innnerIndex) in forCount"
                    :key="innnerIndex"
                    :class="{'data-show-section':innnerIndex==0}"
                >
                    <li
                        v-if="innnerIndex==0"
                        class="data-show-row"
                    >
                        <div class="data-show-item data-show-left">
                            <span class="common-order-info-oprate-type">{{item.type}}</span>
                            {{item.symbol}}
                            <span class="common-data-show-split"></span>
                            {{item.volume}}手
                            <span class="common-data-show-split"></span>
                            {{moneyFormat(item.profit)}}
                        </div>
                    </li>
                    <li
                        v-if="innnerIndex==1"
                        class="data-show-row"
                    >
                        <div class="data-show-item data-show-left">
                            <span
                                class="show-data-sub-title"
                                style="color:#757786;margin-right:0.2rem"
                            >开仓</span>
                            {{item.open_price}}
                        </div>
                        <div class="data-show-item data-show-right">{{item.open_time}}</div>
                    </li>
                    <li
                        v-if="innnerIndex==2"
                        class="data-show-row"
                    >
                        <div class="data-show-item data-show-left">
                            <span
                                class="show-data-sub-title"
                                style="color:#757786;margin-right:0.2rem"
                            >平仓</span>
                            {{item.closed_price}}
                        </div>
                        <div class="data-show-item data-show-right">{{item.close_time}}</div>
                    </li>
                    <li
                        v-if="innnerIndex==3"
                        class="data-show-row"
                        :class="{'data-show-last-li':innnerIndex==3}"
                    >
                        <div class="data-show-item data-show-left">
                            <span
                                class="show-data-sub-title"
                                style="color:#757786;margin-right:0.2rem"
                            >止盈</span>
                            {{item.tp}}
                            <span class="common-data-show-split"></span>
                            <span
                                class="show-data-sub-title"
                                style="color:#757786;margin-right:0.2rem"
                            >止损</span>
                            {{item.sl}}
                        </div>
                    </li>
                </div>
            </ul>
        </div>
        <div
            v-else
            class="data-show-no-data"
        >
            暂无数据
        </div>
    </div>
</template>
<script>
import { getMoneyAmount } from '@public/js/util.js'
export default {
    props: {
        data: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            forCount: 4
        }
    },
    methods: {
        moneyFormat(value) {
            return getMoneyAmount(value)
        }
    },
    computed: {

    }
};

</script>
<style scoped lang="scss">
$primaryColor01: #5291ff;
$primaryColor: #f5a623;
$borderWidth: 0.02rem;
// 灰色边框
$borderColorGray: #3d3d4d;
.data-show-container {
    .data-show-ul{
        border-top:1px solid #3d3d4d;
        margin-top: 0.14rem;
    }
    .data-show-row {
        display: flex;
        margin-left: 0.3rem;
        padding-right: 0.3rem;
        border-bottom: 0.02rem solid #3d3d4d;
    }
    .data-show-item {
        line-height: 1rem;
    }
    .data-show-left {
        color: #fff;
        text-align: left;
        flex: 1;
    }
    .data-show-flex0 {
        flex: 0;
    }
    .data-show-right {
        color: #8b8e99;
        text-align: right;
        flex: 1;
    }
    .lastitem {
        margin-left: 0;
        margin-right: 0;
        padding: 0 0.3rem;
    }
    .data-show-section {
        // margin-top: 0.3rem;
    }
    .data-show-last-li {
        margin-left: 0;
        margin-right: 0;
        padding: 0 0.3rem;
    }
    .common-data-show-split {
        display: inline-block;
        height: 0.4rem;
        width: 0.02rem;
        border-left: 1px solid #555;
        transform: rotate(20deg);
        position: relative;
        top: 6px;
        margin-left: 0.2rem;
        margin-right: 0.1rem;
    }
    .common-order-info-oprate-type {
        border: 1px solid $primaryColor;
        color: $primaryColor;
        padding: 0 0.1rem;
        font-size: 0.2rem;
        margin-right: 0.2rem;
        vertical-align: top;
    }
    .data-show-no-data {
        text-align: center;
        color: #8b8e99;
        margin-top: 0.8rem;
        font-size: 0.3rem;
    }
}
</style>


