<template>
    <!-- 用户-账号信息 -->
    <div class="user-container">
        <a-spin :spinning="spinning">
            <div class="page-title">基本信息</div>
            <div class="user-info">
                <div class="size-16">{{ userDetail.phone }}</div>
                <div class="size-14 mt-20">注册时间： {{ userDetail.register_time }}</div>
                <div class="size-14 mt-5">商家码： {{ userInfo.invite_code }}</div>
                <div class="size-14 mt-5">
                    商家QQ： {{ userDetail.qq_number }}
                    <a-icon type="edit" class="c-primary" @click="showEditModal('qq_number')" />
                </div>
                <div class="size-14 mt-5">
                    紧急联系人：{{ userDetail.emergency_contact
                    }}<a-icon type="edit" class="c-primary" @click="showEditModal('emergency_contact')" />
                </div>

                <div class="flexct mt-40">
                    <span>登录密码</span>
                    <router-link :to="{ name: 'editPass' }" class="ml-50">修改</router-link>
                </div>
                <div class="flexct mt-20 line-b pb-15">
                    <span>支付密码</span>
                    <router-link :to="{ name: 'editPaypass' }" class="ml-50">修改</router-link>
                </div>
            </div>
            <a-row>
                <a-col :xs="24" :md="12">
                    <div class="page-title pt-30">店铺列表</div>
                    <div class="size-12 mt-10">温馨提示 :店铺请填写自己店铺首页地址，不可添加其他卖家的地址，否则会被处罚</div>
                </a-col>
                <a-col :xs="24" :md="12" class="flexct jus-ed pt-30 mt-20">
                    <div class="btn-link mr-10 mt-10" @click="showEditModal('link', '店铺关联设置')">
                        关联设置 <span v-if="userDetail.is_relate == 1">【{{ userDetail.relate_days }}天】</span>
                        <span v-if="userDetail.is_relate == 0">【未关联】</span>
                    </div>
                    <div class="btn-link mt-10" @click="toAddStore">添加店铺</div>
                </a-col>
            </a-row>

            <!-- 店铺列表 -->
            <a-table
                class="mt-30"
                :columns="columns"
                :rowKey="(record) => record.id"
                :data-source="dataSource"
                :pagination="pagination"
                @change="tableChange"
                :scroll="{ x: 1000 }"
            >
                <span slot="customTitle">
                    关联状态
                    <v-tooltip>
                        <template slot="content"
                            >店铺关联是指在派单中，将你所有添加的店铺关联在一起，粉丝只要在你其中一个店铺下接过活动，那么在试用间隔时间内无法再到关联的其他店铺接活动。默认开启，避免了商家多个店铺的情况被同个粉丝接活动。
                        </template>
                    </v-tooltip>
                </span>
                <span slot="qycustomTitle">
                    启用状态
                    <v-tooltip>
                        <template slot="content"
                            >启用状态开启时，发布活动时在店铺列表中会显示该店铺，状态关闭时则在列表中不会显示该店铺。
                        </template>
                    </v-tooltip>
                </span>
                <span slot="intervals" slot-scope="text, record" v-if="userDetail.is_relate == 0"
                    >{{ text ? text : 30 }}天 <a-icon type="edit" class="c-primary" @click="setDays(record)"
                /></span>
                <span slot="platform" slot-scope="text">{{ text == 0 ? '淘宝' : text == 1 ? '京东' : '拼多多' }}</span>
                <span slot="status" slot-scope="text">
                    <span class="c-primary" v-if="text == 0">未审核</span>
                    <span class="c-green" v-if="text == 1">审核通过</span>
                    <span class="c-red" v-if="text == 2">审核拒绝</span>
                </span>
                <a slot="related"><a-switch disabled :checked="userDetail.is_relate == 1 ? true : false"></a-switch></a>
                <a slot="is_open" slot-scope="text, record"
                    ><a-switch @change="setStoreOpen($event, record)" :checked="text == 1 ? true : false"></a-switch
                ></a>
                <a-button-group slot="action" slot-scope="text, record">
                    <a-button type="primary" @click="toEdit(record)">修改</a-button>
                    <a-button @click="toDel(record)">删除</a-button>
                </a-button-group>
            </a-table>
        </a-spin>

        <!-- modal -->
        <a-modal v-model="visible" :closable="false" :title="modal_title" :footer="null" :width="400">
            <div class="payment-modal">
                <template v-if="modal_type == 'qq_number'">
                    <div class="txt-ct"><img src="../../assets/images/user/qq.png" class="avatar" /></div>
                    <div class="size-16">修改会员QQ</div>
                    <a-input class="mt-20" v-model="modal_val"></a-input>
                </template>
                <template v-if="modal_type == 'emergency_contact'">
                    <div class="txt-ct"><img src="../../assets/images/user/head.png" class="avatar" /></div>
                    <div class="size-16">修改为紧急联系人</div>
                    <div class="size-12 mt-10 mb-10">亲，为了方便平台第一时间联系到您，平台邀请您设置紧急联系人号码</div>
                    <a-input type="number" v-model="modal_val"></a-input>
                </template>
                <template v-if="modal_type == 'link'">
                    <div class="size-14 mt-10">
                        店铺关联是指在派单中，将你所有添加的店铺关联在一起，粉丝只要在你其中一个店铺下接过活动，那么在试用间隔时间内无法再到关联的其他店铺接活动。默认开启，避免了商家多个店铺的情况被同个粉丝接活动。
                    </div>
                    <a-row type="flex" align="middle" class="mt-20">
                        <a-col class="mr-5"
                            >关联状态 <a-switch @change="changeSet" :checked="is_set == 1 ? true : false"></a-switch
                        ></a-col>
                        <a-col class="flex1" v-if="is_set">
                            <a-input v-model="days" placeholder="请输入关联店铺的试用间隔">
                                <span slot="addonAfter">天</span>
                            </a-input>
                        </a-col>
                    </a-row>
                </template>

                <template v-if="modal_type == 'setDays'">
                    <div class="size-14 mt-10">
                        限制时间指用户第一次接活动与第二次接活动之间的时间间隔，不同类目的商家，用户的平均回购时间都不同，适当比例的用户回购对店铺和商品权重有很大好处，所以我们开放了商家店铺对用户的间隔时间设置，大家可以根据自己类目和店铺的需要在规定区间内设置。
                    </div>
                    <a-row type="flex" align="middle" class="mt-20">
                        <a-col :xs="24">
                            <a-input v-model="intervals" placeholder="请输入试用间隔">
                                <span slot="addonAfter">天</span>
                            </a-input>
                        </a-col>
                    </a-row>
                </template>
                <div class="flexct jus-ed mt-30">
                    <a-button class="mr-10" @click="visible = false">取消</a-button>
                    <a-button type="primary" @click="commitModal">确定提交</a-button>
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script>
import * as api from '@/api/api'
import { mapGetters } from 'vuex'
export default {
    name: 'index',
    data() {
        return {
            spinning: false,
            userDetail: {},
            columns: [],
            dataSource: [],
            pagination: {
                pageSize: 10, //每页条数
                pageSizeOptions: ['10', '20', '30', '40'],
                current: 1,
                total: 0,
                showSizeChanger: true,
                showQuickJumper: true,
            },
            visible: false,
            modal_type: 'qq',
            modal_title: '',
            modal_val: '',
            is_set: '', //1关联 0 未关联
            days: '', //关联天数
            intervals: '30', //间隔天数
            current_store: {},
        }
    },
    computed: {
        ...mapGetters(['userInfo']),
        pager() {
            if (this.pagination === false) return false
            let option = {
                current: 1,
                total: 0,
                pageSize: 10,
            }
            return _.merge({}, option, this.pagination)
        },
    },
    mounted() {
        console.log(this.userInfo)
        this.getUserDetail()
        this.getTableList()
        this.getColumns()
    },
    methods: {
        getColumns() {
            if (this.userDetail.is_relate == 0) {
                this.columns = [
                    { dataIndex: 'platform', title: '平台类型', scopedSlots: { customRender: 'platform' } },
                    { dataIndex: 'store_name', title: '店铺名称/店铺ID', align: 'center' },
                    { dataIndex: 'status', title: '审核状态', align: 'center', scopedSlots: { customRender: 'status' } },
                    {
                        dataIndex: 'intervals',
                        title: '试用间隔时间设置',
                        align: 'center',
                        scopedSlots: { customRender: 'intervals' },
                    },
                    {
                        dataIndex: 'related',
                        align: 'center',
                        slots: { title: 'customTitle' },
                        scopedSlots: { customRender: 'related' },
                    },
                    {
                        dataIndex: 'is_open',
                        align: 'center',
                        slots: { title: 'qycustomTitle' },
                        scopedSlots: { customRender: 'is_open' },
                    },
                    { dataIndex: 'action', title: '操作', align: 'center', scopedSlots: { customRender: 'action' } },
                ]
            } else {
                this.columns = [
                    { dataIndex: 'platform', title: '平台类型', scopedSlots: { customRender: 'platform' } },
                    { dataIndex: 'store_name', title: '店铺名称/店铺ID', align: 'center' },
                    { dataIndex: 'status', title: '审核状态', align: 'center', scopedSlots: { customRender: 'status' } },
                    {
                        dataIndex: 'related',
                        align: 'center',
                        slots: { title: 'customTitle' },
                        scopedSlots: { customRender: 'related' },
                    },
                    {
                        dataIndex: 'is_open',
                        align: 'center',
                        slots: { title: 'qycustomTitle' },
                        scopedSlots: { customRender: 'is_open' },
                    },
                    { dataIndex: 'action', title: '操作', align: 'center', scopedSlots: { customRender: 'action' } },
                ]
            }
        },
        getUserDetail() {
            this.spinning = true
            api.getUserDetail().then((res) => {
                this.spinning = false
                if (res.success) {
                    this.userDetail = res.data
                    this.is_set = res.data.is_relate
                    this.getColumns()
                }
            })
        },
        getTableList(isReset) {
            this.spinning = true
            let params = {
                page: this.pager.current,
                rows: this.pager.pageSize,
            }
            if (isReset) {
                params.page = this.pager.current = 1
            }
            console.log('params', params)
            api.storeList(params).then((res) => {
                this.spinning = false
                if (res.success) {
                    this.dataSource = res.data.list
                    this.pagination.total = res.data.total
                }
            })
        },
        // 表格数据改变
        tableChange(pagination, filters, sorter, { currentDataSource }) {
            console.log('pagination', pagination)
            if (!_.isEmpty(pagination)) {
                this.pager.current = this.pagination.current = pagination.current
                this.pager.pageSize = this.pagination.pageSize = pagination.pageSize
                this.getTableList()
            }
        },
        // 弹窗操作显示
        showEditModal(type, title) {
            this.visible = true
            this.modal_type = type
            this.modal_title = title
        },
        // 添加店铺
        toAddStore() {
            this.$router.push({ name: 'addStore' })
        },
        // 修改店铺
        toEdit(record) {
            console.log('record', record)
            this.$router.push({ name: 'editStore', query: { id: record.id } })
        },
        // 删除
        toDel(record) {
            console.log('record', record)
            this.$confirm({
                title: '确定要删除该店铺吗?',
                content: '删除后不可恢复',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk: () => {
                    api.delStore({ id: record.id }).then((res) => {
                        if (res.success) {
                            this.$message.success(res.data || '删除成功')
                            this.getTableList(true)
                            this.getUserDetail()
                            this.modalRet()
                        }
                    })
                },
            })
        },
        setDays(record) {
            console.log('record', record)
            this.showEditModal('setDays', '试用间隔时间设置')
            this.current_store = record
        },
        // 修改用户信息
        commitModal() {
            if (this.modal_type == 'qq_number' || this.modal_type == 'emergency_contact') {
                // 修改信息
                if (!this.modal_val) return this.$message.warning('修改值不能为空')
                api.editUserInfo({ type: this.modal_type, val: this.modal_val }).then((res) => {
                    if (res.success) {
                        this.$message.success('修改成功')
                        this.modalRet()
                        this.getUserDetail()
                    }
                })
            } else if (this.modal_type == 'link') {
                // 设置关联
                let param = {
                    is_set: this.is_set,
                }
                if (this.is_set == 1) {
                    if (!this.days) return this.$message.warning('请输入关联店铺的试用间隔')
                    param.days = this.days
                }
                api.releateSet(param).then((res) => {
                    if (res.success) {
                        this.$message.success(res.data || '设置成功')
                        this.getTableList(true)
                        this.getUserDetail()
                        this.modalRet()
                    }
                })
            } else if (this.modal_type == 'setDays') {
                // 设置间隔
                if (!this.intervals) return this.$message.warning('请输入接单间隔时间')
                api.setStoreIntervals({ intervals: this.intervals, id: this.current_store.id }).then((res) => {
                    if (res.success) {
                        this.$message.success(res.data || '设置成功')
                        this.getTableList(true)
                        this.modalRet()
                    }
                })
            }
        },
        modalRet() {
            this.visible = false
            this.modal_val = ''
            this.current_store = {}
        },
        changeSet(value) {
            this.is_set = value ? 1 : 0
        },
        // 设置启用
        setStoreOpen(status, record) {
            api.setStoreOpen({ id: record.id, is_open: status ? 1 : 0 }).then((res) => {
                if (res.success) {
                    this.getTableList(true)
                    this.modalRet()
                }
            })
        },
    },
}
</script>

<style lang="less" scoped></style>
