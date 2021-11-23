<template>
    <div class="editPaypass-container">
        <div class="page-title">重置支付密码</div>
        <PaypassStep :activeKey="1"></PaypassStep>
        <div class="pass-card">
            <div class="top">
                <div class="text">您正在找回 {{ userInfo.phone }} 的支付密码</div>
                <div class="status"><a-icon type="check" /></div>
                <div class="text">基于对您账户及操作环境的检测，我们将提供以下方式供您选择</div>
            </div>
            <div class="bottom">
                <div class="list" @click="toNextPage('forget')">
                    <div class="left">
                        <div class="title">我忘记支付密码了</div>
                        <p>忘记密码或是密码被锁定</p>
                    </div>
                    <a-icon type="right" />
                </div>
                <div class="list mt-25" @click="toNextPage('remember')">
                    <div class="left">
                        <div class="title">我记得原来密码</div>
                    </div>
                    <a-icon type="right" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PaypassStep from './PaypassStep.vue'
export default {
    components: { PaypassStep },
    name: 'editPaypass',
    data() {
        return {
            activeKey: 1,
        }
    },
    computed: {
        ...mapGetters(['userInfo']),
    },
    methods: {
        toNextPage(name) {
            this.$router.push({ name })
        },
    },
}
</script>

<style lang="less" scoped>
@c-lgray: #f5f7f9;
@primary-color: #00a8fc;
@c-gray: #909399;
// 步骤条
.step-wrap {
    padding: 10px;
    margin-top: 30px;
    margin-bottom: 20px;
    .send-step {
        text-align: center;
        font-size: 12px;
        border-radius: 4px;
        .step-item {
            .circle {
                width: 30px;
                height: 30px;
                margin: 0 auto;
                img {
                    width: 100%;
                }
            }
            .text {
                margin-top: 12px;
                color: @c-gray;
            }
            &.active {
                .text {
                    color: @primary-color;
                }
            }
        }
    }
}
</style>
