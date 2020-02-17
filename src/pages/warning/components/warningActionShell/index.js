import WarningActionSheet from './action-sheet.vue'
import addActionSheet from './api'
import Locale from 'cube-ui/src/common/locale'

WarningActionSheet.install = function (Vue) {
  Vue.component(WarningActionSheet.name, WarningActionSheet)
  Locale.install(Vue)
  addActionSheet(Vue, WarningActionSheet)
}

export default WarningActionSheet
