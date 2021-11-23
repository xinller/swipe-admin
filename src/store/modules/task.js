const user = {
    getters: {
        postTaskInfo(state) {
            return state.postTaskInfo
        },
        goodsInfoHis(state) {
            return state.goodsInfo
        },
        priceTaskConfig(state) {
            return state.priceTaskConfig
        },
        orderDetailPrice(state) {
            return state.orderDetailPrice
        }
    },
    state: {
        // 发布任务参数
        postTaskInfo: {},
        // 搜索记录
        goodsInfoHis: [],
        // 发布价格和其他参数配置
        priceTaskConfig: {},
        // 发布的订单详情价格
        orderDetailPrice: {}
    },
    mutations: {
        // 设置发布任务返回参数
        setPostTaskInfo(state, value) {
            state.postTaskInfo = {...value }
        },
        // 宝贝搜索记录
        setGoodsInfoHis(state, value) {
            let has = false
            _.each(state.goodsInfoHis, (v) => {
                if (v.goods_link === value.goods_link) {
                    v = {...value }
                    has = true
                    return
                }
            })
            if (!has) {
                state.goodsInfoHis.unshift(value)
            }
        },
        // 设置任务价格
        setPriceTaskConfig(state, value) {
            if (value.clear) {
                state.priceTaskConfig = {}
            } else {
                state.priceTaskConfig = Object.assign(state.priceTaskConfig, value)
            }

        },
        // 发布价格设置,
        setOrderDetailPrice(state, value) {
            state.orderDetailPrice = value
            if (value.clear) {
                // 是否需要清空价格参数
                for (let i in state.orderDetailPrice) {
                    state.orderDetailPrice[i] = i == 'order_num' ? 1 : 0
                }
            }
        },


    },
}

export default user