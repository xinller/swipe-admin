<template>
    <div class="activeListTable-container payment-table">
        <div class="table-box mt-20">
            <a-row class="row-hd">
                <a-col :xs="6">目标商品信息</a-col>
                <a-col :xs="6">订单信息</a-col>
                <a-col :xs="2">转账金额</a-col>
                <a-col :xs="4">收款方银行信息</a-col>
                <a-col :xs="2">转账状态</a-col>
                <a-col :xs="4">转账时间</a-col>
            </a-row>
            <a-empty class="ptb-10" v-if="dataList.length == 0" />
            <a-row class="row-tr" v-for="(item, index) in dataList" :key="index">
                <a-col class="middle">
                    <a-row type="flex" align="middle">
                        <a-col class="col-td flexct" :xs="6">
                            <img :src="item.goods_image" class="thumb" />
                            <div class="ml-15">
                                <div>
                                    <img src="../../assets/images/task/taobao.png" class="tb-icon" />
                                    <span>{{ item.store_name }}</span>
                                </div>
                                <div class="size-12 c-gray mt-5">任务编号:{{ item.order_code }}</div>
                            </div>
                        </a-col>
                        <a-col class="col-td" :xs="6">
                            <div class="ac-type">
                                接单旺旺: {{ item.taobao_nickname }}
                                <a-icon
                                    type="copy"
                                    v-clipboard:copy="item.taobao_nickname"
                                    v-clipboard:success="onCopy"
                                    v-clipboard:error="onError"
                                />
                            </div>
                            <div class="ac-type">
                                淘宝订单号:{{ item.taobao_ordersn }}
                                <a-icon
                                    type="copy"
                                    v-clipboard:copy="item.taobao_ordersn"
                                    v-clipboard:success="onCopy"
                                    v-clipboard:error="onError"
                                />
                            </div>
                        </a-col>
                        <a-col class="col-td" :xs="2">{{ item.pay_amount }}</a-col>
                        <a-col class="col-td" :xs="4">
                            <div>{{ item.bank_name }} {{ item.bank_hold }} {{ item.bank_open }}</div>
                            <div>{{ item.bank_numer }}</div>
                        </a-col>
                        <a-col class="col-td" :xs="2"
                            ><span class="c-red">{{ format_status(item.status, item.is_trans) }}</span></a-col
                        >
                        <a-col class="col-td" :xs="4">
                            {{ item.update_time }}
                        </a-col>
                    </a-row>
                </a-col>
            </a-row>
            <a-pagination
                class="txt-rt"
                v-model="pagination.current"
                :pageSize="pagination.pageSize"
                :pageSizeOptions="pagination.pageSizeOptions"
                show-size-changer
                show-quick-jumper
                :total="pagination.total"
                :show-total="(total) => `共 ${pagination.total} 条`"
                @change="changePageSize"
                @showSizeChange="changeSize"
            />
        </div>
    </div>
</template>

<script>
import * as api from '@/api/api'
export default {
    name: 'buyerTable',
    props: {
        param: {
            type: Object,
        },
        isLoading: {
            type: Boolean,
        },
    },
    watch: {
        isLoading(newVal) {
            this.loading = newVal
            this.page = 1
            this.getTableList()
        },
        param(nval) {
            this.form = nval
        },
    },
    data() {
        return {
            visible: false,

            loading: this.isLoading,
            form: this.param,
            dataList: [],
            pagination: {
                pageSize: 10, //每页条数
                pageSizeOptions: ['10', '20', '30', '40'],
                current: 1,
                showSizeChanger: true,
                showQuickJumper: true,
                total: 0,
            },
            total: 0,
            spinning: false,
            now_userInfo: {},
        }
    },

    computed: {
        pager() {
            if (this.pagination === false) return false
            let option = {
                current: 1,
                pageSize: 10,
            }
            return _.merge({}, option, this.pagination)
        },
    },
    mounted() {
        this.getTableList()
    },
    methods: {
        format_status(status, is_trans) {
            if (status == 0 && is_trans == 0) {
                return '等待转账'
            } else if (status == 0 && is_trans == 1) {
                return '等待买家确认'
            } else if (status == 0 && is_trans == 2) {
                return '转账失败'
            } else if (status == 0) {
                return '未转账反馈'
            } else if (status == 1 && is_trans == 1) {
                return '转账成功'
            } else if (status == 3) {
                return '等待买家确认'
            } else if (status == 4) {
                return '已退款'
            }
        },
        showRefundModal(item) {
            this.visible = true
            this.now_userInfo = item
        },
        onCopy: function(e) {
            this.$message.success('复制成功')
        },
        onError: function(e) {
            this.$message.success('复制失败')
        },
        refreshTable() {
            this.pagination.current = 1
            this.pagination.pageSize = 10
            this.getTableList()
        },
        changePageSize(page, pageSize) {
            this.pagination.pageSize = pageSize
            this.pagination.current = page
            this.getTableList()
        },
        changeSize(current, size) {
            this.pagination.pageSize = size
            this.pagination.current = current
            this.getTableList()
        },
        getTableList(isReset) {
            this.spinning = true
            let params = {
                page: this.pager.current,
                rows: this.pager.pageSize,
                ...this.form,
            }
            if (isReset) {
                params.page = this.pager.current = 1
            }
            console.log('params', params)
            api.transList(params).then((res) => {
                this.spinning = false
                if (res.success) {
                    this.dataList = res.data.list
                    this.pagination.total = res.data.total
                }
            })
        },
    },
}
</script>

<style lang="less" scoped></style>
