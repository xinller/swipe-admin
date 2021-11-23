<template>
    <div class="editPaypass-container">
        <div class="page-title">重置支付密码</div>
        <PaypassStep :activeKey="2"></PaypassStep>
        <a-row type="flex" justify="center" class="mt-30">
            <a-col :xs="24" :md="10">
                <a-form-model layout="horizontal" :model="form" :rules="rules" ref="ruleForm" labelAlign="left">
                    <a-form-model-item label="">
                        <a-input size="large" v-model="userInfo.phone" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item prop="captcha">
                        <div class="login-code">
                            <a-input class="mr-10" size="large" type="text" v-model="form.captcha" placeholder="图形验证码">
                            </a-input>
                            <div class="captcha-box" @click="getCaptcha">
                                <img :src="captcha_url" v-if="captcha_url" />
                            </div>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item prop="verify_code">
                        <div class="login-code">
                            <a-input class="mr-10" size="large" type="text" v-model="form.verify_code" placeholder="手机验证码">
                            </a-input>
                            <a-button size="large" type="primary" @click="getCode">{{ code_text }}</a-button>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item label="" prop="password">
                        <a-input size="large" type="password" v-model="form.password" placeholder="请输入新密码"></a-input>
                    </a-form-model-item>
                    <a-form-model-item label="" prop="password1">
                        <a-input size="large" type="password" v-model="form.password1" placeholder="请重复输入新密码"></a-input>
                    </a-form-model-item>
                    <a-button size="large" type="primary" block shape="round" @click="onSubmit">
                        确认
                    </a-button>
                    <a-button size="large" class="mt-15" block shape="round" @click="goBack">
                        返回
                    </a-button>
                </a-form-model>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PaypassStep from './PaypassStep.vue'
import * as api from '@/api/api'
export default {
    name: 'remember',
    components: {
        PaypassStep,
    },
    computed: {
        ...mapGetters(['userInfo']),
    },
    data() {
        let validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.form.password) {
                callback(new Error('两次密码不一致'))
            } else {
                callback()
            }
        }
        return {
            form: {
                password: '',
                password1: '',
                captcha: '',
                verify_code: '',
            },
            captcha_url: '',
            captcha_key: '',
            rules: {
                captcha: [{ required: true, message: '请输入图形验证码', trigger: 'blur' }],
                verify_code: [{ required: true, message: '请输入手机验证码', trigger: 'blur' }],
                password: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { pattern: /^[0-9]{6}$/, message: '请输入6位数字密码', trigger: 'blur' },
                ],
                password1: [{ required: true, message: '请确认新密码', trigger: 'blur' }, { validator: validatePass2 }],
            },
            code_text: '获取验证码',
        }
    },
    mounted() {
        this.getCaptcha()
    },
    methods: {
        goBack() {
            this.$router.go(-1)
        },
        async getCaptcha() {
            this.spinning = true
            let res = await api.getCaptcha({})
            this.spinning = false
            if (res.success) {
                this.captcha_url = res.data.content
                this.captcha_key = res.data.code
            }
        },
        onSubmit() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.form.captcha_key = this.captcha_key
                    api.forgetPayPass(this.form).then((res) => {
                        if (res.success) {
                            this.$message.success('修改成功')
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
        getCode() {
            if (this.isWaiting) return
            var params = {
                country_code: '86',
                phone: this.userInfo.phone,
                time: 60,
                type: 3,
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
    },
}
</script>

<style lang="less" scoped></style>
