<template>
    <div class="activeList-container">
        <a-form-model layout="inline" :model="form">
            <a-form-model-item label="买家昵称">
                <a-input v-model="form.taobao_nickname" />
            </a-form-model-item>
            <a-form-model-item label="发布时间">
                <a-range-picker @change="onDateChange" class="v-picker" />
            </a-form-model-item>
            <a-form-model-item label="宝贝ID">
                <a-input v-model="form.goods_id" />
            </a-form-model-item>
            <a-form-model-item label="淘宝订单号">
                <a-input v-model="form.taobao_ordersn" />
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
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="自主审核">
                <a-select v-model="form.examine_type">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="0">平台审核</a-select-option>
                    <a-select-option value="1">商家审核</a-select-option>
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
                    <a-select-option value="0"> 待接手</a-select-option>
                    <a-select-option value="1"> 接手待付款</a-select-option>
                    <a-select-option value="2"> 待发货</a-select-option>
                    <a-select-option value="3">待收货评价 </a-select-option>
                    <a-select-option value="4"> 待返款</a-select-option>
                    <a-select-option value="5"> 待追评</a-select-option>
                    <a-select-option value="6"> 已完成</a-select-option>
                    <a-select-option value="7">已关闭 </a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="补缴差价">
                <a-select v-model="form.is_different">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="1">是</a-select-option>
                    <a-select-option value="0">否</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="返款类型">
                <a-select v-model="form.back_type">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="0">平台返款</a-select-option>
                    <a-select-option value="1">商家返款</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item>
                <a-button type="primary" @click="queryEvent">
                    搜索
                </a-button>
                <a-button type="primary" class="ml-20" @click="exportTable">
                    导出
                </a-button>
            </a-form-model-item>
        </a-form-model>

        <a-tabs class="mt-20 list-tabs" v-model="form.status" @change="TabsCallback">
            <a-tab-pane key="" tab="近三个月的任务"> </a-tab-pane>
            <a-tab-pane key="0" tab="待接手"> </a-tab-pane>
            <a-tab-pane key="1" tab="接手待付款"> </a-tab-pane>
            <a-tab-pane key="2" tab="待发货"> </a-tab-pane>
            <a-tab-pane key="3" tab="待收货评价"> </a-tab-pane>
            <a-tab-pane key="4" tab="待返款"> </a-tab-pane>
            <a-tab-pane key="5" tab="待追评"> </a-tab-pane>
            <a-tab-pane key="6" tab="已完成"> </a-tab-pane>
            <a-tab-pane key="7" tab="已关闭"> </a-tab-pane>
        </a-tabs>
        <taskListTable :param="form" :isLoading="isLoading" @chooseTableIds="chooseTableIds"></taskListTable>
        <ExportTable ref="export_form" :params="exportForm" postUrl="export/orderExport" v-show="false"></ExportTable>
    </div>
</template>

<script>
import taskListTable from './taskListTable'
import * as api from '@/api/api'
import ExportTable from '../../components/business/ExportTable'
export default {
    name: 'activeList',
    props: ['isRefresh'],
    watch: {
        isRefresh() {
            this.queryEvent()
        },
    },
    components: {
        taskListTable,
        ExportTable,
    },
    data() {
        return {
            form: {
                is_public: 1, //1已发布 0未发布
                taobao_nickname: '', //买家昵称
                goods_id: '', //宝贝id
                taobao_ordersn: '', //淘宝订单号
                store_id: '', //店铺名称id
                activity_type: '', //活动类型
                examine_type: '', //审核状态
                status: '', //0-待接手 1-待接手付款 2-待发货 3-待收货评价 4-待返款 5-待追评 6-已完成 7-已关闭
                order_sn: '', //活动编号
                order_code: '', //任务编号
                is_different: '', //补缴差价
                back_type: '', //返款类型

                start_time: '',
                end_time: '',
            },
            storeList: [],
            isLoading: false,
            selectIds: [],
            exportForm: {},
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
        chooseTableIds(param) {
            console.log('param', param)
            this.selectIds = param.ids
        },
        exportTable() {
            if (this.selectIds.length == 0) return this.$message.warning('请选择要导出的列表')
            this.exportForm = {
                ids: this.selectIds.join(''),
            }
            this.$refs.export_form.$el.submit()
        },
    },
}
</script>

<style lang="less" scoped></style>
