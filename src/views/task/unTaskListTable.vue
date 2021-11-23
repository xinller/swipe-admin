<template>
    <div class="activeListTable-container">
        <a-spin :spinning="spinning" class="table-box mt-20">
            <a-row class="row-hd">
                <a-col :xs="4">店铺信息</a-col>
                <a-col :xs="4">活动类型</a-col>
                <a-col :xs="2">垫付货款</a-col>
                <a-col :xs="2">任务赏金</a-col>
                <a-col :xs="2">下单数量</a-col>
                <a-col :xs="4">活动摘要</a-col>
                <a-col :xs="3">搜索关键词</a-col>
                <a-col :xs="3">任务状态</a-col>
            </a-row>
            <a-empty class="ptb-10" v-if="dataList.length == 0" />
            <a-row class="row-tr" v-for="(item, index) in dataList" :key="index">
                <a-col class="top">
                    <div>
                        <img
                            src="../../assets/images/task/check.png"
                            class="check-icon"
                            v-if="!isInSelects(item.id)"
                            @click="toggleSelects(item.id)"
                        />
                        <img
                            src="../../assets/images/task/oncheck.png"
                            class="check-icon"
                            v-if="isInSelects(item.id)"
                            @click="toggleSelects(item.id)"
                        />
                        <span class="mlr-10">任务编号：{{ item.order_code }} </span>
                        <span>发布时间：{{ item.public_time }}</span>
                    </div>
                </a-col>
                <a-col class="middle">
                    <a-row type="flex" align="middle">
                        <a-col class="col-td" :xs="4">
                            <span class="ml-15">
                                <img :src="item.goods_image" class="thumb" />
                                <span class="ml-15">
                                    <img
                                        src="../../assets/images/task/taobao.png"
                                        class="tb-icon"
                                        v-if="item.platform_type == 0"
                                    />
                                    <img src="../../assets/images/task/jd.png" class="tb-icon" v-if="item.platform_type == 1" />
                                    <img src="../../assets/images/task/pdd.png" class="tb-icon" v-if="item.platform_type == 2" />
                                    <span>{{ item.store_name }}</span>
                                </span>
                            </span>
                        </a-col>
                        <a-col class="col-td" :xs="4">
                            <div class="ac-type">
                                淘宝/天猫{{ item.activity_type == 0 ? '普通' : '优质' }}试用活动
                                <span :class="['ac-repay', { blue: item.back_type == 1 }, { red: item.back_type == 0 }]">{{
                                    item.back_type == 1 ? '商家返款' : '平台返款'
                                }}</span>
                            </div>
                        </a-col>
                        <a-col class="col-td" :xs="2">
                            <div>¥{{ item.pay_amount }}</div>
                            <!-- <v-tooltip placement="bottom">
                                <template slot="content">买家实付金额与垫付金额不一致</template>
                            </v-tooltip> -->
                        </a-col>
                        <a-col class="col-td" :xs="2">
                            <img src="../../assets/images/activity/san.png" class="san-icon" />
                            {{ item.mi_amount }}
                        </a-col>
                        <a-col class="col-td" :xs="2">1</a-col>

                        <a-col class="col-td col-line" :xs="4">
                            <div class="flexct" style="justify-content:center">
                                <!-- <span class="buyer-ys">延收</span> -->
                                <span class="buyer-zp" v-if="item.is_additional_comments == 1">追评</span>
                                <template v-if="item.browse_require_list && item.browse_require_list.length > 0">
                                    <span class="buyer-s" v-for="i in item.browse_require_list" :key="i">
                                        {{ util.formatBrowse(i) }}
                                    </span>
                                </template>
                            </div>
                        </a-col>
                        <a-col class="col-td txt-ct" :xs="3">
                            <div v-if="item.search_type != 2">{{ item.keywords }}</div>
                            <div v-if="item.search_type == 2">
                                <img :src="item.keywords" class="thumb" />
                            </div>
                        </a-col>
                        <a-col class="col-td" :xs="3">
                            <div>{{ item.status | format_status }}</div>
                            <div class="mt-5">
                                <span class="pointer c-primary" @click="toDetail(item)">详情</span>
                                <!-- 未发布任务显示 -->
                                <span class="pointer c-primary ml-10" @click="toCloseConfirm(item)">关闭</span>
                            </div>
                            <!-- 未发布任务 -->
                            <div class="pointer flex-ct">
                                <a-button
                                    v-if="item.status != 7"
                                    type="primary"
                                    size="small"
                                    class="topay pointer"
                                    @click="toPublish(item)"
                                    >立即发布</a-button
                                >
                            </div>
                        </a-col>
                    </a-row>
                </a-col>
            </a-row>
            <div class="flex-bt">
                <div>
                    <a-checkbox v-model="isChooseAll" @change="chooseAll">全选</a-checkbox>
                    <a-button size="small" class="mr-10" @click="sendConfirm">批量发布</a-button>
                    <a-button size="small" @click="closeConfirm">批量关闭</a-button>
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
        </a-spin>
    </div>
</template>

<script>
import * as api from '@/api/api'
export default {
    name: 'activeListTable',

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
            this.page = 1
            this.rows = 10
            this.getTableList()
        },
        param(nval) {
            this.form = nval
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
            isDisabled: false,
        }
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
        },
        refreshTable() {
            this.pagination.current = 1
            this.pagination.pageSize = 10
            this.getTableList()
        },
        changePageSize(page, pageSize) {
            console.log('pageSize', pageSize)
            console.log('page', page)
            this.pagination.pageSize = pageSize
            this.pagination.current = page
            this.getTableList()
        },
        changeSize(current, size) {
            console.log('size', size)
            console.log('current', current)
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
            console.log('params', params)
            api.missionList(params).then((res) => {
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
        // 付款
        toPay(item) {
            this.$router.push({ name: 'step5', query: { id: item.id } })
        },
        // 任务详情
        toDetail(item) {
            this.$router.push({ name: 'taskDetail', query: { id: item.id } })
        },
        // 批量关闭
        closeConfirm() {
            if (this.selected_ids.length == 0) return this.$message.warning('请选择要关闭的任务')
            this.$confirm({
                title: '确定关闭此任务?',
                content: '关闭任务后系统会退还您所有的货款和赏金',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk: () => {
                    console.log('OK')
                    api.batchCloseMission({ order_ids: this.selected_ids.join() }).then((res) => {
                        if (res.success) {
                            this.$message.success('发布成功')
                            this.refreshTable()
                            this.isChooseAll = false
                            this.chooseAll()
                        }
                    })
                },
                onCancel() {
                    console.log('Cancel')
                },
            })
        },
        // 批量发布
        sendConfirm() {
            if (this.selected_ids.length == 0) return this.$message.warning('请选择要发布的任务')
            this.$confirm({
                title: '确定立即发布',
                okText: '确定',
                okType: 'primary',
                cancelText: '取消',
                onOk: () => {
                    console.log('OK')
                    // 请求刷新页面
                    api.batchPublic({ order_ids: this.selected_ids.join() }).then((res) => {
                        if (res.success) {
                            this.$message.success('发布成功')
                            this.refreshTable()
                            this.isChooseAll = false
                            this.chooseAll()
                        }
                    })
                },
                onCancel() {
                    console.log('Cancel')
                },
            })
        },

        // 关闭任务
        toCloseConfirm(item) {
            this.$confirm({
                title: '确定关闭此任务?',
                content: '关闭任务后系统会退还您所有的货款和赏金',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk: () => {
                    console.log('OK')
                    api.closeMission({ order_id: item.id }).then((res) => {
                        if (res.success) {
                            this.$message.success('关闭成功')
                            this.refreshTable()
                        }
                    })
                },
                onCancel() {
                    console.log('Cancel')
                },
            })
        },
        // 立即发布任务
        toPublish(item) {
            this.$confirm({
                title: '确定立即发布?',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk: () => {
                    console.log('OK')
                    api.toPublic({ order_id: item.id }).then((res) => {
                        if (res.success) {
                            this.$message.success('发布成功')
                            this.refreshTable()
                        }
                    })
                },
                onCancel() {
                    console.log('Cancel')
                },
            })
        },
    },
}
</script>

<style lang="less" scoped></style>
