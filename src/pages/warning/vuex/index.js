import Vue from "vue"
import Vuex from "vuex"
import { getInfoFromSessionStorage, getPlatformCode, getNewPlatform, iConsole,isWechatPlatform } from '@public/js/util.js'
// const config = require('../config.js')
const consts = require('../consts.js')
const globalConsts = require('@public/js/consts.js')
const configConsts = require('@config/consts.js')
import findPassword from "@commonPage/vuex/modules/findPassword";
import dialogSwipe from "./dialogSwipe";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    findPassword,
    dialogSwipe
  },
  state: {
    // 获取行情数据的websocket实例
    websockForSymbolsInstance: '',
    // 行情数据
    symbolsData: {},
    // 已经订阅的行情数据symbol名称
    listendedSymbolsNames: [],
    // 行情websocket连接状态(0: 表示连接尚未建立，1: 表示连接已建立，可以进行通信)
    webSocketReadyStateForSymbols: 0,
    websocketLock: false,
    // 保存websocket推送的数据
    dataStoreForSocket: [],
    //获取行情数据的websocket实例的状态 4表示建立连接开始，1表示连接打开可以通信
    websockForSymbolsState: 0,
    //游客、模拟用户提示登录、注册提示是否显示
    authPopVisible: false,
  },
  mutations: {
    //跟新状态方法
    updateState(state, { field = '', value = '' }) {
      if (!state.hasOwnProperty(field)) return false;
      state[field] = value;
    },
    //更新行情数据
    listenSymbolsChange(state, plyoad) {
      state.symbolsData = plyoad;
    },
    /**
     * @description 订阅行情数据（向服务器发送消息）主要避免重复订阅数据,add类型具有去重功能，如果已订阅无效再订阅，modify直接替换
     * @param {data} //names：symbols名字 websocketInstance： websocket实例,type:'add'/'modify'为操作的类型
     */
    symbolsWebSocketSendMsg(state, { names = [], websocketInstance = '', type = 'add', diff = true }) {
      const listendedSymbolsNa = state.listendedSymbolsNames;
      let userInfo = getInfoFromSessionStorage('userInfo');
      let result = [];
      if (type === 'add') {
        result = names.filter((item) => {
          return listendedSymbolsNa.indexOf(item) < 0
        })
        // 是否强制更新
        if (diff) {
          if (result.length == 0) return;
        }
        result = listendedSymbolsNa.concat(result)
      } else if (type === 'modify') {
        result = names
      }
      let platformCode = getPlatformCode();
      // if (platformCode === globalConsts.platformNames.dev) {
      //   platformCode = globalConsts.platformNames.pm
      // }
      const sendMs = {
        type,
        data: {
          symbols: result,
        },
        platform: platformCode,
      };
      if (!!userInfo) {
        const { account = '' } = userInfo;
        // PF00使用PF10的Platform
        if (getNewPlatform()) {
          // PF00
          if (platformCode == globalConsts.platformNames.iaiTrader) {
            Object.assign(sendMs, { platform: globalConsts.platformNames.se })
            // 其他
          } else {
            Object.assign(sendMs, { platform: platformCode })
          }
          Object.assign(sendMs.data, { account: 0 });
          //老平台
        } else {
          Object.assign(sendMs.data, { account });
        }
        // app用户才添加账户信息

      }
      //微信 写死平台
        if(isWechatPlatform()){
           Object.assign(sendMs,{platform:'PF10'})    
        }
      //
      if (!websocketInstance == '') {
        state.websockForSymbolsInstanc = websocketInstance
        if (websocketInstance.readyState == 1) {
          websocketInstance.send(JSON.stringify(sendMs));
        }
      } else {
        if (state.websockForSymbolsInstance.readyState == 1) {
          state.websockForSymbolsInstance.send(JSON.stringify(sendMs))
        }
      }
      if (type === 'add') {
        state.listendedSymbolsNames = result;
        console.log('names数据:' + JSON.stringify(result))
      } else if (type === 'modify') {
        state.listendedSymbolsNames = [].concat(result)
      }
    },
    updateDataStoreForSocket(state, symbolItem) {
      const { symbolInt: symbolId = '' } = symbolItem;
      const saveResult = state.dataStoreForSocket.concat([]);
      if (saveResult.length == 0) {
        state.dataStoreForSocket = [symbolItem];
        // return this.dataStoreForSocket;
      };
      const filterArr = saveResult.filter(({ symbolInt = '' }, index) => {
        if (symbolInt == symbolId) {
          saveResult[index] = symbolItem
        }
        return symbolInt == symbolId
      })
      if (filterArr.length == 0 && symbolItem.hasOwnProperty('symbolInt')) {
        saveResult.push(symbolItem)
      }
      state.dataStoreForSocket = saveResult;
      // return saveResult
    },
    // 关闭websocket
    websocketClose(state) {
      if (state.websockForSymbolsInstance != '') {
        try {
          state.websockForSymbolsInstance.close();
          state.websockForSymbolsInstance = '';
          state.symbolsData = {};
          state.webSocketReadyStateForSymbols = 0;
          state.websocketLock = false;
          state.dataStoreForSocket = [];
          state.websockForSymbolsState = 0;
        } catch (e) {
          iConsole('关闭websocket出错了')
        }
      }
    }
  },
  getters: {
    getSymbolsData: state => {
      return state.symbolsData;
    }
  },
  actions: {
    //建立行情websocket链接
    createWebSocketForSymbols({ commit, mutation, state, getters }) {
      const symbolSocketInstance = state.websockForSymbolsInstance;
      if (symbolSocketInstance != '') {
        if (symbolSocketInstance.readyState !== 3) {
          return false;
        }
        if (symbolSocketInstance.readyState == 3) {
          console.log('websocket连接断开');
          // commit('updateState', { field: 'websocketLock', value: false });
          commit('updateState', { field: 'websockForSymbolsInstance', value: '' });
        }
      }
      let wsUrl = globalConsts.wsUrl;
      const platformCode = getPlatformCode();
      // pm 01业务
      //真实场环境
      // 新平台
      if (getNewPlatform()) {
        // PF00 及PF10平台
        // if (platformCode == globalConsts.platformNames.pm) {
        //   wsUrl = `${globalConsts.wsUrls.newPlatform}PF10`;
        //   //PF12
        // } else {
        //   wsUrl = `${globalConsts.wsUrls.newPlatform}PF12`;
        // }
        ////
        ///
        wsUrl = `${globalConsts.wsUrls.newPlatform}`;
      } else {
        if (globalConsts.NODE_ENV == configConsts.prodNodeEvn) {
          // 01业务-黄金投资
          if (platformCode == globalConsts.platformNames.pm) {
            wsUrl = globalConsts.wsUrls.pm
            // 01业务-贵金属
          } if (platformCode == globalConsts.platformNames.pmglod) {
            wsUrl = globalConsts.wsUrls.pmglod
            // fx 02业务 金道外汇
          } else if (platformCode == globalConsts.platformNames.fx) {
            wsUrl = globalConsts.wsUrls.fx
            // se 03业务智选天下
          } else if (platformCode == globalConsts.platformNames.se) {
            wsUrl = globalConsts.wsUrls.se
            // 开发
          } else if (platformCode == globalConsts.platformNames.dev) {
            wsUrl = globalConsts.wsUrls.web
          }
        }
      }
      console.log('websocket地址:' + wsUrl)
      console.log("globalConsts.prodNodeEvn=" + globalConsts.NODE_ENV);
      const socket = new WebSocket(wsUrl);
      commit('updateState', { field: 'websockForSymbolsState', value: 4 });
      // websockForSymbolsState:4标间建立连接开始，是否成功未知
      commit('updateState', { field: 'websockForSymbolsState', value: 4 })
      // 格式化websocket信息
      function _formatSymbolsDataFormSS(source, isFormamt = true) {
        const data = isFormamt ? source.data : source
        if (isFormamt) {
          const msg = JSON.parse(data), { data: resData } = msg;
          return resData
        } else {
          return data
        }
      }
      function _clearWebsocket(webSocketState = 0) {
        commit('updateState', { field: 'websockForSymbolsInstance', value: '' });
        commit('updateState', { field: 'listendedSymbolsNames', value: [] });
        commit('updateState', { field: 'websockForSymbolsState', value: webSocketState });
      }
      socket.onmessage = function ({ data = '' } = {}) {
        if (data == '') return;
        const { type = '' } = JSON.parse(data)
        // 表示数据可用
        if (type == consts.webSocketResType[0]) {
          try {
            commit('listenSymbolsChange', _formatSymbolsDataFormSS(event))
          } catch (e) {

          }
          //数据不可用(空闲)
        } else if (type == consts.webSocketResType[1]) {

        }
      }
      socket.onopen = function (event) {
        commit('updateState', { field: 'websockForSymbolsState', value: 1 });
      }
      socket.onclose = function (event) {
        console.log('symbolsWebSocket链接关闭');
        _clearWebsocket()
      }
      socket.onerror = function () {
        socket.close()
        console.log('symbolsWebSocket出错了')
        // _clearWebsocket()
      }
      commit('updateState', { field: 'websockForSymbolsInstance', value: socket });
    },
  }
})
