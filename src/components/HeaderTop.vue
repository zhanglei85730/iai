<template>
    <div class="common-header">{{title}}</div>
</template>
<style lang="scss" scoped="" type="text/css">
@import "@public/css/appGlobal.scss";
.common-header {
    height: 2rem;
    background: $commonColorBlur;
    text-align: center;
    line-height: 2rem;
    color: #fff;
    font-size: 0.6rem;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 20000000;
}
</style>
<script>
export default {
    props: {
        title: {
            type: Array,
            required: true,
            default: '标题'
        },
    }
}
</script>

