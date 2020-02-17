<template>
  <div>
    <MainLayout
      :title="$route.meta.title"
      :headerStyle="$config.headerStyle"
      class="common-layout-back2"
      :isShowBackWord="false"
      :isShowBottom="true"
      :navPosition="is03SePlatFormCode()?'top':'bottom'"
      :isShowHeader="true"
    >
      <div slot="header-right">
                <span @click="rightBtnAction"
                  class="rightEditBtn"
                >{{isEditing?`${$t('homePage.optionPage.finish')}`:`${$t('homePage.optionPage.edit')}`}}</span>
      </div>
      <div slot="page-body" class="optionalPageClass">
        <div>
          <!--自选管理-->
          <div class="groundBox" v-show="!isNoData">
            <div class="itemBox">
              <v-touch
                @tap="isEditing?'':toPriceWarning(item)"
                :data-item="index"
                v-for="(item,index) in myOption.symbols"
                :key="item.symbol"
                @swipeleft="onSwipeLeft(index)"
                @swiperight="onSwipeRight(index)"
                :swipe-options="{direction: 'horizontal'}"
              >
                <div class="listItemBox">
                  <div class="optionItem" :class="{toRemoveLeft:item.isToLeft}">
                    <div class="itemLeftProduct" :class="{itemNameToRight:item.isToLeft}">
                      <div class="itemProductName">{{item.name}}</div>
                    </div>
                    <div class="itemRightBox">
                      <div v-if="isEditing" @click.stop="toRemoveItem(item,index)" class="removeBox">{{$t('homePage.optionPage.delete')}}</div>
                      <img v-if="!isEditing" style="width: 0.18rem;" src="./homePage/img/new-go.png" />
                    </div>
                    <!--<div-->
                      <!--@click="toRemoveItem(item,index)"-->
                      <!--class="removeClass"-->
                      <!--:class="{leftIng:item.isToLeft}"-->
                    <!--&gt;-->
                      <!--<img style="width:0.44rem;" src="./homePage/img/new-delete.png" />-->
                    <!--</div>-->
                  </div>
                  <div class="optionItemContent">
                    <div class="contentItem">{{$t('homePage.price_monitor')}}：{{item.price_count}}{{$t('homePage.optionPage.individual')}}</div>
                    <div class="contentItem">{{$t('homePage.priceChange')}}：{{item.market_movement_count}}{{$t('homePage.optionPage.individual')}}</div>
                    <div class="contentItem">{{$t('homePage.k_form')}}：{{item.kline_form_count}}{{$t('homePage.optionPage.individual')}}</div>
                    <div class="contentItem">{{$t('homePage.major_Thing')}}：{{item.event_count}}{{$t('homePage.optionPage.individual')}}</div>
                    <div class="contentItem">{{$t('homePage.signal_recommend')}}：{{item.index_count}}{{$t('homePage.optionPage.individual')}}</div>
                  </div>
                </div>
              </v-touch>

            </div>
            <!--<div class="tipTitleClass">-->
            <!--异动、形态、事件及信号等盯盘开启后，将根据自选产品进行监控及推送通知。若自选列表为空，则不推送通知。-->
            <!--</div>-->
            <!--<div class="tipTitleClass" style="padding-bottom: 1rem;">-->
            <!--向左滑动，可删除“自选产品”及其所有“已设盯盘”-->
            <!--</div>-->
          </div>
          <div class="nodata_box" v-show="isNoData && !isEditing">
            <div class="center_view">
              <img @click="toAddProduct" class="add_img" src="./homePage/img/new-addicon.png" />
              <div class="add_title">{{$t('homePage.optionPage.addFree')}}</div>
              <div class="add_content">{{$t('homePage.optionPage.addFreeDetail')}}</div>
            </div>
          </div>
          <div class="nodata_box" v-show="isNoData && isEditing">
            <div class="center_view">
              <img @ class="nodataimg" src="./homePage/img/new-noproduct.png" />
              <div class="add_content">{{$t('homePage.optionPage.noFreeData')}}</div>
            </div>
          </div>

          <div
            ref="popnumbeAnimation"
            v-show="isShowSelect"
            class="popNumber"
            :class="{tranditionPopNumber:isShowSelect}"
          >
            <div class="popNumberTitleBox">
              {{$t('homePage.optionPage.addFree')}}
              <img
                @click="toClosePopView"
                class="closeImgClass"
                src="./homePage/img/new-close@2x.png"
              />
            </div>
            <div class="popContentClass">
              <div class="tabBox">
                <cube-tab-bar
                  v-model="selectedLabelDefault.index"
                  :data="tabs"
                  :showSlider="true"
                  @change="changeType"
                ></cube-tab-bar>
              </div>
              <div class="productListBox">
                <div class="itemBox">
                  <div class="productItem" v-for="item in listData">
                    <div class="leftProduct">
                      <span>{{item.id[1]}}</span>
                      <span style="color:rgba(235,235,245,0.3);margin-left: 0.08rem;">{{item.uname}}</span>
                    </div>
                    <div class="rightButton" :class="{alreadSelect:item.select}">
                      <img v-show="!item.select"
                        style="width: 0.24rem;margin-right: 0.04rem;"
                        :src="item.select?alreadAdd:addImg"
                      />
                      <div
                        @click="toAddSymbolAction(item.id[0],item)"
                        class="buttonTitle"
                      >{{item.select?`${$t('homePage.optionPage.alreadyAddFree')}`:`${$t('homePage.optionPage.addFreeBtn')}`}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div @touchmove.prevent v-show="isShowCommonMask" @click="toCloseMask" class="commonMask"></div>
        </div>
      </div>

      <div slot="page-footer">
        <div v-if="(!(isNoData && !isEditing) && !isButtonAdd)" class="bottom-menu-box">
          <div @click="toAddProduct" class="addOptionItem">
          <img style="width: 0.36rem;margin-right: 0.08rem;" src="./homePage/img/new-add.png"/><div >{{$t('homePage.optionPage.addFree')}}</div>
          </div>
        </div>
      </div>
    </MainLayout>
  </div>
</template>

<script>
  import i18n from '@warning/i18n'
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import request from "@services/documentary.js";
import PageFooter from "@warning/components/PageFooter";
import { getSymbolSorts } from "../mapConfig.js";
import addImg from "./homePage/img/new-add-new.png";
import alreadAdd from "./homePage/img/new-good.png";

import {
  commonError,
  getSearchParams,
  numberFixed,
  getMoneyAmount,
  getPropertyForObject,
  getDataFoxAxiosRequest,
  getInfoFromSessionStorage,
  backToApp,
  isPlatformCodeSe,
  saveInfoToSessionStorage,
  getIsNotificationNeedOpen,
  isIos,
  getInfoFromApp,
  getPlatformCode,
  getDeviceModel,
  getStickyTopValue,
  createVconsoleScript,
  getSymbos,
  getAuthStatu,
  setCookie,
  getCookie,
  getAccount,
  getAccountType,
  trackEventGeneral,
  getNewPlatform,
  isWechatBind,
  goAppLogin,
  isWechatPlatform,
  isFirstVisite,
  getSymbolsBySort
} from "@public/js/util.js";

const globalConsts = require("@public/js/consts.js");
export default {
  name: "optionalPage",
  components: {
    PageFooter
  },
  data() {
    return {
      isButtonAdd:false,
      isEditing: false,
      lengthCount: {
        klineLength: 0,
        priceLength: 0
      },
      isNoData: false,
      isFirstSelect: true,
      isAddNumber: false,
      addImg: addImg,
      alreadAdd: alreadAdd,
      selectedLabelDefault: { index: "" },
      isShowCommonMask: false,
      isShowSelect: false,

      productSelect: true,
      priceSelect: false,
      klineSelect: false,
      thingsSelect: false,
      indexSelect: false,
      myOption: {
        events: [],
        kline_forms: [],
        market_movements: [],
        symbols: [],
        index: []
      },
      alreadySelectSymbolList: [],
      commitIds: "",
      isAllMarket: false,
      isAllKline: false,
      tabs: [],
      listData: []
    };
  },
  created() {
    this.getData();
    // sessionStorage.setItem('waringSymbols','[{"uname":"AUDUSD","id":[105,"澳元美元","currency","外汇",5,0.00024,0.0001,10]},{"uname":"EURCHF","id":[114,"欧元瑞郎","currency","外汇",5,0.0003,0.0001,10.02]},{"uname":"EURUSD","id":[101,"欧元美元","currency","外汇",5,0.00021,0.0001,10]},{"uname":"AUDNZD","id":[118,"澳元纽元","currency","外汇",5,0.00046,0.0001,6.5]},{"uname":"EURGBP","id":[113,"欧元英镑","currency","外汇",5,0.00027,0.0001,12.53]},{"uname":"GBPCHF","id":[116,"英镑瑞郎","currency","外汇",5,0.00046,0.0001,10.02]},{"uname":"NZDJPY","id":[111,"纽元日元","currency","外汇",3,0.049,0.01,9.24]},{"uname":"GBPAUD","id":[117,"英镑澳元","currency","外汇",5,0.00052,0.0001,6.84]},{"uname":"USDCHF","id":[104,"美元瑞郎","currency","外汇",5,0.00031,0.0001,10.04]},{"uname":"GBPUSD","id":[103,"英镑美元","currency","外汇",5,0.0003,0.0001,10]},{"uname":"USDCAD","id":[107,"美元加元","currency","外汇",5,0.00028,0.0001,7.47]},{"uname":"GBPJPY","id":[109,"英镑日元","currency","外汇",3,0.049,0.01,9.24]},{"uname":"EURAUD","id":[115,"欧元澳元","currency","外汇",5,0.00057,0.0001,9.24]},{"uname":"USDJPY","id":[102,"美元日元","currency","外汇",3,0.021,0.01,9.25]},{"uname":"EURJPY","id":[108,"欧元日元","currency","外汇",3,0.024,0.01,9.24]},{"uname":"CADJPY","id":[112,"加元日元","currency","外汇",3,0.04,0.01,9.24]},{"uname":"NZDUSD","id":[106,"纽元美元","currency","外汇",5,0.00026,0.0001,10]},{"uname":"AUDJPY","id":[110,"澳元日元","currency","外汇",3,0.028,0.01,9.24]},{"uname":"HKDCNH","id":[120,"港元离岸人民币","currency","外汇",5,0.0005,0.0001,7.21]},{"uname":"USDCNH","id":[119,"美元离岸人民币","currency","外汇",5,0.00268,0.0001,1.44]},{"uname":"NGAS","id":[359,"天然气","goods","商品",4,0.012,0.001,10]},{"uname":"USOil","id":[351,"美国原油","goods","商品",3,0.06,0.01,10]},{"uname":"UKOil","id":[352,"英国原油","goods","商品",3,0.06,0.01,10]},{"uname":"FRA40","id":[361,"法国FRA40","index","指数",2,1.5,1,20]},{"uname":"TECH100","id":[357,"美国TECH100","index","指数",3,22.5,0.1,20]},{"uname":"SP500","id":[358,"美国SP500","index","指数",3,0.75,1,50]},{"uname":"DJ30","id":[356,"美国DJ30","index","指数",1,6,1,5]},{"uname":"HK50","id":[354,"香港50","index","指数",1,11,1,2]},{"uname":"CHINA300","id":[353,"中华300","index","指数",1,2.6,1,10]},{"uname":"JPN225","id":[355,"日本JPN225","index","指数",1,20,1,2]},{"uname":"GER30","id":[362,"德国GER30","index","指数",2,6,0.1,10]},{"uname":"VIX","id":[430,"恐慌指数","index","指数",3,0.3,0.1,100]},{"uname":"UK100","id":[360,"英国UK100","index","指数",2,2,1,10]},{"uname":"USDINDEX","id":[427,"美汇指数","index","指数",3,0.05,0.01,10]},{"uname":"CHFJPY","id":[448,"瑞郎日元","currency","外汇",3,0.044,0.01,9.24]},{"uname":"EURCAD","id":[444,"欧元加元","currency","外汇",5,0.0005,0.0001,7.45]},{"uname":"EURNZD","id":[445,"欧元纽元","currency","外汇",5,0.00065,0.0001,6.49]},{"uname":"GBPCAD","id":[446,"英镑加元","currency","外汇",5,0.00065,0.0001,7.45]},{"uname":"GBPNZD","id":[447,"英镑纽元","currency","外汇",5,0.00083,0.0001,6.49]},{"uname":"USDSGD","id":[443,"美元新加坡元","currency","外汇",5,0.00059,0.0001,7.3]},{"uname":"XAGUSD","id":[23,"现货白银","goods","商品",3,0.036,0.01,50]},{"uname":"XAUUSD","id":[22,"现货黄金","goods","商品",2,0.37,0.01,10]}]')
    // alert(getSymbolsBySort(getSymbolSorts()[2].value).length)
    // var symbolList = getSymbolsBySort(getSymbolSorts()[0].value)
    // var symbolList = getSymbolsBySort(getSymbolSorts()[0].value)
    // console.log(symbolList)
  },
  mounted() {
    if (this.$route.query.isShow==1) {
      this.isShowSelect = true;
      this.isShowCommonMask = true;
      this.$router.push({name:'optionalPage'})
      setTimeout(() => {
        if (this.isFirstSelect) {
          this.isFirstSelect = false;
          this.selectedLabelDefault.index = "currency";
        }
        this.$refs.popnumbeAnimation.style.bottom = 0;
      }, 100);
    }
    this.handleSymbolSort();
    setTimeout(() => {
      this.addClass();
    }, 1000);
  },

  methods: {
    rightBtnAction(){
      this.isEditing=!this.isEditing
      this.isButtonAdd = !this.isButtonAdd
    },
    finishAction() {
      this.myOption.symbols.forEach(item => {
        item.isToLeft = false;
      });
      this.$forceUpdate();
      this.isEditing = false;
    },
    menuAction(type) {
      if (type == 1) {
        this.myOption.symbols.forEach(item => {
          item.isToLeft = true;
        });
        this.$forceUpdate();
        this.isEditing = true;
      } else {
        this.isButtonAdd = true
        this.toAddProduct();
      }
    },
    compare(property) {
      return function(a, b) {
        var nameA = a[property].toUpperCase(); // ignore upper and lowercase
        var nameB = b[property].toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      };
    },
    changeValue(value) {
      console.log(value);
    },
    toCloseMask() {
      this.isButtonAdd =false
      this.$refs.popnumbeAnimation.style.bottom = -100 + "vh";
      setTimeout(() => {
        this.isShowSelect = false;
        this.isShowCommonMask = false;
      }, 300);
    },
    optionSetOpen(state = false) {
      const _data = [].concat(this.myOption.market_movements);
      const result = _data.map(item => {
        return Object.assign({}, item, { isSelect: state });
      });
      this.myOption = Object.assign({}, this.myOption, {
        market_movements: result
      });
    },
    allMarket(value) {
      if (this.isAddNumber) {
        this.isAddNumber = false;
        return;
      }
      var allvalid = [];
      const _data = [].concat(this.myOption.market_movements);
      _data.forEach(item => {
        item.isSelect = value;
        if (value) {
          allvalid.push(item.id);
        }
      });
      this.myOption = Object.assign({}, this.myOption, {
        market_movements: _data
      });

      //点击后需要重新计算是否全选
      this.handleISAllSelect(this.myOption);

      // this.$forceUpdate()
      setTimeout(() => {
        this.requestData(allvalid.join(","), "market_movements");
      }, 500);
    },
    allKLine(value) {
      if (this.isAddNumber) {
        this.isAddNumber = false;
        return;
      }
      var allvalid = [];
      this.myOption.kline_forms.forEach(item => {
        item.isSelect = value;
        if (value) {
          allvalid.push(item.id);
        }
      });

      //点击后需要重新计算是否全选
      this.handleISAllSelect(this.myOption);

      this.$forceUpdate();
      setTimeout(() => {
        this.requestData(allvalid.join(","), "kline_forms");
      }, 500);
    },
    toPriceWarning(item) {
      this.$router.push({
        path: "/priceWarning/main",
        query: {
          setWarningSymbol: item.ename,
          backPage: "homePage"
        }
      });
    },
    handleAlreadySelectSymbol() {
      this.alreadySelectSymbolList = [];
      this.myOption.symbols.forEach(item => {
        this.alreadySelectSymbolList.push(item.ename);
      });
      this.listData.forEach(item => {
        if (this.alreadySelectSymbolList.indexOf(item.uname) > -1) {
          item.select = true;
        } else {
          item.select = false;
        }
      });
    },
    addClass() {
      //添加homePageNoTouch 去除touch对z-index的影响
      document
        .getElementsByClassName("page-layout-body")[0]
        .classList.add("noOverflowX");
    },
    toRemoveItem(item, index) {
      this.$createDialog({
        type: "confirm",
        title: this.$t('homePage.optionPage.confirmDetlete'),
        content:
          this.$t('homePage.optionPage.confirmDetail'),
        confirmBtn: {
          text: this.$t('homePage.optionPage.confirm'),
          active: true,
          disabled: false,
          href: "javascript:;"
        },
        cancelBtn: {
          text: this.$t('homePage.optionPage.cancle'),
          active: false,
          disabled: false,
          href: "javascript:;"
        },
        onConfirm: () => {
          request
            .deleteGroupPrice({ symbol: item.id, ...this.getUserInfo() })
            .then(res => {
              const resData = getDataFoxAxiosRequest(res, this);
              if (resData) {
                this.myOption.symbols.splice(index, 1);
                this.handleAlreadySelectSymbol();
                if (this.myOption.symbols.length != 0) {
                  this.isNoData = false;
                } else {
                  this.isNoData = true;
                }
              }
            });
        },
        onCancel: () => {
          // item.isToLeft = false;
          // this.$forceUpdate();
        }
      }).show();
    },
    onSwipeLeft(index) {
      // if (index!=undefined ) {
      //    this.myOption.symbols[index].isToLeft =true
      //    this.$forceUpdate()
      // }
    },
    onSwipeRight(index) {
      // if (index!=undefined ) {
      //   this.myOption.symbols[index].isToLeft =false
      //   this.$forceUpdate()
      // }
    },
    toAddSymbolAction(symbol,item) {
      if (item.select){
        request
          .deleteGroupPrice({ symbol: symbol, ...this.getUserInfo() })
          .then(res => {
            const resData = getDataFoxAxiosRequest(res, this);
            if (resData) {
              this.getData();
            }
          });
      }else {
        this.addSymbol(symbol);
      }

    },
    getUserInfo(symbol) {
      let userInfo = getInfoFromSessionStorage() || {};
      return {
        userid: userInfo.userid,
        account: userInfo.account,
        platform: getPlatformCode()
      };
    },
    addSymbol(symbol) {
      request
        .optionPageGroupAdd({ symbol, ...this.getUserInfo() })
        .then(res => {
          const resData = getDataFoxAxiosRequest(res, this);
          if (resData) {
            this.getData();
          }
        });
    },
    handleSymbolSort() {
      var recordSelect = "";
      getSymbolSorts().forEach((item, index) => {
        if (index == 0) {
          this.listData = getSymbolsBySort(item.value);
          this.listData.sort(this.compare("uname"));
        }
        this.tabs.push({
          label: `${item.text}(${getSymbolsBySort(item.value).length})`,
          value: item.value
        });
      });
    },
    changeType(value) {
      this.listData = getSymbolsBySort(value);
      this.handleAlreadySelectSymbol();
      this.listData.sort(this.compare("uname"));
    },
    toAddProduct() {
      this.isButtonAdd =true
      this.isShowSelect = true;
      this.isShowCommonMask = true;
      setTimeout(() => {
        if (this.isFirstSelect) {
          this.isFirstSelect = false;
          this.selectedLabelDefault.index = "currency";
        }

        // document.getElementsByClassName('cube-tab-bar-slider')[0].style.cssText  = `width:${document.getElementsByClassName('cube-tab_active')[0].offsetWidth}px;important`
        this.$refs.popnumbeAnimation.style.bottom = 0;

      }, 100);

      // this.$forceUpdate()
    },
    toClosePopView() {
      this.isButtonAdd =false
      this.$refs.popnumbeAnimation.style.bottom = -100 + "vh";
      setTimeout(() => {
        this.isShowSelect = false;
        this.isShowCommonMask = false;
      }, 300);
    },
    switchSelect(type, isAllSelect = false) {
      this.selectSelectItemSwitch = true;
      var that = this;
      setTimeout(() => {
        //添加--所有有效的--提交到后台
        var allvalid = [];
        const _data = [].concat(this.myOption[type]);
        _data.forEach(item => {
          if (isAllSelect) {
          } else {
            //否则如果不是全选的话，为true的才算
            if (item.isSelect == true) {
              allvalid.push(item.id);
            }
          }
        });
        that.myOption = Object.assign({}, this.myOption, { [type]: _data });
        that.commitIds = allvalid.join(",");

        //点击后需要重新计算是否全选
        that.handleISAllSelect(that.myOption);

        that.requestData(that.commitIds, type);
      }, 500);
    },
    requestData(ids, type) {
      request
        .updateFavoritesOption({ ids: ids, type: type, ...this.getUserInfo() })
        .then(res => {
          const resData = getDataFoxAxiosRequest(res, this);
          if (resData) {
          }
        });
    },
    // 是否是03业务，返回03业务platformCode
    is03SePlatFormCode() {
      return isPlatformCodeSe();
    },
    getData() {
      request.getFavoritesOption({ ...this.getUserInfo() }).then(res => {
        const resData = getDataFoxAxiosRequest(res, this);
        if (resData) {
          this.myOption = resData;
          if (this.myOption.symbols.length != 0) {
            this.isNoData = false;
          } else {
            this.isNoData = true;
          }
          this.alreadySelectSymbolList = [];
          this.myOption.symbols.forEach(item => {
            this.alreadySelectSymbolList.push(item.ename);
          });
          this.handleAlreadySelectSymbol();
          this.handleData(resData);
        }
      });
    },
    //添加switch控制变量---true false
    handleData(apiData) {
      //控制k线异动和行情异动是否全选
      var klineSelectNumber = 0;
      var marketSelectNumber = 0;

      //添加变量+计算是否全选
      Object.keys(apiData).forEach(key => {
        apiData[key].forEach(item => {
          if (item.isvalid == "0") {
            item.isSelect = false;
          } else {
            item.isSelect = true;
            if (key == "market_movements") {
              marketSelectNumber++;
            } else if (key == "kline_forms") {
              klineSelectNumber++;
            }
          }
        });
      });

      this.lengthCount.priceLength = marketSelectNumber;
      this.lengthCount.klineLength = klineSelectNumber;

      //行情和k线---全选判断
      if (marketSelectNumber == apiData.market_movements.length) {
        this.isAllMarket = true;
      }
      if (klineSelectNumber == apiData.kline_forms.length) {
        this.isAllKline = true;
      }
    },
    // 单独计算----k线异动和行情异动是否全选  也可以直接调用handleData方法 但是考虑到需要太多便利
    handleISAllSelect(apiData) {
      var klineSelectNumber = 0;
      var marketSelectNumber = 0;
      // 行情异动
      apiData.market_movements.forEach(item => {
        if (item.isSelect == true) {
          marketSelectNumber++;
        }
      });
      // k线异动
      apiData.kline_forms.forEach(item => {
        if (item.isSelect == true) {
          klineSelectNumber++;
        }
      });

      this.lengthCount.priceLength = marketSelectNumber;
      this.lengthCount.klineLength = klineSelectNumber;

      if (marketSelectNumber == apiData.market_movements.length) {
        if (this.isAllMarket == false) {
          this.isAddNumber = true;
        }
        this.isAllMarket = true;
      } else {
        if (this.isAllMarket) {
          this.isAddNumber = true;
        }
        this.isAllMarket = false;
      }

      if (klineSelectNumber == apiData.kline_forms.length) {
        if (this.isAllKline == false) {
          this.isAddNumber = true;
        }
        this.isAllKline = true;
      } else {
        if (this.isAllKline) {
          this.isAddNumber = true;
        }
        this.isAllKline = false;
      }
    }
  },
  i18n,
  watch: {
    //  isAllMarket:function(newval,old){
    //     this.optionSetOpen(newval)
    //  }
  }
};
</script>
<style>
.noOverflowX {
  overflow-x: hidden !important;
}
.cube-switch .cube-switch-ui::after {
  background-color: transparent !important;
}
.cube-switch .cube-switch-ui {
  border: 3px solid #24242e !important;
}
.cube-switch .cube-switch-input:checked + .cube-switch-ui {
  border: 3px solid transparent !important;
}
.optionalPageClass .cube-tab-bar-slider {
  background: none !important;
}
.optionalPageClass .cube-tab-bar-slider:after {
  content: " ";
  display: block;
  background: #fdfdfd;
  height: 2px;
  width: 36px;
  text-align: center;
  margin: 0 auto;
}
.optionalPageClass .cube-tab {
  padding: 0.16rem 0 !important;
}
.optionalPageClass .cube-switch .cube-switch-ui::after {
  background-color: #fff !important;
}
.homePageNoTouch {
  -webkit-overflow-scrolling: auto !important;
}
</style>
<style scoped lang="scss">
.bottom-menu-box {
  justify-content: center;
  align-items: center;
  height: 1rem;
  box-sizing: border-box;
  font-size: 0.28rem;
  font-weight: 500;
  display: flex;
  color: rgba(255, 255, 255, 1);
  line-height: 0.28rem;
  align-items: center;
  background: #31313D;
}

.tipTitleClass {
  font-size: 0.24rem;
  font-weight: 400;
  color: rgba(235, 235, 245, 0.3);
  line-height: 0.36rem;
  padding: 0.18rem 0.28rem 0 0.28rem;
}
.commonMask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 500;
}

.popNumber {
  flex-direction: column;
  align-items: stretch;
  height: 9rem;
  display: flex;

  transition: bottom ease-out 0.3s;
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
    align-items: center;
    justify-content: center;
    display: flex;
    font-size: 0.28rem;
    font-weight: 500;
    color: rgba(235, 235, 245, 0.85);
    line-height: 0.88rem;
    text-align: center;
  }
  .popContentClass {
    height: 2px;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    .tabBox {
      padding: 0.2rem 0;
      box-sizing: border-box;
      border-top: 0.02rem solid #23232b;
      border-bottom: 0.02rem solid #23232b;
    }
    .productListBox {
      flex: 1;
      overflow-y: scroll;
      .itemBox {
        padding-left: 0.28rem;
        .productItem {
          border-bottom: 0.02rem solid #23232b;
          height: 1rem;
          padding: 0 0.28rem 0 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .leftProduct {
            font-size: 0.32rem;
            font-weight: 400;
            color: rgba(235, 235, 245, 0.85);
          }
          .rightButton {
            width: 1.2rem;
            height: 0.52rem;
            box-sizing: border-box;
            border-radius: 0.08rem;
            border: 0.02rem solid rgba(51, 133, 255, 1);
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 0.24rem;
            font-weight: 400;
            color: rgba(76, 148, 255, 1);
            .buttonTitle {
              line-height: 0.52rem;
            }
          }
          .alreadSelect {
            border: 0.02rem solid #f66 !important;
            color: #f66 !important;
          }
        }
      }
    }
  }

  position: fixed;
  bottom: 0; //-100vh;
  left: 0;
  right: 0;
  background-color: #292933;
  z-index: 800;
}

.addOptionItem {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  font-size: 0.32rem;
  font-weight: 400;
  color: rgba(76, 148, 255, 1);
}
.optionalPageClass {
  color: white;
  /*height: 100vh;*/
  /*background-color:#292933;*/

  .nodata_box {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .center_view {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .nodataimg {
        width: 1.92rem;
        height: 1.92rem;
      }
      .add_img {
        width: 0.64rem;
        padding: 0.32rem;
        background: rgba(51, 133, 255, 1);
        border-radius: 0.08rem;
      }
      .add_title {
        font-size: 0.28rem;
        font-weight: 400;
        color: rgba(235, 235, 245, 0.3);
        line-height: 0.42rem;
        margin-top: 0.16rem;
      }
      .add_content {
        margin-top: 0.16rem;
        width: 4.16rem;
        font-size: 0.32rem;
        font-weight: 400;
        color: rgba(235, 235, 245, 0.3);
        line-height: 0.48rem;
        text-align: center;
      }
    }
  }
  .tipTitleClass {
    font-size: 0.24rem;
    font-weight: 400;
    color: rgba(235, 235, 245, 0.3);
    line-height: 0.36rem;
    padding: 0.18rem 0.28rem 0 0.28rem;
  }
  .groundBox {
    .itemBox {
      /*background-color: #23232B;*/
      .toRemoveLeft {
        transform: translateX(-1.8rem);
      }
      .listItemBox {
        background-color: #292933;
        margin-bottom: 0.17rem;
        position: relative;
        .optionItem {
          transition: transform ease-out 0.3s;
          position: relative;
          .removeClass {
            transition: right ease-out 0.1s;
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            right: -1.8rem;
            top: 0;
            height: 100%;
            background-color: #ff4d4d;
            width: 1.8rem;
          }
          box-sizing: border-box;
          min-height: 0.88rem;
          border-bottom: 0.02rem solid #23232b;
          background-color: #292933;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 0.28rem 0 0.28rem;
          .itemLeftBox {
            font-size: 0.36rem;
            font-weight: 800;
            color: rgba(255, 255, 255, 1);

            display: flex;
            align-items: center;
            .itemLeftImg {
              margin-left: 0.2rem;
              width: 0.2rem;
              height: 0.2rem;
              background-color: red;
            }
          }
          .itemNameToRight {
            transform: translateX(1.8rem);
          }
          .itemLeftProduct {
            transition: transform ease-out 0.3s;
            padding-right: 0.5rem;
            .itemProductName {
              font-size: 0.32rem;
              font-weight: 400;
              color: rgba(235, 235, 245, 0.85);
            }
            .itemContent {
              font-size: 0.24rem;
              font-weight: 400;
              color: rgba(235, 235, 245, 0.3);
              margin-top: 0.12rem;
              line-height: 0.36rem;
            }
          }
          .itemRightBox {
            .removeBox {
              display: flex;
              justify-content: center;
              align-items: center;
              font-size:0.24rem;
              color:rgba(255,102,102,1);
              width:1.12rem;
              box-sizing: border-box;
              height:0.48rem;
              border-radius:0.08rem;
              border:0.02rem solid rgba(255,77,77,1);
            }
            display: flex;
            align-items: center;
            .itemRightImg {
              transition: transform 0.2s;
              /*margin-left: 0.2rem;*/
              width: 0.28rem;
            }
            .itemRightImgTransform {
              transform: rotate(180deg);
            }
          }

          .leftIng {
            /*right: 0 !important;*/
          }
        }
        .optionItemContent {
          background: rgba(41, 41, 51, 1);
          padding: 0 0.28rem 0.23rem 0.28rem;
          display: flex;
          flex-wrap: wrap;
          .contentItem {
            font-size: 0.24rem;
            font-weight: 400;
            color: rgba(235, 235, 245, 0.6);
            line-height: 0.33rem;
            flex: 0 0 33.3%;
            margin-top: 0.2rem;
          }

          .contentItem:nth-child(2) {
            text-align: center;
          }
          .contentItem:nth-child(3) {
            text-align: right;
          }
          .contentItem:nth-child(5) {
            text-align: center;
          }
        }
      }
    }
  }

  .groundBox > .optionItem:last-child {
    border-bottom: none;
  }
}

.rightEditBtn{
  font-size:0.32rem;
  font-weight:400;
  color:rgba(76,148,255,1);
  /*line-height:32px;*/
}
</style>

