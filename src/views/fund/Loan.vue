<template>
    <a-spin :spinning="spinning" class="loan-container">
        <section class="matters">
            <div class="matters-title">注意事项</div>
            <p class="matters-item">1.人工审核对账，免手续费；</p>
            <p class="matters-item">2.由于银行间转账存在一定的时差，建议您使用实时到账，联系客服确认到账；</p>
            <p class="matters-item">3.当天充值金额请勿重复！否则只会到账一笔；</p>
            <p class="matters-item">
                4.充值到账可能会有延时，若30分钟内未到账请联系客服，23点以后第二天审核，为了不影响任务发布，请提前充值。
            </p>
            <p class="matters-item tip">
                5.出于对商家安全的考虑，平台禁止使用支付宝转账，建议通过银行卡进行转账。
            </p>
        </section>
        <section class="step">
            <div class="step-title">第一步：转账到鲸鱼官方账号</div>
            <div class="step-content">
                <a-row>
                    <a-col class="step-one-content">
                        <div class="title">鲸鱼官方账号</div>
                        <div v-if="sysInfo">
                            <span class="mt-10 mr-10">{{ sysInfo.bank_name }}</span>
                            <span class="mt-10 mr-10 ">{{ sysInfo.bank_number }}</span>
                            <a-button
                                class="mt-10"
                                type="primary"
                                size="small"
                                v-clipboard:copy="sysInfo.bank_number"
                                v-clipboard:success="onCopy"
                                v-clipboard:error="onError"
                                >复制账号</a-button
                            >
                        </div>
                        <div class="mt-10">
                            <span class="size-14">户名：</span> <span>{{ sysInfo.bank_username }}</span>
                        </div>
                        <div class="mt-10">
                            <span class="size-14">开户行：</span> <span>{{ sysInfo.bank_open }}</span>
                        </div>
                    </a-col>
                </a-row>
            </div>
            <div class="step-title mt-30">第二步:请确认并提交转账信息</div>
            <a-form-model
                class="step-content step-form"
                layout="horizontal"
                :model="form"
                :rules="rules"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 18 }"
                ref="ruleForm"
            >
                <a-form-model-item label="转账金额" prop="amount">
                    <a-input v-model="form.amount" type="number" />
                </a-form-model-item>
                <a-form-model-item label="转出渠道名称" prop="bank_name">
                    <a-select v-model="form.bank_name">
                        <a-select-option :value="item.bank_name" v-for="item in bankList" :key="item.id">
                            {{ item.bank_name }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="转出账户姓名" prop="username">
                    <a-input v-model="form.username" />
                </a-form-model-item>
                <div class="warn-msg">一次转账只能提交一次充值，如发现恶意重复提交，将处罚甚至封号</div>
                <a-form-model-item :wrapper-col="{ span: 14, offset: 6 }">
                    <a-button type="primary" :disabled="loading" :loading="loading" shape="round" @click="onSubmit">
                        确认提交
                    </a-button>
                </a-form-model-item>
            </a-form-model>
            <div class="step-title mt-30">最近5条银行转账记录</div>
            <div class="step-record">
                <tableList ref="mytableList" :loadOptions="options" :columnsSource="dataColumns" rowkeyname="id" class="mt-20">
                </tableList>
            </div>
        </section>
    </a-spin>
</template>

<script>
import * as api from '@/api/api'
import tableList from '../../components/business/tableList/index'
export default {
    name: 'loan',
    components: {
        tableList,
    },
    data() {
        return {
            sysInfo: '', //系统卡
            bankList: [], //银行列表
            loading: false,
            spinning: false,
            form: {
                amount: '',
                bank_name: '',
                username: '',
            },
            rules: {
                amount: [{ required: true, message: '请输入转账金额', trigger: 'blur' }],
                bank_name: [{ required: true, message: '请选择转账银行', trigger: 'blur' }],
                username: [{ required: true, message: '请输入账户姓名', trigger: 'blur' }],
            },
            dataColumns: [],
            options: {
                pageUrl: 'member/rechargeList',
                pageFormData: {
                    page: 1,
                    rows: 5,
                },
            },
            pagination: {
                current: 1,
                total: 100,
                pageSize: 10,
                pageSizeOptions: ['10', '20', '30', '40', '50'],
                showSizeChanger: true,
                showQuickJumper: true,
            },
        }
    },
    mounted() {
        this.getSysBank()
        this.getBank()
        this.getColums()
    },
    methods: {
        onCopy: function(e) {
            this.$message.success('复制成功')
        },
        onError: function(e) {
            this.$message.success('复制失败')
        },
        getColums() {
            this.dataColumns = [
                { dataIndex: 'create_time', title: '提交时间', align: 'center', width: 100 },
                { dataIndex: 'bank_name', title: '转出渠道名称', align: 'center', width: 100 },
                { dataIndex: 'bank_hold', title: '转出账户姓名', align: 'center', width: 100 },
                { dataIndex: 'amount', title: '金额', align: 'center', width: 100 },
                {
                    dataIndex: 'status',
                    title: '审核状态',
                    align: 'center',
                    width: 100,
                    customRender: (value, row, index) => {
                        return {
                            children:
                                value == 0 ? (
                                    <span class="c-primary">未审核</span>
                                ) : value == 1 ? (
                                    <span class="c-green">审核通过</span>
                                ) : (
                                    <span class="c-red">审核失败</span>
                                ),
                        }
                    },
                },
                { dataIndex: 'update_time', title: '审核时间', align: 'center', width: 100 },
            ]
        },
        getSysBank() {
            this.spinning = true
            api.getSysBank().then((res) => {
                this.spinning = false
                if (res.success) {
                    this.sysInfo = res.data
                }
            })
        },
        getBank() {
            api.getBank().then((res) => {
                if (res.success) {
                    this.bankList = res.data
                }
            })
        },
        onSubmit() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.loading = true
                    api.rechargeBank(this.form).then((res) => {
                        this.loading = false
                        if (res.success) {
                            this.$message.success('充值成功')
                            this.resetPage()
                        }
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        resetPage() {
            this.form = {
                amount: '',
                bank_name: '',
                username: '',
            }
            this.$refs.mytableList.getTableListData(true)
        },
    },
}
</script>

<style lang="less" scoped></style>
