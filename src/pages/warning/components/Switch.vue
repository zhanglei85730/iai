<template>
    <div class="tab-custom">
        <div class="tab-custom-box">
            <button
                v-for="(item,index) in data"
                :key="index"
                class="tab-custom-item"
                :class="selectValue==item.value?'current':''"
                @click="onClickHandle(item,index)"
            >
                {{item.text}}
            </button>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        // 当前激活的tab item索引
        selectValue: {
            type: [Number, String],
            required: true,
            default: 0
        },
        data: {
            type: Array,
            required: true,
            default: [{}]
        },
    },
    methods: {
        onClickHandle(params, index) {
            this.$emit('select', Object.assign(params, { index }))
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@public/css/warningGlobal.scss";
$itemHeight: 28px;
.tab-custom-box {
    display: flex;
    min-width: 1.3rem;
    .tab-custom-item:first-child {
        border-right: none;
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
    }
    .tab-custom-item:last-child {
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
    }
    .tab-custom-item {
        flex: 1;
        // background: none;
        // border: 1px solid $commonFsColorGray;
        border-radius: 0.06rem;
        height: $itemHeight;
        line-height: $itemHeight;
        text-align: center;
        width: 100%;
        height: 0.48rem;
        line-height: 0.48rem;
        color: #4c94ff;
        padding: 0 0.13rem;
        outline: none;
    }
    .current {
        // background: $commonFsColorGray;
        color: #2e2e3b;
    }
}
</style>


