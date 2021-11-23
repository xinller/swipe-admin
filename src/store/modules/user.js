const user = {
    getters: {
        SWIPE_A_TOKEN(state) {
            return state.SWIPE_A_TOKEN
        },
        userInfo(state) {
            return state.userInfo
        },
        exModalVisible(state) {
            return state.exModalVisible
        },
        updateBalance(state) {
            return state.updateBalance
        },
        userBalance1(state) {
            return state.userBalance1
        },
        userBalance2(state) {
            return state.userBalance2
        },
        DISCOUNT(state) {
            return state.DISCOUNT
        }
    },
    state: {
        SWIPE_A_TOKEN: '',
        DISCOUNT: 1,
        userInfo: {},
        exModalVisible: false,
        updateBalance: false,
        userBalance1: '0.00',
        userBalance2: '0.00',
    },
    mutations: {
        // 设置token
        setToken(state, token) {
            state.SWIPE_A_TOKEN = token
        },
        // 设置登录后返回数据
        setUserInfo(state, userInfo) {
            delete userInfo.token
            state.userInfo = userInfo
        },
        // 设置折扣比例
        setDiscount(state, value) {
            state.DISCOUNT = value
        },
        // 是否显示兑换
        showExchange(state, visible) {
            state.exModalVisible = visible
        },
        // 是否更新金额
        setUpdateBalance(state, value) {
            state.updateBalance = value
        },
        // 设置货款 鲸币金额
        setUserBalance(state, value) {
            // 鲸币
            state.userBalance1 = Number(value[0]['amount']).toFixed(2)
                // 货款
            state.userBalance2 = Number(value[1]['amount']).toFixed(2)
        },

    },
}

export default user