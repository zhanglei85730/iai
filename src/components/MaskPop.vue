<template>
    <div
        class="mask-container"
        :style="{height:maskContaner}"
        v-show="visible"
        :class="{'web-popularize':isWebPopularize}"
    >
        <div
            class="mask"
            :style="getMaskCss"
            @click="onMaskClick"
        ></div>
        <div class="mask-content" :style="{[position]:0}">
            <slot name="content"></slot>
        </div>

    </div>
</template>
<script>
import { isWebPopularize } from '@public/js/util.js'
export default {
    props: {
        visible: {
            type: Boolean,
            required: false,
            default: false
        },
        opacity: {
            type: Number,
            required: false,
            default: 0.6
        },
        zIndex: {
            type: [Number, String],
            required: false,
            default: 4
        },
        maskClosabl: {
            type: Boolean,
            required: false,
            default: false
        },
        position: {
            type: String,
            required: false,
            default: 'default'
        }
    },
    data() {
        return {
            maskContaner: '100vh',
            isWebPopularize:false
        }
    },
    created(){
       if(isWebPopularize()){
          this.isWebPopularize=true
       }
    },
    computed: {
        getMaskCss() {
            return Object.assign({
                opacity: 0.6
            }, {
                opacity: this.opacity,
                zIndex: this.zIndex,
            })
        }
    },
    methods: {
        onMaskClick() {
            this.$emit('maskClick')
        },
        getScrollTop() {
            var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            return scrollTop
        },
    },
    watch: {
        visible(newval, oldval) {
            this.maskContaner = document.body.clientHeight + this.getScrollTop() + 'px';
            if (newval) {
                document.querySelector('body').style.overflow = 'hidden'
            } else {
                document.querySelector('body').style.overflow = ''
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.mask-container {
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 200;
    left: 0;
    top: 0;
    overflow: hidden!important;
}
.mask {
    position:fixed;
    width: 100vw;
    height: 100%;
    background: #000;
    z-index: 5;
    left: 0;
    top: 0;
}
.mask-content {
    width: 100%;
    // height: 100vh;
    z-index: 201;
    left: 0;
    position: absolute;
}
.web-popularize{
    width:100%!important;
    overflow:hidden!important;
    .mask-content{
        width:700px!important;
        left:50%;
        bottom:5px;
        margin-left:-350px;
        position: fixed;
    }
    .top-sticky{
        position: static!important
    }
    .mask{
        overflow:hidden!important
    }
}
</style>

