<template>
    <div class="activeList-container">
        <a-form-model layout="inline" :model="form">
            <a-form-model-item label="发布时间">
                <a-range-picker @change="onDateChange" class="v-picker" />
            </a-form-model-item>
            <a-form-model-item label="活动类型">
                <a-select v-model="form.activity_type" placeholder="请选择">
                    <a-select-option value="0">普通</a-select-option>
                    <a-select-option value="1">优质</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="店铺名称">
                <a-select v-model="form.store_id">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option :value="item.id" v-for="(item, index) in storeList" :key="index">{{
                        item.store_name
                    }}</a-select-option>
                </a-select>
            </a-form-model-item>

            <a-form-model-item label="返款类型">
                <a-select v-model="form.back_type">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="0">平台返款</a-select-option>
                    <a-select-option value="1">商家返款</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="任务编号">
                <a-input v-model="form.order_code" />
            </a-form-model-item>
            <a-form-model-item label="活动编号">
                <a-input v-model="form.order_sn" />
            </a-form-model-item>
            <a-form-model-item label="任务状态">
                <a-select v-model="form.status">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="7">已关闭 </a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item>
                <a-button type="primary" @click="queryEvent">
                    搜索
                </a-button>
            </a-form-model-item>
        </a-form-model>

        <unTaskListTable :param="form" :isLoading="isLoading"></unTaskListTable>
    </div>
</template>

<script>
import unTaskListTable from './unTaskListTable'
import * as api from '@/api/api'
export default {
    name: 'activeList',
    components: {
        unTaskListTable,
    },
    data() {
        return {
            form: {
                is_public: 0, //1已发布 0未发布
                store_id: '', //店铺名称id
                activity_type: '', //活动类型
                task_status: '', //任务状态 0-未付款 1-进行中 2-已完成 3-部分完成 4-已取消
                order_code: '', //任务编号
                order_sn: '', //活动编号
                back_type: '', //返款类型
                start_time: '',
                end_time: '',
            },
            storeList: [],
            isLoading: false,
        }
    },
    mounted() {
        this.getStoreList()
    },
    methods: {
        onDateChange(date, dateString) {
            this.form.start_time = date[0].format('YYYY-MM-DD hh:mm:ss')
            this.form.end_time = date[1].format('YYYY-MM-DD hh:mm:ss')
        },
        TabsCallback(key) {
            console.log(key)
            this.queryEvent()
        },
        queryEvent() {
            this.isLoading = !this.isLoading
        },
        // 可用店铺列表
        getStoreList() {
            api.getStoreList({ page: 1, rows: 1000 }).then((res) => {
                if (res.success) {
                    this.storeList = res.data.list
                    // this.form.store_id = res.data.list[0]['id']
                }
            })
        },
    },
}
</script>

<style lang="less" scoped></style>
