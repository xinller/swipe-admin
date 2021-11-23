<template>
    <div class="common-container addBankCard-container">
        <div class="page-title">修改添加店铺</div>

        <a-form-model class="form-page mt-15" layout="horizontal" ref="ruleForm" labelAlign="left">
            <!-- <a-form-model-item label="审核方式">
                <a-select v-model="form.examine_type">
                    <a-select-option value="0">人工审核</a-select-option>
                </a-select>
            </a-form-model-item> -->
            <a-form-model-item label="选择平台">
                <a-select v-model="form.platform" disabled>
                    <a-select-option value="0">淘宝</a-select-option>
                    <a-select-option value="1">京东</a-select-option>
                    <a-select-option value="2">拼多多</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="店铺名称">
                <a-input v-model="form.store_name" class="mr-10"></a-input>
                <span>务必跟手机端宝贝页显示的店铺名一致</span>
            </a-form-model-item>
            <a-form-model-item label="店铺首页网址">
                <a-input v-model="form.store_website" placeholder="请输入电脑端店铺首页网址" class="mr-10" read-only></a-input>
                <span>请输入电脑端店铺首页网址</span>
            </a-form-model-item>
            <a-form-model-item label="店铺主旺旺ID">
                <a-input v-model="form.store_wangwang" placeholder="请输入店铺主旺旺ID" class="mr-10" read-only></a-input>
                <span>主旺旺ID用于核对买手是否找对宝贝</span>
            </a-form-model-item>
            <a-form-model-item label="主营类目">
                <a-select v-model="form.store_category" placeholder="请选择类目">
                    <a-select-option :value="item.id" v-for="item in storeCate" :key="item.id">{{ item.title }}</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="审核状态">
                <span class="c-primary" v-if="form.status == 0">未审核</span>
                <span class="c-green" v-if="form.status == 1">审核通过</span>
                <span class="c-red" v-if="form.status == 2">审核拒绝</span>
            </a-form-model-item>

            <a-form-model-item>
                <a-button type="primary" shape="round" @click="onSubmit" :disabled="form.status == 0">
                    确认提交
                </a-button>
            </a-form-model-item>
            <div class="c-red size-14" v-if="form.status == 2">拒绝原因:{{ form.reason }}</div>
        </a-form-model>
    </div>
</template>

<script>
import * as api from '@/api/api'
export default {
    name: 'addStore',
    data() {
        return {
            form: {
                platform: '0',
                store_website: '',
                store_name: '',
                store_wangwang: '',
                store_category: '',
                status: '-1',
            },
            storeCate: [
                { id: 1, title: '服装鞋包' },
                { id: 2, title: '手机数码' },
                { id: 3, title: '家用电器' },
                { id: 4, title: '美妆饰品' },
                { id: 5, title: '母婴用品' },
                { id: 6, title: '家居建材' },
                { id: 7, title: '百货食品' },
                { id: 8, title: '运动户外' },
                { id: 9, title: '文化娱乐' },
                { id: 10, title: '生活服务' },
                { id: 11, title: '汽摩配件' },
                { id: 12, title: '游戏话费' },
                { id: 99, title: '其它' },
            ],
            store_id: '',
        }
    },
    mounted() {
        this.getStoreDetail()
    },
    methods: {
        getStoreDetail() {
            console.log(this.$route)
            this.store_id = this.$route.query.id
            api.storeDetail({ store_id: this.store_id }).then((res) => {
                if (res.success) {
                    res.data.platform = String(res.data.platform)
                    res.data.store_category = Number(res.data.store_category)
                    this.form = { ...res.data }
                }
            })
            // this.form.store_category = this.form.store_category?Number(this.form.store_category):''
            // this.form.platform = String(this.form.platform)
        },
        onSubmit() {
            if (!this.form.store_name) return this.$message.warning('请输入店铺名称')
            if (!this.form.store_category) return this.$message.warning('请选择主营类目')
            api.editStore(this.form).then((res) => {
                if (res.success) {
                    this.$message.success('修改成功')
                    setTimeout(() => {
                        this.$router.go(-1)
                    }, 1000)
                }
            })
        },
    },
}
</script>

<style lang="less" scoped></style>
