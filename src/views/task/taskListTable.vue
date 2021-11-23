<template>
    <!-- 已发布任务列表 -->
    <div class="activeListTable-container">
        <a-spin :spinning="spinning">
            <div class="table-box">
                <a-row class="row-hd">
                    <a-col :xs="4">店铺信息</a-col>
                    <a-col :xs="4">活动类型</a-col>
                    <a-col :xs="2">垫付货款</a-col>
                    <a-col :xs="2">任务赏金</a-col>
                    <a-col :xs="2">下单数量</a-col>
                    <a-col :xs="4">活动摘要</a-col>
                    <a-col :xs="3">买家昵称</a-col>
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
                        <div class="rt-btn">
                            <span v-if="item.status != 7">淘宝编号:{{ item.taobao_ordersn }}</span>
                            <span v-if="item.status == 7" class="c-primary pointer" @click="deleteTask(item)">
                                <a-icon type="delete"></a-icon> 删除任务</span
                            >
                            <!-- 不同颜色标记 -->
                            <img
                                v-if="item.flag_type == 0"
                                src="../../assets/images/activity/sign_gray.png"
                                class="sign-icon"
                                @click="signModal(item)"
                            />
                            <img
                                v-if="item.flag_type === 1"
                                src="../../assets/images/activity/sign_red.png"
                                class="sign-icon"
                                @click="signModal(item)"
                            />
                            <img
                                v-if="item.flag_type === 2"
                                src="../../assets/images/activity/sign_yel.png"
                                class="sign-icon"
                                @click="signModal(item)"
                            />
                            <img
                                v-if="item.flag_type === 3"
                                src="../../assets/images/activity/sign_green.png"
                                class="sign-icon"
                                @click="signModal(item)"
                            />
                            <img
                                v-if="item.flag_type === 4"
                                src="../../assets/images/activity/sign_blue.png"
                                class="sign-icon"
                                @click="signModal(item)"
                            />
                            <img
                                v-if="item.flag_type === 5"
                                src="../../assets/images/activity/sign_pink.png"
                                class="sign-icon"
                                @click="signModal(item)"
                            />
                        </div>
                    </a-col>
                    <a-col class="middle">
                        <a-row type="flex" align="middle">
                            <a-col class="col-td" :xs="4">
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
                            </a-col>
                            <a-col class="col-td" :xs="4">
                                <div class="ac-type">
                                    淘宝/天猫{{ item.activity_type == 0 ? '普通' : '优质' }}试用活动
                                    <span :class="['ac-repay', { blue: item.back_type == 1 }, { red: item.back_type == 0 }]">{{
                                        item.back_type == 1 ? '商家返款' : '平台返款'
                                    }}</span>
                                </div>
                                <!-- <div class="ac-type">淘宝/天猫优质试用活动 <span class="ac-repay red">平台返款</span></div> -->
                            </a-col>
                            <a-col class="col-td" :xs="2">
                                <div>¥{{ item.pay_amount }}</div>
                                <v-tooltip placement="bottom">
                                    <template slot="content">买家实付金额与垫付金额不一致</template>
                                </v-tooltip>
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
                                <div>{{ item.taobao_nickname }}</div>
                                <div class="flexct jus-ct" v-if="item.taobao_level_num">
                                    <img
                                        :src="BASE_URL + item.taobao_img"
                                        class="level-icon"
                                        v-for="i in item.taobao_level_num"
                                        :key="i"
                                    />
                                </div>
                            </a-col>
                            <a-col class="col-td" :xs="3">
                                <!-- 状态 -->
                                <div>{{ item.status | format_status }}</div>
                                <div class="mt-5">
                                    <span class="pointer c-primary" @click="toDetail(item)">详情</span>
                                </div>
                                <div class="flex-ct">
                                    <!-- 待发货 -->
                                    <a-button
                                        v-if="item.status == 2"
                                        type="primary"
                                        size="small"
                                        class="topay pointer mr-10"
                                        @click="toDelivery(item)"
                                        >发货</a-button
                                    >
                                    <a-button
                                        :disabled="item.is_bounty == 1"
                                        class="size-12"
                                        v-if="item.status == 2"
                                        size="small"
                                        @click="confirmSanjin(item)"
                                        >{{ item.is_bounty == 1 ? '已发放赏金' : '确认无误' }}</a-button
                                    >
                                    <!-- 待返款 -->
                                    <a-button
                                        v-if="item.status == 4"
                                        type="primary"
                                        size="small"
                                        class="topay pointer"
                                        @click="toRefund(item)"
                                        >返款</a-button
                                    >
                                </div>
                            </a-col>
                        </a-row>
                    </a-col>
                </a-row>
                <div class="flex-bt">
                    <div>
                        <a-checkbox v-model="isChooseAll" @change="chooseAll">全选</a-checkbox>
                        <a-button size="small" class="mr-10" @click="signAllEvent">批量标记</a-button>
                        <!-- <a-button size="small">淘客检测</a-button> -->
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
        <!-- 编辑小红旗标志 -->
        <a-modal v-model="signVisible" title="编辑标记" @ok="editSignEvent" :closable="false" class="sign-modal">
            <div class="sign-modal-content">
                <a-table
                    :rowKey="(record) => record.id"
                    :columns="columns"
                    :data-source="dataSource"
                    style="max-height:400px;overflow:auto"
                >
                    <a slot="status" slot-scope="text">{{ text | format_status }}</a>
                </a-table>
                <div class="mt-20">
                    <span class="size-13 mr-10">标记:</span>
                    <a-radio-group name="radioGroup" :default-value="0" v-model="sign_Info.flag_type">
                        <a-radio :value="0"><img src="../../assets/images/activity/sign_gray.png" class="sign-icon" /> </a-radio>
                        <a-radio :value="1"><img src="../../assets/images/activity/sign_red.png" class="sign-icon" /> </a-radio>
                        <a-radio :value="2"><img src="../../assets/images/activity/sign_yel.png" class="sign-icon" /> </a-radio>
                        <a-radio :value="3"><img src="../../assets/images/activity/sign_green.png" class="sign-icon" /> </a-radio>
                        <a-radio :value="4"><img src="../../assets/images/activity/sign_blue.png" class="sign-icon" /> </a-radio>
                        <a-radio :value="5"><img src="../../assets/images/activity/sign_pink.png" class="sign-icon" /> </a-radio>
                    </a-radio-group>
                </div>
                <div class="mt-20">
                    <span class="size-13 mr-10">标记信息:</span>
                    <a-textarea class="sign-textarea" v-model="sign_Info.remark"></a-textarea>
                </div>
            </div>
        </a-modal>
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
            signVisible: false, //显示红旗弹窗
            columns: [
                { title: '任务编号', dataIndex: 'order_code', align: 'center' },
                { title: '淘宝编号', dataIndex: 'taobao_ordersn', align: 'center' },
                { title: '买手账号', dataIndex: 'taobao_nickname', align: 'center' },
                { title: '任务金额', dataIndex: 'pay_amount', align: 'center' },
                { title: '任务状态', dataIndex: 'status', align: 'center', scopedSlots: { customRender: 'status' } },
            ],
            // 标记列表
            dataSource: [{}],
            // 标记类型
            sign_Info: {
                flag_type: 0, //0-4
                remark: '',
            },

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
        // 标记所有
        signAllEvent() {
            if (this.selected_ids.length == 0) return this.$message.warning('请选择要标记的列表')
            this.dataSource = _.filter(this.dataList, (v) => {
                let index = _.findIndex(this.selected_ids, (id) => id == v.id)
                return index >= 0
            })
            console.log(this.dataSource)
            this.signVisible = true
        },
        // 标记 显示弹窗 不同颜色小红旗
        signModal(item) {
            this.signVisible = true
            this.sign_Info = {
                flag_type: item.flag_type,
                remark: item.remark,
            }
            this.dataSource = [item]
        },
        // 标记 确定
        editSignEvent() {
            if (this.dataSource.length == 1) {
                if (!this.sign_Info.remark) return this.$message.warning('请输入标记信息')
                if (this.isDisabled) return
                this.isDisabled = true
                api.markOrder({
                    order_id: this.dataSource[0]['id'],
                    flag_type: this.sign_Info.flag_type,
                    remark: this.sign_Info.remark,
                }).then((res) => {
                    this.isDisabled = false
                    if (res.success) {
                        this.$message.success('标记成功')
                        this.refreshTable()
                        this.signVisible = false
                        this.sign_Info = {
                            flag_type: 0,
                            remark: '',
                        }
                    }
                })
            } else if (this.dataSource.length >= 2) {
                console.log(this.selected_ids.join(','))
                api.batchMarkOrder({
                    order_ids: this.selected_ids.join(','),
                    flag_type: this.sign_Info.flag_type,
                    remark: this.sign_Info.remark,
                }).then((res) => {
                    this.isDisabled = false
                    if (res.success) {
                        this.$message.success('标记成功')
                        this.refreshTable()
                        this.signVisible = false
                        this.isChooseAll = false
                        this.chooseAll()
                        this.sign_Info = {
                            flag_type: 0,
                            remark: '',
                        }
                    }
                })
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
        //删除任务
        deleteTask(item) {
            this.$confirm({
                title: '确定删除此任务?',
                content: '删除后不可恢复',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk: () => {
                    console.log('OK')
                    api.deleteMission({ order_id: item.id }).then((res) => {
                        if (res.success) {
                            this.refreshTable()
                        }
                    })
                },
            })
        },
        // 确认无误发放赏金
        confirmSanjin(item) {
            this.$confirm({
                title: '提示?',
                content: '确定订单没问题发放赏金吗',
                okText: '确定',
                okType: 'primary',
                cancelText: '取消',
                onOk: () => {
                    console.log('OK')
                    api.orderConfirmed({ order_id: item.id }).then((res) => {
                        if (res.success) {
                            this.refreshTable()
                        }
                    })
                },
            })
        },
        // 发货
        toDelivery(item) {
            this.$router.push({ name: 'delivery', query: { id: item.id } })
        },
        // 返款
        toRefund(item) {
            this.$router.push({ name: 'taskDetail', query: { id: item.id } })
        },
        // 任务详情
        toDetail(item) {
            this.$router.push({ name: 'taskDetail', query: { id: item.id } })
        },
    },
}
</script>

<style lang="less" scoped></style>
