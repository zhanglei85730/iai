/**
 * 切换DialogSwipe
 */
export default {
    namespaced: true,
    state: {
        // 综合评分滑动modal
        warningRate: -1,
        // WinLossInfo组件里dialogSwipe组件里滑动modal
        winLossInfoDialog: -1,
    },
    mutations: {
        //跟新状态方法
        updateState(state, fields = {}) {
            if (Array.isArray(fields)) {
                fields.forEach(({ field = '', value = '' }) => {
                    if (state.hasOwnProperty(field)) {
                        state[field] = value;
                    }
                })
            } else {
                try {
                    const { field = '', value = '' } = fields
                    if (!state.hasOwnProperty(field)) return false;
                    state[field] = value;
                } catch (e) {
                    console.error(e.message)
                }

            }
        },
        updateWarningRateChangeId(state, fields = {}) {
            state.warningRate = state.warningRate + 1
        },
        updateDialogChangeId(state, fields = {}) {
            state.winLossInfoDialog = state.winLossInfoDialog + 1
        }
    },
}