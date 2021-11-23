<template>
    <div class="withdraw-container">
        <span class="warn-msg mr-10">请使用一类卡，二类卡可能会出现限额不到账情况，有问题可联系银行咨询</span>
        <router-link :to="{ name: 'addBankCard' }" class="upload" v-if="myBankInfo.length == 0">
            <a-icon type="plus" class="icon"></a-icon>
            <div>添加银行卡</div>
        </router-link>
        <a-button class="mt-20" type="primary" v-if="myBankInfo.length > 0" @click="toEditBank()">修改银行卡</a-button>
        <div class="form-wrap">
            <a-form-model
                class="step-form"
                layout="horizontal"
                :model="form"
                :rules="rules"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 18 }"
                ref="ruleForm"
                labelAlign="left"
            >
                <a-form-model-item label="可提现货款">
                    <span class="c-red">{{ userBalance2 }}</span
                    >元
                </a-form-model-item>
                <a-form-model-item label="提现金额" prop="amount">
                    <a-input type="number" class="mr-10" v-model="form.amount" @input="changeAmount"></a-input>
                    <a-button type="primary" size="small" @click="getAll">全部提现</a-button>
                </a-form-model-item>
                <a-form-model-item label="手续费">
                    <span>{{ rate_num }}元</span>
                </a-form-model-item>
                <a-form-model-item label="银行卡">
                    <span v-if="myBankInfo.length > 0">
                        {{ myBankInfo[0]['bank_name'] }}
                        {{ myBankInfo[0]['bank_open'] }}
                        {{ myBankInfo[0]['bank_number'] }}
                    </span>
                </a-form-model-item>
                <a-form-model-item label="支付密码" prop="pay_password">
                    <a-input type="password" class="mr-5" v-model="form.pay_password"></a-input>
                    <span class="size-12"
                        >初始密码:666666,为了你的账户安全,请 <router-link to="/user/editPaypass">修改支付密码</router-link></span
                    >
                </a-form-model-item>
                <a-form-model-item :wrapper-col="{ span: 14, offset: 6 }">
                    <a-button :loading="loading" :disabled="loading" type="primary" shape="round" @click="onSubmit">
                        申请提现
                    </a-button>
                </a-form-model-item>
            </a-form-model>
        </div>
        <span class="warn-msg">注意: 最低提现金额50元，手续费0.1%，每天仅限提现1次。当日00:00-18:00可提现，18:00之后处理。 </span>
    </div>
</template>

<script>
import * as api from '@/api/api'
import { mapGetters } from 'vuex'
export default {
    name: 'withdraw',
    data() {
        return {
            loading: false,
            form: {
                amount: '',
                pay_password: '',
                bank_id: '',
            },
            rules: {
                amount: [{ required: true, message: '请输入提现金额', trigger: 'blur' }],
                pay_password: [{ required: true, message: '请输入支付密码', trigger: 'blur' }],
            },
            myBankInfo: [],
            with_rate: 0.0,
            rate_num: 0.0,
        }
    },
    computed: {
        ...mapGetters(['userBalance2', 'updateBalance']),
    },
    mounted() {
        this.getBankInfo()
        this.getWithRate()
    },
    methods: {
        getBankInfo() {
            api.getBankInfo().then((res) => {
                if (res.success) {
                    this.myBankInfo = res.data
                    if (this.myBankInfo.length == 0) return this.$message.error('请先绑定银行卡才能提现')
                }
            })
        },
        getWithRate() {
            api.getWithRate().then((res) => {
                if (res.success) {
                    this.with_rate = res.data.with_rate
                }
            })
        },
        changeAmount() {
            this.rate_num = ((this.form.amount * this.with_rate) / 100).toFixed(2)
        },
        getAll() {
            this.form.amount = this.userBalance2
            this.changeAmount()
        },
        toEditBank() {
            this.$router.push({ name: 'addBankCard', query: { id: this.myBankInfo[0].id } })
        },
        onSubmit() {
            if (this.myBankInfo.length == 0) return this.$message.error('您未绑定银行卡')
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.form.bank_id = this.myBankInfo[0]['id']
                    this.loading = true
                    api.doWithout(this.form).then((res) => {
                        this.loading = false
                        if (res.success) {
                            this.$message.success(res.data || '申请成功')
                            this.$store.commit('setUpdateBalance', !this.updateBalance)
                            this.resetForm()
                        }
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        resetForm() {
            this.rate_num = 0.0
            this.form = {
                amount: '',
                pay_password: '',
            }
        },
    },
}
</script>

<style lang="less" scoped></style>
