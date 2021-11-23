<template>
    <!-- 审号管理 -->
    <div class="activeList-container">
        <a-form-model layout="inline" :model="form">
            <a-form-model-item label="买家昵称">
                <a-input v-model="form.taobao_nickname" />
            </a-form-model-item>
            <a-form-model-item label="申请日期">
                <a-range-picker @change="onDateChange" class="v-picker" />
            </a-form-model-item>
            <a-form-model-item label="活动类型">
                <!-- <a-select v-model="form.platform_type" placeholder="请选择">
                    <a-select-option value="0">淘宝</a-select-option>
                    <a-select-option value="1">京东</a-select-option>
                    <a-select-option value="2">拼多多</a-select-option>
                </a-select> -->
                <a-select v-model="form.activity_type" placeholder="请选择" class="ml-10">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="0">淘宝/天猫优质试用活动</a-select-option>
                    <a-select-option value="1">淘宝/天猫普通试用活动</a-select-option>
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
            <a-form-model-item label="任务状态">
                <a-select v-model="form.status">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="0"> 待审核</a-select-option>
                    <a-select-option value="1"> 已通过</a-select-option>
                    <a-select-option value="2"> 已拒绝</a-select-option>
                </a-select>
            </a-form-model-item>

            <a-form-model-item label="活动编号">
                <a-input v-model="form.order_sn" />
            </a-form-model-item>
            <a-form-model-item label="任务编号">
                <a-input v-model="form.order_code" />
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
            <a-tab-pane key="" tab="近三个月的申请"> </a-tab-pane>
            <a-tab-pane key="0" tab="待审核"> </a-tab-pane>
            <a-tab-pane key="1" tab="已通过"> </a-tab-pane>
            <a-tab-pane key="2" tab="已拒绝"> </a-tab-pane>
        </a-tabs>
        <CheckListTable :param="form" :isLoading="isLoading" @chooseTableIds="chooseTableIds"></CheckListTable>
        <ExportTable ref="export_form" :params="exportForm" postUrl="export/examineExport" v-show="false"></ExportTable>
    </div>
</template>

<script>
import CheckListTable from './CheckListTable'
import * as api from '@/api/api'
import ExportTable from '../../components/business/ExportTable'
export default {
    name: 'checkManage',
    components: {
        CheckListTable,
        ExportTable,
    },
    data() {
        return {
            form: {
                taobao_nickname: '', //买家昵称
                order_code: '', //任务编号
                order_sn: '', //活动编号
                store_id: '', //店铺名称id
                platform_type: '', //平台类型
                activity_type: '', //活动类型 类型
                status: '', //审核状态 0-待审核 1-已通过 2-已拒绝
                start_time: '',
                end_time: '',
            },
            storeList: [],
            isLoading: false,
            exportForm: {},
            selectIds: [],
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
