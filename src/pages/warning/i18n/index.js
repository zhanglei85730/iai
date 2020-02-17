import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh_CN from "./zh-CN";
import ID from "./ID";
const globalConsts = require('@public/js/consts.js');

Vue.use(VueI18n)
const i18n = new VueI18n({
    locale:globalConsts.locale.chinese,
    // locale:globalConsts.locale.indonesia,
    messages: {
        [globalConsts.locale.chinese]:zh_CN,
        [globalConsts.locale.indonesia]:ID
    }
});
export default i18n;
