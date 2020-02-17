/**
 * @description 预警所使用的变量
 */
module.exports = {
    fromApp: 'app',
    fromWeb: 'web',
    // 提交预警不满足条件提示内容
    triggerErrorTip500:'预警价格必须大于当前价格',
    triggerErrorTip501:'预警价格必须小于当前价格',
    triggerErrorTip101_01:'请输入预警价格',
    triggerErrorTip101_02:'请输入点数',
    triggerErrorTip103_01:'请输入价格',
    triggerErrorTip103_02:'请请输入累计反弹点数',
    triggerErrorTip104_01:'请输入价格',
    triggerErrorTip104_02:'请输入累计回落点数',
    inputErrorTip:'输入不合法，请重新输入',
    // websocket数据状态 ticket数据可用，writeIdle无数据
    webSocketResType:['ticket','writeIdle']
}
