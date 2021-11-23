<template>
    <div class="activeListTable-container">
        <a-spin :spinning="spinning" class="table-box">
            <a-row class="row-hd">
                <a-col :xs="6">店铺信息</a-col>
                <a-col :xs="4">活动类型</a-col>
                <a-col :xs="2">任务总数</a-col>
                <a-col :xs="2">金额总数</a-col>
                <a-col :xs="4">活动状态</a-col>
                <a-col :xs="6">活动概况</a-col>
            </a-row>
            <a-empty class="ptb-10" v-if="dataList.length == 0" />
            <a-row class="row-tr" v-for="(item, index) in dataList" :key="index">
                <a-col class="top">
                    <div>
                        <span class="mr-10">活动编号：{{ item.order_sn }} </span>
                        <span>创建时间：{{ item.create_time }}</span>
                    </div>
                    <div class="rt-btn">
                        <img
                            src="../../assets/images/activity/copy.png"
                            title="复制活动"
                            class="icon pointer"
                            @click="showCopyConfirm(item)"
                        />
                        <img
                            src="../../assets/images/activity/template.png"
                            title="保存为模版"
                            class="icon pointer"
                            @click="createTplConfirm(item)"
                        />
                        <img
                            src="../../assets/images/activity/trash.png"
                            title="删除活动"
                            class="icon pointer"
                            @click="showDelConfirm(item)"
                            v-if="item.order_status == 0"
                        />
                        <!-- 未付款显示 trash -->
                    </div>
                </a-col>
                <a-col class="middle">
                    <a-row type="flex" align="middle">
                        <a-col class="col-td" :xs="6">
                            <img :src="item.goods_image" class="thumb" />
                            <span class="ml-15">
                                <img src="../../assets/images/task/taobao.png" class="tb-icon" v-if="item.platform_type == 0" />
                                <img src="../../assets/images/task/jd.png" class="tb-icon" v-if="item.platform_type == 1" />
                                <img src="../../assets/images/task/pdd.png" class="tb-icon" v-if="item.platform_type == 2" />
                                <span>{{ item.store_name }}</span>
                            </span>
                        </a-col>
                        <a-col class="col-td" :xs="4">
                            <div class="ac-type">
                                淘宝/天猫{{ item.acticity_type == 1 ? '优质' : '普通' }}试用活动
                                <span :class="['ac-repay', { blue: item.back_type == 1 }, { red: item.back_type == 0 }]">{{
                                    item.back_type == 1 ? '商家返款' : '平台返款'
                                }}</span>
                            </div>
                        </a-col>
                        <a-col class="col-td" :xs="2">{{ item.order_num }}</a-col>
                        <a-col class="col-td" :xs="2">¥{{ item.payment_amount }}</a-col>
                        <a-col class="col-td" :xs="4">
                            <div>{{ item.order_status | format_status }}</div>
                            <!-- 未支付:付款 + 活动详情 -->
                            <div class="mt-5" v-if="item.order_status == 0">
                                <a-button size="small" type="primary" class="mr-10 topay pointer" @click="toPay(item)"
                                    >付款</a-button
                                >
                                <span class="pointer c-primary" @click="toDetail(item)">活动详情</span>
                            </div>
                            <!-- 进行中:取消活动 + 活动详情 -->
                            <div v-else-if="item.order_status == 1">
                                <span class="pointer c-primary" @click="toDetail(item)">活动详情</span>
                                <div class="mt-5 c-primary pointer" @click="showCancelConfirm(item)">
                                    取消活动
                                </div>
                            </div>

                            <!-- 已完成|部分完成|已取消: 活动详情 -->
                            <div v-else>
                                <span class="pointer c-primary" @click="toDetail(item)">活动详情</span>
                            </div>
                        </a-col>
                        <a-col class="col-td" :xs="6">
                            <div class="flexct" style="justify-content:center">
                                <div>
                                    <div>未发布</div>
                                    <div>{{ item.un_public }}</div>
                                </div>
                                <div>
                                    <div>已发布</div>
                                    <div>{{ item.public_num }}</div>
                                </div>
                                <div>
                                    <div>已完成</div>
                                    <div>{{ item.complete_num }}</div>
                                </div>
                                <div>
                                    <div>已关闭</div>
                                    <div>{{ item.close_num }}</div>
                                </div>
                            </div>
                        </a-col>
                    </a-row>
                </a-col>
            </a-row>
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
        </a-spin>
    </div>
</template>

<script>
import * as api from '@/api/api'
import { mapGetters } from 'vuex'
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
            this.getTableList()
        },
        param(nval) {
            this.form = nval
        },
    },
    computed: {
        ...mapGetters(['updateBalance']),
    },
    data() {
        return {
            loading: this.isLoading,
            form: this.param,
            tmp_name: '',
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
            isCopying: false,
        }
    },
    filters: {
        format_status(val) {
            switch (Number(val)) {
                case 0:
                    return '未支付'
                case 1:
                    return '进行中'
                case 2:
                    return '已完成'
                case 3:
                    return '部分完成'
                case 4:
                    return '已取消'
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
            console.log('params', params)
            api.orderList(params).then((res) => {
                this.spinning = false
                if (res.success) {
                    this.dataList = res.data.list
                    this.pagination.total = res.data.total
                }
            })
        },
        // 付款
        toPay(item) {
            this.$router.push({ name: 'step5', query: { id: item.id } })
        },
        // 活动详情
        toDetail(item) {
            this.$router.push({ name: 'activityDetail', query: { id: item.id } })
        },
        // 取消活动
        showCancelConfirm(item) {
            this.$confirm({
                title: '确定取消此活动?',
                content: '取消活动后系统会退还您所有的货款和赏金',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk: () => {
                    api.cancleGrab({ id: item.id }).then((res) => {
                        if (res.success) {
                            this.$message.success('取消成功')
                            this.refreshTable()
                            this.$store.commit('setUpdateBalance', !this.updateBalance)
                        }
                    })
                },
                onCancel() {
                    console.log('Cancel')
                },
            })
        },
        // 复制
        showCopyConfirm(item) {
            this.$confirm({
                title: '',
                content: '确定复制该活动?点击确定去发布活动',
                okText: '确定',
                okType: 'primary',
                cancelText: '取消',
                onOk: () => {
                    console.log('item')
                    if (this.spinning) return
                    this.spinning = true
                    api.copyGrab({ id: item.id }).then((res) => {
                        this.spinning = false
                        if (res.success) {
                            let newId = res.data
                            this.$router.push({ name: 'step2', query: { id: newId } })
                        }
                    })

                    // 带着活动每个步骤的参数过去 回填
                    // 提示 该活动包含评价任务,请注意修改评价内容,请勿重复使用评价内容
                },
                onCancel() {
                    console.log('Cancel')
                },
            })
        },
        // 生成模版
        createTplConfirm(item) {
            this.$confirm({
                title: '',
                content: (h) => (
                    <div>
                        设置模版名称 <a-input id="tmp_name"></a-input>
                    </div>
                ),
                okText: '确定',
                okType: 'primary',
                cancelText: '取消',
                onOk: () => {
                    console.log('OK')
                    let name = document.getElementById('tmp_name').value
                    // 请求 刷新页面
                    api.createModel({ id: item.id, model_name: name }).then((res) => {
                        if (res.success) {
                            this.$message.success('生成模版成功')
                        }
                    })
                },
                onCancel() {
                    console.log('Cancel')
                },
            })
        },
        // 删除
        showDelConfirm(item) {
            this.$confirm({
                title: '确定删除此活动?',
                okText: '确定',
                okType: 'primary',
                cancelText: '取消',
                onOk: () => {
                    console.log('OK')
                    // 请求刷新页面
                    api.delGrab({ id: item.id }).then((res) => {
                        if (res.success) {
                            this.$message.success('删除成功')
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
