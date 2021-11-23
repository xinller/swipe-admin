<template>
    <div class="payment-container activeList-container">
        <div class="refund-tips">
            <div class="refund-tips-title">转账相关规定</div>
            <div class="refund-tips-item">
                <p>1、必须在每天下午 18:00 前完成前一天的所有转账，对于多次超时的卖家，平台有权终止合作。</p>
                <p>2、严禁使用支付宝转账，一经发现将终止合作；</p>
                <p>3、对于超时未转账的订单，买家有权申请退款；</p>
                <p>转账操作流程：导出转账信息—进行转账操作—返回平台标记转账失败订单—再标记转账成功订单。</p>
            </div>
        </div>

        <a-form-model class="mt-30" layout="inline" :model="form">
            <a-form-model-item label="转账状态">
                <a-select v-model="form.is_trans">
                    <a-select-option value="0">等待转账</a-select-option>
                    <a-select-option value="1">已转出</a-select-option>
                </a-select>
            </a-form-model-item>

            <a-form-model-item label="任务编号">
                <a-input v-model="form.order_code"></a-input>
            </a-form-model-item>
            <a-form-model-item label="转账金额">
                <a-input placeholder="¥" v-model="form.pay_amount_start" type="number"></a-input>
                <span>-</span>
                <a-input placeholder="¥" v-model="form.pay_amount_end" type="number"></a-input>
            </a-form-model-item>
            <a-form-model-item label="转账申请时间">
                <a-range-picker @change="onDateChange" class="v-picker" />
            </a-form-model-item>
            <a-form-model-item>
                <a-button type="primary" @click="queryEvent">
                    搜索
                </a-button>
            </a-form-model-item>
        </a-form-model>
        <div class="flexct mt-10">
            <a-button :loading="exportBtnLoading" class="mr-10" shape="round" @click="exportEvent">批量转账导出</a-button>
            <a-button class="mr-10" shape="round" @click="exportAll">全部转账成功</a-button>
            <span>转出卡户名: {{ bank_name }}<a-icon type="edit" class="c-primary size-16" @click="visible = true"/></span>
        </div>
        <div class="c-red mt-20 size-12">
            温馨提示：转账前请商家仔细核对，如果您不清楚应该如何操作转账，请咨询客服处理。因商家自身原因导致的重复转账造成的损失，平台只负责协助商家进行追回。
        </div>
        <WaitTransTable class="mt-30" :param="form" :isLoading="isLoading"></WaitTransTable>
        <ExportTable ref="export_form" :params="form" postUrl="export/bankExport" v-show="false"></ExportTable>

        <a-modal v-model="visible" :closable="false" title="" :footer="null">
            <div class="payment-modal">
                <div class="txt-ct"><img src="../../assets/images/user/head.png" class="avatar" /></div>
                <div class="size-16">转出银行卡户名</div>
                <div class="size-12 mt-10 mb-10">
                    为方便买家核账，请填写您转出银行卡的户名，如您转出银行卡户名发生了更改，请及时同步修改。
                </div>
                <a-input v-model="bank_account_name"></a-input>
                <div class="flexct jus-ed mt-20">
                    <a-button class="mr-10" @click="visible = false">取消</a-button>
                    <a-button :disabled="isDisabled" type="primary" @click="editBankName">确定提交</a-button>
                </div>
            </div>
        </a-modal>
        <a-modal v-model="export_visible" title="温馨提示" :footer="null">
            <div class="export-modal">
                <div class="export-tips">
                    <div>
                        当前表格存在
                        <span style="color: red;">{{ export_total }}</span>
                        条状态为“已导出”的订单数据， 为避免重复转账，请按以下步骤进行操作；
                    </div>
                    <div>1、在表格中筛选出“已导出”的订单数据；</div>
                    <div>2、核实是否已对这订单进行转账；</div>
                    <div>3、若确实已转账请返回平台根据转账结果将这些订单标志为“转账成功”或者“转账失败”；</div>
                    <div>4、标记完毕后再导出剩余的致据，执行转账操作。</div>
                </div>
                <div class="bank-list">
                    <span :class="['bank-item', { active: form.bank_type == 1 }]" @click="form.bank_type = 1"
                        ><img src="../../assets/images/user/bank_zh.png" alt=""
                    /></span>
                    <span :class="['bank-item', { active: form.bank_type == 2 }]" @click="form.bank_type = 2"
                        ><img src="../../assets/images/user/bank_xy.png" alt=""
                    /></span>
                    <span :class="['bank-item', { active: form.bank_type == 3 }]" @click="form.bank_type = 3"
                        ><img src="../../assets/images/user/bank_jt.png" alt=""
                    /></span>
                    <span :class="['bank-item', { active: form.bank_type == 4 }]" @click="form.bank_type = 4"
                        ><img src="../../assets/images/user/bank_pa.png" alt=""
                    /></span>
                </div>
                <div class="txt-rt"><a-button :disable="doExport" type="primary" @click="exportExcel">确认导出</a-button></div>
            </div>
        </a-modal>
    </div>
</template>

<script>
import WaitTransTable from './WaitTransTable'
import ExportTable from '../../components/business/ExportTable'
import * as api from '@/api/api'
export default {
    name: 'waitTransfer',
    components: {
        WaitTransTable,
        ExportTable,
    },
    data() {
        return {
            form: {
                layout: 'horizontal',
                is_trans: '',
                order_code: '',
                pay_amount_start: '',
                pay_amount_end: '',
                time_start: '',
                time_end: '',
                status: 0,
                bank_type: 1,
            },
            isLoading: false,
            visible: false,
            bank_account_name: '',
            bank_name: '',
            isDisabled: false,
            exportBtnLoading: false,

            export_visible: false,
            doExport: false,
            export_total: 0,
        }
    },
    mounted() {
        this.getUserDetail()
    },
    methods: {
        onDateChange(date, dateString) {
            this.form.time_start = date[0].format('YYYY-MM-DD hh:mm:ss')
            this.form.time_end = date[1].format('YYYY-MM-DD hh:mm:ss')
        },
        queryEvent() {
            this.isLoading = !this.isLoading
        },
        getUserDetail() {
            api.getUserDetail().then((res) => {
                if (res.success) {
                    this.bank_name = res.data.bank_account_name
                    this.bank_account_name = this.bank_name

                    if (!this.bank_name) {
                        this.visible = true
                    }
                }
            })
        },
        editBankName() {
            this.isDisabled = true
            if (!this.bank_account_name) return this.$message.warning('请输入转出户名')
            api.editUserInfo({ type: 'bank_account_name', val: this.bank_account_name }).then((res) => {
                this.isDisabled = false
                if (res.success) {
                    this.$message.success('修改成功')
                    this.visible = false
                    this.getUserDetail()
                }
            })
        },
        // 导出
        exportExcel() {
            console.log(this.$refs)
            this.$refs.export_form.$el.submit()
            this.export_visible = false
        },
        exportEvent() {
            api.exportNum().then((res) => {
                if (res.success) {
                    this.export_total = res.data.total
                    this.export_visible = true
                }
            })
        },
        exportAll() {
            this.$confirm({
                title: '确定已全部导出,并转账成功?',
                content: '取消活动后系统会退还您所有的货款和赏金.',
                okText: '确定',
                okType: 'primary',
                cancelText: '取消',
                onOk: () => {
                    api.allTransSuccess().then((res) => {
                        if (res.success) {
                            this.$message.success('操作成功')
                            this.queryEvent()
                        }
                    })
                },
            })
        },
    },
}
</script>

<style lang="less" scoped></style>
