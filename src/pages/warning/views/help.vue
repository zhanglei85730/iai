<template>
    <div>
        <MainLayout
            :title="$route.query.name+$t('warningHelp_page').help"
            :headerStyle="$config.headerStyle"
            class="common-layout-back"
            :isShowBackWord="false"
        >
            <!-- <div slot="header-left">
            {{$route.query.name}}
        </div> -->
            <div
                slot="page-body"
                class="warning-help"
            >
                <!-- 指标预警 -->
                <div class="common-fixed-container">
                    <div
                        class="tab-box common-tab-menu-bar common-tab-menu-fixed"
                        :class="{'common-fixed-container-web':$config.userFromType()=='web'}"
                    >
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
                <SideSpace style="margin-top:26px">
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
                                <div class="warning-help-title">{{$t('warningHelp_page').characteristic}}</div>
                                <div class="warning-help-title-cont">
                                    {{item.characteristic}}
                                </div>
                                <div class="warning-help-title">{{$t('warningHelp_page').principle}}</div>
                                <div class="warning-help-title-cont">
                                    {{item.principle}}
                                </div>
                                <div class="warning-help-title">{{$t('warningHelp_page').example}}</div>
                                <div class="warning-help-title-cont">
                                    {{item.example}}
                                    <img
                                        class='warning-help-example-img'
                                        :src="'static/img/warning/'+item.imagesPath[0]"
                                    />
                                </div>
                                <!-- <div class="warning-help-title">{{$t('warningHelp_page').operateSetp}}</div>
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
            const { code = '', warningType = '' } = this.$route.query;
            const warning = getWarningConditionForSelectOptions(code, warningType);
            const { data } = warning[0];
            const tabs = [];
            const tabsCon = [];
            data.forEach((item) => {
                const { text, descriptions, value } = item;
                tabs.push({ label: text });
                tabsCon.push(descriptions)
            })
            this.tabsContent = tabsCon;
            this.tabs = tabs
            this.selectedLabelSlots = tabs[0].label
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
}
.warning-help-example-img {
    width: 100%;
    margin-top: 10px;
}
.warning-help-title {
    margin-top: 0.9rem;
    font-size: $commonFsTitleMedium;
    text-align: center;
    &:after,
    &:before {
        content: "";
        display: inline-block;
        width: 1rem;
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
.warning-help-title-cont-last {
    margin-bottom: 0;
    line-height: 0;
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
</style>


