<template>
    <div class="payment-container activeList-container">
        <div class="refund-tips">
            <div class="refund-tips-title">
                下方表格记录的是买家提交的转账未到账反馈，请复制订单编号到网银核实该笔订单的转账情况，并且积极配合客服处理。
            </div>
        </div>

        <UnFeedbackTable></UnFeedbackTable>
    </div>
</template>

<script>
import UnFeedbackTable from './UnFeedbackTable'
export default {
    name: 'UnFeedback',
    components: {
        UnFeedbackTable,
    },
    data() {
        return {}
    },
    methods: {},
}
</script>

<style lang="less" scoped></style>
