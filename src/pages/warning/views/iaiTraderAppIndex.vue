<template>
   <div class="homePageClass">
                <div class="topSwitchBoxClass">
                    <cube-tab-bar
                        v-model="selectedLabelDefault"
                        :data="tabs"
                        @click="clickHandler"
                    ></cube-tab-bar>
                </div>
                <div
                    v-show="selectPrice"
                    class="chartPriceTrading"
                    id='chartPriceTrading'
                ></div>
                <div
                    v-show="!selectPrice"
                    class="chartCalendarTrading"
                    id='chartCalendarTrading'
                ></div>
            </div>

</template>

<script>
export default {
    data() {
        return {
            selectPrice: true,
            selectedLabelDefault: "行情",
            tabs: [
                {
                    label: "行情"
                },
                {
                    label: "财经日历"
                }
            ]
        };
    },
    methods: {
        clickHandler(label) {
            // if you clicked home tab, then print 'Home'
            if (label == "行情") {
                this.selectPrice = true;
            } else {
                this.selectPrice = false;
            }
        },
        insertPriceScript() {
            document.getElementById("chartPriceTrading").appendChild(this.getPriceScript());
        },
        insertCalendarScript() {
            //    document.body.removeChild(this.recordCalendarScript);
            document.getElementById("chartCalendarTrading").appendChild(this.getCalendarScript());
        },
        getPriceScript() {
            var newPrice = document.createElement("script");
            newPrice.type = "text/javascript";
            newPrice.src =
                "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
            newPrice.text = `{
                "colorTheme": "dark",
                "dateRange": "12m",
                "showChart": true,
                "locale": "zh_CN",
                "largeChartUrl": "http://172.30.10.58:8080/warning.html#/homeDetailPage/{tvexchange}:{tvsymbol}",
                "isTransparent": false,
                "width": "100%",
                "height": "100%",
                "plotLineColorGrowing": "rgba(33, 150, 243, 1)",
                "plotLineColorFalling": "rgba(33, 150, 243, 1)",
                "gridLineColor": "rgba(233, 233, 234, 1)",
                "scaleFontColor": "rgba(120, 123, 134, 1)",
                "belowLineFillColorGrowing": "rgba(33, 150, 243, 0.12)",
                "belowLineFillColorFalling": "rgba(33, 150, 243, 0.12)",
                "symbolActiveColor": "rgba(33, 150, 243, 0.12)",
                "tabs": [
                    {
                    "title": "指数",
                    "symbols": [
                        {
                        "s": "OANDA:SPX500USD",
                        "d": "S&P 500"
                        },
                        {
                        "s": "OANDA:NAS100USD",
                        "d": "Nasdaq 100"
                        },
                        {
                        "s": "FOREXCOM:DJI",
                        "d": "Dow 30"
                        },
                        {
                        "s": "INDEX:NKY",
                        "d": "Nikkei 225"
                        },
                        {
                        "s": "INDEX:DAX",
                        "d": "DAX Index"
                        },
                        {
                        "s": "OANDA:UK100GBP",
                        "d": "FTSE 100"
                        }
                    ],
                    "originalTitle": "Indices"
                    },
                    {
                    "title": "商品",
                    "symbols": [
                        {
                        "s": "CME_MINI:ES1!",
                        "d": "E-Mini S&P"
                        },
                        {
                        "s": "CME:E61!",
                        "d": "Euro"
                        },
                        {
                        "s": "COMEX:GC1!",
                        "d": "Gold"
                        },
                        {
                        "s": "NYMEX:CL1!",
                        "d": "Crude Oil"
                        },
                        {
                        "s": "NYMEX:NG1!",
                        "d": "Natural Gas"
                        },
                        {
                        "s": "CBOT:ZC1!",
                        "d": "Corn"
                        }
                    ],
                    "originalTitle": "Commodities"
                    },
                    {
                    "title": "外汇",
                    "symbols": [
                        {
                        "s": "FX:EURUSD"
                        },
                        {
                        "s": "FX:GBPUSD"
                        },
                        {
                        "s": "FX:USDJPY"
                        },
                        {
                        "s": "FX:USDCHF"
                        },
                        {
                        "s": "FX:AUDUSD"
                        },
                        {
                        "s": "FX:USDCAD"
                        }
                    ],
                    "originalTitle": "Forex"
                    }
                ]
                }`;
            return newPrice;
        },
        getCalendarScript() {
            var newCalendar = document.createElement("script");
            newCalendar.type = "text/javascript";
            newCalendar.src =
                "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
            newCalendar.text = `{
                            "colorTheme": "dark",
                            "isTransparent": false,
                            "width": "100%",
                            "height": "100%",
                            "locale": "zh_CN",
                            "importanceFilter": "-1,0,1"
                            }`;
            return newCalendar;
        }
    },
    destroyed() {

    },
    created() {

    },
    mounted() {
        this.$nextTick(() => {
            this.insertPriceScript();
            this.insertCalendarScript();
        })
    }
};
</script>

<style lang="scss" scoped>
.homePageClass {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    .chartPriceTrading {
        height: 100%;
        flex: 1;
    }
    .chartCalendarTrading {
        height: 100%;
        flex: 1;
    }
    height:100vh;
}
</style>

