<template>
    <div>
        <MainLayout
            :title="$route.query.name+$t('warningHelp_page').help"
            :headerStyle="$config.headerStyle"
            class="common-layout-back"
            :isShowBackWord="true"
            :backBtnTxt="$route.query.name.substring(0,2)+ $t('common').earlyWarning"
        >
            <div
                slot="page-body"
                class="warning-help help-price-waring"
            >
                <!--  现价预警、涨跌预警-->
                <div v-if="$route.query.code==101 ||$route.query.code==102">
                    <div class="warning-help-title help-price-characteristic">{{$t('warningHelp_page').characteristic}}</div>
                    <div
                        class="help-price-title-cont help-price-characteristic-cont"
                        v-html="characteristic"
                    >
                    </div>
                    <div class="help-price-waring-fixed-container">
                        <div class="tab-box common-tab-menu-bar">
                            <cube-tab-bar
                                v-model="selectedLabelSlots"
                                :value="getDefaultSelect"
                                show-slider
                                inline
                                @click="clickHandler"
                            >
                                <cube-tab
                                    v-for="item in tabs"
                                    :label="item.label"
                                    :key="item.label"
                                >
                                    <!-- name为icon的插槽 -->
                                    <i
                                        slot="icon"
                                        :class="item.icon"
                                    ></i>
                                    <!-- 默认插槽 -->
                                    {{item.label}}
                                </cube-tab>
                            </cube-tab-bar>
                        </div>
                    </div>
                    <!-- cube-tab-bar 内容 -->
                    <SideSpace>
                        <div slot='content'>
                            <cube-tab-panels
                                v-model="selectedLabelSlots"
                                :value="getDefaultSelect"
                            >
                                <cube-tab-panel
                                    :label="tabs[index].label"
                                    v-for="(item,index) in tabsContent"
                                    :key="index"
                                >

                                    <div class="warning-help-title-cont price-warning-help-title-cont">
                                        <div v-html="item.content"></div>
                                        <img
                                            class='warning-help-example-img'
                                            :src="'static/img/warning/'+item.imagesPath[0]"
                                        />
                                    </div>
                                    <!-- 
                                    <div class="warning-help-title">{{$t('warningHelp_page').operateSetp}}</div>
                                    <div class="warning-help-title-cont warning-help-title-cont-last">

                                        <img
                                            class='warning-help-example-img'
                                            :src="'static/img/warning/'+item.imagesPath[1]"
                                        />
                                    </div> -->
                                </cube-tab-panel>

                            </cube-tab-panels>
                        </div>
                    </SideSpace>
                </div>
                <div v-else>
                    <SideSpace>
                        <div slot='content'>
                            <div class="warning-help-title warningitem103or104">{{$t('warningHelp_page').characteristic}}</div>
                            <div class="warning-help-title-cont">
                                {{warningitem103or104.characteristic}}
                            </div>
                            <div class="warning-help-title">{{$t('warningHelp_page').example}}</div>
                            <div class="warning-help-title-cont">
                                {{warningitem103or104.example}}
                                <img
                                    class='warning-help-example-img'
                                    :src="'static/img/warning/'+warningitem103or104.imagesPath[0]"
                                />
                            </div>
                            <!-- <div class="warning-help-title">{{$t('warningHelp_page').operateSetp}}</div>
                            <div class="warning-help-title-cont">
                                <img
                                    class='warning-help-example-img'
                                    :src="'static/img/warning/'+warningitem103or104.imagesPath[1]"
                                />
                            </div> -->
                        </div>

                    </SideSpace>
                </div>
            </div>
        </MainLayout>
    </div>
</template>
<script>
import { getWarningConditionForSelectOptions } from '../mapConfig.js'
import i18n from '@warning/i18n';
export default {
    data() {
        const t = this;
        return {
            selectedLabelSlots: t.$t('warningHelp_page').fllowing,
            tabs: [{
                label: t.$t('warningHelp_page').fllowing,
            }, {
                label: t.$t('warningHelp_page').historyFllowing,
            }],
            tabsContent: [],
            // 特点
            characteristic: '',
            // 预警code 103 or 104
            warningitem103or104: ''
        }
    },
    computed: {
        getDefaultSelect() {
            return this.tabs[0].label
        }
    },
    methods: {
        clickHandler(label) {
            const tabs = this.tabs;
            switch (label) {
                case tabs[0].label:
                    // this.tabLoadData('now')
                    break;
                case tabs[1].label:
                    // this.tabLoadData('history')
                    break;
            }
        },
        // 设置tab的title及内容
        initTabs() {
            const t = this;
            const { code = '', warningType = '' } = this.$route.query;
            const warning = getWarningConditionForSelectOptions(code, warningType);
            const { data, descriptions = '' } = warning[0];
            if ((code == '101' || code == '102') && descriptions !== '') {
                const { characteristic = '', dealCase = '' } = descriptions
                if (dealCase != '', characteristic != '') {
                    t.characteristic = characteristic
                }
                if (dealCase.length > 0) {
                    const tabs = [];
                    const tabsCon = [];
                    dealCase.forEach((item) => {
                        const { title, content, imagesPath } = item;
                        tabs.push({ label: title });
                        tabsCon.push({ content, imagesPath })
                    })
                    this.tabsContent = tabsCon;
                    this.tabs = tabs
                    this.selectedLabelSlots = tabs[0].label
                }

            } else if ((code == '103' || code == '104') && descriptions !== '') {
                const { example = '', imagesPath } = descriptions;
                if (example != '') {
                    t.warningitem103or104 = descriptions
                }

            }

        }
    },
    created: function () {
        this.initTabs()
    },
    i18n
    // errorCaptured:function(err,vm,info){
    //     debugger
    // }
}
</script>

<style scoped lang="scss">
@import "@public/css/warningGlobal.scss";
.warning-help {
    color: #fff;
}
.warning-help-title-cont {
    color: #fff;
    margin-top: 20px;
    margin-bottom: 40px;
    line-height: $contentLineHeight;
    font-size: $commonFsMedium;
    line-height: 0.42rem;
    p {
        margin-bottom: 20px;
        line-height: 0.42rem;
    }
}
.warning-help-example-img {
    width: 100%;
    margin-top: 10px;
}
.warning-help-title {
    font-size: $commonFsTitleMedium;
    text-align: center;
    &:after,
    &:before {
        content: "";
        display: inline-block;
        width: 50px;
        height: 1px;
        background: $commonFsColorDarkGray;
        vertical-align: middle;
    }
    &:after {
        margin-left: 0.08rem;
    }
    &:before {
        margin-right: 0.08rem;
    }
}
.help-price-waring {
    .warningitem103or104 {
        margin-top: 20px;
    }
    .help-price-characteristic {
        margin-top: 20px;
    }
    .help-price-characteristic-cont {
        font-size: 0.28rem;
    }
    .help-price-waring-fixed-container {
        .common-tab-menu-bar {
            border-top: 1px solid $commonFsColorDarkGray !important;
            padding-top: 0;
            margin-top: 30px;
        }
    }
    .help-price-title-cont {
        margin-top: 20px;
        padding: 0 15px;
        line-height: $contentLineHeight;
    }
    .warning-help-title-cont-last {
        margin-bottom: 0;
        line-height: 0;
    }
}
</style>
<style>
.warning-help .common-tab-menu-bar {
    border-top: none !important;
}
.warning-help .cube-tab-bar-slider:after {
    content: " ";
    display: block;
    background: #fdfdfd;
    height: 2px;
    width: 36px;
    text-align: center;
    margin: 0 auto;
}
.warning-help .cube-tab-bar-slider {
    background: none;
}
.warning-help .cube-tab-bar {
    width: 100% !important;
}
.warning-help-title-cont p,.help-price-characteristic-cont p {
    margin-bottom: 20px;
    line-height: 0.42rem;
}
</style>


