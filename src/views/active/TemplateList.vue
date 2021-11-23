<template>
    <div class="activeList-container">
        <a-form-model layout="inline" :model="form">
            <a-form-model-item label="店铺名称">
                <a-select v-model="form.store_id">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option :value="item.id" v-for="(item, index) in storeList" :key="index">{{
                        item.store_name
                    }}</a-select-option>
                </a-select>
            </a-form-model-item>

            <a-form-model-item label="活动类型">
                <a-select v-model="form.activity_type" placeholder="请选择">
                    <a-select-option value="0">普通</a-select-option>
                    <a-select-option value="1">优质</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item>
                <a-button type="primary" @click="queryEvent">
                    搜索
                </a-button>
            </a-form-model-item>
        </a-form-model>

        <TemplateListTable :param="form" :isLoading="isLoading"></TemplateListTable>
    </div>
</template>

<script>
import TemplateListTable from './TemplateListTable'
import moment from 'moment'
import * as api from '@/api/api'
export default {
    name: 'templateList',
    components: {
        TemplateListTable,
    },
    data() {
        return {
            form: {
                store_id: '',
                activity_type: '',
            },
            isLoading: false,
            storeList: [],
        }
    },
    mounted() {
        this.getStoreList()
    },
    methods: {
        queryEvent() {
            this.isLoading = !this.isLoading
        },
        TabsCallback(key) {
            console.log(key)
            this.queryEvent()
        },
        // 可用店铺列表
        getStoreList() {
            api.getStoreList({ page: 1, rows: 1000 }).then((res) => {
                if (res.success) {
                    this.storeList = res.data.list
                    // this.form.store_id = res.data.list[0]['id']
                }
            })
        },
    },
}
</script>

<style lang="less" scoped></style>
