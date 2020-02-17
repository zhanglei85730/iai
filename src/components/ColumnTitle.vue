<template>
    <div class="columen-title">
        <div class="columen-title-left" :style="{flex:leftFlex}">
            <div
                class="columen-title-icon1"
                v-if="iconType==1"
            ></div>
            <div
                class="columen-title-icon2"
                v-else
            ></div>
            <div class="columen-title-txt">{{title}}</div>
        </div>
        <div class="columen-title-right" :style="{flex:rightFlex}">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'columenTitle',
    props: {
        // 银行卡数据列表
        title: {
            type: String,
            required: true
        },
        iconType: {
            type: String,
            required: true
        },
        leftFlex:{
              type: Number,
            required: false,
            default:1
        },
         rightFlex:{
              type: Number,
            required: false,
            default:1
        }
    },
    data() {
        return {
            msg: 'Welcome to Your Vue.js App'
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "@public/css/global.scss";
.columen-title {
    display: flex;
    width: 100%;
    .columen-title-icon1 {
        display: inline-block;
        width: 0.2rem;
        background: #f5a623;
        width: 0.2rem;
        height: 0.3rem;
    }
    .columen-title-icon2 {
        display: inline-block;
        width: 0.2rem;
        background: #5291ff;
        width: 0.2rem;
        height: 0.06rem;
        vertical-align: middle;
        position: relative;
        top: -3px;
    }
    .columen-title-left,
    .columen-title-right {
        flex: 1;
    }
    .columen-title-txt {
        color: #fff;
        height: 0.7rem;
        line-height: 0.7rem;
        text-align: left;
        font-size: $commonFsTitleMedium;
        display: inline-block;
        margin-left:4px;
        font-weight:900
    }
}
</style>
