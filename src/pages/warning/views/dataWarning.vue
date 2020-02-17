<template>
    <!-- 指标预警-->
    <div>
        <MainLayout
            :title="title"
            :headerStyle="$config.headerStyle"
            class="common-layout-back"
            :backBtnTxt="$route.query.backTitle"
        >
            <!-- <div slot="header-right">
                <router-link
                    to="/myWarning"
                    tag="span"
                >
                    <img
                        src="static/img/mobile/user_icon@2x.png"
                        class="common-header-right-icon"
                    />
                </router-link>
            </div> -->
            <div
                slot="page-body"
                class="warning-index"
            >
                <SelectList :data="getListData()" />
            </div>
        </MainLayout>
        <!-- 授权弹出层 -->
        <LoginPop class="warning-author-pop" />
    </div>
</template>

<script>
import request from '@services/documentary.js'
import { commonError, getSearchParams, numberFixed, getMoneyAmount, getDataFoxAxiosRequest,iosKeyboardHide } from '@public/js/util.js'
import SelectList from '../components/SelectList'
import { getPriceWarningConfig, getCombinationWarningConfig } from '../mapConfig.js'
import i18n from '@warning/i18n';

export default {
    components: {
        SelectList,
    },
    data() {
        const t = this;
        return {
            title: t.$t('common').warning,
            priceListData: [],
            // 组合预警-data
            combinationListData: [],
        }

    },
    methods: {
        // 根据url query参数返回不同的预警项目数据
        getListData() {
            const t = this;
            const { warningType = '', title = t.$t('common').warning } = this.$route.query;
            // this.title = title;
            let resultListData = [];
            switch (warningType) {
                case 'priceWarning': {
                    this.title = t.$t('common').priceWarning
                    resultListData = this.priceListData;
                    break;
                }
                // 指标预警单独的页面（tab切换页面较复杂，单独页面）
                // case 'indexWarning': {
                //      this.title ='指标预警'
                //     resultListData = this.indexListData;
                //     break;
                // }
                case 'combinationWarning': {
                    this.title = t.$t('common').combinationWarning
                    resultListData = this.combinationListData;
                    break;
                }
            }
            return resultListData
        }
    },
    computed: {

    },
    created() {
        iosKeyboardHide()
        this.priceListData = getPriceWarningConfig(this.$route.meta.title)
        this.combinationListData = getCombinationWarningConfig(this.$route.meta.title)
    },
    i18n
}
</script>
<style scoped lang="scss">
@import "@public/css/warningGlobal.scss";
.warning-index {
}
</style>