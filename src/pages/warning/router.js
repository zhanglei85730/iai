import Vue from 'vue'
import Router from 'vue-router'
import { Toast } from 'cube-ui'

import { getI18nData, decodURIForSpecial, removeIndexLoading, iaiTraderControlApp, isIaiTraderApp } from '@public/js/util.js'
import { getWarningConfig } from './mapConfig.js'
import i18n from "./i18n";
const i18nData = getI18nData(i18n)
Vue.use(Router)
Vue.use(Toast)
// 首页loading
const moduleLoading = Toast.$create({
  txt: '加载中...',
  mask: true,
})

document.addEventListener("DOMContentLoaded", function () {

}, false);


const routesData = [
  {
    path: '',
    redirect: '/index',
    meta: {}
  },
  // 高级盯盘
  {
    path: '/advanceAssign',
    name: 'advanceAssign',
    // component: resolve => require([`./views/index`], resolve),
    component: resolve => {
      moduleLoading.show()
      return require([`./views/index`], resolve).then((data) => {
        moduleLoading.hide()
        removeIndexLoading()
      })
    },
    meta: { requireAuth: false }
  },
  // 页面初始化
  {
    path: '/index',
    name: 'index',
    component: resolve => {
      // indexLoaing.show()
      return require([`./views/initPage`], resolve).then((data) => {

      })
    },
    meta: { requireAuth: false }
  },
  // 新版首页
  {
    path: '/homePage',
    name: 'homePage',
    component: resolve => {
      moduleLoading.show()
      return require([`./views/homePage`], resolve).then((data) => {
        moduleLoading.hide()
        removeIndexLoading()
      })
    },
    meta: { requireAuth: false }
  },
  // 新版设置页
  {
    path: '/optionalPage',
    name: 'optionalPage',
    component: resolve => {
      moduleLoading.show()
      return require([`./views/optionalPage`], resolve).then((data) => {
        moduleLoading.hide()
        removeIndexLoading()
      })
    },
    meta: { requireAuth: false }
  },
  // 新版symbol详情页
  {
    path: '/productDetailPage',
    name: 'productDetailPage',
    component: resolve => {
      moduleLoading.show()
      return require([`./views/productDetail`], resolve).then((data) => {
        moduleLoading.hide()
        removeIndexLoading()
      })
    },
    meta: { requireAuth: false }
  },

  {
    path: '/dataWarning',
    name: 'dataWarning',
    component: resolve => require([`./views/dataWarning`], resolve),
    meta: { requireAuth: false }
  },
  {
    path: '/dataWarningDetail',
    name: 'dataWarningDetail',
    // component: resolve => require([`./views/dataWarningDetail`], resolve),
    component: resolve => {
      return require([`./views/dataWarningDetail`], resolve).then((data) => {
        removeIndexLoading()
      })
    },
    meta: { requireAuth: false }
  },
  {
    path: '/indexWarning',
    name: 'indexWarning',
    component: resolve => require([`./views/indexWarning`], resolve),
    meta: { requireAuth: false }
  },
  {
    path: '/validateIdentity',
    name: 'validateIdentity',
    component: resolve => require([`@commonPage/views/validateIdentity`], resolve),
    meta: { requireAuth: false },
  },
  {
    path: '/setLoginPassword',
    name: 'setLoginPassword',
    component: resolve => require([`@commonPage/views/setLoginPassword`], resolve),
    meta: { requireAuth: false },
  },
  {
    path: '/myWarning',
    name: 'myWarning',
    component: resolve => {
      moduleLoading.show()
      return require([`./views/myWarning`], resolve).then(() => {
        moduleLoading.hide()
        removeIndexLoading()
      })
    },
    meta: { requireAuth: true }
  },
  {
    path: '/help',
    name: 'help',
    component: resolve => require([`./views/help`], resolve),
    meta: { requireAuth: false }
  },
  // 指标预警帮助
  {
    path: '/helpPriceWarning',
    name: 'helpPriceWarning',
    component: resolve => require([`./views/helpPriceWarning`], resolve),
    meta: { requireAuth: false }
  },
  {
    path: '/errorPage',
    name: 'errorPage',
    component: resolve => require([`./views/errorPage`], resolve),
    meta: { requireAuth: false }
  },
  {
    path: '/login',
    name: 'login',
    component: resolve => require([`@commonPage/views/login`], resolve),
    meta: { requireAuth: false }
  },
  {
    path: '/findPassword',
    name: 'findPassword',
    component: resolve => require([`@commonPage/views/findPassword`], resolve),
    meta: { requireAuth: false },
  },
  {
    path: '/setNewPassword',
    name: 'setNewPassword',
    component: resolve => require([`@commonPage/views/setNewPassword`], resolve),
    meta: { requireAuth: false },
  },
  {
    path: '/register',
    name: 'register',
    component: resolve => require([`@commonPage/views/register`], resolve),
    meta: { requireAuth: false }
  },
  {
    path: '/weChatNotice',
    name: 'weChatNotice',
    // component: resolve => require([`./views/weChatNotice`], resolve),
    component: resolve => {
      return require([`./views/weChatNotice`], resolve).then((data) => {
        removeIndexLoading()
      })
    },
    meta: { requireAuth: false }
  },
  {
    path: '/indexLoading',
    name: 'indexLoading',
    component: resolve => require([`./views/indexLoading`], resolve),
    meta: { requireAuth: false }
  },
  {
    path: '/feedback',
    name: 'feedback',
    component: resolve => {
      return require([`./views/feedback`], resolve).then((data) => {
        removeIndexLoading()
      })
    },
    meta: { requireAuth: false }
  },
  {
    path: '/vsersionIntroduce',
    name: 'vsersionIntroduce',
    component: resolve => {
      return require([`./views/vsersionIntroduce`], resolve).then((data) => {
        removeIndexLoading()
      })
    },
    meta: { requireAuth: false }
  },
  // iai-trader app 首页
  {
    path: '/iaiTraderAppIndex',
    name: 'iaiTraderAppIndex',
    component: resolve => {
      return require([`./views/iaiTraderAppIndex`], resolve).then((data) => {
        removeIndexLoading()
      })
    },
    meta: { requireAuth: false }
  },
  // iai-trader我的页面
  {
    path: '/minePage',
    name: 'minePage',
    component: resolve => {
      return require([`./views/minePage`], resolve).then((data) => {
        removeIndexLoading()
      })
    },
    meta: { requireAuth: false }
  },
  // 用户协议
  {
    path: '/userProtocol',
    name: 'userProtocol',
    component: resolve => {
      return require([`./views/userProtocol`], resolve).then((data) => {
        removeIndexLoading()
      })
    },
    meta: { requireAuth: false }
  },
  // 新价格预警 main 价格预警 comment自定义备注 quitDialog退出确认
  {
    path: '/priceWarning/:page',
    name: 'priceWarning',
    component: resolve => {
      return require([`./views/priceWarning`], resolve).then((data) => {
        removeIndexLoading()
      })
    },
    meta: { requireAuth: false }
  },
  // 新价格预警 main 价格预警 comment自定义备注 quitDialog退出确认
  {
    path: '/aboutUs',
    name: 'aboutUs',
    component: resolve => {
      return require([`./views/aboutUs`], resolve).then((data) => {
        removeIndexLoading()
      })
    },
    meta: { requireAuth: false }
  },
  // test首页图表
  {
    path: '/testPage',
    name: 'testPage',
    component: resolve => {
      return require([`./views/testPage`], resolve).then((data) => {
        removeIndexLoading()
      })
    },
    meta: { requireAuth: false }
  },
  // test首页图表
  {
    path: '/tableDataTest',
    name: 'tableDataTest',
    component: resolve => {
      return require([`./views/tableDataTest`], resolve).then((data) => {
        removeIndexLoading()
      })
    },
    meta: { requireAuth: false }
  },
  // test首页图表
  {
    path: '/bangtest',
    name: 'bangtest',
    component: resolve => {
      return require([`./views/bangtest`], resolve).then((data) => {
        removeIndexLoading()
      })
    },
    meta: { requireAuth: false }
  },
  // 登录授权
  {
    path: '/serviceAuthByPassword',
    name: 'serviceAuthByPassword',
    component: resolve => {
      return require([`./views/auth/serviceAuthByPassword`], resolve).then((data) => {
        removeIndexLoading()
      })
    },
    meta: { requireAuth: false }
  },
  {
    path: '/serviceAuthByToken',
    name: 'serviceAuthByToken',
    component: resolve => {
      return require([`./views/auth/serviceAuthByToken`], resolve).then((data) => {
        removeIndexLoading()
      })
    },
    meta: { requireAuth: false }
  },
  //wechatBindTel
  {
    path: '/wechatBindTel',
    name: 'wechatBindTel',
    component: resolve => {
      return require([`./views/auth/wechatBindTel`], resolve).then((data) => {
        removeIndexLoading()
      })
    },
    meta: { requireAuth: false }
  },
  // end 登录授权
  {
    path: '/noticeManage',
    name: 'noticeManage',
    component: resolve => {
      return require([`./views/noticeManage`], resolve).then((data) => {
        removeIndexLoading()
      })
    },
    meta: { requireAuth: false }
  }
]
const router = new Router({
  routes: routesData.map((item) => {
    try {
      Object.assign(item.meta, { title: i18nData.pageTitle[item.name] })
      return item
    } catch (e) {
      Object.assign(item.meta, { title: '1' })
      return item
    }
  })
})
// 获取title name
function getTitleName(query) {
  const { modify = '', code = '', name = '' } = query
  // 如果是修改
  if (String(modify) === 'true' & code != '') {
    const warningTypeInfoArr = getWarningConfig(code, 'ww')
    return warningTypeInfoArr.length > 0 ? warningTypeInfoArr[0].title + i18nData.common.modifyText : '';
  } else {
    return name != '' ? decodURIForSpecial(name) + i18nData.common.setText : '';
  }
}
// 判断是否需要登录权限 以及是否登录
router.beforeEach((to, from, next) => {
  // 主要用来神策全埋点设置html里head里的title
  const { path = '', query = {}, name = '' } = to;
  const { path: fromPath = '' } = from;
  const { warningType = '', name: queryNameValue = '' } = query;
  //除预警详情页显示iai-trader app 底部菜单，其他页面隐藏底部菜单
  if (isIaiTraderApp()) {
    /**
     * 除预警详情页显示iai-trader app 底部菜单，其他页面隐藏底部菜单
     *  隐藏底部菜单bottomMenu:0
     * iaiTraderControlApp 控制iaiTrader app底部菜单显示隐藏（js调用原生app方法） showBottom值1显示 0隐藏，curentIndex当前选中菜单索引值
     */
    switch (path) {
      case '/iaiTraderAppIndex': {
        iaiTraderControlApp({ showBottom: '1', curentIndex: '0' });
        Object.assign(to.query, { bottomMenu: 0 })
        break
      }
      case '/advanceAssign': {
        iaiTraderControlApp({ showBottom: '1', curentIndex: '2' });
        Object.assign(to.query, { bottomMenu: 0 })
        break
      }
      case '/minePage': {
        iaiTraderControlApp({ showBottom: '1', curentIndex: '3' });
        Object.assign(to.query, { bottomMenu: 0 })
        break
      }
      case '/index': {
        iaiTraderControlApp({ showBottom: '1', curentIndex: '0' });
        Object.assign(to.query, { bottomMenu: 0 })
        break
      }
      case '/myWarning': {
        iaiTraderControlApp({ showBottom: '0' });
        Object.assign(to.query, { bottomMenu: 0 })
        break
      }
      default: {
        iaiTraderControlApp({ showBottom: '0' })
      }
    }
  }

  //
  if (path == '/dataWarningDetail') {
    document.title = getTitleName(query)
    // 帮助页面
  } else if (name == 'help' || name == 'helpPriceWarning') {
    document.title = queryNameValue + i18nData.warningHelp_page.help;
  } else if (warningType == 'priceWarning') {
    document.title = i18nData.common.priceWarning;
  } else if (warningType == 'indexWarning') {
    document.title = i18nData.common.indexWarning;
  } else if (warningType == 'combinationWarning') {
    document.title = i18nData.common.combinationWarning;
  } else {
    document.title = to.meta.title;
  }
  //de
  console.log('fromPath=' + fromPath)
  console.log('fromPath==' + (fromPath == "/" && path == '/index'))
  // 判断是否需要登录权限
  // if (to.matched.some(res => res.meta.requireAuth)) {
  //   const userInfo = getInfoFromSessionStorage(publiConsts.userInfoKeyNameInStore);
  //   if (!!userInfo) {// 判断是否登录
  //     next()
  //   } else {// 没登录则跳转到登录界面
  //     next({
  //       path: '/login',
  //       query: { loginAfterTo: 'index' }
  //     })
  //   }
  // } else {
  //   next()
  // }
  next()
})
export default router
