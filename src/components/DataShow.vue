<template>
    <div class="data-show-container">
        <ul class="data-show-ul">
            <li
                v-for="(item,index) in data"
                :key="index"
                class="data-show-row"
                :class="{lastitem:item.hasOwnProperty('leftFlex')}"
            >
                <div
                    class="data-show-item data-show-left"
                    v-html="item.left"
                    :style="item.hasOwnProperty('leftFlex')?`flex:${item.leftFlex}`:''"
                >{{item.left}}</div>
                <div
                    class="data-show-item data-show-right"
                    v-html="item.right"
                    :style="item.hasOwnProperty('rightFlex')?`flex:${item.rightFlex}`:''"
                >{{item.right}}</div>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props: {
        data: {
            type: Array,
            required: true
        }
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
    .data-show-row {
        display: flex;
        margin-left: 0.3rem;
        padding-right: 0.3rem;
        border-bottom: 1px solid #3d3d4d;
    }
    .data-show-row:first-child {
        border-top: 1px solid #3d3d4d;
    }
    .data-show-item {
        line-height: 1rem;
    }
    .data-show-left {
        color: #fff;
        text-align: left;
        flex: 1;
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
}
</style>

