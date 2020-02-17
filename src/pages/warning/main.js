// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "./vuex"
// 主要布局组件
import GlobalMainLayout from '@components/layout/MainLayout';
import GlobalSideSpace from '@components/SideSpace';
import i18n from "./i18n";
import Cube from 'cube-ui'
import WarningActionShell from '@warning/components/warningActionShell'
import SelectActionSheet from '@warning/components/SelectActionSheet'
import VueTouch from 'vue-touch'
import LoginPop from '@warning/components/LoginPop'
import AuthPop from '@warning/components/AuthPop'
import WeChatLogin from "@warning/components/WeChatLogin"
Vue.use(WarningActionShell)
Vue.use(SelectActionSheet)
Vue.use(VueTouch, {name: 'v-touch'})

const config = require('./config.js')
// 全局组件
const MainLayout = {
  install: function (Vue) {
    Vue.component('MainLayout', GlobalMainLayout)
  }
}
const SideSpace = {
  install: function (Vue) {
    Vue.component('SideSpace', GlobalSideSpace)
  }
}
Vue.use(MainLayout);
Vue.use(SideSpace);
// 全局授权组件
Vue.use({
  install: function (Vue) {
    Vue.component('LoginPop', LoginPop)
  }
});
// 全局登录组件
Vue.use({
  install: function (Vue) {
    Vue.component('AuthPop',AuthPop)
  }
});
// 全局微信绑定手机
Vue.use({
  install: function (Vue) {
    Vue.component('WeChatLogin',WeChatLogin)
  }
});
Vue.use(Cube)

Vue.config.productionTip = false;
// Vue.config.imagePrefix = 'mobile/img';
/* eslint-disable no-new */
// 配置文件
//指令
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
// 配置信息
Vue.prototype.$config = config;
// 通用错误处理
// Vue.config.errorHandler = function (err, vm, info) {

  // vm.$router.replace({ name: 'errorPage', query: { message: err.message } })
// }
//
new Vue({
  el: '#documentary',
  i18n,
  router,
  store,
  // render: (h) => h(one)
  components: { App },
  template: '<App/>'
})
