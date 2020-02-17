<template>
    <!-- 指标预警-->
    <MainLayout
        :title="$route.meta.title"
        :headerStyle="$config.headerStyle"
        class="common-layout-back"
        :isShowBackWord="false"
        :backBtnTxt="$route.query.backTitle"
        :flexSet="{center:5}"
    >
        <div slot="header-right">
        </div>
        <!-- 头部tab切换 -->
        <div slot="headerCenter">
            <!-- tab菜单 -->
            <div class="profit-trend-tab tab-custom">
                <div class="tab-custom-box">
                    <button
                        class="tab-custom-item first-child"
                        :class="ordersInfoTabCurrent===1?'current':''"
                        @click="onOrdersInfoTab(1)"
                    >{{$t('common').shakeIndexWarning}}</button>
                    <button
                        class="tab-custom-item last-child"
                        :class="ordersInfoTabCurrent===2?'current':''"
                        @click="onOrdersInfoTab(2)"
                    >{{$t('common').trendIndexWarning}}</button>
                </div>
            </div>
        </div>
        <div
            slot="page-body"
            class="warning-index"
        >
            <!-- tab content -->
            <SelectList
                :data="oscillationData"
                v-show="ordersInfoTabCurrent==1"
            />
            <SelectList
                :data="trendData"
                v-show="ordersInfoTabCurrent==2"
            />
        </div>
    </MainLayout>
</template>

<script>
import request from '@services/documentary.js'
import { commonError, getSearchParams, numberFixed, getMoneyAmount, getDataFoxAxiosRequest,trackEventGeneral,iosKeyboardHide} from '@public/js/util.js'
import SelectList from '../components/SelectList'
import { getIndexWarningConfig } from '../mapConfig.js'
import i18n from '@warning/i18n';

export default {
    components: {
        SelectList,
    },
    data() {
        const t=this;
        return {
            title: t.$t('common').warning,
            selectedLabelSlots: t.$t('common').shakeIndexWarning,
            tabs: [{
                label:t.$t('common').shakeIndexWarning,
            }, {
                label: t.$t('common').trendIndexWarning,
            }],
            // 震荡
            oscillationData: [],
            //趋势
            trendData: [],
            ordersInfoTabCurrent: 1
        }

    },
    methods: {
        // 切换头部tab
        onOrdersInfoTab(index = 1) {
            this.ordersInfoTabCurrent = index;
        },
    },
    computed: {

    },
    created() {
         iosKeyboardHide()
        this.oscillationData = getIndexWarningConfig(1, this.$route.meta.title);
        this.trendData = getIndexWarningConfig(2, this.$route.meta.title)
    },
    i18n
}
</script>
<style lang="scss">
@import "@public/css/warningGlobal.scss";
</style>
