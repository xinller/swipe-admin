<template>
    <!-- 任务发货 -->
    <a-spin :spinning="spinning" class="delivery-container">
        <div class="title">发货</div>
        <p class="size-13">
            设置发货后，试客才能提交收货和好评信息，请及时设置。请仔细核对淘宝订单号和旺旺号，以免造成不必要的损失，如发现对应不上，联系客服处理。
        </p>

        <div class="dev-table">
            <a-row type="flex" align="middle" class="row-hd">
                <a-col :xs="4">任务编号</a-col>
                <a-col :xs="4">淘宝订单号</a-col>
                <a-col :xs="4">买家昵称</a-col>
                <a-col :xs="2">任务金额</a-col>
                <a-col :xs="4">快递</a-col>
                <a-col :xs="4">单号</a-col>
                <a-col :xs="2">操作</a-col>
            </a-row>
            <a-row type="flex" align="middle" class="row-hd" v-if="orderDetail.data">
                <a-col :xs="4">{{ orderDetail.data.order_code }}</a-col>
                <a-col :xs="4">{{ orderDetail.data.taobao_ordersn }}</a-col>
                <a-col :xs="4">{{ orderDetail.data.taobao_nickname }}</a-col>
                <a-col :xs="2">{{ orderDetail.data.pay_amount }}</a-col>
                <a-col :xs="4">
                    <a-select v-model="express_id">
                        <a-select-option :value="item.id" v-for="item in expressArr" :key="item.id">{{
                            item.express_name
                        }}</a-select-option>
                    </a-select>
                </a-col>
                <a-col :xs="4">
                    <a-input v-model="express_number"></a-input>
                </a-col>
                <a-col :xs="2">
                    <a-button :disabled="isLoading" type="primary" @click="sendOrder">确认发货</a-button>
                </a-col>
            </a-row>
        </div>
    </a-spin>
</template>

<script>
import * as api from '@/api/api'
export default {
    name: 'delivery',
    data() {
        return {
            spinning: false,
            orderDetail: '',
            expressArr: [], //快递列表
            isLoading: false,
            express_id: '',
            express_number: '',
            order_id: this.$route.query.id,
        }
    },
    mounted() {
        this.getData()
        this.expressList()
    },
    methods: {
        getData() {
            this.spinning = true
            api.orderDetail({ order_id: this.order_id }).then((res) => {
                this.spinning = false
                if (res.success) {
                    this.orderDetail = res.data
                }
            })
        },
        // 快递列表
        expressList() {
            this.spinning = true
            api.expressList().then((res) => {
                this.spinning = false
                if (res.success) {
                    this.expressArr = res.data
                }
            })
        },
        // 发货
        sendOrder() {
            if (!this.express_id) return this.$message.warning('请选择发货快递')
            if (!this.express_number) return this.$message.warning('请输入快递单号')
            this.isLoading = true
            api.sendOrder({ order_id: this.order_id, express_id: this.express_id, express_number: this.express_number }).then(
                (res) => {
                    if (res.success) {
                        this.$message.success('发货成功')
                        this.$router.go(-1)
                    }
                }
            )
        },
    },
}
</script>

<style lang="less" scoped></style>
