<template>
  <div class="ManagerItemClass">
    <div >
      <!--行情异动-->
      <div class="groundBox">
        <div class="itemBox">
          <div class="optionItem" @click="(priceSelect = !priceSelect)">
            <div class="itemLeftBox">
              <span>{{$t('homePage.priceChange')}}({{lengthCount.priceLength}})</span>
            </div>
            <div class="itemRightBox">
              <!--<div class="numberItem">个</div>-->
              <img class="itemRightImg" :class="{itemRightImgTransform:priceSelect?true:false}"
                   src="../../views/homePage/img/new-arrow.png"/>
            </div>
          </div>
        </div>

        <div v-show="priceSelect" >
          <!--<div class="groundATipBox">-->
          <!--<span class="leftTipTitle">每邀请一个好友使用盯盘，可获得1周“全部异动”使用权</span><img class="rightTipImg" src=""/>-->
          <!--</div>-->
          <div class="itemBox">
            <div class="optionItem" v-show="(myOption.market_movements.length==0?false:true)">
              <div class="itemLeftProduct">
                <span  class="itemProductName">{{$t('homePage.managerItem.allChange')}}</span>
              </div>
              <div class="itemRightBox">
                <cube-switch v-model="isAllMarket" @input="allMarket">
                </cube-switch>
              </div>
            </div>
            <div class="optionItem" v-for="(item,index) in myOption.market_movements"  :key="index">
              <div class="itemLeftProduct">
                <div class="itemProductName">{{item.name}}</div>
                <div class="itemContent">{{item.comment}}</div>
              </div>
              <div class="itemRightBox">
                <cube-switch @click.native="switchSelect('market_movements')" v-model="item.isSelect">
                </cube-switch>
              </div>
            </div>
          </div>

        </div>
        <div v-show="priceSelect" style="background-color:#23232B;height: 0.16rem; "></div>
      </div>

      <!--k线形态-->
      <div class="groundBox">
        <div class="itemBox">
          <div class="optionItem" @click="(klineSelect = !klineSelect)">
            <div class="itemLeftBox">
              <span>{{$t('homePage.k_form')}}({{lengthCount.klineLength}})</span>
            </div>
            <div class="itemRightBox">
              <!--<div class="numberItem">个</div>-->
              <img class="itemRightImg" :class="{itemRightImgTransform:klineSelect?true:false}"
                   src="../../views/homePage/img/new-arrow.png"/>
            </div>
          </div>
        </div>

        <div v-show="klineSelect">
          <!--<div class="groundATipBox">-->
          <!--<span class="leftTipTitle">每邀请一个好友使用盯盘，可获得1周“全部异动”使用权</span><img class="rightTipImg" src=""/>-->
          <!--</div>-->
          <div class="itemBox">
            <div class="optionItem" v-show="(myOption.kline_forms.length==0?false:true)">
              <div class="itemLeftProduct">
                <span class="itemProductName">{{$t('homePage.managerItem.allForm')}}</span>
              </div>
              <div class="itemRightBox">
                <cube-switch @input="allKLine" v-model="isAllKline">
                </cube-switch>
              </div>
            </div>
            <div class="optionItem" v-for="item in myOption.kline_forms">
              <div class="itemLeftProduct">
                <div class="itemProductName">{{item.name}}</div>
                <div class="itemContent">{{item.comment}}</div>
              </div>
              <div class="itemRightBox">
                <cube-switch @click.native="switchSelect('kline_forms')" v-model="item.isSelect">
                </cube-switch>
              </div>
            </div>
          </div>
        </div>
        <div v-show="klineSelect" style="background-color:#23232B;height: 0.16rem; "></div>
      </div>
      <!--事件-->
      <div class="groundBox">
        <div class="itemBox">
          <div class="optionItem" @click="(thingsSelect = !thingsSelect)">
            <div class="itemLeftBox">
              <span>{{$t('homePage.major_Thing')}}({{lengthCount.thingLength}})</span>
            </div>
            <div class="itemRightBox">
              <!--<div class="numberItem">{{myOption.events.length}}</div>-->
              <img class="itemRightImg" :class="{itemRightImgTransform:thingsSelect?true:false}"
                   src="../../views/homePage/img/new-arrow.png"/>
            </div>
          </div>
        </div>


        <div v-show="thingsSelect">
          <div class="itemBox">
            <div class="optionItem" v-for="item in myOption.events">
              <div class="itemLeftProduct">
                <div class="itemProductName">{{item.name}}</div>
                <div class="itemContent">{{item.comment}}</div>
              </div>
              <div class="itemRightBox">
                <cube-switch @click.native="switchSelect('events')" v-model="item.isSelect">
                </cube-switch>
              </div>
            </div>
          </div>

        </div>
        <div v-show="thingsSelect" style="background-color:#23232B;height: 0.16rem; "></div>
      </div>

      <!-- 信号推荐-->
      <div class="groundBox">
        <div class="itemBox">
          <div class="optionItem" @click="(indexSelect = !indexSelect)">
            <div class="itemLeftBox">
              <span>{{$t('homePage.signal_recommend')}}({{lengthCount.recommandLength}})</span>
            </div>
            <div class="itemRightBox">
              <!--<div class="numberItem">{{myOption.events.length}}</div>-->
              <img class="itemRightImg" :class="{itemRightImgTransform:indexSelect?true:false}"
                   src="../../views/homePage/img/new-arrow.png"/>
            </div>
          </div>
        </div>
        <div v-show="indexSelect">
          <div class="itemBox">
            <div class="optionItem" v-for="(item,index) in myOption.index" :key="index">
              <div class="itemLeftProduct">
                <div class="itemProductName">{{item.name}}</div>
                <div class="itemContent">{{item.comment}}</div>
              </div>
              <div class="itemRightBox">
                <cube-switch @click.native="switchSelect('index')" v-model="item.isSelect">
                </cube-switch>
              </div>
            </div>
          </div>

        </div>
        <div v-show="indexSelect" style="background-color:#23232B;height: 0.16rem; "></div>
      </div>

    </div>
  </div>
</template>

<script>
  const globalConsts = require('@public/js/consts.js')
  import i18n from '@warning/i18n'
  import {getInfoFromSessionStorage,getPlatformCode,getDataFoxAxiosRequest,cookieForFirstShowNotice,isWechatBind} from '@public/js/util.js'
  import request from '@services/documentary.js'

  export default {
    name: "ManagerItem",
    components: {
    },
    props:{
      data:{
        type:Object,
        require:true
      }
    },
    data() {
      return {
        lengthCount:{
          klineLength:0,
          priceLength:0,
          thingLength:0,
          recommandLength:0,
        },
        isBindNotice:false,
        isAddNumber:false, // 当独立重新计算是否全部选中时，改变switch状态会回调，此值控制回调不影响业务
        isControllKline:false,


        //记录已选中id
        priceSelectList:'',
        klineSelectList:'',
        thingsSelectList:'',

        indexSelectList:'',

        //控制是否选中
        priceSelect: false,
        klineSelect: false,
        thingsSelect: false,
        indexSelect:false,

        myOption: {events: [], kline_forms: [], market_movements: [],index:[]},

        commitIds: '',
        isAllMarket: false, //是否全选异动
        isAllKline: false,  //是否全选k线
      }
    },
    created() {
      // this.getData();
      this.getWechatStatu()
    },

    mounted(){
      setTimeout(()=>{
        document.getElementsByClassName('page-layout-body')[0].classList.add('noOverflowX')
      },1000)
    },

    methods: {
      getWechatStatu() {
        request.isWechatEntyShow()
          .then(({ wx_show = "", wx_bind = "" }) => {
            // 未开通  wx_bind:1//1绑定 0未绑定
            if (wx_bind == 1) {
              this.isBindNotice = true;
            }else {
              this.isBindNotice = false;
            }
          })
          .catch(e => {
            commonError(e, this);
          });
      },
      getItemPrama(){
       return {market_movement_set:this.priceSelectList,kline_form_set:this.klineSelectList,
         index_set:this.indexSelectList,event_set:this.thingsSelectList
                }
      },
      allMarket(value){
        if(this.isAddNumber){
          this.isAddNumber =false
          return
        }
        this.showNotice(this.isBindNotice)
        var allvalid = []
        const _data = [].concat(this.myOption.market_movements);
        _data.forEach((item) => {
          item.isSelect = value
          if (value){
            allvalid.push(item.id)
          }
        })
        this.myOption=Object.assign({},this.myOption,{market_movements:_data})

        //点击后需要重新计算是否全选
        this.handleISAllSelect(this.myOption)

        // this.$forceUpdate()
        setTimeout(()=>{
          this.priceSelectList = allvalid.join(',')
          this.$emit('changeValue',this.getItemPrama())
          // this.requestData(allvalid.join(','),'market_movements')
        },500)
      },
      allKLine(value){
        if(this.isAddNumber){
          this.isAddNumber =false
          return
        }
        if (this.isControllKline){
          this.isControllKline =false
          return
        }

        this.showNotice(this.isBindNotice)
        var allvalid = []
        this.myOption.kline_forms.forEach((item) => {
          item.isSelect =value
          if (value){
            allvalid.push(item.id)
          }
        })

        //点击后需要重新计算是否全选
        this.handleISAllSelect(this.myOption)

        // this.$forceUpdate()
        setTimeout(()=>{
          this.klineSelectList = allvalid.join(',')
          //先注释
          this.$emit('changeValue',this.getItemPrama())
          // this.requestData(allvalid.join(','),'kline_forms')
        },500)
      },
      toPriceWarning(item){
        this.$router.push({
          path:'/priceWarning/main',
          query:{
            setWarningSymbol:item.ename,
            backPage:'homePage'
          }
        })
      },
      getUserInfo(symbol){
        let userInfo = getInfoFromSessionStorage() || {}
        return {userid:userInfo.userid,account:userInfo.account,platform:getPlatformCode()}
      },
      showNotice(){
        if (!this.isBindNotice){
          return
        }
        let that =this
        // 显示通知弹窗
        cookieForFirstShowNotice({
          cookieConfig: {
            key: globalConsts.cookies.managerItemOpenKey,
            version: 1
          },
          callback: function () {
            that.$nextTick(function () {
              that.$createDialog({
                type: "alert",
                title: that.$t('priceWarning.noticeDialog.title'),
                showClose: false,
                content:
                  that.$t('priceWarning.noticeDialog.content'),
              }).show();
            });
          }
        });
      },
      switchSelect(type,isAllSelect=false) {
        var that = this
        this.showNotice(this.isBindNotice)
        that.selectSelectItemSwitch =true
        setTimeout(() => {
          //添加--所有有效的--提交到后台
          var allvalid = []
          const _data = [].concat(this.myOption[type]);
          _data.forEach((item) => {
            if (isAllSelect) {
            }else {
              //否则如果不是全选的话，为true的才算
              if (item.isSelect == true) {
                allvalid.push(item.id)
              }
            }
          })
          that.myOption=Object.assign({},this.myOption,{[type]:_data})

          if (type=='market_movements'){
            that.priceSelectList = allvalid.join(',')
          }else if(type=='index'){
            that.indexSelectList = allvalid.join(',')
          }else if(type=='kline_forms'){
            that.klineSelectList = allvalid.join(',')
          }else if(type=='events'){
            that.thingsSelectList = allvalid.join(',')
          }

          // that.commitIds = allvalid.join(',')

          //点击后需要重新计算是否全选
          that.handleISAllSelect(that.myOption)

          that.$emit('changeValue',that.getItemPrama())
          // that.requestData(that.commitIds,type)
        }, 500)
      },
      //添加switch控制变量---true false
      handleData(apiData) {
        //控制k线异动和行情异动是否全选
        var klineSelectNumber = 0;var thingSelectNumber =0;
        var marketSelectNumber = 0;var recommandSelectNumber = 0;
        //添加变量+计算是否全选
        Object.keys(apiData).forEach((key) => {
          var recordList =[]
          apiData[key].forEach((item) => {
            if (item.isvalid == '0') {
              item.isSelect = false
            } else {
              recordList.push(item.id)
              item.isSelect = true
              if (key == 'market_movements') {
                marketSelectNumber++
              } else if (key == 'kline_forms') {
                klineSelectNumber++
              } else if(key=='events'){
                thingSelectNumber++
              } else if(key=='index'){
                recommandSelectNumber++
              }
            }
          })

          if (key=='market_movements'){
            this.priceSelectList = recordList.join(',')
          }else if(key=='index'){
            this.indexSelectList = recordList.join(',')
          }else if(key=='kline_forms'){
            this.klineSelectList = recordList.join(',')
          }else if(key=='events'){
            this.thingsSelectList = recordList.join(',')
          }
        })

        this.lengthCount.priceLength = marketSelectNumber
        this.lengthCount.klineLength = klineSelectNumber
        this.lengthCount.thingLength = thingSelectNumber
        this.lengthCount.recommandLength = recommandSelectNumber


        //行情和k线---全选判断
        if (marketSelectNumber == apiData.market_movements.length) {
          if (this.isAllMarket==false){
            this.isAddNumber=true
          }
          // debugger
          this.isAllMarket = true
        }else {
          this.isAllMarket = false
        }
        if (klineSelectNumber == apiData.kline_forms.length) {
          if (this.isAllKline==false){
            this.isControllKline=true
          }
          this.isAllKline = true
        }else {
          this.isAllKline =false
        }

        return apiData

      },
      // 单独计算----k线异动和行情异动是否全选  也可以直接调用handleData方法 但是考虑到需要太多便利
      handleISAllSelect(apiData) {
        var klineSelectNumber = 0;var thingSelectNumber =0;
        var marketSelectNumber = 0;var recommandSelectNumber = 0;
        // 行情异动
        apiData.market_movements.forEach((item) => {
          if (item.isSelect == true) {
            marketSelectNumber++
          }
        })
        // k线异动
        apiData.kline_forms.forEach((item) => {
          if (item.isSelect == true) {
            klineSelectNumber++
          }
        })
        // k线异动
        apiData.index.forEach((item) => {
          if (item.isSelect == true) {
            recommandSelectNumber++
          }
        })
        // k线异动
        apiData.events.forEach((item) => {
          if (item.isSelect == true) {
            thingSelectNumber++
          }
        })

        this.lengthCount.priceLength = marketSelectNumber
        this.lengthCount.klineLength = klineSelectNumber
        this.lengthCount.thingLength = thingSelectNumber
        this.lengthCount.recommandLength = recommandSelectNumber

        if (marketSelectNumber == apiData.market_movements.length) {
          if (this.isAllMarket==false){
            this.isAddNumber=true
          }
          this.isAllMarket = true
        }else {
          if (this.isAllMarket){
            this.isAddNumber=true
          }
          this.isAllMarket = false
        }

        if (klineSelectNumber == apiData.kline_forms.length) {
          if (this.isAllKline==false){
            this.isAddNumber=true
          }
          this.isAllKline = true
        }else {
          if (this.isAllKline){
            this.isAddNumber=true
          }
          this.isAllKline = false
        }

      }
    },
    watch:{
      data(newValue,oldValue){
        this.myOption = this.handleData(newValue);
        this.$emit('getData',this.getItemPrama())
      }
    },
    i18n
  }
</script>
<style>

  .cube-switch .cube-switch-ui::after{
    background-color: transparent !important;
  }
  .cube-switch .cube-switch-ui{
    border: 3px solid #24242e !important;
  }
  .cube-switch .cube-switch-input:checked + .cube-switch-ui{
    border: 3px solid transparent !important;
  }
  .ManagerItemClass .cube-tab-bar-slider{
    background:none!important
  }
  .ManagerItemClass .cube-tab-bar-slider:after {
    content: ' ';
    display: block;
    background: #fdfdfd;
    height: 2px;
    width: 36px;
    text-align: center;
    margin: 0 auto;
  }
  .ManagerItemClass .cube-tab{
    padding: 0.16rem 0 !important;
  }
  .ManagerItemClass .cube-switch .cube-switch-ui::after {
    background-color: #fff !important;
  }
</style>
<style scoped lang="scss">
  .ManagerItemClass {
    color: white;
    background-color:#23232B;

    .groundBox {
      .groundATipBox {
        padding: 0.3rem 0.28rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .leftTipTitle {
          font-size: 0.25rem;
        }
        .rightTipImg {
          width: 0.5rem;
          height: 0.5rem;
          background-color: red;
        }
      }
      .itemBox{
        padding-left:0.28rem;
        background-color: #292933;

      }

    }

    .toRemoveLeft{
      transform: translateX(-1.8rem);
    }

    .optionItem {
      position: relative;
      transition: transform ease-out 0.3s;
      box-sizing: border-box;
      min-height: 1rem;
      border-bottom: 0.02rem solid #23232B;
      /*background-color:#292933;*/
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.3rem 0.28rem 0.3rem 0;
      .itemLeftBox {
        font-size:0.36rem;
        font-weight:800;
        color:rgba(255,255,255,1);

        display: flex;
        align-items: center;
        .itemLeftImg {
          margin-left: 0.2rem;
          width: 0.2rem;
          height: 0.2rem;
          background-color: red;
        }
      }
      .itemLeftProduct {
        padding-right: 0.5rem;
        .itemProductName{
          font-size:0.32rem;
          font-weight:400;
          color:rgba(235,235,245,0.85);
        }
        .itemContent{
          font-size:0.24rem;
          font-weight:400;
          color:rgba(235,235,245,0.3);
          margin-top: 0.12rem;
          line-height:0.36rem;
        }
      }
      .itemRightBox {
        .numberItem{
          font-size:0.28rem;
          font-weight:400;
          color:rgba(235,235,245,0.6);
          margin-right: 0.3rem;
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
      .removeClass{
        transition: right ease-out 0.1s;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        right:-1.8rem;
        top: 0;
        height: 100%;
        background-color: #FF4D4D;
        width:1.8rem ;
      }
      .leftIng{
        /*right: 0 !important;*/
      }
    }
    .groundBox > .optionItem:last-child {
      border-bottom: none;
    }
  }
</style>

