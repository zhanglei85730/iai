<template>
    <div class="drawer-title-container">
        <div class="drawer-title-left" @click="onDrawerBack"><i class="cubeic-back drawer-title-icon"></i></div>
        <div class="drawer-title-txt">{{title}}</div>
        <div class="drawer-title-right"></div>
    </div>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            required: true,
            default: '需要props标题'
        }
    },
    methods:{
        onDrawerBack(){
            this.$emit('drawerBack')
        }
    }
}
</script>

<style lang="scss" scoped lang="scss">
@import "@public/css/global.scss";
.drawer-title-icon{
    color: $commonColorBlur;
}
.drawer-title-container {
    display: flex;
    .drawer-title-left,.drawer-title-right{
        width: 40px;
    }
    .drawer-title-txt {
        flex: 1;
        text-align: center;
        font-size:$commonFsTitleMedium
    }
}
</style>

