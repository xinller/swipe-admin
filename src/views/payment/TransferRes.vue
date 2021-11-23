<template>
    <div class="payment-container activeList-container">
        <a-form-model layout="inline" :model="form">
            <a-form-model-item label="转账状态">
                <a-select v-model="form.is_trans">
                    <a-select-option value="0">转账成功</a-select-option>
                    <a-select-option value="1">转账失败</a-select-option>
                </a-select>
            </a-form-model-item>

            <a-form-model-item label="任务编号">
                <a-input v-model="form.order_code"></a-input>
            </a-form-model-item>
            <a-form-model-item label="转账时间">
                <a-range-picker @change="onDateChange" class="v-picker" />
            </a-form-model-item>
            <a-form-model-item>
                <a-button type="primary" @click="queryEvent">
                    搜索
                </a-button>
            </a-form-model-item>
        </a-form-model>

        <TransferResTable :param="form" :isLoading="isLoading"></TransferResTable>
    </div>
</template>

<script>
import TransferResTable from './TransferResTable'
export default {
    name: 'TransferRes',
    components: {
        TransferResTable,
    },
    data() {
        return {
            form: {
                is_trans: '',
                order_code: '',
                time_start: '',
                time_end: '',
                status: 1,
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
