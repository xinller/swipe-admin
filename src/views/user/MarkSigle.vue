<template>
    <div class="mark-container">
        <div class="page-title">淘宝账号打标</div>
        <div class="c-red mt-5 size-13">淘宝账号打标有什么用？(打不上标的可以打竞品，用户同样能提权)</div>
        <a-row class="mt-20">
            <a-col :xs="24" :md="16">
                <a-form v-bind="layout">
                    <a-form-item label="搜索关键词">
                        <a-input placeholder="请输入搜索关键词"></a-input>
                        <span>必须是标题内词，权重过低的宝贝建议使用长尾词 </span>
                    </a-form-item>
                    <a-form-item label="宝贝链接">
                        <a-input placeholder="请输入淘宝宝贝链接"></a-input>
                    </a-form-item>
                    <a-form-item label="搜索关键词">
                        <a-input placeholder="请输入淘宝会员名"></a-input>
                        <span>需要打标的淘宝用户会员名（注意是会员名，不懂问客服） </span>
                    </a-form-item>
                    <a-form-item :wrapper-col="{ span: 18, offset: 6 }">
                        <a-button type="primary" class="mr-10">立即打标</a-button>
                        <span>每次打标扣 <span class="c-red">0.5鲸币</span> </span>
                    </a-form-item>
                </a-form>
            </a-col>
        </a-row>
    </div>
</template>

<script>
export default {
    name: 'MarkSigle',
    data() {
        return {
            layout: {
                labelCol: { span: 6 },
                wrapperCol: { span: 18 },
            },
        }
    },
}
</script>

<style lang="less" scoped></style>
