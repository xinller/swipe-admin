<template>
    <div class="MarkRecordTask-container">
        <a-table :columns="dataColumns" :dataSource="dataSource" :scroll="{ x: 1200 }"></a-table>
    </div>
</template>

<script>
export default {
    name: 'MarkRecordTask',
    data() {
        return {
            dataColumns: [
                { dataIndex: 'keyword', title: '打标关键词', align: 'center' },
                { dataIndex: 'link', title: '商品链接', align: 'center' },
                { dataIndex: 'ww', title: '旺旺', align: 'center' },
                { dataIndex: 'status', title: '打标状态', align: 'center' },
                { dataIndex: 'amount', title: '金币', align: 'center' },
                { dataIndex: 'create_time', title: '打标时间', align: 'center' },
            ],
            dataSource: [],
        }
    },
}
</script>

<style lang="less" scoped></style>
