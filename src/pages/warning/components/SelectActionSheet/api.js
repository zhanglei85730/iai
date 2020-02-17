import {createAPI} from 'cube-ui'

export default function addActionSheet (Vue, ActionSheet) {
  createAPI(Vue, ActionSheet, ['select', 'cancel','save','default','titleIcon'], true)
}
