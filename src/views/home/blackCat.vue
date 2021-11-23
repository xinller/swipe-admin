<template>
    <div class="comtb-container">
        <div class="tabs-container">
            <a-tabs type="card" @change="tabChange">
                <a-tab-pane key="0" tab="全部"></a-tab-pane>
                <a-tab-pane :tab="item.category_name" v-for="item in categorys" :key="item.id"></a-tab-pane>
            </a-tabs>
        </div>
        <div class="notice-container">
            <a-list item-layout="horizontal" :data-source="dataList" :pagination="pagination">
                <a-list-item slot="renderItem" slot-scope="item" @click="toDetail(item)">
                    <a-list-item-meta>
                        <a href="javascript:;" slot="title">{{ item.title }}</a>
                    </a-list-item-meta>
                    <div class="ml-10">{{ item.create_time }}</div>
                </a-list-item>
            </a-list>
        </div>
    </div>
</template>

<script>
import * as api from '@/api/api'
export default {
    name: 'blackCat',
    data() {
        return {
            dataList: [],
            pagination: {
                pageSizeOptions: ['10', '20', '30', '40', '50'],
                showQuickJumper: true,
                showSizeChanger: true,
                size: 'small',
                current: 1,
                pageSize: 10,
                total: 0,
                onChange: (page) => {
                    console.log('page', page)
                    this.pagination.current = page
                    this.getData()
                },
                onShowSizeChange: (page, pageSize) => {
                    console.log('pageSize', pageSize)
                    this.pagination.pageSize = pageSize
                    this.getData()
                },
            },
            categorys: '',
            category_id: '',
        }
    },

    mounted() {
        this.videoCategorys()
    },
    methods: {
        videoCategorys() {
            api.categorys().then((res) => {
                if (res.success) {
                    this.categorys = res.data
                    this.getData()
                }
            })
        },
        tabChange(key) {
            console.log('key', key)
            this.category_id = key == 0 ? '' : key
            this.pagination.current = 1
            this.getData()
        },
        getData() {
            this.loading = true
            api.newsList({
                page: this.pagination.current,
                rows: this.pagination.pageSize,
                category_id: this.category_id,
            }).then((res) => {
                this.loading = false
                if (res.success) {
                    this.dataList = res.data.list
                    this.pagination.total = res.data.total
                }
            })
        },
        toDetail(item) {
            this.$router.push({ name: 'blackCatDetail', query: { id: item.id } })
        },
    },
}
</script>

<style lang="less" scoped></style>
