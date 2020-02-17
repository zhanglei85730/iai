/**
 * 主要用于预警数据的一些辅助方法（查询等）
 */
import { getWarningSort, getInfoFromSessionStorage } from '@public/js/util.js';
// const { warningConditionData,waringData,selectOptions} = require('./warningDataConfig')
import warningData from './warningDataConfig'

const { warningConditionData, waringData, selectOptions, newPriceWarningConfig } = warningData;
/**
 * @description 根据预警类型 获取该预警类型的触发条件（select下的options设置）
 * @param {String | Number} code 
 * @param {String} type 
 */
export function getWarningConditionForSelectOptions(code = '', type = '') {
    if (type == 'indexWarning') {
        return warningConditionData.index.filter((item) => {
            return item.code == code
        })
    } else if (type == 'combinationWarning') {
        return warningConditionData.combination.filter((item) => {
            return item.code == code
        })
    } else if (type == 'priceWarning') {
        return warningConditionData.price.filter((item) => {
            return item.code == code
        })
    }
}
/**
 * @description 根据预警类型及触发条件编码返回触发条件信息
 * @param {Number | String} trigger 
 * @param {Number | String} warningType 触发类型 1、2、3开头的数字 可选参数
 * @returns {Boller | Object} 找到返回Object,未找到返回false
 */
export function getWarningCondition(trigger, warningType) {
    if (trigger !== '' || warningType !== '') {
        let allConditionData = [];
        let typeData = []
        allConditionData = [
            ...warningConditionData.price,
            ...warningConditionData.index,
            ...warningConditionData.combination,
        ];

        typeData = allConditionData.filter((item) => {
            return warningType == item.code
        })

        if (typeData.length > 0 & typeData[0].hasOwnProperty('data')) {
            const tiggerItem = typeData[0].data.filter((item, index) => {
                Object.assign(item, { index })
                return item.value == trigger
            })
            if (tiggerItem.length > 0) {
                return tiggerItem[0]
            } else {
                return false;
            }
        } else {
            return false
        }
    }
}
//合并数据方便遍历
const mergeData = [
    ...waringData.priceListData,
    ...waringData.combinationListData,
    ...waringData.indexListData
]
/**
 * @description 获取价格预警、指数预警、组合预警配置，根据code查找,
 * 在所有预警类型中查找，并在返回的数据中添加backTitle属性
 * @param {String} code 预警类型
 * @param {String} title 页面要显示的title
 * @returns {Array}
 */
export function getWarningConfig(code = '', title = '') {
    if (code === '') return []
    return mergeData.filter((item) => {
        if (item.link.query.code == code) {
            item.link.query['backTitle'] = title;
            return true;
        } else {
            return false
        }
    })
}
/**
 * @description 指标预警
 * @param {Number | Strnig} type 指标预警分类（2趋势、1震荡）
 * @returns {Array}
 */
export function getIndexWarningConfig(type = 1, title) {
    return waringData.indexListData.filter((item) => {
        if (type == item.type) {
            item.link.query['backTitle'] = title
            return true;
        } else {
            return false
        }
    })
}
/**
 * @description 价格预警
 * @param {*} title 页面标题
 * @returns {Array}
 */
export function getPriceWarningConfig(title) {
    return waringData.priceListData.map((item) => {
        item.link.query['backTitle'] = title
        return item
    })
}
/**
 * @description 组合预警
 * @param {*} title 页面标题
 * @returns {Array}
 */
export function getCombinationWarningConfig(title) {
    return waringData.combinationListData.map((item) => {
        item.link.query['backTitle'] = title
        return item
    })
}
/**
 * @description  获取预警设置select options
 * @param {undefined | Object} params 如果为空返回直接返回所有select配置参数
 * 如果为{type:'cycle'} 返回指定类型的select配置参数
 * 如果为{type:'cycle'，value:'1'} 返回指定类型的select下的一项（主要根据value值返回相对应的中文值）
 */
export function getSelectOptions(params = '') {
    try {
        if (params !== '' & Object.prototype.toString.call(params) === '[object Object]') {
            const { type = '', value = '' } = params;
            if (type !== '' & value === '' & selectOptions.hasOwnProperty(params.type)) {
                return selectOptions[params.type]
            }
            if (type !== '' & value !== '' & selectOptions.hasOwnProperty(params.type)) {
                return selectOptions[params.type].filter((item, index) => {
                    Object.assign(item, { index })
                    return item.value == value
                });
            }
        } else {
            return selectOptions
        }
    } catch (e) {
        console.error(e.message)
        return false;
    }

}
/**
 * symbols 商品大分类（根据返回的参数自动分类）
 */

export function getSymbolSorts(sourceData = []) {
    // 返回的格式
    // const symbolSorts = [
    //     { text: '外汇', value: 'currency' },
    //     { text: '商品', value: 'goods' },
    //     { text: '指数', value: 'index' },
    //     { text: '数字货币', value: 'virtual_coin' },
    //     { text: '贵金属', value: 'metal' },
    //     // { text: '参考', value: 'refer' },
    //     // { text: '股票', value: 'stock' },
    // ]
    let symbolSorts = []
    const waringSymbols = sourceData.length > 0 ? sourceData : getInfoFromSessionStorage('waringSymbols');
    waringSymbols.forEach(({ id = [] }) => {
        if (symbolSorts.length > 0) {
            const isHave = symbolSorts.some(({ value = '' }) => {
                return value == id[2];
            })
            if (!isHave) {
                symbolSorts.push({ text: id[3], value: id[2] })
            }
        } else {
            symbolSorts.push({ text: id[3], value: id[2] })
        }
    })
    //外汇分类排最前面,不然默认行情会没行情数据
    if (symbolSorts.length > 0) {
        if (symbolSorts[0].value !== 'currency') {
            // 保存第一条item数据
            const firstItem = symbolSorts[0]
            symbolSorts.forEach((item, index) => {
                const { value = '' } = item;
                if (value == 'currency') {
                    symbolSorts[0] = item
                    symbolSorts[index] = firstItem;
                }
            })
        }
    }
    return symbolSorts;
}
// 通过value获取商品分类的index
export function getSymbolSortsIndex(value) {
    const symbolSorts = getSymbolSorts();
    let result = '';
    const filter = symbolSorts.filter((item, index) => {
        if (value == item.value) {
            result = Object.assign({}, item, { index })
            return true;
        }

    })
    return filter.length > 0 & result != '' ? result : false
}
// 依据触发类型获取价格预警中文名（新独立出来的模块）
export function getPriceWarningNameByTrigger(triggerCode) {
    const { triggerData = {} } = newPriceWarningConfig;
    //    const triggerTypesArr = Object.values(triggerData);
    return triggerData.filter(({ type }) => {
        return type == triggerCode
    }).shift()
}
// 获取所有预警trigger相同的数据（新独立出来的模块）
export function getPriceTriggerTypeByCode(trigger) {
    const { triggerData = {} } = newPriceWarningConfig;
    //    const triggerTypesArr = Object.values(triggerData);
    return triggerData.filter(({ triggerType }) => {
        return triggerType == trigger
    })
}
/**
 * @description 通过条件查询预警类型(新独立出来的模块)
 * @param field 字段名
 *  @param value 字段值
 * @returns Array
 */
export function priceWarningQuery({ table='triggerData',field = '', value = '' }) {
    return newPriceWarningConfig[table].filter((item) => {
        return item[field] == value
    })
}
