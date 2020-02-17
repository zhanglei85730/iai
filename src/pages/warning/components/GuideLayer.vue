<template>
    <cube-popup
        type="guideLayerType"
        ref="guideLayer"
        :visible="visible"
        class="guide-layer"
    >
        <div class='guide-box'>
            <!-- 01 -->
            <div
                class="mask-hight-light mask-hight-light01"
                @click="toGuide(2)"
                v-if="currentIndex==1"
            ></div>
            <div
                class="guide-txt guide-txt01"
                v-if="currentIndex==1"
            >
                {{$t('guideLayer01.text01')}}<br />
                 {{$t('guideLayer01.text02')}}<br />
            </div>
            <div
                class="guide-txt guide-txt01-02"
                v-if="currentIndex==1"
            >
             {{$t('guideLayer01.text03')}}<br/>
                <div
                    class="guide-btn"
                    @click="toGuide(2)"
                > {{$t('guideLayer01.text04')}}</div>
            </div>
            <!-- 02 /////////////////-->
            <div
                class="mask-hight-light mask-hight-light02"
                @click="toGuide(3)"
                v-if="currentIndex==2"
            ></div>
            <div
                class="guide-txt guide-txt02"
                v-if="currentIndex==2"
            >
                 {{$t('guideLayer01.text05')}}<br />
                 {{$t('guideLayer01.text06')}}
                <div
                    class="guide-btn"
                    @click="toGuide(3)"
                > {{$t('guideLayer01.text04')}}</div>
            </div>
            <!-- 03 -->
            <div
                class="mask-hight-light mask-hight-light03"
                @click="toGuide(4)"
                v-if="currentIndex==3"
            ></div>
            <div
                class="guide-txt guide-txt03"
                v-if="currentIndex==3"
            >
                 {{$t('guideLayer01.text07')}}<br />
                 {{$t('guideLayer01.text08')}}
                <div
                    class="guide-btn"
                    @click="toGuide(4)"
                > {{$t('guideLayer01.text04')}}</div>
            </div>
            <!-- 04 -->
            <div
                class="mask-hight-light mask-hight-light04"
                @click="toGuide(5)"
                v-if="currentIndex==4"
            ></div>
            <div
                class="guide-txt guide-txt04"
                v-if="currentIndex==4"
            >
                 {{$t('guideLayer01.text09')}}<br /> {{$t('guideLayer01.text10')}}
                <div
                    class="guide-btn"
                    @click="toGuide(5)"
                > {{$t('guideLayer01.text04')}}</div>
            </div>
            <img
                src="static/img/warning/guide_1.png"
                class="guide01 guide-item"
                v-if="currentIndex==1"
            >
            <img
                src="static/img/warning/guide_2.png"
                class="guide02  guide-item"
                v-if="currentIndex==2"
            >
            <img
                src="static/img/warning/guide_3.png"
                class="guide03  guide-item"
                v-if="currentIndex==3"
            >
            <img
                src="static/img/warning/guide_4.png"
                class="guide03  guide-item"
                v-if="currentIndex==4"
            >
            <!-- <div class='guide-btns'>
                <button
                    class='common-button-style02 guide-btns-item'
                    @click="skipHandle"
                >{{$t("guideLayer.jumpOver")}}</button>

                <button
                    v-if="currentIndex==3"
                    class='common-button-style01  guide-btns-item'
                    @click="nextHandle"
                >{{$t("guideLayer.finishBtn")}}({{currentIndex}}/3)</button>
                <button
                    v-else
                    class='common-button-style01  guide-btns-item'
                    @click="nextHandle"
                >{{$t("guideLayer.nextStep")}}({{currentIndex}}/3)</button>
            </div> -->
        </div>
    </cube-popup>
</template>
<script>
import i18n from '@warning/i18n'
export default {
    props: {
        visible: {
            type: Boolean,
            required: false,
            default: false
        },
    },
    data() {
        return {
            currentIndex: 1,
        }
    },
    methods: {
        toGuide(num) {
            if (num == 5) {
                this.$refs.guideLayer.hide()
            } else {
                this.currentIndex = num
            }

        },
    },
    i18n
}
</script>

<style lang="scss">
@import "@public/css/global.scss";
.cube-guideLayerType {
    .cube-popup-mask {
        opacity: 0.8 !important;
    }
}
.guide-layer {
    .mask-hight-light {
        position: absolute;
        // background: #ccc;
        z-index: 1000;
    }
    .mask-hight-light01 {
        width: 100%;
        height: 0.8rem;
        top: 3.22rem;
        left: 0;
    }
    .mask-hight-light02 {
        width: 3.6rem;
        height: 0.9rem;
        top: 4.1rem;
        left: 0;
    }
    .mask-hight-light03 {
        width: 2.6rem;
        height: 1.1rem;
        top: 6rem;
        left: 0;
    }
    .mask-hight-light04 {
        width: 100%;
        height: 0.94rem;
        top: 8.1rem;
        left: 0;
    }
    .guide-txt {
        color: #fff;
        position: absolute;
        width: 100px;
        line-height: 0.48rem;
        z-index: 1000;
        text-align: right;
        font-size: 0.32rem;
        height: 0.96rem;
        font-weight: 500;
    }
    .guide-txt01 {
        right: 0.28rem;
        top: 1.7rem;
        width: 4rem;
        text-align: right;
    }
    .guide-txt01-02 {
        right: 0.28rem;
        top: 5.6rem;
        width: 6rem;
        text-align: right;
    }
    .guide-txt02 {
        top: 5.48rem;
        width: 5rem;
        left: 0.28rem;
        text-align: left;
    }
    .guide-txt03 {
        top: 7.48rem;
        width: 5.4rem;
        left: 0.28rem;
        text-align: left;
    }
    .guide-txt04 {
        top: 9.4rem;
        width: 4.3rem;
        right: 0.28rem;
        text-align: right;
    }
    .guide-btn {
        margin-top: 0.32rem;
        width: 2rem;
        height: 0.64rem;
        line-height: 0.64rem;
        background: rgba(51, 133, 255, 1);
        border-radius: 0.32rem;
        display: inline-block;
        text-align: center;
        font-size: 0.28rem;
    }
    .guide-box {
        width: 100vw;
        height: 100vh;
        position: relative;
    }
    .guide-item {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }
}
</style>

