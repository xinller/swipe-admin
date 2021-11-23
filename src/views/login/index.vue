<template>
	<div class="login" @keydown.enter="handleSubmit">
		<div class="login-header">
			<div class="hd"><img src="../../assets/images/login/logo2.png" class="logo" /> <span class="hd-title">登录</span></div>
		</div>
		<div class="login-wrap">
			<div class="login-con ">
				<a-card :bordered="false">
					<div slot="title">
						欢迎登录鲸鱼
					</div>
					<a-spin :spinning="spinning" class="form-con">
						<a-form :form="loginForm" @submit="handleSubmit">
							<a-form-item prop="phone">
								<a-input size="large" v-decorator="rules.phone" placeholder="请输入手机号"> </a-input>
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
							<a-form-item prop="captcha">
								<div class="login-code">
									<a-input size="large" type="text" v-decorator="rules.captcha" placeholder="填写验证码"> </a-input>
									<div class="captcha-box" @click="getCaptcha">
										<img :src="captcha_url" v-if="captcha_url" />
									</div>
								</div>
							</a-form-item>
							<a-form-item>
								<a-checkbox :checked="remember" @change="remember = !remember"> 记住密码 </a-checkbox>
								<router-link :to="{ name: 'loginForget' }">忘记密码?</router-link>
							</a-form-item>
							<a-form-item>
								<a-button size="large" type="primary" block html-type="submit">登 录</a-button>
							</a-form-item>
						</a-form>
						<div class="mt-10 size-12 txt-ct">
							<router-link :to="{ name: 'register' }">还没账号?立即注册</router-link>
						</div>
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

				captcha: ['captcha', { rules: [{ required: true, message: '请输入验证码' }] }],
			},

			captcha_url: '',
			captcha_key: '',
			showPass: false,
			remember: false,
			on_disable: false,
			spinning: false,
		}
	},
	mounted() {
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
				console.log('values', values)
				if (!err) {
					this.spinning = true
					values.captcha_key = this.captcha_key
					api.login(values).then((res) => {
						this.spinning = false
						if (res.success) {
							this.$store.commit('setToken', res.data.token)
							this.$store.commit('setUserInfo', { ...res.data })
							if (this.remember) {
								localStorage.setItem('LoginForm', { phone: values.phone, password: values.password })
							}
							this.$router.replace({
								name: this.appConfig.homepage.name,
							})
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
	},
}
</script>
<style lang="less" scoped>
@import './index.less';
</style>
