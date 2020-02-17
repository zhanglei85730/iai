<template>
  <div>
    <MainLayout :title="pageTitle" :isShowHeader="true" :headerStyle="$config.headerStyle" class="common-layout-back2 my-warning-layout" :isShowBackWord="false" :isScroll="true" :backBtnFun="backFunc"
      :backBtnTxt="$route.query.backTitle" :flexSet="{center:6}" name='myWarning' @mainScrollBoxScrollTop="mainScroll">
      <div slot="header-left">
        <img src="static/img/commonPage/header_back_arrow.png" class="common-header-left-icon" @click="pageBack" />
        <img src="static/img/warning/more_hamburger@2x.png" class="common-header-left-icon common-header-left-more" v-show="!isShowComment" @click="topLeftDropMenuShow" />
      </div>
      <div slot="header-right">
        <span class="price-warning-top-menu" v-if="!isShowComment" @click="topRightMenuHandle">...</span>
      </div>
      <div slot="page-body" class="price-warning-body page-body-background">
        <!-- 'top-for-app':$config.userFromType()=='app' -->
        <div class="price-warning" v-show="!isShowComment" ref="priceWarning" id="priceWarningContainer">
          <!-- 价格盯盘 -->
          <div class="top-price-box common-card-background" :class="{'sticky':isTabMenufixed}" ref="topPrice">
            <div class="top-price-item top-price-symbol">
              <div class="top-price-title">{{symbolCnName}}</div>
              <div class="top-price-title">{{symbolEnName}}</div>
            </div>
            <div class="top-price-item">
              <div class="top-price-title"
                :class="{'common-up-color':symbolWebsocketData[1].buyPrice>symbolWebsocketData[0].buyPrice,'common-down-color':symbolWebsocketData[1].buyPrice<symbolWebsocketData[0].buyPrice}">
                {{symbolWebsocketData[1].buyPrice}}</div>
              <div class="top-price-title">{{$t('priceWarning.buyPrice')}}</div>
            </div>
            <div class="top-price-item">
              <div class="top-price-title"
                :class="{'common-up-color':symbolWebsocketData[1].sellPrice>symbolWebsocketData[0].sellPrice,'common-down-color':symbolWebsocketData[1].sellPrice<symbolWebsocketData[0].sellPrice}">
                {{symbolWebsocketData[1].sellPrice}}</div>
              <div class="top-price-title">{{$t('priceWarning.sellPrice')}}</div>
            </div>
            <div class="top-price-item">
              <div class="top-price-title"
                :class="{'common-up-color':symbolWebsocketData[1].nowPrice>symbolWebsocketData[0].nowPrice,'common-down-color':symbolWebsocketData[1].nowPrice<symbolWebsocketData[0].nowPrice}">
                {{symbolWebsocketData[1].nowPrice}}</div>
              <div class="top-price-title">{{$t('priceWarning.newestPrice')}}</div>
            </div>
            <div class="top-price-item">
              <div class="top-price-title" :class="{'common-up-color':symbolWebsocketData[1].changeRate>0,'common-down-color':symbolWebsocketData[1].changeRate<0}">
                {{symbolWebsocketData[1].changeRate | changeRateFormat}}</div>
              <div class="top-price-title">{{$t('priceWarning.upOrDownPrice')}}</div>
            </div>
          </div>
          <div class="divider"></div>
          <!-- 分割线 -->
          <div class="box-title-box common-card-background">
            <div class="box-title">
              <span class="box-title-text">{{$t('priceWarning.priceDinPan')}}({{priceDingpanOpenCount}})</span>
              <span class="box-title-add" @click="addSetWarning">+</span>
            </div>

          </div>
          <div class="common-card-background swicth-set-warning-comp">
            <SwicthSetWarning :data="setData" @delete="deleteItemHandle" @swipeLeft="swipeLeftHandle" @swipeRight="swipeRightHandle" @unitSelect="unitSelectHandle" @selectPrice="selectPriceHandle"
              :priceVarData="priceVarData" @inputChange="inputChangeHandle" @inputBlur="inputBlurHandle" @switchChange='switchChangeHandle' :renderId='swicthSetWarningId' />
          </div>
          <!-- 提醒频率 -->
          <div class="common-card-background">
            <div class="select-row font-style1">
              <div class="select-row-item">{{$t('priceWarning.warnFrequency')}}</div>
              <div class="select-row-item" @click="frequenciesSelect"><span class="coustom-comment-count">{{frequencyName}}</span><img src="static/img/warning/arrow@2x.png" class='select-row-arrow' />
              </div>
            </div>
          </div>
          <!-- 自定义备注入口 -->
          <div class="common-card-background">
            <div class="select-row font-style1" @click="customCommentHandle" style="border-bottom:none">
              <div class="select-row-item">{{$t('priceWarning.customComment')}}</div>
              <div class="select-row-item"><span class="coustom-comment-count">{{countCommentAmount}}个</span><img src="static/img/warning/arrow@2x.png" class='select-row-arrow' /></div>
            </div>
          </div>
          <div class="divider"></div>
          <ManagerItem @changeValue="managerChange" :data="managerOption" @getData="getDataHandle" />
          <div class="tipTitleClass">
            {{$t('priceWarning.tipText01')}}
          </div>
          <!-- 保存按钮 -->
          <div class="bottom-save-box">
            <SideSpace value="0.28rem">
              <button class="common-button-style01" slot="content" @click="submitData"
                v-if="(saveButtonDisable && ( isAdd || isModify || isCommentModify)) || isCommentModify">{{$t('priceWarning.saveBtnText')}}</button>
              <button class="common-button-style01 common-button-disable" v-else slot="content" disabled>{{$t('priceWarning.saveBtnText')}}</button>
            </SideSpace>
          </div>
        </div>
        <!-- 自定义备注 'top-for-app':$config.userFromType()=='app',-->
        <div class="custom-comment-box common-layout-back2" :class="{'custom-comment-box-web-height':userFromType==4,'custom-comment-box-app-height':userFromType==1}" v-show="isShowComment">

          <div class="comment-item" v-for="(item,index) in setData" :key="index">
            <div v-if="commentFilter(item)">
              <div class="comment-title">{{item | commentTitleName}}</div>
              <div class="comment-input">
                <input :placeholder="$t('priceWarning.placeholder01')" type="text" v-model="item.comment" class="comment-input-main" maxlength="16" @keyup="commentChange" />
                <div class="comment-input-label">{{item.comment.length}}/16</div>
              </div>
            </div>
          </div>
          <!-- 自定义无数据 -->
          <div class="no-data" v-if="setData.length==0">
            <NoData :text="$t('priceWarning.placeholder02')" width="3.2rem" iconPath="static/img/warning/new_icon_no_warning@3x.png" />
          </div>
        </div>
        <!-- 自定义盯盘结束 -->
      </div>
    </MainLayout>
    <!-- unitPopupVisible -->
    <MaskPop :visible="unitPopupVisible" zIndex="100" @maskClick="unitOptionMaskHandle">
      <div slot="content" class="unit-select-options-container">
        <div class="unit-select-options-box" :class="unitFlag==1?'active-point':'active-persent'" :style="unitSelectPopupStyle">
          <div class="unit-select-arrow"></div>
          <div class="unit-select-options-point" @click="unitOptionSelect(1)">{{$t('priceWarning.setUnitDot')}}</div>
          <div class="unit-select-options-persent" @click="unitOptionSelect(0)">{{$t('priceWarning.setUnitPersent')}}</div>
        </div>

      </div>
    </MaskPop>

    <MaskPop :visible="topRightMenuMaskVisible || topLeftMenuMaskVisible" @maskClick="maskClickHandle" />
    <!-- 顶部左边菜单  {
                icon:'static/img/warning/icon_file@3x.png',
                text:'产品详情'
                }-->
    <DropPopMenu class="top-right-menu price-warning-top-left-menu" :data="[{
                icon:'static/img/warning/icon_home@3x.png',
                text:$t('priceWarning.pageTitle_homePage')
            },
            {
               icon:'static/img/warning/icon_set@3x.png',
            text:$t('priceWarning.pageTitle_warningMannge')
            }, {
               icon:'static/img/warning/bell_icon@2x.png',
            text:$t('priceWarning.pageTitle_indexWarngin')
            }, {
                icon:'static/img/warning/icon_file@3x.png',
                text:$t('priceWarning.pageTitle_productDetail')
                }]" @select="topLeftMenuSelect" :visible="topLeftMenuMaskVisible" />
    <!-- 顶部右边菜单 -->
    <DropPopMenu :arrowStyle="{left:'1.8rem'}" class="top-right-menu price-warning-top-right-menu" :data="getDropPopData()" @select="topRightMenuSelect" :visible="topRightMenuMaskVisible" />
    <Dialog :btns="btnData" :visible="customDialogVisible" direct="row" />
    <!-- 授权 -->
    <!-- 非微信 -->
    <div>
      <!-- 授权弹出层 -->
      <LoginPop class="warning-author-pop" @authSuccessAfter="authSuccessAfterHandle" :isShow="isAuthStart" :isAuth="isAuthStart" @hide="loginPopHideHandle" />
      <!-- 为登录、游客弹出层 -->
      <AuthPop :isShow="loginPopVisible" @cancle="AuthPopcancleHandle" />
    </div>
    <!-- 微信登录注册框 isWeChatLogin-->
    <WeChatLogin :show="isWeChatLogin" @close="weChatLoginClose" refreshPage="1" />
    <!-- 授权 -->
    <GuideLayer :visible="newGuiderShow" />
  </div>
</template>
<script>
import i18n from '@warning/i18n'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import request from '@services/documentary.js'
import SwicthSetWarning from '../components/swicthSetWarning'
import NoData from '@warning/components/noData'
import MaskPop from '@components/MaskPop'
import DropPopMenu from '@warning/components/DropPopMenu'
import GuideLayer from '@warning/components/GuideLayer'
//Dialog
import Dialog from '@warning/components/Dialog'
import { getPriceWarningNameByTrigger, getWarningCondition, getPriceTriggerTypeByCode, priceWarningQuery } from '../mapConfig.js'
import {
  getInfoFromSessionStorage,
  commonError,
  getDataFoxAxiosRequest,
  isObject,
  getPlatformCode,
  getSymbolInfoById,
  iConsole,
  getSymbolInfoByEname,
  backToApp,
  newUserFromType,
  getAuthStatu,
  getNewPlatform,
  isWechatBind,
  isIaiTraderApp,
  goAppLogin,
  isWechatPlatform,
  noticeToast,
  getIsNotificationNeedOpen,
  cookieForFirstShowNotice
} from '@public/js/util.js'
import SelectActionSheet from '@warning/components/SelectActionSheet'
import warningCoreData from '@warning/warningDataConfig'
import ManagerItem from '@warning/components/ManagerItem'
const globalConsts = require('@public/js/consts.js')
export default {
  components: {
    SwicthSetWarning,
    MaskPop,
    DropPopMenu,
    NoData,
    Dialog,
    ManagerItem,
    GuideLayer
  },
  data() {
    return {
      swicthSetWarningId: 1,
      unitFlag: '1',
      newGuiderShow: false,
      symbol: 105,
      // 最新价
      newPrice: 0,
      // 涨跌幅
      changeRate: 0,
      // 买价
      buyPrice: 0,
      //卖价
      sellPrice: 0,
      setData: [],
      // 更新数据id
      setDataId: '',
      symbolWebsocketData: [
        // 上次价格
        { nowPrice: 0, changeRate: 0, buyPrice: 0, sellPrice: 0 },
        // 现在价格
        { nowPrice: 0, changeRate: 0, buyPrice: 0, sellPrice: 0 }
      ],

      // 是否显示自定义备注
      isShowComment: false,
      pageTitle: '',
      // 选择单位
      unitSelectPopupStyle: {},
      unitPopupVisible: false,
      // 选择单位项在data中的index
      unitSelectIndexInData: -1,
      topLeftMenuMaskVisible: false,
      topRightMenuMaskVisible: false,
      priceVarData: {},
      symbolDigit: 4,
      symbolCnName: '',
      symbolEnName: '',
      // 频率相关
      frequencyValue: '',
      frequencyName: '',
      frequencyActive: 1,
      userFromType: '',
      isModify: false,
      isAdd: false,
      isCommentModify: false,
      symbolPip: 0,
      saveButtonDisable: true,
      // 点 %单位选择时相对应的setData的索引值
      unitSelectIndex: -1,
      btnData: [],
      customDialogVisible: false,
      // 授权
      isAuthStart: false,
      loginPopVisible: false,
      isWeChatLogin: false,
      indexWarningParmas: {},
      isTabMenufixed: false,
      managerOption: {},
      managerSetedData: {},
      // 行情异动计数 第一次除外视为修改
      managerChangeCount: 0,
      // 输入校验值
      validateValue: '',
    }
  },
  filters: {
    // 涨跌幅百分比化
    changeRateFormat(changeRate = '') {
      try {
        return `${Number(changeRate).toFixed(2)}%`
      } catch (e) {
        return changeRate
      }
    },
    commentTitleName({ condition: { params, trigger = '' }, warning_type = '' }) {
      const priceTrigger = warningCoreData.triggerType
      const { type = '', target = '' } = params;
      let warningItem = '';
      if (type == '' && trigger != '') {
        warningItem = getWarningCondition(trigger, warning_type)
        if (!!warningItem) {
          return warningItem.text
        } else {
          return ''
        }
      } else {
        try {
          return getPriceWarningNameByTrigger(type).text
        } catch (e) {
          return '';
          iConsole('获取触发类型出错了')
        }
      }
    },
  },
  methods: {
    ...mapMutations(['symbolsWebSocketSendMsg', 'updateDataStoreForSocket', 'websocketClose']),
    ...mapActions(['createWebSocketForSymbols']),
    managerChange(data) {
      this.directDialog();
      this.isModify = true;
      this.managerSetedData = data
    },
    getDataHandle(data) {
      this.managerSetedData = data
    },

    mainScroll(scrollTop) {
      console.log(scrollTop, this.$refs.topPrice.offsetTop)
      if (scrollTop + 50 > this.$refs.topPrice.offsetTop) {
        this.isTabMenufixed = true
      } else {
        this.isTabMenufixed = false
      }
    },
    switchChangeHandle() {
      this.isModify = true;
      this.directDialog()
    },
    // 获取右上角 配置数据
    getDropPopData() {
      const t = this;
      if (isWechatPlatform() || isIaiTraderApp()) {
        return [
          //     {
          //     icon: 'static/img/warning/icon_more_hamburger@3x.png',
          //     text: t.$t('priceWarning.changeService'),
          //     url: '/myWarning'
          // },
          {
            icon: 'static/img/warning/icon_dialog@2x.png',
            text: t.$t('priceWarning.feedback'),
            url: '/feedback'
          }]
      } else {
        return [
          {
            icon: 'static/img/warning/icon_dialog@2x.png',
            text: t.$t('priceWarning.feedback'),
            url: '/feedback'
          }]
      }

    },
    commentChange(item, index) {
      this.isCommentModify = true;
    },
    //======================触发授权流程===================
    // 是否登录
    // 调转登录
    goToLogin() {
      if (getNewPlatform()) {
        this.isWeChatLogin = true
      } else {
        this.$router.push({ name: 'login', query: { loginAfterTo: 'index' } })
      }

    },
    isAuthed() {
      //app 未登录
      if (this.$config.userFromType() == 'app') {
        // 未登录
        if (!this.$config.isLogined()) {
          //iai-trade app
          if (isIaiTraderApp()) {
            // 跳转登录界面（原生app,url拦截）
            goAppLogin(this.$router.history.current.path);
            return false
          }
          //微信服务号
          if (isWechatPlatform()) {
            this.isWeChatLogin = true
          } else {
            this.loginPopVisible = true;
          }
          return false;
        } else {
          return true;
          // 登录后再校验是否授权，如果已校验未登录弹出未登录不提示授权
        }
        // web 未登录
      } else {
        if (!this.$config.isLogined()) {
          this.goToLogin();
          return false;
        } else {
          return true
        }
      }
    },
    authTrigger() {
      if (!this.isAuthed()) return false;
      // 从localstorage获取保存的授权状态，为-1 提示授权
      if (getAuthStatu() === globalConsts.auth.statu.fail) {
        console.log('545')
        if (isWechatBind() && getNewPlatform()) {

        } else {
          console.log('549')
          this.isAuthForApp();
          return false;
        }
      } else {
        console.log('554')
        return true
      }
    },
    isAuthForApp() {
      console.log('556')
      // PF00新平台
      if (isWechatPlatform() && !isWechatBind()) {
        console.log('559')
        this.isWeChatLogin = true
        //01 02 03等老平台
      } else {
        console.log('562')
        this.isAuthStart = true;
      }

    },
    authSuccessAfterHandle() {

    },
    loginPopHideHandle(data) {
      this.isAuthStart = false
    },
    AuthPopcancleHandle() {
      this.loginPopVisible = false
    },
    // 隐藏wechatlogin
    weChatLoginClose() {
      this.isWeChatLogin = false
    },
    //==============是否授权 end============================
    // 获取基准价格
    getBasePrise(triggerType) {
      let basePrice = ''
      try {
        const _symbolWebsocketData = this.symbolWebsocketData[1]
        const filterByType = priceWarningQuery({ table: 'triggerData', field: 'type', value: triggerType });
        switch (filterByType[0].basePrice) {
          case 0: {
            basePrice = _symbolWebsocketData.nowPrice;
            break;
          }
          case 1: {
            basePrice = _symbolWebsocketData.buyPrice;
            break;
          }
          case 2: {
            basePrice = _symbolWebsocketData.sellPrice;
            break;
          }
          default: {            inpu
            basePrice = _symbolWebsocketData.nowPrice;
          }
        }
        return basePrice
      } catch (e) {
        console.log('获取基准价格出错')
        return 'null'
      }
    },
    inputBlurHandle(item, index) {
      // 上涨类型
      const t = this;
      const upTriggerType = [500];
      // 下跌类型
      const downTriggerType = [501];
      // let isError = false;
      if (this.setData.length > 0) {
        const _setData = this.setData.map((item, innerIndex) => {
          const _item = Object.assign({}, item)
          const { trigger = '', condition: { params } } = _item;
          const { target = 0, point = '', flag = 1, type: triggerType = '' } = params;
          const _target = Number(target)
          if (trigger == 502 || trigger == 503 || trigger == 511 || trigger == 510) {
            const _point = Number(point);
            if (point != '') {
              // 输入保留位数(点数保留2位，%保留2位)
              if (_point != 0) {
                _item.condition.params.point = flag == 1 ? _point.toFixed(1) : _point.toFixed(2);
              }

            } else {
              //  // 输入保留位数(点数保留2位，%保留2位)
              if (_target != 0) {
                _item.condition.params.point = flag == 1 ? _point.toFixed(1) : _point.toFixed(2);
              }
            }

          } else {
            // 输入整数保留一位小数
            if (_target != 0) {
              _item.condition.params.target = _target.toFixed(t.symbolDigit);
            }
          }
          //
          let basePrice = t.getBasePrise(triggerType)
          // 校验上涨类型输入值不能小于基准值
          if (target != '' && innerIndex == index && upTriggerType.indexOf(trigger) >= 0 && _target <= t.symbolWebsocketData[1].nowPrice) {
            _item['inputTip'] = `${$t('priceWarning.moreThan')}${basePrice}`
            _item['isShowTip'] = true
          }
          // 校验下跌类型输入值不能大于基准值
          if (target != '' && innerIndex == index && downTriggerType.indexOf(trigger) >= 0 && _target >= t.symbolWebsocketData[1].nowPrice) {
            _item['inputTip'] = `${$t('priceWarning.lessThan')}${basePrice}`;
            _item['isShowTip'] = true
          }
          return _item
        })
        this.setData = _setData
      }

    },
    // 跳转
    directDialog() {
      if (this.$route.params.page == 'main') {
        if (!this.isModify || !this.isAdd) {
          this.$router.push({ path: '/priceWarning/quitDialog', query: { ...this.$route.query, back: true } })
        } else {
          this.$router.go(-1)
        }
      } else {

      }

    },
    // 是否上涨或下跌类型 返回1表示上涨类型 0表示下跌类型
    upOrDownType(triggerType) {
      // 上涨类型
      const upTriggerType = [500, 510, 502];
      // 下跌类型
      const downTriggerType = [501, 511, 503];
      if (upTriggerType.indexOf(triggerType) >= 0) {
        return 1
      } else if (downTriggerType.indexOf(triggerType) >= 0) {
        return 0
      }
    },
    // 是否最新价上涨、最新价下跌类型（除上涨、下跌类型）
    upOrDownType2(triggerType) {
      // 上涨类型
      const upTriggerType = [500];
      // 下跌类型
      const downTriggerType = [501];
      if (upTriggerType.indexOf(triggerType) >= 0) {
        return 1
      } else if (downTriggerType.indexOf(triggerType) >= 0) {
        return 0
      }
    },
    inputChangeHandle(item = {}, index, { currentTarget } = {}, type) {
      const t = this;
      const { valueAsNumber = '' } = currentTarget
      const { condition: { params }, trigger = '' } = item
      let { target = '', point = '', type: triggerType = '', flag = 1 } = params;
      if (String(valueAsNumber) === 'NaN') {
        const setDataCopy = [].concat(this.setData);
        item.condition.params[type] = ''
        setDataCopy[index] = item
        this.setData = setDataCopy;
        this.swicthSetWarningId = Math.random()
        return false
      }
      const _symbolWebsocketData = this.symbolWebsocketData[1]
      const _target = Number(target);
      const _item = Object.assign({}, this.setData[index])
      // 上涨、下跌预警))
      if (trigger == 502 || trigger == 503) {
        const _point = Number(point);
        // 接口params没有type参数，用trigger替代
        triggerType = trigger
        // 输入整数保留一位小数
        if (_point != '' && _point != 0) {
          if (isNaN(point)) {
            this.setData[index].condition.params.point = ''
          } else {
            if (flag == 1) {
              if (point.indexOf('.') >= 0 && point.substring(point.indexOf('.')).length > 1) {
                setTimeout(function () {
                  t.setData[index].condition.params.point = _point.toFixed(1);
                }, 100)
              }

            } else if (flag == 0) {
              if (point.indexOf('.') >= 0 && point.substring(point.indexOf('.')).length > 2) {
                setTimeout(function () {
                  t.setData[index].condition.params.point = _point.toFixed(2);
                }, 100)
              }
            }
            this.setData[index].isvalid = 1;
          }

        } else {
          this.setData[index].isvalid = 0
        }
        //其它预警
      } else {
        // 输入整数保留一位小数
        if (target != '' && _target != 0) {
          this.setData[index].isvalid = 1
        } else {
          this.setData[index].isvalid = 0
        }
      }
      // const text =
      const filterByType = priceWarningQuery({ table: 'triggerData', field: 'type', value: triggerType });
      let basePrice = t.getBasePrise(triggerType)
      //
      if ((trigger == 500 || trigger == 501 || trigger == 511 || trigger == 510) && target != '') {
        // 校验输入数据是否非法（非数字）
        if (isNaN(target)) {
          this.setData[index].condition.params.target = target.substring(0, target.length - 1)
        } else {
          if (trigger == 500 || trigger == 501) {
            this.setData[index]['inputTip'] = t.$t('priceWarning.compareText') + filterByType[0].text + ((Math.abs(_target - Number(basePrice)) / Number(this.symbolPip)).toFixed(1)) + t.$t('priceWarning.dotText');
            this.setData[index]['isShowTip'] = true;
          } else {
            if (flag === 1) {
              this.setData[index]['inputTip'] = t.$t('priceWarning.priceWaveText') + ((_target * t.symbolPip).toFixed(t.symbolDigit));
              this.setData[index]['isShowTip'] = true;
            }
          }
        }
        //上涨超过、下跌超过
      } else if ((trigger == 502 || trigger == 503) & point != '') {
        // 单位位点
        /** 需求说明  需求说明需求说明需求说明
         * 设置【上涨超过】【500.0点】时，上方提示“最新价到 1550.00 ”（1500+500*0.1）
            设置【下跌超过】【400.0点】时，上方提示“最新价到 1540.00 ”（1500-400*0.1）
            设置【上涨超过】【1.00%】时，上方提示“最新价到 1515.00 ”（1500+1500*1%）
            设置【下跌超过】【2.00%】时，上方提示“最新价到 1470.00 ”（1500-1500*2%）
            ////
         */
        const express = trigger == 502 ? 1 : -1;
        const _value = flag == 1 ? this.symbolPip : Number(point) / 100;
        const _value2 = flag == 1 ? Number(point) : Number(_symbolWebsocketData.nowPrice)
        // 校验是否非数字
        if (isNaN(point)) {
          this.setData[index].condition.params.point = point.substring(0, point.length - 1)
        } else {
          this.setData[index]['inputTip'] = t.$t('priceWarning.newestPriceTo') + (Number(_symbolWebsocketData.nowPrice) + express * _value2 * _value).toFixed(this.symbolDigit);
          this.setData[index]['isShowTip'] = true;
        }

      } else {
        this.setData[index]['isShowTip'] = false;
      }
      // this.setData[index]['inputTip'] = '较' + filterByType[0].text + ((Math.abs(_target - Number(basePrice)) / Number(this.symbolPip)).toFixed(1)) + '点';
      // if ((trigger == 500 || trigger == 501) && target != '' || (trigger == 502 || trigger == 503) & point != '') {
      //     this.setData[index]['isShowTip'] = true;
      // } else {
      //     this.setData[index]['isShowTip'] = false;
      // }
      this.directDialog()
      this.isModify = true;
    },
    // 设置默认频率
    setDefaultFrequency() {
      const { frequencies = [] } = warningCoreData.newPriceWarningConfig;
      const defaultOption = frequencies.find(({ defaultSelect = '' }, index) => {
        if (defaultSelect === true) {
          this.frequencyActive = index
          return true
        }
      })
      this.frequencyValue = defaultOption.value;
      this.frequencyName = defaultOption.text;
    },
    frequenciesSelect() {
      const { frequencies = [] } = warningCoreData.newPriceWarningConfig;
      const t = this;
      this.$createActionSheet({
        title: t.$t('priceWarning.selectWarningTitle'),
        active: this.frequencyActive,
        data: frequencies.map(item => {
          return { content: item.text, ...item }
        }),
        onSelect: (item, index) => {
          t.isModify = true
          t.frequencyValue = item.value
          t.frequencyName = item.text
          t.frequencyActive = index
        },
        onCancel: () => {
        }
      }).show()
    },
    selectPriceHandle(item, index) {
      this.getAtrValueRequest(item, index);
    },
    // 过滤价格上涨、下跌类型
    commentFilter({ trigger = '' }) {
      return [500, 501, 502, 503, 510, 511].indexOf(Number(trigger)) >= 0
    },
    // 设置商品小数点位数
    setSymbolDigit(symbolName) {
      // const symbolInfo = getSymbolInfoById(symbolId);

      const symbolInfo = getSymbolInfoByEname(symbolName)
      if (symbolInfo !== false) {
        this.symbolCnName = symbolInfo.id[1];
        this.symbolEnName = symbolInfo.uname
        this.symbolDigit = symbolInfo.id[4];

      }
    },
    // 价格选择后更新input的数据
    updateTargetInput(value, index) {
      try {
        this.setData[index].condition.params.target = value;
        this.setData[index].isvalid = true
      } catch (e) {
        iConsole('跟新价格出错')
      }
      const t = this;
    },
    dialogAtrInfo() {
      const t = this;
      return this.$createDialog({
        type: 'alert',
        title: t.$t('priceWarning.dialogTitle01'),
        content: t.$t('priceWarning.dialogContent01'),
        zIndex: 200,
        confirmBtn: {
          text: t.$t('priceWarning.iKnow'),
        }
      })
    },
    setlectWarningSet({ condition: { params } }, dataIndex) {
      const t = this;
      const { type = '' } = params;
      let typeText = '';
      const { nowPrice: now_newPrice, changeRate: now_changeRate,
        buyPrice: now_buyPrice, sellPrice: now_sellPrice } = this.symbolWebsocketData[1];
      let priceType = now_newPrice;
      let tend = 1
      let textType01 = t.$t('priceWarning.priceChangeType.rise')
      const arr = [1, 2, 3]
      switch (type) {
        case 5001: {
          typeText = t.$t('priceWarning.priceChangeType.newestPriceUp');
          priceType = now_newPrice;
          tend = 1
          break;
        }
        case 5002: {
          typeText = t.$t('priceWarning.priceChangeType.sellPriceUp');
          priceType = now_sellPrice
          tend = 1
          break;
        }
        case 5003: {
          typeText = t.$t('priceWarning.priceChangeType.buyPriceUp');
          tend = 1
          priceType = now_buyPrice
          break;
        }
        case 5011: {
          typeText = t.$t('priceWarning.priceChangeType.newestPriceDown');
          tend = -1;
          textType01 = t.$t('priceWarning.priceChangeType.down')
          priceType = now_newPrice
          break;
        }
        case 5012: {
          typeText = t.$t('priceWarning.priceChangeType.sellPriceDown');
          priceType = now_sellPrice;
          textType01 = t.$t('priceWarning.priceChangeType.down')
          tend = -1
          break;
        }
        case 5013: {
          typeText = t.$t('priceWarning.priceChangeType.buyPriceDown');
          textType01 = t.$t('priceWarning.priceChangeType.down')
          priceType = now_buyPrice;
          tend = -1
          break;
        }
      }
      const _newPrice = Number(priceType);
      const { value = '', point = '' } = t.priceVarData;

      const resultData = arr.map((item, index) => {
        // let price = ((_newPrice + tend * (index + 1)) * value).toFixed(t.symbolDigit);
        let price = (_newPrice + value * (index + 1) * tend).toFixed(this.symbolDigit)
        const _point = Math.round(point * (index + 1));
        return {
          content: `<div class="price-sheet-value">${price}</div><div  class="price-sheet-sub">${textType01}${index + 1}${t.$t('priceWarning.selectTargetTipText01')}${typeText}${_point}${t.$t('priceWarning.dotText')}</div>`,
          value: price,
          dataIndex: dataIndex,
          class: 'price-sheet-select'
        }
      })
      const sheetData = this.$createSelectActionSheet({
        myClass: 'warning-sheet',
        title: tend > 0 ? t.$t('priceWarning.stopPrice') : t.$t('priceWarning.sustainPrice'),
        active: -1,
        titleIcon: 'static/img/warning/exclamation_icon.png',
        onTitleIcon: (item, index) => {
          t.dialogAtrInfo().show()
        },
        warninrType: '',
        zIndex: 100,
        data: resultData,
        onSelect: ({ value = '', dataIndex = '' }, index) => {
          t.updateTargetInput(value, dataIndex);

        },
        onCancel: () => {

        }
      })
      sheetData.show()
    },
    // 请求获取symbol价格阻力位
    getAtrValueRequest(item, index) {
      const t = this;
      const parmas = {
        platform: getPlatformCode(),
        symbol: this.symbol,
      }
      // 请求后重置选择的actionsheet index
      // this.resetActionSheetSelectIndex()
      request.getAtrValue(parmas).then((res) => {
        const data = getDataFoxAxiosRequest(res, t);
        if (!!data) {
          t.priceVarData = data;
          t.setlectWarningSet(item, index)
        }
      }).catch(e => commonError(e, this))
    },
    topRightMenuHandle() {
      this.topRightMenuMaskVisible = true;
    },
    maskClickHandle() {
      this.topRightMenuMaskVisible = false;
      this.topLeftMenuMaskVisible = false
    },
    unitOptionMaskHandle() {
      this.unitPopupVisible = false
    },
    topLeftMenuSelect({ text = '' } = {}, index) {
      let url = '';
      // 页面查询参数
      let queryParmas = {};
      const t = this;
      switch (text) {
        case this.$t('priceWarning.pageTitle_homePage'):
          url = '/homePage?tabIndex=1';
          break;
        case this.$t('priceWarning.pageTitle_warningMannge'):
          url = '/optionalPage';
          break;
        case this.$t('priceWarning.pageTitle_indexWarngin'):
          url = '/advanceAssign';
          break;
        case this.$t('priceWarning.pageTitle_productDetail'):
          url = '/productDetailPage';
          queryParmas = {
            symbol: t.symbol,
          };
          break;
      }
      // 选择我的预警、盯盘详情 授权检测  ///////////////////////////////////////
      if (url == '/optionalPage') {
        if (!this.authTrigger()) {
          this.topLeftMenuMaskVisible = false
          return false
        }
      }
      if (this.isAdd || this.isModify) {
        this.topLeftMenuMaskVisible = false
        this.quitDialog({
          confirm: function () {
            t.$router.push({ path: url, query: queryParmas })
          },
          cancle: function () {
            t.$router.push({ path: url, query: queryParmas })
          }
        })
      } else {
        this.topLeftMenuMaskVisible = false
        this.$router.push({ path: url, query: queryParmas })
      }

    },
    topRightMenuSelect({ url = '' }, index) {
      const t = this;
      // 页面查询参数
      let queryParmas = {};
      if (this.isAdd || this.isModify) {
        this.topRightMenuMaskVisible = false
        this.quitDialog({
          confirm: function () {
            t.$router.push({ path: url, query: queryParmas })
          },
          cancle: function () {
            t.$router.push({ path: url, query: queryParmas })
          }
        })
      } else {
        this.topRightMenuMaskVisible = false
        this.$router.push({ path: url, query: queryParmas })
      }

    },
    topLeftDropMenuShow() {
      this.topLeftMenuMaskVisible = true;
    },
    //   发送订阅websock行情信息
    toSymbolWebSocketsendMessage() {
      this.symbolsWebSocketSendMsg({
        names: [String(this.symbol)],
        type: 'modify'
      })
    },
    getScrollTop() {
      var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
      return scrollTop
    },
    // 单位选择（点或百分比事件）index: 1点数 0百分比
    unitOptionSelect(index) {
      const t = this;
      const _unitSelectIndexInData = this.unitSelectIndexInData;
      const newObjectItem = Object.assign({}, this.setData[_unitSelectIndexInData]);
      newObjectItem.condition.params['flag'] = index
      this.$set(this.setData, _unitSelectIndexInData, newObjectItem)
      this.unitPopupVisible = false;
      const _item = this.setData[this.unitSelectIndexInData]
      const { condition: { params: { point = t.$t('priceWarning.noValue'), target = t.$t('priceWarning.noValue') } } } = _item
      _item.condition.params.point = ''
      _item.condition.params.target = ''
    },
    // 单位选择
    unitSelectHandle(item, index, e) {
      const { condition: { params } } = item
      const { flag = '' } = params
      this.unitFlag = flag
      this.unitSelectIndexInData = index;
      this.unitSelectPopupStyle = { left: e.clientX - 20 + 'px', top: e.clientY + 20 + this.getScrollTop() + 'px' }
      this.unitPopupVisible = true;
      this.isModify = true
      this.directDialog()
    },
    swipeLeftHandle(index) {
      const _index = Number(index)
      const newItem = Object.assign({}, this.setData[_index])
      newItem['deleteMark'] = true;
      this.$set(this.setData, _index, newItem)
    },
    swipeRightHandle(index) {
      const _index = Number(index)
      const newItem = Object.assign({}, this.setData[_index])
      delete newItem['deleteMark']

      this.$set(this.setData, _index, newItem)
    },
    deleteItemHandle(item, index) {
      const t = this;
      this.$createDialog({
        type: 'confirm',
        title: t.$t('priceWarning.deleteDialog.title'),
        content: t.$t('priceWarning.deleteDialog.content'),
        confirmBtn: {
          text: t.$t('priceWarning.deleteDialog.deleteBtn'),
          active: true,
          disabled: false,
          href: 'javascript:;'
        },
        cancelBtn: {
          text: t.$t('priceWarning.deleteDialog.cancleBtn'),
          active: false,
          disabled: false,
          href: 'javascript:;'
        },
        onConfirm: () => {
          const data = t.setData.filter((filterItem, filterIndex) => {
            return filterIndex != index
          });
          t.setData = data
        },
        onCancel: () => {
          t.setData = t.setData.map((item) => {
            if (item.hasOwnProperty('deleteMark')) {
              delete item.deleteMark
            }
            return item
          });

        }
      }).show()

    },
    //排除相同预警设置
    excludeSameWarningSet(setDataItem, setData) {
      const { condition: { params: { target = '', point = '', type = '', flag = '' } } = {}, isvalid = '', trigger = '' } = setDataItem;
      const result = setData.filter((item) => {
        const { condition: { params: { target: innerTarget = '', point: innerPoint = '', type: innerType = '', flag: innerFlag = '' } } = {}, trigger: innerTrigger = '', isvalid: innnerIsvalid = '' } = item;
        if (type != '' && type === innerType && Number(target) === Number(innerTarget) && isvalid == innnerIsvalid && isvalid == 1 && innnerIsvalid == 1) {
          return true
        } else if (type === '' && Number(point) === Number(innerPoint) && isvalid == 1 && trigger == innerTrigger && innerFlag === flag) {
          return true
        } else {
          return false
        }
      })
      return result

    },
    // 保存成功执行方法
    saveDataSuccessHandle() {
      const t = this;
      this.$createDialog({
        type: 'confirm',
        title: t.$t('priceWarning.saveDialog.title'),
        content: t.$t('priceWarning.saveDialog.content'),
        confirmBtn: {
          text: t.$t('priceWarning.saveDialog.confirm'),
          active: true,
          disabled: false,
          href: 'javascript:;'
        },
        cancelBtn: {
          text: t.$t('priceWarning.saveDialog.cancleBtn'),
          active: false,
          disabled: false,
          href: 'javascript:;'
        },
        onConfirm: () => {
          t.$router.push('/homePage?tabIndex=1')
        },
        onCancel: () => {
          const { page = '', } = t.$route.params;
          if (page == 'quitDialog') {
            t.resetStateForBackDialog()
          }
        }
      }).show()
    },
    // 提交保存数据
    submitData() {
      const t = this;
      //授权
      if (!this.authTrigger()) return false
      // 盯盘通知
      getIsNotificationNeedOpen().then((data) => {
        console.log('打开通知：' + data)
        // 0表示未打开通知
        if (data === 0) {
          return false
        } else {
          t.saveDataRequest()
        };

      })
    },
    //保存数据请求
    saveDataRequest({ callback = '' } = {}) {
      const t = this;
      const userInfo = getInfoFromSessionStorage(globalConsts.userInfoKeyNameInStore)
      if (!!!userInfo) return false;
      const { account = '', userid = '' } = userInfo;
      // 提示文字
      let validateErrorText = '';
      // 相同预警且相同设置值提示
      let isPassTestSameWarning = [];
      // 数据过滤调无需要的参数
      const _setData = this.setData.map((item) => {
        const { condition: { params }, isvalid = false, trigger } = item;
        const { target = '', type: triggerType = '', point = '' } = params
        const nowPrice = Number(t.symbolWebsocketData[1].nowPrice)
        const _target = Number(target);
        // 校验是否为空、输入是否合法
        let isValidateLegal = true;
        if (t.excludeSameWarningSet(item, t.setData).length > isPassTestSameWarning.length) {
          isPassTestSameWarning = t.excludeSameWarningSet(item, t.setData);
        }
        // 获取基准值类型文本（买入价、卖出价、现价）
        let basePrice = t.getBasePrise(triggerType)
        const filterByType = priceWarningQuery({ table: 'triggerData', field: 'type', value: triggerType != '' ? triggerType : trigger });
        let basePriceText = ''
        switch (filterByType[0].basePrice) {
          case 0: {
            basePriceText = t.$t('priceWarning.newestPrice')
            break;
          }
          case 1: {

            basePriceText = t.$t('priceWarning.buyPrice')
            break;
          }
          case 2: {
            basePriceText = t.$t('priceWarning.sellPrice')
            break;
          }
          default: {
            basePriceText = t.$t('priceWarning.newestPrice')
          }

        }
        // ==================开启条件下校验数据是否为空、是否合法=========================
        if (isvalid === true) {
          if (trigger == 502 || trigger == 503) {
            if (point === '') {
              validateErrorText = t.$t('priceWarning.warningTip.targetEmpty');
              isValidateLegal = false
            } else {
              if (isNaN(point)) {
                validateErrorText = `${filterByType[0].text}${t.$t('priceWarning.warningTip.illegalInput')}`;
                isValidateLegal = false
              }
            }
          } else {
            if (target === '') {
              validateErrorText = t.$t('priceWarning.warningTip.targetEmpty');
              isValidateLegal = false

            } else {
              if (isNaN(target)) {
                validateErrorText = `${filterByType[0].text}${t.$t('priceWarning.warningTip.illegalInput')}`;
                isValidateLegal = false
              }
            }
          }
        }
        if (validateErrorText !== '' && !isValidateLegal) {
          this.$createDialog({
            type: 'alert',
            title: t.$t('priceWarning.warningTip.priceWarning'),
            content: validateErrorText,
          }).show()
          return false;
        }
        //==================== 校验输入是否符合业务逻辑=================================
        if (t.upOrDownType2(trigger) == 1 && _target <= basePrice && isvalid) {
          validateErrorText = `${t.$t('priceWarning.warningTip.priceMoreThenNow')}${basePriceText}`
          // 校验下跌输入是否低于现价
        } else if (t.upOrDownType2(trigger) == 0 && _target >= basePrice && isvalid) {
          validateErrorText = `${t.$t('priceWarning.warningTip.priceLessThenNow')}${basePriceText}`
        } else if (isPassTestSameWarning.length >= 2) {
          validateErrorText = `${filterByType[0].text}${t.$t('priceWarning.warningTip.sameTarget')}`
        }
        const _newItem = Object.assign({}, item)
        if ((trigger == 502 || trigger == 503) && _newItem.condition.params.hasOwnProperty('target')) {
          delete _newItem.condition.params.target
        }
        if (_newItem.hasOwnProperty('isAdd')) {
          delete _newItem.isAdd
        }
        if (_newItem.hasOwnProperty('isShowTip')) {
          delete _newItem.isShowTip
        }
        if (_newItem.hasOwnProperty('isModify')) {
          delete _newItem.isModify
        }
        if (_newItem.hasOwnProperty('inputTip')) {
          delete _newItem.inputTip
        }
        // 为分钟内及上涨超过添加最新价格
        if (_newItem.trigger == 502 || _newItem.trigger == 503 ||
          _newItem.trigger == 510 || _newItem.trigger == 511) {
          _newItem.condition.params['price'] = nowPrice
        }
        if (item.isvalid === false || item.isvalid === true) {

          if (_newItem.isvalid === false) {
            _newItem.isvalid = 0
          } else {
            _newItem.isvalid = 1
          }
          return _newItem
        } else {
          return _newItem
        }
      })
      //校验
      if (validateErrorText !== '') {
        this.$createDialog({
          type: 'alert',
          title: t.$t('priceWarning.warningTip.priceWarning'),
          content: validateErrorText,
        }).show()
        return false;
      }
      const params = {
        // id: 4,
        platform: getPlatformCode(),
        account,
        userid,
        symbol: t.symbol,
        rows: JSON.stringify(_setData),
        frequency: t.frequencyValue,
        ...t.managerSetedData
      }
      if (this.setDataId != '') {
        Object.assign(params, { id: this.setDataId })
      }
      // 根据有无id 判断调用更新或新增接口
      const saveDataApiType = this.setDataId === '' ? 'priseWarningAddData' : 'priseWarningUpdateData'
      request[saveDataApiType](params).then((res) => {
        const data = getDataFoxAxiosRequest(res, t, true);
        try {
          const { status = '', message = '' } = data;
          if (status == globalConsts.resStatus.success) {
            // callback回调方法，默认没有回调
            if (callback == '') {
              t.priseWarningGetSetData();
              t.resetStateForBackDialog()
              t.saveDataSuccessHandle()
              //数据未保存，返回 弹框保存回调
            } else {
              callback()
            }

          } else {
            this.$createToast({
              txt: message != '' ? message : t.$t('priceWarning.warningTip.opreateFail'),
              type: 'error'
            }).show()
          }
        } catch (e) {

        }

      })
    },
    // 保存成功后重置状态(有修改未保存状态))
    resetStateForBackDialog() {
      this.isModify = false;
      this.isAdd = false;
      this.isCommentModify = false
      this.saveButtonDisable = false
      // this.$router.replace({ path: '/priceWarning/main', query: { ...this.$route.query } })
      history.go(-1)
    },
    // 校验是否有数据未保存validateDataIsNoSave
    validateDataIsNoSave() {
      return this.setData.some((item) => {
        const { isAdd = false, isModify = false } = item;
        return isAdd || isModify
      })
    },
    // 退出询问对化框
    quitDialog({
      confirm = '',
      cancle = ''
    } = {}) {
      const { backPage = '' } = this.$route.query;
      const t = this;
      this.customDialogVisible = true;
      function _backPage(backPage = '') {
        if (backPage != '') {
          history.back(-1)
        } else {
          t.backFunc()
        }
      }
      // 确认回调不为空
      if (confirm !== '') {
        this.btnData = [
          {
            text: t.$t('priceWarning.giveUpBtn'),
            func: function () {
              if (cancle != '') {
                cancle()
              } else {
                t.customDialogVisible = false
                history.go(1)
              }

            }
          }
        ]
        let _appAuth = (getAuthStatu() === globalConsts.auth.statu.fail || this.$config.isLogined()) && t.userFromType == 1;
        let _wechat = isWechatPlatform() && !isWechatBind()
        //   未授权
        if (_appAuth || _wechat) {
          this.btnData = [{
            text: t.$t('priceWarning.saveBtn'),
            primary: true,
            func: function () {
              t.isAuthForApp()
            }
          }].concat(this.btnData)

          // 已授权
        } else {
          this.btnData = [{
            text: t.$t('priceWarning.saveBtn'),
            primary: true,
            func: function () {
              t.saveDataRequest({
                callback: () => {
                  confirm();
                  t.customDialogVisible = false;
                }
              })
            }
          }].concat(this.btnData)
        }

      } else {
        this.btnData = [
          {
            text: t.$t('priceWarning.giveUpBtn'),
            func: function () {
              _backPage(backPage)
            }
          },
          {
            text: t.$t('priceWarning.saveBtn'),
            primary: true,
            func: function () {
              t.saveDataRequest({
                callback: () => {
                  t.customDialogVisible = false;
                  _backPage(backPage)
                }
              })
            }
          },

        ]
      }
    },
    // 退出
    backFunc() {
      const t = this
      if (this.$config.userFromType() == 'app') {
        const { page = '', } = this.$route.params;
        const { backPage = '' } = this.$route.query
        if (page == 'comment') {
          this.$router.go(-1)
        } else {
          if (page == 'main') {
            if (backPage != '') {
              history.go(-1)
            } else {
              backToApp()
            }
          } else {
            history.go(-1)
          }
        }
      } else {
        history.go(-1)
      }
    },
    pageBack() {
      this.backFunc()
    },
    customCommentHandle() {
      this.isShowComment = true
      this.$router.push({ path: '/priceWarning/comment' })
    },
    addSetWarningType(triggerType) {
      const filter = priceWarningQuery({ table: 'triggerData', field: 'type', value: triggerType });
      if (filter.length > 0) {
        const filterItem = filter[0]
        // 预警类型101
        const defaultAddData101 = {
          warning_type: 101,
          condition: {
            trigger: filterItem.triggerType,
            params: {
              target: "",
              type: filterItem.type
            }
          },
          trigger: filterItem.triggerType,
          comment: "",
          isvalid: 0,
          // 是否为新增
          isAdd: true,
        }
        // 预警类型102
        const defaultAddData102 = {
          warning_type: filterItem.warning_type,
          condition: {
            trigger: filterItem.triggerType,
            params: {
              point: "",
              price: ""
            }
          },
          trigger: filterItem.triggerType,
          comment: "",
          isvalid: 0,
          // 是否为新增
          isAdd: true,
        }
        if (filterItem.warning_type == 101) {
          this.setData = [defaultAddData101].concat(this.setData);
        } else if (filterItem.warning_type == 102) {
          this.setData = [defaultAddData102].concat(this.setData);
        }

      }
    },
    // 增加预警设置
    addSetWarning() {
      const t = this;
      const { addPriceWarningData = [], triggerData } = warningCoreData.newPriceWarningConfig;
      const actionSheetContent = addPriceWarningData.map(({ text = '', defaultType = '' }) => {
        return { content: text, defaultType, class: 'add-price-waring-item' }
      })
      this.$createActionSheet({
        title: t.$t('priceWarning.addWarning'),
        data: actionSheetContent,
        onSelect: (item, index) => {
          t.addSetWarningType(item.defaultType);
          t.directDialog()
          t.isAdd = true;
        }
      }, { class: 'test', }).show()
    },
    // 设置频率选择值从设置过的数据
    setFrequencyActiveByCode(selectCode) {
      const { frequencies = [] } = warningCoreData.newPriceWarningConfig;
      let frequencyActive = 0
      for (let i = 0; i < frequencies.length; i++) {
        if (frequencies[i].value == selectCode) {
          frequencyActive = i;
          break;
        }
      }
      this.frequencyValue = selectCode;
      this.frequencyName = priceWarningQuery({ table: 'frequencies', field: 'value', value: selectCode })[0].text;
      this.frequencyActive = frequencyActive
    },
    // 获取设置过的数据
    priseWarningGetSetData() {
      const t = this;
      const userInfo = getInfoFromSessionStorage(globalConsts.userInfoKeyNameInStore)
      if (!!!userInfo) return false;
      const { account = '', userid = '' } = userInfo;
      const params = {
        account,
        userid,
        symbol: t.symbol
      }
      request.priseWarningGetSetData(params).then(({ data }) => {
        const { rows = [], id = '', frequency = 1, market_movement_set = [], kline_form_set = [], index_set = [], event_set = [] } = data.data;
        t.setFrequencyActiveByCode(frequency)
        t.setData = rows;
        t.managerOption = { market_movements: market_movement_set, kline_forms: kline_form_set, index: index_set, events: event_set }
        // 有id表示要调用更新接口，没有表示调用新增接口
        t.setDataId = id
      }).catch(e => commonError(e, t))

    },
    // 根据页面参数显示隐藏页面
    showPageContentByParams(pageParams = {}) {
      const { page = '' } = pageParams;
      if (page == 'comment') {
        this.isShowComment = true
        this.pageTitle = this.$t('priceWarning.customComment')
      } else {
        this.isShowComment = false
        this.pageTitle = this.$route.meta.title;
        if (page == 'main') {
          if (this.isModify || this.isAdd) {
            this.quitDialog();
          }
        }

      }
    },
    // 超过20条设置限制提示
    moreLimitToast() {
      const t = this;
      this.$createDialog({
        type: 'alert',
        showClose: true,
        content: t.$t('priceWarning.warningTip.moreThan20'),
        title: t.$t('priceWarning.warningTip.priceWarning'),
        onClose: () => {
        }
      }).show()
    },
    // 未找到symbol在本地存储里
    noFindSymbol() {
      const t = this;
      this.$createDialog({
        type: 'confirm',
        title: t.$t('priceWarning.noFindTip.title'),
        content: '该产品盯盘服务即将上线，先到处逛逛吧！',
        confirmBtn: {
          text: t.$t('priceWarning.noFindTip.confirm'),
          active: true,
          disabled: false,
          href: 'javascript:;'
        },
        cancelBtn: {
          text: t.$t('priceWarning.noFindTip.cancle'),
          active: false,
          disabled: false,
          href: 'javascript:;'
        },
        onConfirm: () => {
          this.$router.push('/homePage?tabIndex=1')
        },
        onCancel: () => {
          const { backPage = '' } = t.$route.query;
          if (backPage != '') {
            history.back(-1)
          } else {
            t.backFunc()
          }
        }
      }).show()
    },
  },
  created() {
    this.userFromType = newUserFromType()
    this.createWebSocketForSymbols();
    let symbol = 'AUDUSD'
    if (this.$route.query.hasOwnProperty(globalConsts.setWarningSymbolKey)) {
      symbol = this.$route.query[globalConsts.setWarningSymbolKey]
    }
    // 获取symbol code
    let symbolInfo = {};
    try {
      symbolInfo = getSymbolInfoByEname(symbol);
      if (!symbolInfo) {
        this.noFindSymbol();
        return false;
      }
      this.symbol = symbolInfo.id[0];
      this.symbolPip = symbolInfo.id[6]
    } catch (e) {
      this.symbol = symbol
      console.log('symbol参数位name值非id');
    }
    //  // 如果地址栏有setWarningSymbol参数（根据url setWarningSymbol参数设置商品）或本地存储里有setWarningSymbol
    let warningSymbol = getInfoFromSessionStorage(globalConsts.setWarningSymbolKey);
    if (this.$route.query.hasOwnProperty(globalConsts.setWarningSymbolKey)) {
      warningSymbol = { value: this.$route.query[globalConsts.setWarningSymbolKey] }
    }
    // 保存改symbol小数位数
    if (!!warningSymbol) {
      this.setSymbolDigit(warningSymbol.value)
    }
    this.setDefaultFrequency()
    this.showPageContentByParams()
    //
    if (isWechatPlatform()) {
      this.isWechatPlatform = true
    }
    if (isIaiTraderApp()) {
      this.isIaiTraderPlatform = true
    }
    // 设置指标预警链接跳转参数
    this.indexWarningParmas = { [globalConsts.setWarningSymbolKey]: this.symbolEnName }
  },
  mounted() {
    const t = this
    setTimeout(function () {
      t.toSymbolWebSocketsendMessage()
    }, 400)
    this.priseWarningGetSetData();
    const { backPage = '' } = this.$route.query;
    if (backPage === '') {
      noticeToast(this)
    }
    // 显示一次价格盯盘引导页 ///////////////////////
    cookieForFirstShowNotice({
      cookieConfig: {
        key: globalConsts.cookies.newGuideKey,
        version: 1,
      },
      callback: function () {
        t.$nextTick(function () {
          this.newGuiderShow = true
        })

      }
    })
  },
  computed: {
    ...mapGetters(['getSymbolsData']),
    // 价格预计开启个数
    priceDingpanOpenCount() {
      return this.setData.filter(({ isvalid = 0 }) => {
        return isvalid
      }).length
    },
    // 根据设置预警的数据计算备注条数
    countCommentAmount() {
      const triggerTypes = [500, 501, 502, 503, 510, 511]
      const filterResult = this.setData.filter(({ trigger = '', comment = '' } = {}) => {
        return triggerTypes.indexOf(Number(trigger)) >= 0 && comment != ''
      })
      return filterResult.length
    }
  },
  watch: {
    isModify: function (val, oldValue) {
      if (val) {
        this.saveButtonDisable = true
      }
    },
    setData: function (val, oldValue) {
      if (oldValue.length != 0 && oldValue.length != val.length) {
        this.isModify = true
      }
      if (this.setData.length == 0) {
        this.saveButtonDisable = false
        // 最多添加20条预警
      } else if (this.setData.length > 20) {
        this.saveButtonDisable = false;
        this.moreLimitToast()
      } else {
        this.saveButtonDisable = true
      }
    },
    getSymbolsData: function (val, oldValue) {
      const t = this;
      // ask 买入价 bid卖出价
      const { new_price = '', changeRate = '', symbol, symbolInt, ask = 0, bid = 0 } = val;
      if(symbolInt!==this.symbol){
          return false
      }
      const newData = t.symbolWebsocketData.concat([
        {
          nowPrice: Number(new_price).toFixed(t.symbolDigit),
          changeRate: (Number(changeRate) * 100).toFixed(2),
          buyPrice: Number(ask).toFixed(t.symbolDigit),
          sellPrice: Number(bid).toFixed(t.symbolDigit),
        }
      ])
      newData.splice(0, 1)
      t.symbolWebsocketData = newData
    },
    // websocket建立并为打开状态发送默认订阅数据
    websockForSymbolsState: function (newValue, oldValue) {
      const t = this;
      if (newValue == 1 && oldValue == 4) {
        t.toSymbolWebSocketsendMessage()
        // websocket重链
      } else if (newValue == 0) {
        // 建立websocket连接（行情数据）
        console.log("重连开始")
        setTimeout(function () {
          t.createWebSocketForSymbols();
        }, 4000)

      }
    },
    '$route'(to, from) {
      const { params } = to;
      this.showPageContentByParams(params)
    }
  },
  i18n
}
</script>
<style lang="scss" scoped>
@import "@public/css/warningGlobal.scss";
.tipTitleClass {
  font-size: 0.24rem;
  font-weight: 400;
  color: rgba(235, 235, 245, 0.3);
  line-height: 0.36rem;
  padding: 0.18rem 0.28rem 0 0.28rem;
}
.sticky {
  position: fixed;
  // top: 0.88rem;
  z-index: 90;
  width: 100%;
  background-color: rgb(46, 46, 59);
  transform: translateZ(0);
}
.bottom-save-box {
  background-color: #24242e;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0.12rem 0 0.16rem 0;
}
// 刘海屏设置样式
@supports (bottom: constant(safe-area-inset-bottom)) or
  (bottom: env(safe-area-inset-bottom)) {
  .bottom-save-box {
    bottom: constant(safe-area-inset-bottom);
    bottom: env(safe-area-inset-bottom);
  }
}
.swicth-set-warning-comp {
  width: 100%;
}
.common-header-left-icon {
  width: 0.44rem;
  margin-top: 0.2rem;
}
.common-header-left-more {
  margin-left: 0.4rem;
}
.top-price-box {
  display: flex;
  width: 100%;
  padding: 0.16rem $commonSpace;
}
.top-price-title {
  color: $commonFsColorGray2;
}
.top-price-item {
  flex: 1;
  font-size: $commonFsSmall;
  .top-price-title {
    height: 0.36rem;
    line-height: 0.36rem;
    white-space: nowrap;
  }
  .common-up-color {
    @extend .common-up-color;
  }
  .common-down-color {
    @extend .common-down-color;
  }
}
.top-price-symbol {
  .top-price-title {
    &:first-child {
      color: #fff;
    }
  }
}
.divider {
  height: 0.16rem;
  background: $commonColorDarkBalck;
  width: 100%;
}
.box-title {
  display: flex;
  justify-content: space-between;
  padding-right: $commonSpace;
  color: #fff;
  height: 0.88rem;
  line-height: 0.88rem;
  border-bottom: 1px solid $commonColorDarkBalck;
  .box-title-text {
    font-weight: bold;
  }
  margin-left: $commonSpace;
}
.box-title-add {
  font-size: 0.6rem;
  color: $commonColorBlur;
}
.select-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 0.88rem;
  margin-left: $commonSpace;
  padding-right: $commonSpace;
  color: #fff;
  border-bottom: 1px solid $commonColorDarkBalck;
  font-size: $commonFsContent;
}
.select-row-item {
  display: flex;
  justify-content: center;
  align-items: center;
}
.select-row-arrow {
  width: 0.18rem;
  height: 0.35rem;
}
.line-border-top {
  border-top: 2px solid $commonColorDarkBalck;
}
.price-warning-body {
  // position: relative;
}
.price-warning {
  // position: relative;
  left: 0;
  top: 0;
  z-index: 90;
  padding-bottom: 1.3rem;
  width: 100%;
  // overflow: hidden;
}
.custom-comment-box {
  // position: absolute;
  // left: 0;
  // top: 0;
  // z-index: 90;

  width: 100%;
  .comment-item {
    &:first-child {
      border-top: 1px solid #24242e;
    }
  }
}
// web版高度计算
.custom-comment-box-web-height {
  height: calc(100vh - 0.9rem);
}
.custom-comment-box-app-height {
  height: calc(100vh - 1.3rem);
}
.comment-item {
  background-color: $commonBackgroundDark;
  margin-bottom: 0.16rem;
}
.comment-input {
  display: flex;
  justify-content: space-between;
  height: 1rem;
  align-items: center;
  margin-left: $commonSpace;
  border-top: 2px solid #24242e;
}
.comment-title {
  height: 0.72rem;
  line-height: 0.72rem;
  color: $commonFsColorGray2;
  margin-left: $commonSpace;
}
.comment-input-main {
  background: none;
  color: #fff;
  flex: 1;
}
.comment-input-label {
  color: $commonFsColorGray2;
  width: 40px;
  font-size: $commonFsSmall;
}
.unit-select-options-container {
  color: #fff;
  position: relative;
}
// 单位选择弹出框
.unit-select-options-box {
  width: 1rem;
  height: 1.96rem;
  position: absolute;
  background: $commonBackgroundDark;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0.08rem;
  justify-content: center;
  .unit-select-options-point,
  .unit-select-options-persent {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  .unit-select-options-point {
    border-top-left-radius: 0.08rem;
    border-top-right-radius: 0.08rem;
  }
  .unit-select-arrow {
    width: 12px;
    height: 10px;
    // border-width: 0 10px 10px;
    background-color: #3d3d4d;
    border-color: #3d3d4d;
    position: absolute;
    border-style: solid;
    top: -5px;
    left: 50%;
    margin-left: -3px;
    transform: rotate(45deg);
  }
}
.active-point {
  .unit-select-options-point {
    background: #3d3d4d;
  }

  .unit-select-options-persent {
    color: #58586f;
  }
}
.active-persent {
  .unit-select-options-persent {
    background: #3d3d4d;
  }
  .unit-select-arrow {
    background: #2e2e3b;
  }
  .unit-select-options-point {
    color: #58586f;
  }
}
.price-warning-top-menu {
  color: $commonColorBlur;
  font-size: 0.5rem;
  font-weight: bold;
  line-height: 0.2rem;
  top: -2px;
  position: relative;
}
.coustom-comment-count {
  margin-right: 0.2rem;
}
.font-style1 {
  font-size: $commonFsMedium;
}
</style>
<style lang="scss">
@import "@public/css/coverStyle.scss";
.add-price-waring-item {
  color: #fff !important;
}
.price-warning-top-left-menu {
  position: fixed !important;
  left: 0.15rem !important;
  top: 1.05rem !important;
}
.price-warning-top-right-menu {
  position: fixed !important;
  right: 0.15rem !important;
  top: 1.05rem !important;
}
</style>
