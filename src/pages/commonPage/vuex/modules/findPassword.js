/**
 * 找回密码 vuex module
 * 只能是json 不能用function(){return {}}这样方式
 */
export default {
    namespaced: true,
    state: {
        username: '',//用户名
        smscode: '',//验证码
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
    },
}