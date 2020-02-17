<template>
    <div class="success-container">
        <div class="icon-box" :class="type?'success-icon':'fail-icon'" :style="{width,height}"></div>
        <div class="success-txt">{{text}}</div>
    </div>
</template>
<script>
export default {
    props: {
        width: {
            type: String,
            required: true,
            default: '200px',
        },
        height: {
            type: String,
            required: true,
            default: '200px',
        },
        text: {
            type: String,
            required: false,
        },
        // 显示类型 错误或成功提示
        type: {
            type: Boolean,
            required: true,
            default: true
        }
    }
}
</script>

<style scoped lang="scss">
.success-container {
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    .icon-box {
        background-size: contain;
        width: 100%;
        margin-left: auto;
        margin-right: auto;
    }
    .success-icon {
        background: url("images/icon_success.png") center center no-repeat;
         background-size: contain;
    }
    .fail-icon {
        background: url("images/icon_fail.png") center center no-repeat;
        background-size: contain;
    }
    .success-txt {
        margin-top: 0.4rem;
        color: #fff;
    }
}
</style>

