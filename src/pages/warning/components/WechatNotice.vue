<template>
    <div class="priceNoticeItem">
        <div class="noticeLeftLineBox">
            <div class="leftNoticeCircle"></div>
            <div class="noticeItemLineTop"></div>
        </div>
        <div class="noticeRightContentBox">
            <div
                @click="toWechatNotice"
                class="noticeItemLeftBox"
            >
                <div class="leftNoticeTimeBox">
                    <div class="leftNoticeTimeContent">AI智能盯盘提醒</div>
                </div>

                <div class="leftTitleClass">{{title}}</div>
                <div class="wechatImgBox">
                    <img
                        style="width: 100%;border-radius: 0.1rem;"
                        :src="imgurl"
                    >
                </div>

                <!--行情区域-->
                <div class="klineBox" v-show="isShowBtn">
                    <div
                        @click="toWechatNotice"
                        class="historyNumber"
                    >
                        <div>立即前往</div>
                        <img
                            style="width: 0.18rem;margin-left: 0.04rem;"
                            src="../views/homePage/img/new-go.png"
                        />
                    </div>
                </div>
            </div>
            <!--<img-->
            <!--v-show="false"-->
            <!--style="width: 0.32rem;"-->
            <!--class="noticeItemImg"-->
            <!--src="./homePage/img/new-share@2x.png"-->
            <!--/>-->
        </div>
    </div>
</template>

<script>

export default {
    name: "WechatNotice",
    props: {
        title: {
            type: String,
            required: false
        },
        imgurl: {
            type: String,
            default: 'static/img/warning/new-wechat_ntf.png',
            required: false
        },
        isShowBtn:{
            type:Boolean,
            default:true,
        }
    },
    data() {
        return {

        };
    },
    methods: {
        toWechatNotice() {
            this.$emit('toWechatNotice')
        }
    }

};
</script>

<style scoped lang="scss">
.priceNoticeItem {
    padding: 0 0.28rem;
    background-color: #292933 !important;
    margin: 0.16rem 0 0.16rem 0;
    position: relative;
    display: flex;
    align-items: stretch;
    .noticeLeftLineBox {
        flex-grow: 0;
        flex-shrink: 0;
        position: relative;
        display: flex;

        flex-direction: column;
        align-items: center;
        box-sizing: border-box;
        width: 0.12rem;
        .noticeItemLineTop {
            width: 0.01rem;
            height: 0.1rem;
            background-color: rgba(164, 164, 207, 0.05);
        }
        .leftNoticeCircle {
            border: 0.03rem solid rgba(103, 103, 115, 1);
            box-sizing: border-box;
            position: absolute;
            top: 0.36rem;
            left: 0;
            width: 0.12rem;
            height: 0.12rem;
            border-radius: 50%;
            background-color: #24242e;
        }
    }
    .noticeRightContentBox {
        flex: 1;
        display: flex;
        padding: 0.26rem 0 0.26rem 0;
        .noticeItemLeftBox {
            flex: 1;
            .wechatImgBox {
                width: 100%;
                /* margin-left: 0.2rem; */
                padding-left: 0.2rem;
                box-sizing: border-box;
                margin: 0.12rem 0 0.21rem 0;
            }
            .leftTitleClass {
                margin-top: 0.12rem;
                margin-left: 0.2rem;
                font-size: 0.24rem;
                font-weight: 500;
                color: rgba(235, 235, 245, 0.85);
                line-height: 0.36rem;
            }
            .leftNoticeTimeBox {
                display: flex;
                align-items: center;
                .leftNoticeTimeContent {
                    font-size: 0.24rem;
                }
                .moreMessageClass {
                    display: flex;
                    align-items: center;
                    font-size: 0.24rem;
                    font-weight: 500;
                    color: rgba(235, 235, 245, 0.6);
                    line-height: 0.36rem;
                    margin-left: 0.2rem;
                }
                .leftNoticeTimeContent {
                    font-size: 0.24rem;
                    font-weight: 500;
                    color: rgba(235, 235, 245, 0.3);
                    line-height: 0.36rem;
                    margin-left: 0.2rem;
                }
                .lastNumberMessage {
                    .showAllClassNormal {
                        width: 0.28rem;
                        margin-left: 0.1rem;
                        transition: transform 0.2s;
                    }
                    .showAllIng {
                        transform: rotate(-180deg);
                    }
                    margin-left: 0.2rem;
                    font-size: 0.24rem;
                    font-weight: 400;
                    color: rgba(235, 235, 245, 0.6);
                    line-height: 0.36rem;
                    display: flex;
                    align-items: center;
                }
                .lastNumberMessage > img {
                    /*vertical-align: top;*/
                }
            }
            .rateListClass {
                padding: 0.1rem 0;
                width: 1.48rem;
                height: 0.32rem;
                margin-left: 0.2rem;
            }
            .leftNoticeContent {
                line-height: 0.46rem;
                margin-left: 0.2rem;
                font-size: 0.3rem;
                font-weight: 500;
                color: rgba(235, 235, 245, 0.85);
                line-height: 0.46rem;
            }
            .klineBox {
                margin-top: 0.12rem;
                display: flex;
                align-items: center;
                margin-left: 0.2rem;
                .historyNumber {
                    display: flex;
                    align-items: center;
                    background: rgba(81, 81, 97, 0.3);
                    padding: 0.08rem 0.14rem;
                    display: flex;
                    box-sizing: border-box;
                    align-items: center;
                    height: 0.52rem;
                    font-size: 0.24rem;
                    font-weight: 500;
                    color: rgba(235, 235, 245, 0.85);
                    line-height: 0.52rem;
                    border-radius: 0.06rem;
                    img {
                        vertical-align: top;
                    }
                }
                .isExpire {
                    background: rgba(86, 86, 102, 1) !important;
                    color: rgba(61, 61, 77, 1) !important;
                }
                .toPayOrder {
                    width: 1.4rem;
                    height: 0.52rem;
                    box-sizing: border-box;
                    border-radius: 0.06rem;
                    background: rgba(51, 133, 255, 1);
                    line-height: 0.52rem;
                    font-size: 0.24rem;
                    font-weight: 400;
                    color: rgba(255, 255, 255, 1);
                    text-align: center;
                }
            }
            .scoreListBox {
                margin-top: 0.1rem;
                margin-left: 0.2rem;
                display: flex;
                align-items: center;
                .scoreSelectImg {
                    width: 0.5rem;
                }
                .scoreNormalImg {
                    width: 0.18rem;
                    background-color: green;
                }
            }
            .tagListBox {
                margin-top: 0.2rem;
                margin-left: 0.2rem;
                display: flex;
                align-items: center;
                .tagClass {
                    padding: 0.2rem;
                    background-color: gray;
                    color: white;
                    border-radius: 0.05rem;
                }
            }
        }
        .noticeItemImg {
            width: 0.32rem;
            height: 0.32rem;
        }
    }
}
.priceNoticeItem:first-child {
    .noticeRightContentBox {
        padding: 0;
    }
    .noticeLeftLineBox {
        flex-grow: 0;
        flex-shrink: 0;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-sizing: border-box;
        width: 0.12rem;
        .leftNoticeCircle {
            border: 0.03rem solid rgba(103, 103, 115, 1);
            box-sizing: border-box;
            position: absolute;
            top: 0.1rem;
            left: 0;
            width: 0.12rem;
            height: 0.12rem;
            border-radius: 50%;
            background-color: #24242e;
        }
        .noticeItemLineTop {
            width: 0.01rem;
            height: 0.1rem;
            background-color: rgba(164, 164, 207, 0.05);
        }
    }
}
</style>

