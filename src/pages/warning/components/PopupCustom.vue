<template>
    <cube-popup
        type="my-popup"
        :visible="popVisible"
    >

        <div class="dialog-swipe-containeer wechat-open-box">
            <!-- <p class="wechat-open-01">盯盘触发后未收到通知，<br />错过重要机会？</p>
            <h2 class="wechat-open-02">开通微信通知<br />买卖信号更及时</h2>
            <p class="wechat-open-03">将为您提升50%获利概率</p>
            <button
                class="common-button-style01 wechat-open-button"
                @click="openWechat"
            >开通</button> -->
            <router-link :to="{path:'/weChatNotice'}"><img src="static/img/warning/pop_wechat_alert@2x.png" class="pop_wechat_banner" /></router-link>
        </div>
        <div class="dialog-swipe-center">
            <img
                src="static/img/warning/modal_button_close@2x.png"
                class="dialog-swipe-close"
                @click="closePopup"
            />
        </div>
    </cube-popup>
</template>
<script>
export default {
    data() {
        return {
            currentIndex: 0,
            popVisible: false
        }
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        }
    },
    created: function () {
        this.popVisible = this.$props.visible
    },
    methods: {
        closePopup() {
            // this.$refs[this.$props.sialogSwipeRef].hide()
            this.popVisible = false
            // this.$emit('close')
            // this.$props.visible=false;
        },
        openWechat() {
            this.$router.push('/weChatNotice')
        }
    },
    watch: {
        changeId(newval, oldval) {
            this.showPopup(this.$props.sialogSwipeRef)
        }
    }
}
</script>
<style lang="scss" scoped>
.pop_wechat_banner{
    width:5.4rem;
    height:6.4rem
}
.dialog-swipe-containeer {
    width: 5.4!important;
    min-height: 5.5rem;
    background: none!important;
    border-radius: 0.14rem;
    color: #8b8e99;
    padding:0;
    box-sizing: border-box;
    font-size: 0.26rem;
    line-height: 0.39rem;
    overflow: auto;
}
.dialog-swipe-box {
    min-height: 5rem;
    overflow: auto;
}
.dialog-swipe-center {
    text-align: center;
    margin-top: 0.6rem;
}
.dialog-swipe-close {
    width: 0.96rem;
}
.wechat-open-01 {
    font-size: 0.24rem;
}
.wechat-open-02 {
    margin-top: 0.3rem;
    font-size: 0.4rem;
    color: #fff;
    line-height: 0.56rem;
}
.wechat-open-03 {
    margin-top: 0.5rem;
}
.wechat-open-box {
    text-align: center;
}
.wechat-open-button {
    margin-top: 0.5rem;
}
</style>


