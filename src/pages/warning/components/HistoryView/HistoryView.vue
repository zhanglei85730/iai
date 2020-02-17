<template>
  <div>
    <!--显示蒙层-->
    <div @touchmove.prevent @click="toClosePopView" v-show="isShow" class="historyMask"></div>
    <div
      ref="popnumbeAnimation"
      @touchmove.prevent
      v-show="isShow"
      class="popNumber"
      :class="{tranditionPopNumber:isShow}"
    >
      <div class="popNumberTitleBox">
        {{getName()}}_{{getLineType(infoModel.cycle)}}_{{infoModel.up_down ==1?`${$t('homePage.historyView.do_many')}`:`${$t('homePage.historyView.do_blank')}`}}{{$t('homePage.historyView.signal')}}
        <img
          @click="toClosePopView"
          class="closeImgClass"
          src="../../views/homePage/img/new-close@2x.png"
        />
      </div>
      <div class="popContentClass">
        <div class="conditionBox">
          <div class="conditionName">{{$t('homePage.historyView.signal_condition')}}</div>
          <div
            class="conditionDetail"
          >{{getSelectOptions({type:'cycle',value:infoModel.cycle})[0].text}}{{$t('homePage.messageView.k_chart_show')}}：{{infoModel.stare_condition}}</div>
        </div>

        <div class="reasonBox">
          <div class="reasonName">{{$t('homePage.historyView.recommend_reason')}}</div>
          <div class="reasonContent">
            <div>
              <div class="reasonTitle">{{$t('homePage.historyView.pay_winrate')}}</div>
              <div class="reasonNumber">{{infoModel.winrate}}%</div>
            </div>
            <div>
              <div class="reasonTitle">{{$t('homePage.historyView.pay_scale')}}</div>
              <div class="reasonNumber">{{infoModel.profit_ratio}}</div>
            </div>
            <div>
              <div class="reasonTitle">{{$t('homePage.historyView.expect')}}</div>
              <div class="reasonNumber" style="text-align: right;">${{infoModel.expect}}</div>
            </div>
          </div>
        </div>
        <div class="historyBox">
          <div class="historyTitle">{{$t('homePage.historyView.history_count')}}</div>
          <div class="historyNumerBox">
            <span>{{$t('homePage.historyView.trigger_total')}}</span>
            <span class="numberClass">{{infoModel.trigger_total}}</span>
          </div>
          <div class="historyNumerBox">
            <span>{{$t('homePage.historyView.touch_pay',{point:getSelectOptions({type:'cycle',value:infoModel.cycle})[0].text})}}  </span>
            <span class="numberClass">{{infoModel.avg_win_profit}}</span>
          </div>
          <div class="historyNumerBox">
            <span>{{$t('homePage.historyView.stop_win')}}</span>
            <span class="numberClass">{{infoModel.stop_win}}</span>
          </div>
          <div class="historyNumerBox">
            <span>{{$t('homePage.historyView.stop_loss')}}</span>
            <span class="numberClass">{{infoModel.stop_loss}}</span>
          </div>
          <div class="popTipBox">{{$t('homePage.historyView.bottom_tip')}}</div>
          <div
            :class="{isExpire:infoModel.is_expire == '1'?true:false}"
            @click="infoModel.is_expire == '1'?'':toPayAction(infoModel.ename)"
            class="popButtonBox"
          >{{infoModel.is_expire == '1'?`${$t('homePage.messageView.signal_failure')}`:$config.isWechatPlatform?$t('homePage.messageView.signal_avliable'):`${$t('homePage.messageView.look_chart')}`}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import i18n from '@warning/i18n'
import { getSymbolInfoById, isIos } from "@public/js/util.js";
import { getSelectOptions } from "../../mapConfig";
export default {
  name: "HistoryView",
  props: {
    isShow: {
      type: Boolean,
      require: true
    },
    infoModel: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      getSelectOptions: getSelectOptions
    };
  },
  watch: {
    isShow(newValue, oldValue) {
      if (newValue) {
        setTimeout(() => {
          this.$refs.popnumbeAnimation.style.bottom = 0;
          document
            .getElementsByClassName("page-layout-body")[0]
            .classList.add("homePageNoTouch");
        }, 100);
      }
    }
  },
  i18n,
  methods: {
    toClosePopView() {
      this.$refs.popnumbeAnimation.style.bottom = -100 + "vh";
      setTimeout(() => {
        document
          .getElementsByClassName("page-layout-body")[0]
          .classList.remove("homePageNoTouch");
        this.$emit("closeFinish");
      }, 300);
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
    getName() {
      if (this.getChineseName(this.infoModel.symbol_id) == undefined) {
        return "- -";
      } else {
        return this.getChineseName(this.infoModel.symbol_id).cname;
      }
    },
    getChineseName(symbol) {
      var item = getSymbolInfoById(symbol);
      var infoArray = item.id;
      if (item == null || item == undefined) {
        return { cname: "- -", ename: "- -" };
      }
      if (!!infoArray) {
        return { cname: infoArray[1], ename: item.uname };
      }
    },
    toPayAction(symbol) {
      if(this.$config.isWechatPlatform){
        return false
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
    }
  }
};
</script>

<style scoped lang="scss">
.historyMask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 200;
}
.popNumber {
  transition: bottom ease-out 0.3s;
  .reasonBox {
    border-bottom: 0.02rem solid rgba(35, 35, 43, 1);
    padding-bottom: 0.32rem;
    margin-top: 0.48rem;
    .reasonName {
      font-size: 0.32rem;
      font-weight: 800;
      color: rgba(255, 255, 255, 1);
      line-height: 0.32rem;
      margin-bottom: 0.24rem;
    }
    .reasonContent {
      display: flex;
      justify-content: space-between;
      .reasonTitle {
        font-size: 0.24rem;
        font-weight: 400;
        color: rgba(235, 235, 245, 0.3);
        line-height: 0.24rem;
        margin-bottom: 0.08rem;
      }
      .reasonNumber {
        font-size: 0.32rem;
        font-weight: 500;
        color: rgba(235, 235, 245, 0.85);
        line-height: 0.32rem;
      }
    }
  }
  .conditionBox {
    .conditionName {
      font-size: 0.32rem;
      font-weight: 800;
      color: rgba(255, 255, 255, 1);
      line-height: 0.32rem;
      margin-bottom: 0.13rem;
    }
    .conditionDetail {
      font-size: 0.28rem;
      font-weight: 400;
      color: rgba(235, 235, 245, 0.6);
      line-height: 0.42rem;
    }
  }
  .popNumberTitleBox {
    position: relative;
    .closeImgClass {
      width: 0.36rem;
      right: 0.28rem;
      top: 0;
      bottom: 0;
      margin: auto 0;
      position: absolute;
    }
    box-sizing: border-box;
    height: 0.88rem;
    font-size: 0.28rem;
    font-weight: 500;
    color: rgba(235, 235, 245, 0.85);
    line-height: 0.88rem;
    text-align: center;
    border-bottom: 0.02rem solid rgba(35, 35, 43, 1);
  }
  .popContentClass {
    padding: 0.28rem;
    color: rgba(255, 255, 255, 1);
    .historyBox {
      margin-top: 0.32rem;
      .historyTitle {
        height: 0.32rem;
        font-size: 0.32rem;
        font-weight: 800;
        color: rgba(255, 255, 255, 1);
        line-height: 0.32rem;
        margin-bottom: 0.16rem;
      }
      .historyNumerBox {
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        height: 0.6rem;
        font-size: 0.26rem;
        font-weight: 500;
        color: rgba(235, 235, 245, 0.6);
        .numberClass {
          color: rgba(235, 235, 245, 0.85);
        }
      }
      .popTipBox {
        margin-top: 0.36rem;
        font-size: 0.24rem;
        font-weight: 400;
        color: rgba(235, 235, 245, 0.3);
        line-height: 0.36rem;
      }
      .isExpire {
        background: rgba(86, 86, 102, 1) !important;
        color: rgba(61, 61, 77, 1) !important;
      }
      .popButtonBox {
        margin-top: 0.36rem;
        box-sizing: border-box;
        height: 0.92rem;
        background: rgba(51, 133, 255, 1);
        border-radius: 0.06rem;
        font-size: 0.36rem;
        font-weight: 800;
        color: rgba(255, 255, 255, 1);
        line-height: 0.92rem;
        text-align: center;
      }
    }
  }
  position: fixed;
  bottom: -100vh;
  left: 0;
  right: 0;
  background-color: #292933;
  z-index: 600;
}
</style>
