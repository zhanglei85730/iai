<template>
    <div class="productListItemBox">
        <div
            class="priceBox"
            :id="productItem.symbol"
        >
            <div
                @click="toPayAction(productItem.ename)"
                class="priceTopBox"
            >
                <div style="display: flex;align-items: center;">
                    <div class="priceValue">{{productItem.name}}</div>
                    <div class="priceValueName">{{productItem.ename}}</div>
                </div>
                <img
                    style="width:0.4rem;height: 0.4rem;"
                    src="../../views/homePage/img/new-right-price.png"
                >

            </div>
            <div
                @click="toPayAction(productItem.ename)"
                class="priceRightBox"
            >
                <div class="priceValueBox">
                    <div
                        :style="{color:updatePriceItem.askUp == true ? '#7ACC7A' : '#FF6666'}"
                        class="priceValue"
                    >{{updatePriceItem.ask}}</div>
                    <div class="priceValueName">{{$t('homePage.selectView.buyPrice')}}</div>
                </div>
                <div class="priceValueBox">
                    <div
                        :style="{color:updatePriceItem.bidUp == true ? '#7ACC7A' : '#FF6666'}"
                        class="priceValue"
                    >{{updatePriceItem.bid}}</div>
                    <div class="priceValueName">{{$t('homePage.selectView.sellPrice')}}</div>
                </div>
                <div class="priceValueBox">
                    <div
                        :style="{color:updatePriceItem.priceUp == true ? '#7ACC7A' : '#FF6666'}"
                        class="priceValue"
                    >{{updatePriceItem.new_price}}</div>
                    <div class="priceValueName">{{$t('homePage.selectView.newestPrice')}}</div>
                </div>
                <div
                    @click="toPayAction(productItem.ename)"
                    class="smallPriceValueBox"
                >
                    <div
                        class="priceValue"
                        :style="{color:updatePriceItem.isUp == true ? '#7ACC7A' : '#FF6666'}"
                    >{{updatePriceItem.changeRate}}</div>
                    <div class="priceValueName">{{$t('homePage.selectView.quote_change')}}</div>
                </div>
            </div>
            <div class="bottomButtonBox">
                <div
                    @click="toPriceWarning(productItem.ename)"
                    class="detailBtn"
                >{{$t('homePage.selectView.price_monitor')}}</div>
                <div
                    @click="toProductDetail(productItem.symbol)"
                    class="chartBtn"
                    style="margin-left: 0.12rem;"
                >{{$t('homePage.selectView.product_detail')}}</div>
            </div>
        </div>

        <div
            class="priceNoticeList"
            v-if="!isNoMessge"
        >
            <slot name="messageSlot"></slot>
            <slot name="detailMessageSlot"></slot>
        </div>
        <slot name='wechatNoticeSlot'></slot>
         <cube-popup
            type="my-popup"
            ref="popularizeAd"
            :maskClosable="true"
        >
            <img src="static/img/warning/popularize_pop.png" />
        </cube-popup>
    </div>
</template>

<script>
import i18n from '@warning/i18n'
import { isWebPopularize } from '@public/js/util.js'
export default {
    name: "SelectView",
    props: {
        isWechatNotice: {
            type: Boolean,
            default: false
        },
        productItem: {
            type: Object,
            default: false,
            require: true,
        },
        updatePriceItem: {
            type: Object,
            require: true,
            default: false
        },
        isNoMessge: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        toPriceWarning(ename) {
            if(isWebPopularize()){
                this.$refs.popularizeAd.show()
                return false
            }
            this.$router.push({
                path: '/priceWarning/main',
                query: {
                    setWarningSymbol: ename,
                    backPage: 'homePage'
                }
            })
        },
        toPayAction(ename) {
          // 微信或iaiTrader app 不跳转图表页
            if (!this.$config.isWechatPlatform && !this.$config.isIaiTraderApp) {
                this.$emit('toPayAction', ename)
            }
        },
        toProductDetail(symbol) {
            if(isWebPopularize()){
                this.$refs.popularizeAd.show()
                return false
            }
            this.$emit('toProductDetail', symbol)
        }
    },
    i18n
}
</script>

<style scoped lang="scss">
.productListItemBox {
    margin-bottom: 0.16rem;
    padding: 0 !important;
    background-color: #24242e !important;
    /*padding-bottom: 0.16rem;*/
    .priceBox {
        background-color: #292933;
        padding: 0.2rem 0.28rem 0.4rem 0.28rem;
        /*margin-bottom: 0.2rem;*/
        .priceTopBox {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .priceValue {
                font-size: 0.32rem;
                font-weight: 800;
                color: rgba(255, 255, 255, 0.85);
                line-height: 0.54rem;
            }
            .priceValueName {
                font-size: 0.32rem;
                font-weight: 500;
                color: rgba(235, 235, 245, 0.3);
                line-height: 0.54rem;
                margin-left: 0.08rem;
            }
        }

        .bottomButtonBox {
            padding-top: 0.24rem;
            height: 0.48rem;
            display: flex;
            align-items: stretch;
            font-size: 0.24rem;
            color: rgba(235, 235, 245, 0.6);
            line-height: 0.24rem;
            .detailBtn {
                box-sizing: border-box;
                display: flex;
                flex-grow: 1;
                justify-content: center;
                align-items: center;
                border-radius: 0.06rem;
                background: rgba(49, 49, 61, 1);
            }
            .chartBtn {
                flex-grow: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                box-sizing: border-box;
                border-radius: 0.06rem;
                background: rgba(49, 49, 61, 1);
            }
        }
        .priceRightBox {
            justify-content: space-between;
            display: flex;
            align-items: center;
            .priceValueBox {
                width: 1.28rem;
                .priceValue {
                    font-size: 0.28rem;
                    font-weight: 500;
                    color: rgba(255, 89, 89, 1);
                    line-height: 0.42rem;
                }
                .priceValueName {
                    font-size: 0.22rem;
                    font-weight: 500;
                    color: rgba(235, 235, 245, 0.3);
                    line-height: 0.34rem;
                }
            }
            .smallPriceValueBox {
                text-align: right;
                width: 0.88rem;
                .priceValue {
                    color: #7acc7a;
                    font-size: 0.28rem;
                    line-height: 0.42rem;
                }
                .priceValueName {
                    font-size: 0.22rem;
                    font-weight: 500;
                    color: rgba(235, 235, 245, 0.3);
                    line-height: 0.34rem;
                }
            }
        }
    }
    .priceNoticeList {
        background-color: #292933;
        padding: 0 0.28rem 0.4rem 0.28rem;
        .messageTimeClass {
            font-size: 0.24rem;
            font-weight: 400;
            color: rgba(235, 235, 245, 0.6);
            line-height: 0.36rem;
            padding: 0.16rem 0;
            border-bottom: 1px solid rgba(0, 0, 0, 0.25);
        }
        /*border-bottom: 0.02rem solid #535366;*/
        /*padding-bottom: 0.4rem;*/
        margin-bottom: 0.16rem;
    }
    .priceNoticeList > .priceNoticeItem:first-child {
        .noticeRightContentBox {
            padding-top: 0 !important;
        }
    }
}
.productListItemBox .priceNoticeList:last-child {
    border-bottom: none !important;
}
</style>
