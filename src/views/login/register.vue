<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-header">
            <div class="hd"><img src="../../assets/images/login/logo.png" class="logo" /> <span class="hd-title">注册</span></div>
        </div>
        <div class="register-wrap">
            <div class="login-con register">
                <a-card :bordered="false">
                    <div slot="title">
                        欢迎注册鲸鱼
                    </div>
                    <a-spin :spinning="spinning" class="form-con">
                        <a-form :form="loginForm" @submit="handleSubmit">
                            <a-form-item prop="phone">
                                <a-input size="large" v-decorator="rules.phone" placeholder="请输入手机号"> </a-input>
                            </a-form-item>
                            <a-form-item prop="captcha">
                                <div class="login-code">
                                    <a-input size="large" type="text" v-decorator="rules.captcha" placeholder="图形验证码">
                                    </a-input>
                                    <div class="captcha-box" @click="getCaptcha">
                                        <img :src="captcha_url" alt="" />
                                    </div>
                                </div>
                            </a-form-item>
                            <a-form-item prop="verify_code">
                                <div class="login-code">
                                    <a-input size="large" type="text" v-decorator="rules.verify_code" placeholder="手机验证码">
                                    </a-input>
                                    <a-button type="primary" @click="getCode">{{ code_text }}</a-button>
                                </div>
                            </a-form-item>
                            <a-form-item prop="invite_code">
                                <a-input size="large" v-decorator="rules.invite_code" placeholder="请输入邀请码"> </a-input>
                            </a-form-item>
                            <a-form-item prop="password">
                                <a-input
                                    size="large"
                                    :type="showPass ? 'text' : 'password'"
                                    v-decorator="rules.password"
                                    placeholder="请输入密码"
                                >
                                    <a-icon
                                        slot="suffix"
                                        :type="showPass ? 'eye' : 'eye-invisible'"
                                        style="color:rgba(0,0,0,.25)"
                                        @click="showPass = !showPass"
                                    />
                                </a-input>
                            </a-form-item>
                            <a-form-item prop="password1">
                                <a-input
                                    size="large"
                                    :type="showPass2 ? 'text' : 'password'"
                                    v-decorator="rules.password1"
                                    placeholder="请再次输入密码"
                                >
                                    <a-icon
                                        slot="suffix"
                                        :type="showPass2 ? 'eye' : 'eye-invisible'"
                                        style="color:rgba(0,0,0,.25)"
                                        @click="showPass2 = !showPass2"
                                    />
                                </a-input>
                            </a-form-item>
                            <a-form-item>
                                <a-button size="large" type="primary" block html-type="submit">立即注册</a-button>
                            </a-form-item>
                        </a-form>
                        <router-link to="/login">已有账号?立即登录</router-link>
                    </a-spin>
                </a-card>
            </div>
        </div>
        <div class="login-tip">鲸鱼 版权所有</div>
    </div>
</template>

<script>
import * as api from '@/api/api.js'
export default {
    name: 'login',
    data() {
        let validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.loginForm.getFieldValue('password')) {
                callback(new Error('两次密码不一致'))
            } else {
                callback()
            }
        }
        return {
            loginForm: this.$form.createForm(this, { name: 'login' }),
            rules: {
                phone: ['phone', { rules: [{ required: true, message: '请输入手机号' }] }],
                password: [
                    'password',
                    {
                        rules: [
                            { required: true, message: '请输入密码' },
                            { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/, message: '请输入6~16位字母数字密码' },
                        ],
                    },
                ],
                password1: [
                    'password1',
                    {
                        rules: [
                            { required: true, message: '请再次输入密码' },
                            { validator: validatePass2, message: '请保持密码一致' },
                        ],
                    },
                ],
                captcha: ['captcha', { rules: [{ required: true, message: '请输入验证码' }] }],
                verify_code: ['verify_code', { rules: [{ required: true, message: '请输入手机验证码' }] }],
                invite_code: ['invite_code', { rules: [{ required: true, message: '请输入邀请码' }] }],
            },

            captcha_url: '',
            captcha_key: '',
            showPass2: false,
            showPass: false,
            code_text: '获取验证码',
            isWaiting: false,
            on_disable: false,
            interval: null,
            spinning: false,
        }
    },
    mounted() {
        if (this.$route.query.invite_code) {
            this.loginForm.setFieldsValue({ invite_code: this.$route.query.invite_code })
        }
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
        handleSubmit(e) {
            e.preventDefault()
            this.loginForm.validateFields((err, values) => {
                if (!err) {
                    this.spinning = true
                    values.captcha_key = this.captcha_key
                    api.register(values).then((res) => {
                        this.spinning = false
                        if (res.success) {
                            this.$message.success('注册成功')
                            this.$router.replace({ name: 'login' })
                        } else {
                            this.getCaptcha()
                        }
                    })
                }
            })
        },
        getCode() {
            let phone = this.loginForm.getFieldValue('phone')
            if (!phone) return this.$message.warning('请输入手机号')
            if (this.isWaiting) return
            var params = {
                country_code: '86',
                phone: phone,
                time: 60,
                type: 1,
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
<style lang="less" scoped>
@import './index.less';
</style>
