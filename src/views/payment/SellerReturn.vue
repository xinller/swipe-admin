<template>
    <div class="payment-container activeList-container">
        <div class="refund-tips">
            <div class="refund-tips-title">
                下方表格记录的是买家已在购物平台退款成功的订单。对于以下情况的订单，买家有权利到购物平台进行退款。
            </div>
            <div class="refund-tips-item">
                <p>1、卖家长时间未转账。</p>
                <p>2、卖家频繁操作转账失败的订单。</p>
                <p>3、退款成功后，管理员会将订单状态变更为“已退款”。</p>
            </div>
        </div>

        <a-form-model class="mt-30" layout="inline" :model="form">
            <a-form-model-item label="任务编号">
                <a-input v-model="form.order_code"></a-input>
            </a-form-model-item>

            <a-form-model-item label="退款时间">
                <a-range-picker @change="onDateChange" class="v-picker" />
            </a-form-model-item>
            <a-form-model-item>
                <a-button type="primary" @click="queryEvent">
                    搜索
                </a-button>
            </a-form-model-item>
        </a-form-model>

        <SellerTable class="mt-30" :param="form" :isLoading="isLoading"></SellerTable>
    </div>
</template>

<script>
import SellerTable from './SellerTable'
export default {
    name: 'BuyerReturn',
    components: {
        SellerTable,
    },
    data() {
        return {
            form: {
                order_code: '',
                time_start: '',
                time_end: '',
                status: 3,
            },
            isLoading: false,
        }
    },
    methods: {
        onDateChange(date, dateString) {
            this.form.time_start = date[0].format('YYYY-MM-DD hh:mm:ss')
            this.form.time_end = date[1].format('YYYY-MM-DD hh:mm:ss')
        },
        queryEvent() {
            this.isLoading = !this.isLoading
        },
    },
}
</script>

<style lang="less" scoped></style>
