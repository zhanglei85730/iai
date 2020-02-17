import SelectActionSheet from './action-sheet.vue'
import addActionSheet from './api'
import Locale from 'cube-ui/src/common/locale'

SelectActionSheet.install = function (Vue) {
  Vue.component(SelectActionSheet.name, SelectActionSheet)
  Locale.install(Vue)
  addActionSheet(Vue, SelectActionSheet)
}

export default SelectActionSheet
