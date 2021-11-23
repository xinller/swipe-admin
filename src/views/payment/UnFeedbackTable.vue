<template>
    <div class="activeListTable-container payment-table">
        <div class="table-box mt-20">
            <a-row class="row-hd">
                <a-col :xs="6">目标商品信息</a-col>
                <a-col :xs="6">订单信息</a-col>
                <a-col :xs="2">转账金额</a-col>
                <a-col :xs="4">收款方银行信息</a-col>
                <a-col :xs="2">转账状态</a-col>
                <a-col :xs="4">操作</a-col>
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
                            <a-button type="primary" size="small" class="size-12 pointer" @click="showRefundModal(item)"
                                >处理</a-button
                            >
                            <p>反馈时间:{{ item.update_time }}</p>
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
        <a-modal v-model="visible" class="refund-modal" :footer="null" title="转账截图证明" :width="400">
            <div class="mb-10">请上传返款截图证明</div>
            <a-upload
                name="avatar"
                list-type="picture-card"
                class="feedBack-uploader"
                :show-upload-list="false"
                :before-upload="beforeUpload"
                @change="handleChange"
            >
                <img v-if="refund_certificate" :src="refund_certificate" alt="avatar" class="upload-img" />
                <div v-else class="c-gray">
                    <a-icon type="plus" />
                </div>
            </a-upload>
            <a-button :disabled="onDisabled" type="primary" class="mt-20" block shape="round" @click="refundCertificate()"
                >确认</a-button
            >
        </a-modal>
    </div>
</template>

<script>
import * as api from '@/api/api'

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}
export default {
    name: 'activeListTable',
    data() {
        return {
            loading: this.isLoading,
            visible: false,
            form: {
                status: 2,
            },
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
            cur_id: '', //当前id
            refund_certificate: '',
            onDisabled: false,
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
        onCopy: function(e) {
            this.$message.success('复制成功')
        },
        onError: function(e) {
            this.$message.success('复制失败')
        },
        showRefundModal(item) {
            this.visible = true
            this.cur_id = item.id
        },
        beforeUpload() {
            return false
        },
        async handleChange(info) {
            console.log('info', info)
            let file = info.file
            if (!file) return
            let fileBase64 = await getBase64(file)
            api.image_upload({ base_str: fileBase64, type: 2 }).then((res) => {
                if (res.success) {
                    let url = this.BASE_URL + res.data
                    this.refund_certificate = url
                }
            })
        },
        // 提交证明
        refundCertificate() {
            if (!this.refund_certificate) return this.$message.warning('请提供转账截图证明')
            this.onDisabled = true
            api.refundCertificate({ id: this.cur_id, refund_certificate: this.refund_certificate }).then((res) => {
                this.onDisabled = false
                if (res.success) {
                    this.$message.success('操作成功')
                    this.visible = false
                    this.cur_id = ''
                    this.refund_certificate = ''
                    this.refreshTable()
                }
            })
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
                status: 2,
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
