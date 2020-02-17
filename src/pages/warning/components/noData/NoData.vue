<template>
    <div
        class="no-data-container"
        :style="{'width':width}"
    >
        <img
            :src="iconPath"
            class="no-data-img"
        />
        <div class="no-data-text">{{text}}</div>
    </div>
</template>
<script>
export default {
    props: {
        width: {
            type: String,
            required: false,
            default: '1.6rem'
        },
        text: {
            type: String,
            required: false,
            default: '暂无数据'
        },
        iconPath: {
            type: String,
            required: false,
            default: "static/img/warning/icon_no_following@2x.png"
        }
    }
}
</script>

<style lang="scss" scoped>
.no-data-container {
    margin-top: 1rem;
    margin-bottom: 1rem;
    width: 0.6rem;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    .no-data-text {
        color: #575766;
        font-size: 0.3rem;
    }
    .no-data-img {
        width: 100%;
        opacity: 0.3;
    }
}
</style>

