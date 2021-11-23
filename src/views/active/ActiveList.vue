<template>
    <div class="activeList-container">
        <a-form-model layout="inline" :model="form">
            <a-form-model-item label="活动编号">
                <a-input v-model="form.order_sn" />
            </a-form-model-item>
            <a-form-model-item label="发布时间">
                <a-range-picker @change="onDateChange" class="v-picker" />
            </a-form-model-item>
            <a-form-model-item label="宝贝ID">
                <a-input v-model="form.goods_id" />
            </a-form-model-item>
            <a-form-model-item label="店铺名称">
                <a-select v-model="form.store_id">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option :value="item.id" v-for="(item, index) in storeList" :key="index">{{
                        item.store_name
                    }}</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="活动类型">
                <a-select v-model="form.activity_type" placeholder="请选择">
                    <a-select-option value="0">普通</a-select-option>
                    <a-select-option value="1">优质</a-select-option>
                    <!-- <a-select-option value="2">拼多多</a-select-option> -->
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="活动状态">
                <a-select v-model="form.activity_status">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="0">未付款</a-select-option>
                    <a-select-option value="1">进行中</a-select-option>
                    <a-select-option value="2">已完成</a-select-option>
                    <a-select-option value="3">部分完成</a-select-option>
                    <a-select-option value="4">已取消</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="审核方式">
                <a-select v-model="form.examine_type">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="0">平台审核</a-select-option>
                    <a-select-option value="1">商家审核</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item>
                <a-button type="primary" @click="queryEvent">
                    搜索
                </a-button>
            </a-form-model-item>
        </a-form-model>

        <a-tabs class="mt-20 list-tabs" v-model="form.activity_status" @change="TabsCallback">
            <a-tab-pane key="" tab="近三个月的活动"> </a-tab-pane>
            <a-tab-pane key="0" tab="未付款"> </a-tab-pane>
            <a-tab-pane key="1" tab="进行中"> </a-tab-pane>
            <a-tab-pane key="2" tab="已完成"> </a-tab-pane>
            <a-tab-pane key="3" tab="部分完成"> </a-tab-pane>
            <a-tab-pane key="4" tab="已取消"> </a-tab-pane>
        </a-tabs>
        <ActiveListTable :param="form" :isLoading="isLoading"></ActiveListTable>
    </div>
</template>

<script>
import ActiveListTable from './ActiveListTable'
import moment from 'moment'
import * as api from '@/api/api'
export default {
    name: 'activeList',
    components: {
        ActiveListTable,
    },
    data() {
        return {
            form: {
                layout: 'horizontal',
                order_sn: '',
                goods_id: '',
                store_id: '',
                activity_type: '',
                activity_status: '', //订单状态 0-未付款 1-进行中 2-已完成 3-部分完成 4-已取消
                examine_type: '',
                start_time: '',
                end_time: '',
            },
            isLoading: false,
            storeList: [],
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
        queryEvent() {
            this.isLoading = !this.isLoading
        },
        TabsCallback(key) {
            console.log(key)
            this.queryEvent()
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
