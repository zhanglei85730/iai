import {getSearchParams,getI18nData} from '@public/js/util.js'
import data_zh_CN from "./data.zh-CN.js";
import data_ID from "./data.ID.js";
import i18n from '@warning/i18n';

const globalConsts = require('@public/js/consts.js');
const {locale=''} = i18n;
// 默认使用中文（中国大陆）
let resultLanuage ='';
// 根据参数调用不同的语言的预警数据配置
switch(locale){
    case globalConsts.locale.chinese:{
        resultLanuage=data_zh_CN;
        break;
    }
    case globalConsts.locale.indonesia:{
        resultLanuage=data_ID
        break;
    }
    default:{
        resultLanuage =data_zh_CN;
    }
}
export default resultLanuage
