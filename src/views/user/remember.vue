<template>
    <div class="pass-container">
        <div class="page-title">重置支付密码</div>
        <PaypassStep :activeKey="2"></PaypassStep>
        <a-row type="flex" justify="center" class="mt-30">
            <a-col :xs="24" :md="10">
                <a-form-model layout="horizontal" :model="form" :rules="rules" ref="ruleForm" labelAlign="left">
                    <a-form-model-item label="" prop="old_password">
                        <a-input size="large" type="password" v-model="form.old_password" placeholder="原密码"></a-input>
                    </a-form-model-item>
                    <a-form-model-item label="" prop="password">
                        <a-input size="large" type="password" v-model="form.password" placeholder="新密码"></a-input>
                    </a-form-model-item>
                    <a-form-model-item label="" prop="password1">
                        <a-input size="large" type="password" v-model="form.password1" placeholder="请确认新密码"></a-input>
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
import PaypassStep from './PaypassStep.vue'
import * as api from '@/api/api'
export default {
    name: 'remember',
    components: {
        PaypassStep,
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
                old_password: '',
                password: '',
                password1: '',
                type: 3,
            },
            rules: {
                old_password: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
                password: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
                password1: [{ required: true, message: '请确认新密码', trigger: 'blur' }, { validator: validatePass2 }],
            },
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1)
        },
        onSubmit() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    api.changePass(this.form).then((res) => {
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
