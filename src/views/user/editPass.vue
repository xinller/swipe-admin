<template>
    <div class="common-container addBankCard-container">
        <div class="page-title">修改登录密码</div>
        <a-row type="flex" justify="center">
            <a-col :xs="24" :md="10">
                <a-form-model class="mt-15" layout="horizontal" :model="form" :rules="rules" ref="ruleForm" labelAlign="left">
                    <a-form-model-item label="原密码" prop="old_password">
                        <a-input size="large" type="password" v-model="form.old_password" placeholder="原密码"></a-input>
                    </a-form-model-item>
                    <a-form-model-item label="新密码" prop="password">
                        <a-input size="large" type="password" v-model="form.password" placeholder="新密码"></a-input>
                    </a-form-model-item>
                    <a-form-model-item label="确认新密码" prop="password1">
                        <a-input size="large" type="password" v-model="form.password1" placeholder="确认新密码"></a-input>
                    </a-form-model-item>
                    <a-button size="large" block type="primary" shape="round" @click="onSubmit">
                        确认
                    </a-button>
                </a-form-model>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import * as api from '@/api/api'
export default {
    name: 'editPass',
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
                type: 2,
            },
            rules: {
                old_password: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
                password: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
                password1: [{ required: true, message: '请确认新密码', trigger: 'blur' }, { validator: validatePass2 }],
            },
        }
    },
    methods: {
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
