<template>
    <!-- 公告中心 -->
    <div class="notice-container">
        <a-list item-layout="horizontal" :data-source="data" :loading="loading" :pagination="pagination">
            <a-list-item slot="renderItem" slot-scope="item" @click="toDetail(item)">
                <a-list-item-meta>
                    <a href="javascript:;" slot="title">{{ item.title }}</a>
                </a-list-item-meta>
                <div class="ml-10">{{ item.update_time }}</div>
            </a-list-item>
        </a-list>
    </div>
</template>

<script>
import * as api from '@/api/api'
export default {
    name: 'notice',
    data() {
        return {
            loading: false,
            data: [],
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
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        getData() {
            this.loading = true
            api.noticeList({
                page: this.pagination.current,
                rows: this.pagination.pageSize,
            }).then((res) => {
                this.loading = false
                if (res.success) {
                    this.data = res.data.list
                    this.pagination.total = res.data.total
                }
            })
        },

        toDetail(item) {
            this.$router.push({ name: 'noticeDetail', query: { id: item.id } })
        },
    },
}
</script>

<style lang="less" scoped></style>
