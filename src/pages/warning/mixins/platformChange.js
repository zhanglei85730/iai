
import request from '@services/documentary.js'
const globalConsts = require('@public/js/consts.js')

import { commonError,initPage } from '@public/js/util.js'
import { getInfoFromSessionStorage,getTenantId,saveInfoToStorage} from '../../../public/js/util';
export default {
    data() {
        return {
            platformPlaneVisible: false,
            token:'',
            platformData: [
                // {
                //     "platform": "PF00",
                //     "account": 0,
                //     "user_id": 0,
                //     "current_pf":0,
                //     "en_short": "IAI_TRADE",
                //     "cn_short": "AI智能盯盘",
                //     "desc": "这里是一条简介，很长很长...",
                //     "bind": 1,
                // },
                // {
                //     "platform": "PF10",
                //     "account": 0,
                //     "user_id": 0,
                //     "current_pf":0,
                //     "en_short": "GWPM",
                //     "cn_short": "金道黄金投资",
                //     "desc": "这里是一条简介，很长很长...",
                //     "bind": 1
                // },
                // {
                //     "platform": "PF12",
                //     "account": 0,
                //     "user_id": 0,
                //     "current_pf": 1,
                //     "en_short": "GWFX",
                //     "cn_short": "金道环球投资",
                //     "desc": "这里是一条简介，很长很长...",
                //     "bind": 0,
                //     'open_url':'http://www.baidu.com'
                // },
                // {
                //     "platform": "PF14",
                //     "account": 0,
                //     "user_id": 0,
                //     "current_pf": 0,
                //     "en_short": "SE6868",
                //     "cn_short": "智选天下",
                //     "desc": "这里是一条简介，很长很长...",
                //     "bind": 0,
                //      'open_url':'http://www.baidu.com'
                // }
            ],
        }
    },
    components: {

    },
    computed: {
        getPlatformSelectCnshort() {
            let select = 0;
            if (this.platformData == 0) {
                return select
            }
            const result = this.platformData.filter(({ current_tenant_id = '' }, index) => {
                return current_tenant_id == 1
            })
            try {
                return result.length > 0 ? result[0].cn_short : ''
            } catch (e) {
                return ''
            }
        },
        getPlatformSelectIndex() {
            let select = 0;
            if (this.platformData == 0) {
                return select
            }
            const result = this.platformData.some(({ current_tenant_id = '' }, index) => {
                if (current_tenant_id == 1) {
                    select = index;
                    return true
                }
            })
            console.log('select00000000000=' + select)
            return select
        },
    },
    methods: {
        maskClickHandle(visible) {
            this.platformPlaneVisible = !visible
        },
        bindTip(item) {
            this.platformItem = item;
            const { platform = '', en_short = '',tenant_id='' } = item
            const t = this;
            //查询绑定确认
            const queryBindSure = this.$createDialog({
                type: 'confirm',
                title: '查询授权并绑定经纪商',
                content: `您将使用当前手机号查询AI智能盯盘与${en_short}经纪商的授权关系。若存在授权，将为您绑定经纪商，是否继续查询？`,
                confirmBtn: {
                    text: '继续查询',
                    active: true,
                    disabled: false,
                    href: 'javascript:;'
                },
                cancelBtn: {
                    text: '暂不',
                    active: false,
                    disabled: false,
                    href: 'javascript:;'
                },
                onConfirm: () => {
                    // t.queryAuthHandle(en_short, platform)
                    t.queryAuthRequest(en_short, platform,tenant_id)
                },
                onCancel: () => {

                }
            }).show()
        },
        // 查询授权
        queryAuthRequest(en_short = '', platform = '',tenant_id='') {
            const t = this;
            // 租户id
            // const tenant_id = getTenantId()
            const bindFailToast = this.$createDialog({
                type: 'alert',
                title: '未查询到授权关系',
                content: `非常抱歉，未查询您在${en_short}经纪商的盯盘授权关系。`,
                confirmBtn: {
                    text: '确定',
                    active: true,
                    disabled: false,
                    href: 'javascript:;'
                },
            })
            request.platformQuery(tenant_id).then(({ data: resData, status: resStatu }) => {
                const { status = '', data = {}, msg = ''} = resData;
                const {auth='',token=''}=data
                ////////////////
                alert(`resData222`+JSON.stringify(resData));
                console.log('147:'+(resStatu == globalConsts.resStatus.success))
                if (status == globalConsts.resStatus.success) {
                    console.log('148:'+auth)
                    if (auth == 1) {
                        bindFailToast.show()
                    } else if (auth == 2) {
                         t.token=token
                        // bindSuccessToast.show()
                        t.queryAuthHandle(en_short, platform,tenant_id)
                    }
                } else {
                    bindFailToast.show()
                }
            }).catch(e => commonError(e, this))
        },
        // 查询授权
        queryAuthHandle(en_short, platform,tenant_id) {
            const t = this;
            this.$createDialog({
                type: 'confirm',
                title: '已查询到授权关系',
                content: `已为您查询到${en_short}经纪商的授权关系。是否确认绑定该经纪商？`,
                confirmBtn: {
                    text: '确认绑定',
                    active: true,
                    disabled: false,
                    href: 'javascript:;'
                },
                onConfirm: () => {
                    // t.queryAuthRequest(en_short, platform)
                    t.platformBindRequest(en_short, platform,tenant_id)
                },
            }).show()
        },
        //获取平台列表
        getPlatformListRequest() {
            // if (this.platformData.length > 0) return false;
            request.getPlatformList().then(({ data: resData, status: resStatu }) => {
                const { status = '', data = [] } = resData
                if (status == globalConsts.resStatus.success) {
                    this.platformData = data;
                }
            }).catch(e => commonError(e, this))
        },
        showPlatformPlane() {
            if (!this.platformPlaneVisible) {
                this.getPlatformListRequest()
            }
            this.platformPlaneVisible = !this.platformPlaneVisible;
        },
        // 切换平台提示
        platformChange(data, index) {
            console.log('198:'+JSON.stringify(data))
            const { platform = '', en_short='',tenant_id='' } = data;
            const t = this;
            // 绑定提示
            this.$createDialog({
                type: 'confirm',
                title: '温馨提醒',
                content: `您即将进入${en_short}的盯盘服务，微信将仅推送该平台的盯盘通知。`,
                confirmBtn: {
                    text: '确定',
                    active: true,
                    disabled: false,
                    href: 'javascript:;'
                },
                onConfirm: () => {
                    // t.platformBindRequest(platform)
                    if (tenant_id != '') {
                        // alert('tenant_id:'+tenant_id)
                        request.platformBind(tenant_id).then(({ data: resData }) => {
                            // alert(tenant_id)
                            const { data, status, msg = '' } = resData;
                            const {token=''}=data
                            if (status == globalConsts.resStatus.success) {
                                const _qeury = { platform, goPage: globalConsts.urlParamsKeys.goPage.value.page3_1, };
                                // t.websocketClose()
                                // 绑定成功后更新token458
                                // const ss=tenant_id
                                saveInfoToStorage({ data:{[globalConsts.wechatStorageKeys.tenant_id]:tenant_id,[globalConsts.access_token]:token}, key:globalConsts.accessAuthKey, type :'localStorage', method:'modify' })
                                initPage(t.$router, _qeury);
                            } else {
                                t.$createToast({
                                    txt: msg != '' ? msg : '切换平台失败',
                                    type: 'error'
                                }).show()
                            }
                        })
                    }
                    t.platformPlaneVisible = false;
                },
            }).show()
        },

        // 绑定平台
        platformBindRequest(en_short, platform,tenant_id='') {
            console.log(`622 en_short='+${en_short},platform=${platform}`)
            // const tenant_id = getTenantId()
            const t = this;
            // const { platform = '' } = data;
            const bindSuccessToast = this.$createDialog({
                type: 'alert',
                title: '绑定成功',
                content: `您即将进入${en_short}的盯盘服务，微信将仅推送该平台的盯盘通知。`,
                confirmBtn: {
                    text: '确定',
                    active: true,
                    disabled: false,
                    href: 'javascript:;'
                },
                onConfirm: () => {
                    const _qeury = { platform, goPage: globalConsts.urlParamsKeys.goPage.value.page3_1 };
                    initPage(this.$router, _qeury);
                },
            })
            request.platformBind(tenant_id).then(({ data: resData }) => {
                const { data={}, status, msg = '', } = resData;
                const {token=''}=data
                if (status == globalConsts.resStatus.success) {
                    bindSuccessToast.show()
                } else {
                    t.$createToast({
                        txt: msg != '' ? msg : '绑定平台失败',
                        type: 'error'
                    }).show()
                }
            })
            this.platformPlaneVisible = false;
        },
    }
}
