<template>
    <div class="drop-menu" v-show="visible">
        <div class="drop-menu-arrow" :style="arrowStyle"></div>
        <ul>
            <li
                v-for="(item,index) in data"
                :key="index"
                class="drop-menu-item"
                @click="dropMenuItemSelect(item,index)"
            >
                <div class="drop-menu-item-icon">
                    <img :src="item.icon" v-if="item.hasOwnProperty('icon') && item.icon!=''"/>
                    <i class="cubeic-back icon-color" v-else></i>
                    </div>
                <div class="drop-menu-item-text">{{item.text}}</div>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props: {
        data: {
            type: Array,
            required: false,
            default: [
                {
                    text: '文字内容',
                    icon: 'd'
                },
                {
                    text: '文字内容',
                    icon: 'd'
                },
            ]
        },
        visible:{
            type:Boolean,
            required:false,
            default:false
        },
        arrowStyle:{
            type:Object,
            required:false,
            default:()=>{}
        }
    },
    methods:{
        dropMenuItemSelect(item,index){
            this.$emit('select',item,index)
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@public/css/warningGlobal.scss";
$background:#2E2E3B;
// 单位选择弹出框
.drop-menu {
    min-width: 2.28rem;
    z-index: 20000;
    position: absolute;
    // left: 10px;
    top: 10px;
    background: $background;
    border-radius: 0.08rem;
}
.drop-menu-item {
    height: 0.86rem;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #24242e;
    align-content: center;
    padding: 0 0.2rem;
}
.drop-menu-item-text {
    color: #fff;
    font-size: $commonFsMedium;
    text-align: left;
}
.drop-menu-item-icon,
.drop-menu-item-text {
    display: flex;
    justify-content: left;
    align-items: center;
}
.drop-menu-item-icon {
    width: 0.44rem;
    img{
        width:100%
    }
}
.drop-menu-item-text {
    flex: 2;
    padding-left:0.2rem;
}
.icon-color {
    color: $commonColorBlur;
}
.drop-menu-arrow {
    width: 12px;
    height: 10px;
    // border-width: 0 10px 10px;
    background-color: $background;
    border-color: $background;
    position: absolute;
    border-style: solid;
    top:-0.06rem;
    left: 50%;
    margin-left: -3px;
    transform: rotate(45deg);
}
</style>