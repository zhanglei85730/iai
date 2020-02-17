
<template>
    <!--图表end  -->
    <ul class="chart-descripe">
        <li class="chart-descripe-item">
            <div>{{$t('winList.renct3MonthsTrigger')}}<span class="chart-descripe-value">{{data.trigger_total}}</span></div>
            <div>{{$t('winList.triggerWaitTime')}}<span class="chart-descripe-value">{{data.wait_time}}{{$t('common.hourLabel')}}</span></div>
        </li>
        <li class="chart-descripe-item">
            <div>{{$t('winList.xdykb')}}<img
                    src="static/img/warning/icon_info_grey@3x.png"
                    class="name-icon-info"
                    @click="dialogTipHandle"
                /><span class="chart-descripe-value">{{data.profit_ratio}}</span></div>
            <div>{{$t('winList.zydsqj')}}<span class="chart-descripe-value stop-win chart-descripe-area">[ {{data.stop_win[0]}} ~ {{data.stop_win[1]}} ]</span></div>
        </li>
        <li class="chart-descripe-item">
            <div>{{$t('winList.ygsyds')}}<span class="chart-descripe-value">{{data.avg_win_profit}}</span></div>
            <div>{{$t('winList.zsdsqj')}}<span class="chart-descripe-value stop-loss chart-descripe-area">[ {{data.stop_loss[0]}} ~ {{data.stop_loss[1]}} ]</span></div>
        </li>
    </ul>
</template>
<script>
import i18n from '@warning/i18n'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import {trackEventGeneral} from '@public/js/util.js'

export default {
    props: {
        // 是否显示
        data: {
            type: Object,
            required: true,
            default: false
        },
    },
    methods:{
         ...mapActions['dialogSwipe/updateState'],
        dialogTipHandle(){
            this.$store.commit('dialogSwipe/updateDialogChangeId');
            trackEventGeneral('Click_Ratio_QuestionMark')
            this.$emit('tipHandle')
        }
    },
    i18n
}
</script>
<style lang="scss" scoped>
@import "@public/css/warningGlobal.scss";
.name-icon-info {
    width: 0.32rem;
    height: 0.32rem;
    vertical-align: middle;
    position: relative;
    top: -1px;
    left: 2px;
}
.chart-title {
    color: $commonFsColorGray;
    font-size: $commonFsSmall;
    height: 0.68rem;
    line-height: 0.68rem;
    text-align: center;
}
.chart-descripe-value {
    margin-left: 4px;
}
.chart-descripe-area{
    // width:2.2rem;
    // display:inline-block;
    white-space: nowrap
}
.chart-descripe-item {
    display: flex;
    width: 100%;
    font-size: $commonFsSmall;
    margin-top: 0.24rem;
    div {
        width: 100%;
        color: $commonFsColorGray;
        &:last-child {
            text-align: right;
            flex: 3;
        }
        &:first-child {
            flex: 2;
            text-align: left;
        }
        span {
            color: #fff;
        }
        .stop-loss {
            color: $commonFsColorRed;
        }
        .stop-win {
            color: $commonFsGreenColor;
        }
    }
}
</style>


