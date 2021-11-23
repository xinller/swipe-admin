<template>
    <div class="step-wrap">
        <a-row class="send-step" :gutter="[24, 30]" type="flex" justify="space-around">
            <a-col :class="['step-item', { active: activeKey >= 1 }]">
                <div class="circle"><img src="../../assets/images/user/safe_on.png" alt="" /></div>
                <div class="text">选择重置方式</div>
            </a-col>
            <a-col :class="['step-item', { active: activeKey >= 2 }]">
                <div class="circle" v-if="activeKey < 2"><img src="../../assets/images/user/pass.png" alt="" /></div>
                <div class="circle" v-if="activeKey >= 2"><img src="../../assets/images/user/pass_on.png" alt="" /></div>
                <div class="text">设置新的支付密码</div>
            </a-col>
            <a-col :class="['step-item', { active: activeKey >= 3 }]">
                <div class="circle" v-if="activeKey < 3"><img src="../../assets/images/user/success.png" alt="" /></div>
                <div class="circle" v-if="activeKey >= 3"><img src="../../assets/images/user/success_on.png" alt="" /></div>
                <div class="text">重置成功</div>
            </a-col>
        </a-row>
    </div>
</template>

<script>
export default {
    name: 'editPaypass',
    props: {
        activeKey: '',
    },
    data() {
        return {}
    },
}
</script>

<style lang="less" scoped>
@c-lgray: #f5f7f9;
@primary-color: #0179ff;
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
