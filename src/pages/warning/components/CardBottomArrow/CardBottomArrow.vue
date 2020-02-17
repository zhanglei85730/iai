<template>
    <div
        class="item-5"
        @click="tabListItemExplode"
        v-if="$props.visible"
    >
        <img
            src="./images/arrows_down.png"
            alt=""
            class="item-5-arrow"
            :class="{'item-5-arrow-up':$props.isArrowUp}"
        />
    </div>
</template>
<script>
import {trackEventGeneral} from '@public/js/util.js'
export default {
    data() {
        return {
            arrowUp: false,
        }
    },
    props: {
        isArrowUp: {
            type: Boolean,
            required: false,
            default: false,
        },
        visible: {
            type: Boolean,
            required: false,
            default: true,
        }
    },
    methods: {
        // tab内容List item底部点击展开
        tabListItemExplode() {
            // this.arrowUp = !this.arrowUp;
            // 埋点统计图表下面数据的展开收拢
            if(this.arrowUp){
                 trackEventGeneral('Click_To_ExpandCard')
            }else{
                 trackEventGeneral('Click_To_CollapseCard')
            }
            // this.$emit('clicHandle', this.arrowUp)
             this.$emit('clicHandle')
        },
    },
    mounted: function () {
        // if (this.$props.isArrowUp === true) {
        //     this.arrowUp = true
        // }
    },
}
</script>
<style lang="scss" scoped>
.item-5 {
    text-align: center;
    height: 0.5rem;
    clear: both;
    width: 100%;
    position: relative;
    // transform: perspective(1000);
    .item-5-arrow {
        width: 0.28;
        height: 0.36rem;
        // position: absolute;
        // bottom:-0.1rem;
        // left: 50%;
        // margin-left:-0.14
        position: relative;
        top: 0.18rem;
    }
    .item-5-arrow-up {
        // ios不支持rotateX
        transform: rotate(180deg);
        transform-origin: center center;
    }
}
</style>


