<template>
    <div class="step-wrap">
        <a-row class="send-step" :gutter="[16, 24]" type="flex" justify="space-around">
            <a-col :class="['step-item', { active: activeKey >= 1 }]">
                <div class="circle">1</div>
                <div class="text">选择活动类型</div>
            </a-col>
            <a-col :class="['step-item', { active: activeKey >= 2 }]">
                <div class="circle">2</div>
                <div class="text">宝贝搜索设置</div>
            </a-col>
            <a-col :class="['step-item', { active: activeKey >= 3 }]">
                <div class="circle">3</div>
                <div class="text">浏览下单设置</div>
            </a-col>
            <a-col :class="['step-item', { active: activeKey >= 4 }]">
                <div class="circle">4</div>
                <div class="text">增值服务选择</div>
            </a-col>
            <a-col :class="['step-item', { active: activeKey >= 5 }]">
                <div class="circle">5</div>
                <div class="text">付款发布</div>
            </a-col>
        </a-row>
    </div>
</template>

<script>
export default {
    name: 'stepCom',
    props: {
        activeKey: Number,
    },
    data() {
        return {}
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
    .send-step {
        background-color: @c-lgray;
        // padding: 20px;
        text-align: center;
        font-size: 12px;
        border-radius: 4px;
        .step-item {
            .circle {
                width: 46px;
                height: 46px;
                border-radius: 50%;
                text-align: center;
                background: #e6e6e6;
                color: #aaa;
                line-height: 46px;
                font-size: 14px;
                margin: 0 auto;
            }
            .text {
                margin-top: 12px;
                color: @c-gray;
            }
            &.active {
                .circle {
                    background-color: @primary-color;
                    color: #fff;
                }
                .text {
                    color: @primary-color;
                }
            }
        }
    }
}
@media screen and (max-width: 768px) {
    .step-wrap .send-step {
        .step-item {
            .circle {
                width: 36px;
                height: 36px;
                line-height: 36px;
                font-size: 12px;
            }
        }
    }
}
</style>
