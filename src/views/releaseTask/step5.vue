<template>
    <a-spin :spinning="spinning" class="releaseTask-container">
        <div class="title">
            发布任务
            <span class="ml-5 c-gray size-12">标题：{{ orderDetail.goods_title }} </span>
            <span class="ml-5 c-gray size-12">店铺名：{{ orderDetail.store_name }}</span>
        </div>

        <stepCom :activeKey="5" />
        <div class="step-page">
            <!-- 店铺信息 -->
            <orderPrice :detail="orderDetail"></orderPrice>

            <!-- 活动概况+活动费用详情 -->
            <activeInfoDetail :detail="orderDetail"></activeInfoDetail>
            <a-row class="mt-20">
                <a-col class="size-12">
                    <a-checkbox v-model="agreePay"><span class="c-primary">使用账户余额支付</span></a-checkbox>
                    (可用货款余额 <span class="c-red size-14">{{ userBalance2 }}</span> 元， 可用鲸币余额
                    <span class="c-red size-14">{{ userBalance1 }}</span> 元） （余额不足，请去充值，充值成功后刷新本页面)
                </a-col>
            </a-row>
            <div class="mt-30">
                <a-button class="btn-next" @click="toPrev">上一步</a-button>
                <a-button type="primary" class="ml-30 btn-next" @click="toPay">确认支付</a-button>
            </div>
        </div>
        <!-- 支付弹窗 -->
        <v-pay-modal
            :isReset="isReset"
            :visible="isPayVisible"
            okText="支付"
            @toggle="isPayVisible = !isPayVisible"
            @commit="PayCommit"
        >
            <template slot="footer-content">
                <p class="size-12">活动发布后约1分钟生效,注意刷新活动页!</p>
                <p class="size-12">
                    买家 <span class="c-red">付款后</span> 请及时确认及发货,系统将在 <span class="c-red">1天后自动发货!</span>
                </p>
                <p class="size-12">
                    买家 <span class="c-red">收货后</span> 请及时确认及返款,系统将在 <span class="c-red">1天后自动返款!</span>
                </p>
            </template>
        </v-pay-modal>
    </a-spin>
</template>

<script>
import stepCom from './stepCom'
import activeInfoDetail from '../../components/business/activeInfoDetail'
import VPayModal from '../../components/business/VPayModal'
import * as api from '@/api/api'
import { mapGetters } from 'vuex'
import orderPrice from './orderPrice'
export default {
    name: 'step5',
    components: {
        stepCom,
        activeInfoDetail,
        VPayModal,
        orderPrice,
    },
    computed: {
        ...mapGetters(['userBalance1', 'userBalance2', 'updateBalance']),
    },
    data() {
        return {
            isPayVisible: false,
            orderDetail: {},
            isdisable: false,
            agreePay: false,
            isReset: false,
            spinning: false,
        }
    },
    mounted() {
        this.getOrderDetail()
    },
    methods: {
        getOrderDetail() {
            this.spinning = true
            api.grabDetail({ order_id: this.$route.query.id }).then((res) => {
                this.spinning = false
                if (res.success) {
                    let data = res.data
                    this.orderDetail = data
                }
            })
        },
        toPay() {
            if (!this.agreePay) return this.$message.error('请同意用账户余额支付')
            if (Number(this.orderDetail.mi_amount) > Number(this.userBalance1)) {
                let amount = this.orderDetail.mi_amount - this.userBalance1
                this.$confirm({
                    title: '提示',
                    content: (h) => (
                        <div style="color:gray;">
                            您的鲸币余额不足,是否将货款{amount}自动转换成{amount}鲸币
                        </div>
                    ),
                    onOk: () => {
                        console.log('OK')
                        api.miExchange({ amount: amount }).then((res) => {
                            if (res.success) {
                                this.$store.commit('setUpdateBalance', !this.updateBalance)
                                this.isPayVisible = true
                            }
                        })
                    },
                    class: 'test',
                })
            } else {
                this.isPayVisible = true
            }
        },
        PayCommit(param) {
            console.log('param', param)
            if (param.password) {
                if (this.isdisable) return
                this.isdisable = true
                api.postTaskStep4({ grab_id: this.orderDetail.id, pay_password: param.password }).then((res) => {
                    this.isdisable = false
                    if (res.success) {
                        this.$message.success('发布成功')
                        this.$router.replace({ name: 'home' })
                        this.isPayVisible = false
                        this.$store.commit('setUpdateBalance', !this.updateBalance)
                    } else {
                        this.isReset = !this.isReset
                    }
                })
            } else {
                this.$toast('请输入密码')
            }
        },
        toPrev() {
            this.$router.go(-1)
        },
    },
}
</script>

<style lang="less" scoped></style>
