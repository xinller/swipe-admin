<template>
    <div class="common-container addBankCard-container">
        <div class="page-title">添加银行卡</div>
        <span class="warn-msg">每个用户只能添加一张银行卡，如需换卡建议修改银行卡信息 </span>
        <a-row>
            <a-col :xs="24" :md="16">
                <a-form-model
                    class="form-page mt-15"
                    layout="inline"
                    :model="form"
                    :rules="rules"
                    ref="ruleForm"
                    labelAlign="left"
                >
                    <a-form-model-item label="开户人姓名" prop="bank_hold">
                        <a-input v-model="form.bank_hold"></a-input>
                    </a-form-model-item>
                    <a-form-model-item label="选择银行" prop="bank_name">
                        <a-select v-model="form.bank_name">
                            <a-select-option :value="item.bank_name" v-for="item in bankList" :key="item.id">
                                {{ item.bank_name }}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="银行卡号" prop="bank_number">
                        <a-input v-model="form.bank_number" type="number"></a-input>
                    </a-form-model-item>
                    <a-form-model-item label="手机号" prop="phone">
                        <a-input v-model="userInfo.phone" read-only disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item label="开户行" prop="bank_open">
                        <a-input v-model="form.bank_open"></a-input>
                    </a-form-model-item>
                    <a-form-model-item label="图行验证码" prop="captcha">
                        <div class="captcha-wrap">
                            <a-input v-model="form.captcha"></a-input>
                            <div class="captcha-box" @click="getCaptcha">
                                <img :src="captcha_url" alt="" />
                            </div>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item label="验证码" prop="verify_code">
                        <div class="captcha-wrap">
                            <a-input class="mr-10" v-model="form.verify_code"></a-input>
                            <a-button type="primary" @click="getCode">{{ code_text }}</a-button>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item v-if="!bank_id">
                        <a-button :loading="loading" :disabled="loading" type="primary" shape="round" @click="onSubmit">
                            确认添加
                        </a-button>
                    </a-form-model-item>
                    <a-form-model-item v-if="bank_id">
                        <a-button :loading="loading" :disabled="loading" type="primary" shape="round" @click="onSubmitEdit">
                            确认修改
                        </a-button>
                    </a-form-model-item>
                </a-form-model>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import * as api from '@/api/api'
import { mapGetters } from 'vuex'
export default {
    name: 'addBankCard',
    data() {
        return {
            bankList: [],
            form: {
                bank_hold: '',
                bank_open: '',
                bank_number: '',
                bank_name: '',
                verify_code: '',
                captcha: '',
            },
            rules: {
                bank_hold: [{ required: true, message: '请输入开户人姓名', trigger: 'blur' }],
                bank_open: [{ required: true, message: '请输入开户行', trigger: 'blur' }],
                bank_number: [{ required: true, message: '请输入卡号', trigger: 'blur' }],
                bank_name: [{ required: true, message: '请选择银行', trigger: 'blur' }],
                verify_code: [{ required: true, message: '请输入短信验证码', trigger: 'blur' }],
                captcha: [{ required: true, message: '请输入图形验证码', trigger: 'blur' }],
            },
            captcha_url: '',
            captcha_key: '',
            code_text: '获取验证码',
            isWaiting: false,
            interval: null,
            loading: false,
            bank_id: this.$route.query.id,
        }
    },
    computed: {
        ...mapGetters(['userInfo']),
    },
    mounted() {
        this.getBankInfo()
        this.getBank()
        this.getCaptcha()
    },
    methods: {
        async getCaptcha() {
            this.spinning = true
            let res = await api.getCaptcha({})
            this.spinning = false
            if (res.success) {
                this.captcha_url = res.data.content
                this.captcha_key = res.data.code
            }
        },
        getBank() {
            api.getBank().then((res) => {
                if (res.success) {
                    this.bankList = res.data
                }
            })
        },
        getBankInfo() {
            if (this.$route.query.id) {
                api.getBankInfo().then((res) => {
                    if (res.success) {
                        this.form = res.data[0]
                    }
                })
            }
        },
        getCode() {
            let phone = this.userInfo.phone
            if (!phone) return this.$message.warning('请输入手机号')
            if (this.isWaiting) return
            var params = {
                country_code: '86',
                phone: phone,
                time: 60,
                type: 4,
            }
            this.isWaiting = true
            this.remainTime()
            api.getVerify(params).then((res) => {
                if (res.success) {
                    this.$message.success(res.data)
                } else {
                    clearInterval(this.interval)
                    this.code_text = '获取验证码'
                    this.isWaiting = false
                }
            })
        },
        remainTime() {
            var time = 60
            this.interval = setInterval(() => {
                this.code_text = time-- + 's'
                if (time < 0) {
                    clearInterval(this.interval)
                    this.code_text = '获取验证码'
                    this.isWaiting = false
                }
            }, 1000)
        },
        onSubmit() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.loading = true
                    this.form.captcha_key = this.captcha_key
                    api.addBank(this.form).then((res) => {
                        this.loading = false
                        if (res.success) {
                            this.$message.success('添加成功')
                            setTimeout(() => {
                                this.$router.go(-1)
                            }, 1000)
                        } else {
                            this.getCaptcha()
                        }
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        onSubmitEdit() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.loading = true
                    api.editBankInfo(this.form).then((res) => {
                        this.loading = false
                        if (res.success) {
                            this.$message.success('修改成功')
                            setTimeout(() => {
                                this.$router.go(-1)
                            }, 1000)
                        }
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
    },
}
</script>

<style lang="less" scoped></style>
