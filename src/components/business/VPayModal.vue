<template>
    <!-- 支付弹窗 -->
    <a-modal v-model="isVisible" title="" :footer="null">
        <div class="modal-pay">
            <div class="txt-ct"><img src="../../assets/images/task/pay_card.png" class="pay-card" /></div>
            <a-input v-model="password" type="password"></a-input>
            <div class="size-12 mt-15">
                初始密码:666666,为了您的账户安全, <router-link :to="{ name: 'editPaypass' }">请设置密码</router-link>
            </div>
            <div class="txt-rt mt-15 pb-20 line-b">
                <a-button class="mr-10" @click="toggle">取消</a-button>
                <a-button :disabled="loading" type="primary" @click="commit">{{ okText }}</a-button>
            </div>
            <div class="mt-15">
                <slot name="footer-content"></slot>
            </div>
        </div>
    </a-modal>
</template>

<script>
export default {
    name: 'payModal',
    props: {
        visible: {
            type: Boolean,
        },
        okText: {
            type: String,
            default: '确定',
        },
        isReset: {
            type: Boolean,
        },
    },
    watch: {
        visible(val) {
            this.isVisible = val
            if (val) {
                this.loading = false
                this.password = ''
            }
        },
        isReset(val) {
            this.loading = false
        },
    },
    data() {
        return {
            isVisible: this.visible,
            password: '',
            loading: false,
        }
    },
    methods: {
        commit() {
            if (!this.password) return this.$message.warning('请输入支付密码')
            this.loading = true
            this.$emit('commit', { password: this.password })
        },
        toggle() {
            this.$emit('toggle', false)
        },
    },
}
</script>

<style lang="less" scoped></style>
