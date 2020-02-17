<template>
    <router-link :to="path">
        <div class="open-wechat-entrance"><span class="open-wechat-entrance-text" v-html="text"></span><span class="open-wechat-entrance-arrow">></span></div>
    </router-link>
</template>
<script>
export default {
    props: {
        path: {
            type: Object,
            required: false,
            default: function () {
                return {
                    name: 'weChatNotice'
                }
            }
        },
        text: {
            type: String,
            required: false,
            default:'开通微信通知，获利机会将提升<span style="color:#FF9F00">50%</span><sup style="vertical-align:super;color:#FF9F00">+</sup>'
        }
    }
}
</script>

<style lang="scss" scoped>
.open-wechat-entrance {
    margin: 0.16rem 0.28rem;
    background: rgba(61, 61, 77, 1);
    height: 0.8rem;
    border-radius: 0.08rem;
    text-align: left;
    font-size: 0.28rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 0.8rem;
    padding: 0 0.2rem;
    box-sizing: content-box;
    display: flex;
    justify-content: center;
    align-items: center;
    .open-wechat-entrance-text {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis
    }
    .open-wechat-entrance-arrow {
        width: 0.4px;
        text-align: right;
        margin-right: 0.2rem;
        color: #8b8e99;
        opacity: 0.8;
    }
}
</style>
