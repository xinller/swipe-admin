<template>
    <a-spin :spinning="spinning" class="activeListTable-container">
        <div class="table-box mt-20">
            <a-row class="row-hd">
                <a-col :xs="7">店铺信息</a-col>
                <a-col :xs="4">活动类型</a-col>
                <a-col :xs="2">任务总数</a-col>
                <a-col :xs="2">垫付金额</a-col>
                <a-col :xs="2">活动赏金</a-col>
                <a-col :xs="7">活动摘要</a-col>
            </a-row>
            <a-empty class="ptb-10" v-if="dataList.length == 0" />
            <a-row class="row-tr" v-for="item in dataList" :key="item.id">
                <a-col class="top">
                    <div>
                        <img
                            src="../../assets/images/task/check.png"
                            class="check-icon"
                            v-if="!isInModels(item.id)"
                            @click="toggleModels(item.id)"
                        />
                        <img
                            src="../../assets/images/task/oncheck.png"
                            class="check-icon"
                            v-if="isInModels(item.id)"
                            @click="toggleModels(item.id)"
                        />
                        <span class="mr-10"
                            >模版名称: <span class="c-primary">{{ item.model_name }}</span>
                        </span>
                        <span>创建时间：{{ item.create_time }}</span>
                    </div>
                    <div class="rt-btn">
                        <span class="c-primary pointer mr-10" @click="showCopyConfirm(item)">生成活动</span>
                        <span class="c-primary pointer" @click="showDelConfirm(item)">删除模版</span>
                    </div>
                </a-col>
                <a-col class="middle">
                    <a-row type="flex" align="middle">
                        <a-col class="col-td" :xs="7">
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
                        <a-col class="col-td" :xs="2">1</a-col>
                        <a-col class="col-td" :xs="2">¥{{ item.payment_amount }}</a-col>
                        <a-col class="col-td" :xs="2">¥{{ item.mi_amount }}</a-col>
                        <a-col class="col-td col-linne" :xs="7">
                            <div class="flexct" style="justify-content:center">
                                <!-- <span class="buyer-ys">延收</span> -->
                                <span class="buyer-ys" v-if="item.is_pre == 1">预售</span>
                                <template v-if="item.browse_require_list && item.browse_require_list.length > 0">
                                    <span class="buyer-s" v-for="i in item.browse_require_list" :key="i">
                                        {{ util.formatBrowse(i) }}
                                    </span>
                                </template>
                            </div>
                        </a-col>
                    </a-row>
                </a-col>
            </a-row>
            <div class="flex-bt">
                <div>
                    <a-checkbox v-model="isChooseAll" @change="chooseAll">全选</a-checkbox>
                    <a-button size="small" @click="showDelAllConfirm">批量删除</a-button>
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
            model_ids: [],
            modelIds: [], //所有id
            isChooseAll: false,
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
        updateBalance() {
            return this.$store.state.user.updateBalance
        },
    },
    mounted() {
        this.getTableList()
    },
    methods: {
        // 判断是否选择
        isInModels(id) {
            return this.model_ids.indexOf(id) >= 0 ? true : false
        },
        // 添加选择
        toggleModels(id) {
            if (this.isInModels(id)) {
                let index = _.findIndex(this.model_ids, (v) => v == id)
                this.model_ids.splice(index, 1)
            } else {
                this.model_ids.push(id)
            }
            this.isAll()
        },
        // 判断是否全选
        isAll() {
            let has = true
            _.each(this.modelIds, (v) => {
                if (this.model_ids.indexOf(v) == -1) {
                    has = false
                    return
                }
            })
            this.isChooseAll = has
        },
        // 全选
        chooseAll() {
            if (this.isChooseAll) {
                this.model_ids = this.modelIds
            } else {
                this.model_ids = []
            }
        },
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
            api.modelList(params).then((res) => {
                this.spinning = false
                if (res.success) {
                    this.dataList = res.data.list
                    this.pagination.total = res.data.total
                    this.getAllModelIdsArr()
                }
            })
        },
        // 获取所有列表id
        getAllModelIdsArr() {
            let modelIdsArr = []
            _.each(this.dataList, (v) => {
                modelIdsArr.push(v.id)
            })
            this.modelIds = modelIdsArr
        },
        // 活动详情
        toDetail() {
            this.$router.push({ name: 'activityDetail', query: { id: 222 } })
        },
        // 复制 生成活动
        showCopyConfirm(item) {
            this.$confirm({
                title: '',
                content: '确定复制该活动?点击确定去发布活动',
                okText: '确定',
                okType: 'primary',
                cancelText: '取消',
                onOk: () => {
                    console.log('OK')
                    if (this.spinning) return
                    this.spinning = true
                    api.copyModel({ id: item.id }).then((res) => {
                        this.spinning = false
                        if (res.success) {
                            let newId = res.data
                            this.$router.push({ name: 'step2', query: { id: newId } })
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
                title: '确定删除',
                okText: '确定',
                okType: 'primary',
                cancelText: '取消',
                onOk: () => {
                    console.log('OK')
                    // 请求刷新页面
                    api.deleteModel({ model_id: item.id }).then((res) => {
                        if (res.success) {
                            this.$message.success('删除成功')
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
        showDelAllConfirm() {
            if (this.model_ids.length <= 0) return this.$message.warning('请选择要删除的模版')
            this.$confirm({
                title: '确定删除选择的模版吗?',
                okText: '确定',
                okType: 'primary',
                cancelText: '取消',
                onOk: () => {
                    console.log('OK')
                    // 请求刷新页面
                    let model_ids = this.model_ids.join()
                    api.batchDeleteModel({ model_ids: model_ids }).then((res) => {
                        if (res.success) {
                            this.$message.success('删除成功')
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
    },
}
</script>

<style lang="less" scoped></style>
