<template>
    <a-spin :spinning="spinning" class="activeListTable-container">
        <div class="table-box">
            <a-row class="row-hd">
                <a-col :xs="5">店铺信息</a-col>
                <a-col :xs="4">任务编号</a-col>
                <a-col :xs="4">申请买号</a-col>
                <a-col :xs="3">状态</a-col>
                <!-- <a-col :xs="3">总任务数/剩余名额</a-col> -->
                <a-col :xs="4">申请时间</a-col>
                <a-col :xs="4">操作</a-col>
            </a-row>
            <a-empty class="ptb-10" v-if="dataList.length == 0" />
            <a-row class="row-tr" v-for="(item, index) in dataList" :key="index">
                <a-col class="middle">
                    <a-row type="flex" align="middle">
                        <a-col class="col-td" :xs="4">
                            <img
                                src="../../assets/images/task/check.png"
                                class="check-icon mr-10"
                                v-if="!isInSelects(item.id)"
                                @click="toggleSelects(item.id)"
                            />
                            <img
                                src="../../assets/images/task/oncheck.png"
                                class="check-icon mr-10"
                                v-if="isInSelects(item.id)"
                                @click="toggleSelects(item.id)"
                            />
                            <img :src="item.goods_image" class="thumb" />
                            <span class="ml-15">
                                <img src="../../assets/images/task/taobao.png" class="tb-icon" />
                                <span>{{ item.store_name }}</span>
                            </span>
                        </a-col>
                        <a-col class="col-td" :xs="4">
                            {{ item.order_code }}
                        </a-col>
                        <a-col class="col-td txt-ct" :xs="4">
                            <div>{{ item.taobao_nickname }}</div>
                            <div class="flexct jus-ct" v-if="item.taobeo_level_num">
                                <img
                                    :src="BASE_URL + item.taobeo_img"
                                    class="level-icon"
                                    v-for="i in item.taobeo_level_num"
                                    :key="i"
                                />
                            </div>
                        </a-col>
                        <a-col class="col-td" :xs="3">
                            <!-- 状态 -->
                            <div class="c-primary">
                                {{ item.examine_status == 0 ? '未审核' : item.examine_status == 1 ? '已通过' : '已拒绝' }}
                            </div>
                            <div v-if="item.examine_status == 1" class="c-primary">{{ item.status | format_status }}</div>
                        </a-col>
                        <!-- <a-col class="col-td" :xs="3">1 </a-col> -->
                        <a-col class="col-td" :xs="4">{{ item.examine_time }}</a-col>
                        <a-col class="col-td col-line" :xs="4">
                            <div class="mt-5">
                                <span class="pointer c-primary" @click="toDetail(item)">详情</span>
                            </div>
                            <div class="flex-ct">
                                <!-- 待发货 -->
                                <!-- <a-button
                                    v-if="item.status == 2"
                                    type="primary"
                                    size="small"
                                    class="topay pointer"
                                    @click="toDelivery(item)"
                                    >发货</a-button
                                > -->
                                <!-- 待返款 -->
                                <!-- <a-button
                                    v-if="item.status == 4"
                                    type="primary"
                                    size="small"
                                    class="topay pointer"
                                    @click="toRefund(item)"
                                    >返款</a-button
                                > -->
                            </div>
                        </a-col>
                    </a-row>
                </a-col>
            </a-row>
            <div class="flex-bt">
                <div>
                    <a-checkbox v-model="isChooseAll" @change="chooseAll">全选</a-checkbox>
                </div>

                <a-pagination
                    class="txt-rt"
                    v-model="pagination.current"
                    :pageSize="pagination.pageSize"
                    :pageSizeOptions="pagination.pageSizeOptions"
                    show-size-changer
                    show-quick-jumper
                    :total="pagination.total"
                    :show-total="(total) => `共 ${pagination.total} 条`"
                    @change="changePageSize"
                    @showSizeChange="changeSize"
                />
            </div>
        </div>
    </a-spin>
</template>

<script>
import * as api from '@/api/api'
export default {
    name: 'checkListTable',
    props: {
        param: {
            type: Object,
        },
        isLoading: {
            type: Boolean,
        },
    },
    watch: {
        isLoading(newVal) {
            this.loading = newVal
            this.getTableList()
        },
        param(nval) {
            this.form = nval
        },
    },
    filters: {
        // 0-待接手 1-待接手付款 2-待发货 3-待收货评价 4-待返款 5-待追评 6-已完成 7-已关闭
        format_status(val) {
            switch (Number(val)) {
                case 0:
                    return '待接手'
                case 1:
                    return '待接手付款'
                case 2:
                    return '待发货'
                case 3:
                    return '待收货评价'
                case 4:
                    return '待返款'
                case 5:
                    return '待追评'
                case 6:
                    return '已完成'
                case 7:
                    return '已关闭'
            }
        },
    },
    data() {
        return {
            loading: this.isLoading,
            form: this.param,
            dataList: [],
            pagination: {
                pageSize: 10, //每页条数
                pageSizeOptions: ['10', '20', '30', '40'],
                current: 1,
                showSizeChanger: true,
                showQuickJumper: true,
                total: 0,
            },
            total: 0,
            spinning: false,
            selected_ids: [], //当前选中的 id
            selecteIds: [], //所有id
            isChooseAll: false,
        }
    },
    computed: {
        pager() {
            if (this.pagination === false) return false
            let option = {
                current: 1,
                pageSize: 10,
            }
            return _.merge({}, option, this.pagination)
        },
    },
    mounted() {
        this.getTableList()
    },
    methods: {
        refreshTable() {
            this.pagination.current = 1
            this.pagination.pageSize = 10
            this.getTableList()
        },
        changePageSize(page, pageSize) {
            this.pagination.pageSize = pageSize
            this.pagination.current = page
            this.getTableList()
        },
        changeSize(current, size) {
            this.pagination.pageSize = size
            this.pagination.current = current
            this.getTableList()
        },
        getTableList(isReset) {
            this.spinning = true
            let params = {
                page: this.pager.current,
                rows: this.pager.pageSize,
                ...this.form,
            }
            if (isReset) {
                params.page = this.pager.current = 1
            }
            api.examineList(params).then((res) => {
                this.spinning = false
                if (res.success) {
                    this.dataList = res.data.list
                    this.pagination.total = res.data.total
                    this.getAllselecteIds()
                }
            })
        },

        // 获取所有列表id
        getAllselecteIds() {
            let selecteIdsArr = []
            _.each(this.dataList, (v) => {
                selecteIdsArr.push(v.id)
            })
            this.selecteIds = selecteIdsArr
        },
        // 判断是否选择
        isInSelects(id) {
            return this.selected_ids.indexOf(id) >= 0 ? true : false
        },
        // 添加选择
        toggleSelects(id) {
            if (this.isInSelects(id)) {
                let index = _.findIndex(this.selected_ids, (v) => v == id)
                this.selected_ids.splice(index, 1)
            } else {
                this.selected_ids.push(id)
            }
            this.$emit('chooseTableIds', { ids: this.selected_ids })
            this.isAll()
        },
        // 判断是否全选
        isAll() {
            let has = true
            _.each(this.selecteIds, (v) => {
                if (this.selected_ids.indexOf(v) == -1) {
                    has = false
                    return
                }
            })
            console.log('has', has)
            this.isChooseAll = has
        },
        // 全选
        chooseAll() {
            if (this.isChooseAll) {
                this.selected_ids = this.selecteIds
            } else {
                this.selected_ids = []
            }
            this.$emit('chooseTableIds', { ids: this.selected_ids })
        },

        // 发货
        toDelivery() {
            this.$router.push({ name: 'delivery', query: { id: 222 } })
        },
        // 返款
        toRefund() {
            this.$router.push({ name: 'taskDetail', query: { id: 222 } })
        },
        // 任务详情
        toDetail(item) {
            this.$router.push({ name: 'checkDetail', query: { id: item.id } })
        },
    },
}
</script>

<style lang="less" scoped></style>
