<template>
    <div
        class="set-btn"
        v-show="visible"
    >
        <!-- <img src="./img/set_icon@3x.png"  class="set-btn-img"/> -->
        {{text}}
    </div>
</template>
<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: true,
            required: false
        },
        text: {
            type: String,
            default: '切换平台',
            required: false
        }
    }
}
</script>
<style lang="scss" scoped>
.set-btn {
    padding-left: 10px;
    text-align: right;
    color: #fff;
    font-size: 0.28rem;
}
.set-btn-img {
    width: 0.44rem;
    height: 0.44rem;
    vertical-align: middle;
}
</style>