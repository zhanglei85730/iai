<template>
    <div class="priceNoticeItem">
        <div v-show="false">
            <slot></slot>
        </div>
        <div class="noticeLeftLineBox">
            <div class="leftNoticeCircle"></div>
            <div class="noticeItemLineTop"></div>
            <div class="noticeItemLineBottom"></div>
        </div>
        <div class="noticeRightContentBox">
            <div
                v-if="isMoreButton"
                class="noticeItemLeftBox"
            >
                <div class="leftNoticeTimeBox">
                    <div
                        @click="toProductDetail"
                        class="moreMessageClass"
                    >
                        <div>{{$t('homePage.messageView.enter_product_detail')}}</div>
                        <img
                            style="width: 0.18rem;margin-left: 0.1rem;"
                            src="../../views/homePage/img/new-input.png"
                        />
                    </div>
                </div>
            </div>
            <div
                v-if="isNoMessage"
                class="noticeItemLeftBox"
            >
                <div class="leftNoticeTimeBox">
                    <div
                        @click="toProductDetail"
                        class="moreMessageClass"
                    >
                        <div>{{$t('homePage.messageView.enter_product_detail')}}</div>
                        <img
                            style="width: 0.18rem;margin-left: 0.1rem;"
                            src="../../views/homePage/img/new-input.png"
                        />
                    </div>
                </div>
            </div>
            <div
                v-if="!isMoreButton && !isNoMessage"
                class="noticeItemLeftBox"
            >
                <div class="leftNoticeTimeBox">
                    <div class="leftNoticeTimeContent">{{messageInfo.created_at.replace(/\d{4}-\d{2}-\d{2}/,'')}} {{getTitleType(messageInfo)}}</div>
                </div>
                <div
                    class="leftNoticeContent"
                    v-html="setPriceContent(messageInfo)"
                ></div>
                <div
                    v-if="messageInfo.type==5"
                    class="rateListClass"
                >
                    <cube-rate
                        :disabled="true"
                        v-model="messageInfo.extend.importance"
                    ></cube-rate>
                </div>
                <div
                    v-if="messageInfo.type==5"
                    class="leftNoticeContent"
                    v-html="setPriceContent(messageInfo,true)"
                ></div>

                <!--行情区域-->
                <div class="klineBox">
                    <div
                        @click="toPayAction(getChineseName(messageInfo.type==5?messageInfo.oneSymbolId:messageInfo.symbol_id).ename)"
                        v-if="(isHavePrice) && (messageInfo.type==3 || messageInfo.type==4  || (messageInfo.type==5 && (messageInfo.extend.type==3)))"
                        class="historyNumber"
                    >
                        <img
                            style="width: 0.24rem;margin-right: 0.16rem;"
                            src="../../views/homePage/img/new-price-blue.png"
                        />
                        <div>{{getChineseName(messageInfo.type==5?messageInfo.oneSymbolId:messageInfo.symbol_id).ename}}</div>
                        <span
                            style="margin-left: 0.12rem;"
                            :style="{color:messageInfo.changeRateIsUp == true ? '#7ACC7A' : '#FF6666'}"
                        >{{messageInfo.changeRate?messageInfo.changeRate:'--%'}}</span>
                    </div>

                    <div
                        @click="toPayAction(getChineseName(messageInfo.twoSymbolId).ename)"
                        v-if="(isHavePrice) && (messageInfo.type==5 && messageInfo.extend.type==3)"
                        class="historyNumber"
                    >
                        <img
                            style="width: 0.24rem;margin-right: 0.16rem;"
                            src="../../views/homePage/img/new-price-blue.png"
                        />
                        <div>{{getChineseName(messageInfo.twoSymbolId).ename}}</div>
                        <span
                            style="margin-left: 0.12rem;"
                            :style="{color:messageInfo.twoChangeRateIsUp == true ? '#7ACC7A' : '#FF6666'}"
                        >{{messageInfo.twoChangeRate?messageInfo.twoChangeRate:'--%'}}</span>
                    </div>

                    <div
                        v-if="(messageInfo.type==6)"
                        class="historyNumber"
                        @click="toShowHistory(messageInfo)"
                    >
                        <img
                            style="width: 0.24rem;margin-right: 0.16rem;"
                            src="../../views/homePage/img/new-history-blue.png"
                        />
                        <div>{{$t('homePage.messageView.history_winRate')}} {{messageInfo.extend.winrate}}% | {{$t('homePage.messageView.profit_ratio')}} {{messageInfo.extend.profit_ratio}}</div>
                    </div>
                    <div
                        v-if="(messageInfo.type==5 && (messageInfo.extend.type==1 ||messageInfo.extend.type==2))"
                        class="historyNumber"
                        @click="showStatistics(messageInfo)"
                    >
                        <img
                            style="width: 0.24rem;margin-right: 0.16rem;"
                            src="../../views/homePage/img/new-history-blue.png"
                        />
                        <div>{{$t('homePage.messageView.history_statistical')}}</div>
                    </div>
                    <div
                        v-if="(messageInfo.type==5) && (messageInfo.extend.type==2)"
                        class="historyNumber"
                        @click="showNumberWave(messageInfo)"
                    >
                        <img
                            style="width: 0.24rem;margin-right: 0.16rem;"
                            src="../../views/homePage/img/new-number-blue.png"
                        />
                        <div>{{$t('homePage.messageView.lastest_product_data')}}</div>
                    </div>

                    <div
                        v-if="(messageInfo.type==6 || messageInfo.type==2)"
                        @click="toPayAction(getChineseName(messageInfo.symbol_id).ename)"
                        :class="{isExpire:messageInfo.extend.is_expire == '1'?true:false}"
                        class="toPayOrder"
                    >{{getMessageInfo}}</div>
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
import i18n from '@warning/i18n'
import upImg from "../../views/homePage/img/new-rise@2x.png";
import downImg from "../../views/homePage/img/new-rise-28@2x.png";
import { getSelectOptions } from "../../mapConfig";
import {
    getSymbolInfoById,
    isIos,
    getSymbolInfoByEname,
    isWechatPlatform,
    isWebPopularize
} from "@public/js/util.js";
export default {
    name: "MessageView",
    props: {
        isMoreButton: {
            type: Boolean,
            required: false,
            default: false
        },
        isNoMessage: {
            type: Boolean,
            required: false,
            default: false
        },
        messageInfo: {
            type: Object,
            required: false
        },
        productInfo: {
            type: Object,
            required: false,
            default: null
        },
        isHavePrice: {
            type: Boolean,
            required: false,
            default: true
        },
        isSelect: {
            type: Boolean,
            required: false,
            default: true
        },
        authAction: {
            type: Function,
            required: false,
        }
    },
    data() {
        return {
            upImg: upImg,
            downImg: downImg,
            rateNumber: 2,
            getSelectOptions: getSelectOptions
        };
    },
    methods: {
        getChineseNameList(enameString) {
            var chineseNameList = [];
            enameString.split(",").forEach((item, index) => {
                chineseNameList.push(this.getChineseName(item, true).cname);
            });
            return chineseNameList.join("、");
        },
        toProductDetail() {
             if(isWebPopularize()){
               return false;
            }
            this.$router.push({
                name: "productDetailPage",
                query: {
                    symbol: this.productInfo.symbol
                }
            });
        },
        showNumberWave(messageItem) {
            this.$emit("showNumberWave", messageItem);
        },
        showStatistics(messageItem) {
            this.$emit("showStatistics", messageItem);
        },
        toShowHistory(messageItem) {
            if (this.authAction()) {
                return
            }
            var paramItem = {};
            paramItem = messageItem.extend;
            paramItem.cycle = messageItem.cycle;
            paramItem.is_expire = messageItem.extend.is_expire;
            paramItem.symbol_id = messageItem.symbol_id;
            paramItem.ename = this.getChineseName(messageItem.symbol_id).ename;
            paramItem.up_down = messageItem.up_down
            this.$emit("toShowHistory", paramItem);
        },
        getTitleType(messageInfo) {


            // priceWarning:'价格盯盘',
            //   priceChange:'行情异动',
            //   k_form:'K线形态',
            //   signal_recommend:'信号推荐',
            //   signalWarning:'指标盯盘',
            //   data_tip:'数据提醒',
            //   data_publish:'数据公布',
            //   thing_tip:'事件提醒',
            //
            //   help_many:'利多',
            //   help_blank:'利空',
            //   fluctuation:'震荡波动',
            //   affect:'影响',
            //   your_setting:'您设置的',
            //   already:'已',
            //   rise:'上涨',
            //   fall:'下跌',
            //   single_rise:'涨',
            //   single_fall:'跌',
            //   single_blank:'空',
            //   single_look:'看',
            //   number_extent:'幅',
            //   to:'至',
            //   remark:'备注',
            //   cross:'超',
            //   newestPrice:'最新价报',
            //   k_chart_show:'K图出现',
            //   five_minute_show:'5分钟后即将公布',
            //   predictive_value:'预测值',
            //   published_value:'公布值',
            //   fore_value:'前值',
            //   signal:'信号',


            switch (messageInfo.type) {
                case 1:
                    return this.$t('homePage.messageView.priceWarning');
                    break;
                case 3:
                    return this.$t('homePage.messageView.priceChange');
                    break;
                case 4:
                    return this.$t('homePage.messageView.k_form');
                    break;
                case 2:
                    return this.$t('homePage.messageView.signalWarning');
                    break;
                case 5:
                    if (messageInfo.extend.type == 1) {
                        return this.$t('homePage.messageView.data_tip');
                    } else if (messageInfo.extend.type == 2) {
                        return this.$t('homePage.messageView.data_publish');
                    } else {
                        return this.$t('homePage.messageView.thing_tip');
                    }
                    break;
                case 6:
                    return this.$t('homePage.messageView.signal_recommend');
                    break;
                default:
                    return "";
            }
        },
        getChineseName(symbol, isName = false) {
            var item = !isName
                ? getSymbolInfoById(symbol)
                : getSymbolInfoByEname(symbol);
            var infoArray = item.id;
            if (item == null || item == undefined || infoArray == null) {
                return { cname: "- -", ename: "- -", numberL: 3 };
            }
            if (!!infoArray) {
                return { cname: infoArray[1], ename: item.uname, numberL: infoArray[4] };
            }
        },
        getLineType(cycle) {
            if (cycle == 1 || cycle == 7 || cycle == 9 || cycle == 11) {
                return this.$t('homePage.messageView.super_short_line');
            } else if (cycle == 2 || cycle == 13) {
                return this.$t('homePage.messageView.short_line');
            } else if (cycle == 3) {
                return this.$t('homePage.messageView.medium_long_line');
            } else {
                return this.$t('homePage.messageView.medium_line');
            }
        },
        toPayAction(symbol) {
            // 微信公众号不可点击
            if (isWechatPlatform()) return false;
            if (this.authAction()) {
                return
            }
            if (isIos()) {
                location.href = `https://gts2tubiao/${symbol}`;
            } else {
                window.open(
                    `https://gts2tubiao/${symbol}`,
                    "tubiao",
                    "mobile",
                    "_blank"
                );
            }
        },
        setPriceContent(item, isThing = false) {
            try {
                if (isThing && item.type == 5) {
                    //星星下的v-html模版渲染
                    if (item.extend.type == 2) {
                        return `
              <div style="font-size:0.26rem;font-weight:800;color:rgba(235,235,245,0.85);">
                     ${item.extend.bull ? `<div><span style="color:rgba(122,204,122,0.5);">${this.$t('homePage.messageView.help_many')}：</span><span>${this.getChineseNameList(item.extend.bull)}</span></div>` : ''}
                     ${item.extend.bear ? `<div><span style="color:rgba(255,102,102,0.5);">${this.$t('homePage.messageView.help_blank')}：</span><span>${this.getChineseNameList(item.extend.bear)}</span></div>` : ''}
                     ${item.extend.shock ? `<div><span style="color:rgba(235,235,245,0.3);">${this.$t('homePage.messageView.fluctuation')}：</span><span>${this.getChineseNameList(item.extend.shock)}</span></div>` : ''}
                    </div>
                 `;
                    } else {
                        return `
                  <div style="font-size:0.26rem;font-weight:800;color:rgba(235,235,245,0.85);">
                    <span style="color:rgba(235,235,245,0.3);">${this.$t('homePage.messageView.affect')}：</span><span>${this.getChineseNameList(
                            item.extend.symbol_list
                        )}</span>
                  </div>
                  `;
                    }
                }

                if (item.type == 1) {
                    if (item.extend.warning_type == "101") {
                        return `${this.$t('homePage.messageView.your_setting')}${item.extend.price_type}${this.$t('homePage.messageView.already')}${
                            item.up_down == "1" ? `${this.$t('homePage.messageView.rise')}` : `${this.$t('homePage.messageView.fall')}`}${this.$t('homePage.messageView.to')} <span style="color:${
                            item.up_down == "1" ? "#7ACC7A;" : "#FF6666;"
                            }};">${item.extend.target_value}。</span>${
                            !!item.extend.comment ? ` ${this.$t('homePage.messageView.remark')}：${item.extend.comment}` : ""
                            }`;
                    } else if (item.extend.warning_type == "105") {
                        return `${item.extend.cycle_type}${this.$t('homePage.messageView.single_inner')}${
                            item.up_down == "1" ? `${this.$t('homePage.messageView.rise')}` : `${this.$t('homePage.messageView.fall')}`
                            } <span style="color:${
                            item.up_down == "1" ? "#7ACC7A" : "#FF6666"
                            };">${item.extend.target_value}${
                            item.extend.monad_type
                            }</span>，${this.$t('homePage.messageView.newestPrice')} ${parseFloat(item.extend.now_price).toFixed(this.getChineseName(item.symbol_id).numberL)}，${this.$t('homePage.messageView.day')}${
                            item.up_down == "1" ? `${this.$t('homePage.messageView.single_rise')}` : `${this.$t('homePage.messageView.single_fall')}`
                            }${this.$t('homePage.messageView.number_extent')} <span>${item.extend.up_down_range}%</span>。${
                            !!item.extend.comment ? ` ${this.$t('homePage.messageView.remark')}：${item.extend.comment}` : ""
                            }`;
                    } else {
                        return `${this.$t('homePage.messageView.your_setting_already')}${
                            item.up_down == "1" ? `${this.$t('homePage.messageView.rise')}` : `${this.$t('homePage.messageView.fall')}`
                            }${this.$t('homePage.messageView.cross')} <span style="color:${
                            item.up_down == "1" ? "#7ACC7A" : "#FF6666"
                            };">${item.extend.target_value}${
                            item.extend.monad_type
                            }</span>，${this.$t('homePage.messageView.newestPrice')} ${parseFloat(item.extend.now_price).toFixed(this.getChineseName(item.symbol_id).numberL)}。${
                            !!item.extend.comment ? ` ${this.$t('homePage.messageView.remark')}：${item.extend.comment}` : ""
                            }`;
                    }
                } else if (item.type == 3) {
                    var time = getSelectOptions({ type: "cycle", value: item.cycle });
                    return `${
                        !this.isSelect ? `${this.getChineseName(item.symbol_id).cname} ` : ""
                        }${
                        item.extend.need_cycle == "1" ? `${time[0].text}${this.$t('homePage.messageView.k_chart_show')}：` : `${this.$t('homePage.messageView.priceChange')}：`
                        }<span style="color:${item.up_down == "1" ? "#7ACC7A" : "#FF6666"};">${
                        item.type_name
                        }</span><img src="${
                        item.up_down == "1" ? this.upImg : this.downImg
                        }" style="width: 0.24rem;vertical-align: middle;"/> <br/>${this.$t('homePage.messageView.newestPrice')} ${
                        parseFloat(item.extend.mid_price).toFixed(this.getChineseName(item.symbol_id).numberL)
                        }，${item.extend.up_down_name} ${item.extend.k_range}%`;
                } else if (item.type == 4) {
                    var time = getSelectOptions({ type: "cycle", value: item.cycle });
                    return `${
                        !this.isSelect ? `${this.getChineseName(item.symbol_id).cname} ` : ""
                        }${time[0].text}${this.$t('homePage.messageView.k_chart_show')}：<span style="color:${
                        item.up_down == "1" ? "#7ACC7A" : "#FF6666"
                        };">${item.type_name}</span><img src="${
                        item.up_down == "1" ? this.upImg : this.downImg
                        }" style="width: 0.24rem;vertical-align: middle;"/> <br/>${this.$t('homePage.messageView.newestPrice')} ${
                        parseFloat(item.extend.mid_price).toFixed(this.getChineseName(item.symbol_id).numberL)
                        }，${item.extend.up_down_name} ${item.extend.k_range}%`;
                } else if (item.type == 5) {
                    //星星以上的v-html模版渲染
                    return `
                  ${
                        item.extend.type != 2
                            ? `<span style="font-size:0.24rem;font-weight:500;color:rgba(235,235,245,0.85);">${this.$t('homePage.messageView.five_minute_show',{min:item.extend.push_min})}：</span>`
                            : ""
                        }
                  <div style="color:#FF6666;font-size:0.3rem;font-weight:500;">${
                        item.extend.message
                        }</div>
                  ${
                        ((item.extend.type != 3) && (item.extend.type != 4))
                            ? `<div style="margin-top: 0.24rem;font-weight:500;font-size:0.26rem;color:rgba(235,235,245,0.6);" ><span style="color:rgba(235,235,245,0.3);">${this.$t('homePage.messageView.fore_value')}：</span><span>${
                            item.extend.previous_price ? item.extend.previous_price : '- -'
                            }</span>   <span style="color:rgba(235,235,245,0.3);margin-left: 0.48rem;">${this.$t('homePage.messageView.predictive_value')}：</span><span>${
                            item.extend.survey_price ? item.extend.survey_price : '- -'
                            }</span>    ${
                            item.extend.type == 2
                                ? `<span style="color:rgba(235,235,245,0.3);margin-left: 0.48rem;">${this.$t('homePage.messageView.published_value')}：</span><span>${item.extend.actual_price ? item.extend.actual_price : '- -'}</span>`
                                : ""
                            }  </div>`
                            : ""
                        }
                `;
                } else if (item.type == 6) {
                    var time = getSelectOptions({ type: "cycle", value: item.cycle });
                    return `${
                        !this.isSelect
                            ? `${this.getChineseName(item.symbol_id).cname} (${
                            this.getChineseName(item.symbol_id).ename
                            })<br/>`
                            : ""
                        }<span style="color:${
                        item.up_down == "1" ? "#7ACC7A" : "#FF6666"
                        };">${this.getLineType(item.cycle)}_${this.$t('homePage.messageView.single_look')}${
                        item.up_down == "1" ? `${this.$t('homePage.messageView.single_rise')}` : `${this.$t('homePage.messageView.single_fall')}`
                        }${this.$t('homePage.messageView.signal')}<img src="${
                        item.up_down == "1" ? this.upImg : this.downImg
                        }" style="width: 0.24rem;vertical-align: middle;"/></span><br/>${
                        time[0].text
                        }${this.$t('homePage.messageView.k_chart_show')}：${item.extend.stare_condition} <br/>${this.$t('homePage.messageView.newestPrice')} ${parseFloat(item.extend.now_price).toFixed(this.getChineseName(item.symbol_id).numberL)}`;
                } else if (item.type == 2) {
                    var time = getSelectOptions({ type: "cycle", value: item.cycle });
                    return `${
                        !this.isSelect
                            ? `${this.getChineseName(item.symbol_id).cname} (${
                            this.getChineseName(item.symbol_id).ename
                            })<br/>`
                            : ""
                        }<span style="color:${
                        item.up_down == "1" ? "#7ACC7A" : "#FF6666"
                        };">${this.getLineType(item.cycle)}_${this.$t('homePage.messageView.single_look')}${
                        item.up_down == "1" ? `${this.$t('homePage.messageView.single_rise')}` : `${this.$t('homePage.messageView.single_blank')}`
                        }${this.$t('homePage.messageView.signal')}<img src="${
                        item.up_down == "1" ? this.upImg : this.downImg
                        }" style="width: 0.24rem;vertical-align: middle;"/></span><br/>${
                        time[0].text
                        }${this.$t('homePage.messageView.k_chart_show')}：${item.extend.stare_condition}`;
                }
            } catch (e) {

            }
        }
    },
    computed: {
        getMessageInfo() {
            //  if(isWechatPlatform())return '信号生效中'
            let _look_chart = isWechatPlatform() ? this.$t('homePage.messageView.signal_avliable') : `${this.$t('homePage.messageView.look_chart')}`
            return this.messageInfo.extend.is_expire == '1' ? `${this.$t('homePage.messageView.signal_failure')}` : _look_chart
        },
    },
    i18n
};
</script>

<style scoped lang="scss">
.priceNoticeItem {
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
        .noticeItemLineBottom {
            flex: 1;
            width: 0.02rem;
            background-color: rgba(164, 164, 207, 0.05);
        }
        .leftNoticeCircle {
            border: 0.03rem solid rgba(103, 103, 115, 1);
            box-sizing: border-box;
            position: absolute;
            top: 0.54rem;
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
        padding: 0.44rem 0 0 0;
        .noticeItemLeftBox {
            flex: 1;
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
                    margin-right: 0.12rem;
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
                        margin-right: 0.06rem;
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
