<template>
    <!-- 邀请赚米 -->
    <a-spin :spinning="spinning" class="invite-container">
        <a-row>
            <a-col :span="24"><img src="../../assets/images/invite/banner.png" class="invite-banner"/></a-col>
        </a-row>
        <a-row :gutter="[16, 16]" class="pt-40" type="flex" align="middle">
            <a-col :xs="24" :md="24" :lg="12" class="mb-25">
                <div class="invite-rule">
                    <div class="rule-title">
                        奖励规则
                        <router-link :to="{ name: 'inviteRule' }" class="more">获取更高奖励规则</router-link>
                    </div>
                    <p class="rule-text">
                        1、邀请好友成为您徒弟并发布首单，您可获得
                        <span class="num" v-if="ruleData.rule_data">{{ ruleData.rule_data.return_amount }}</span> 鲸币奖励。
                    </p>
                    <p class="rule-text">
                        2、徒弟每发布一个活动，您可以得到
                        <span class="num" v-if="ruleData.rule_data">{{ ruleData.rule_data.bind_account }}% </span> 鲸币奖励。
                    </p>
                    <p class="rule-text">
                        3、徒孙每发布一个活动，您可以得到
                        <span class="num" v-if="ruleData.rule_data">{{ ruleData.rule_data.active_amount }}% </span> 鲸币奖励。
                    </p>
                    <div class="invite-link">
                        <span class="notwrap">{{ my_url }}</span>
                        <span class="btn-link" v-clipboard:copy="my_url" v-clipboard:success="onCopy" v-clipboard:error="onError"
                            >复制我的专属链接</span
                        >
                    </div>
                    <div class="size-12 mt-10">
                        温馨提示：通过您的推荐链接进入网站注册的人都计算在您的推荐人数
                    </div>
                </div>
            </a-col>
            <a-col :xs="24" :md="24" :lg="12">
                <a-row :gutter="[16, 16]">
                    <a-col :xs="12" :md="6" :lg="12" :xxl="6">
                        <div class="invite-team">
                            <img src="../../assets/images/invite/user1.png" class="icon" />
                            <a-tooltip placement="rightBottom" class="tooltip">
                                <template slot="title"> 你直接邀请的注册人数</template>
                                <span class="mr-5">徒弟注册数</span>
                                <a-icon type="question-circle" />
                            </a-tooltip>
                            <div class="mt-25">
                                <span class="num">{{ ruleData.push_count }}</span
                                >人
                            </div>
                        </div>
                    </a-col>
                    <a-col :xs="12" :md="6" :lg="12" :xxl="6">
                        <div class="invite-team">
                            <img src="../../assets/images/invite/user1.png" class="icon" />
                            <a-tooltip placement="rightBottom" class="tooltip">
                                <template slot="title"> 你徒弟邀请的注册人数</template>
                                <span class="mr-5">徒孙注册数</span>
                                <a-icon type="question-circle" />
                            </a-tooltip>
                            <div class="mt-25">
                                <span class="num">{{ ruleData.grand_count }}</span
                                >人
                            </div>
                        </div>
                    </a-col>
                    <a-col :xs="12" :md="6" :lg="12" :xxl="6">
                        <div class="invite-team">
                            <img src="../../assets/images/invite/user1.png" class="icon" />
                            <a-tooltip placement="rightBottom" class="tooltip">
                                <template slot="title">徒弟成功发布一次活动且完成 </template>
                                <span class="mr-5">徒弟激活数</span>
                                <a-icon type="question-circle" />
                            </a-tooltip>
                            <div class="mt-25">
                                <span class="num">{{ ruleData.push_active_count }}</span
                                >人
                            </div>
                        </div>
                    </a-col>
                    <a-col :xs="12" :md="6" :lg="12" :xxl="6">
                        <div class="invite-team">
                            <img src="../../assets/images/invite/user1.png" class="icon" />
                            <a-tooltip placement="rightBottom" class="tooltip">
                                <template slot="title">徒孙成功发布一次活动且完成 </template>
                                <span class="mr-5">徒孙激活数</span>
                                <a-icon type="question-circle" />
                            </a-tooltip>
                            <div class="mt-25">
                                <span class="num">{{ ruleData.grand_active_count }}</span
                                >人
                            </div>
                        </div>
                    </a-col>
                </a-row>
            </a-col>
        </a-row>

        <div class="award-detail">
            <div class="award-title">奖励明细</div>
            <div class="award-row">
                <div class="award-col">
                    <p class="num">{{ rewardData.sum }}</p>
                    <p class="text">奖励总数</p>
                </div>
                <div class="award-col">
                    <p class="num">{{ rewardData.active }}</p>
                    <p class="text">激活奖励</p>
                </div>
                <div class="award-col">
                    <p class="num">{{ rewardData.commission }}</p>
                    <p class="text">活动提成</p>
                </div>
            </div>
            <div class="award-tip">
                <a-icon type="question-circle" />
                奖励鲸币在任务完成时结算，即在活动完成前不结算。
            </div>
        </div>
        <tableList :columns="dataColumns" :data-source="dataSource"></tableList>
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
</template>

<script>
import * as api from '@/api/api'
import tableList from '../../components/business/tableList'
import { mapGetters } from 'vuex'
export default {
    name: 'invite',
    components: {
        tableList,
    },
    data() {
        return {
            spinning: false,
            dataColumns: [
                // {
                //     title: '奖励类型',
                //     dataIndex: 'type',
                //     key: 'type',
                //     fixed: 'left',
                //     align: 'center',
                // },
                {
                    title: '奖励类型',
                    dataIndex: 'remark',
                    key: 'remark',
                    align: 'center',
                },
                {
                    title: '奖励金额',
                    dataIndex: 'amount',
                    key: 'amount',
                    align: 'center',
                },
                {
                    title: '奖励时间',
                    dataIndex: 'update_time',
                    key: 'update_time',
                    align: 'center',
                },
            ],
            dataSource: [],
            ruleData: '',
            my_url: '',
            rewardData: '',
            pagination: {
                pageSize: 10, //每页条数
                pageSizeOptions: ['10', '20', '30', '40'],
                current: 1,
                showSizeChanger: true,
                showQuickJumper: true,
                total: 0,
            },
        }
    },
    computed: {
        invite_code() {
            return this.$store.state.user.userInfo.invite_code
        },

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
        this.getInviteUrl()

        this.inviteInfo()
        this.getTableList()
    },
    methods: {
        getInviteUrl() {
            let env = ''
            switch (process.env.VUE_APP_ENV) {
                case 'build':
                    env = 'invite'
                    break
                case 'dev':
                    env = 'inviteTest'
                    break
                case 'buildTest':
                    env = 'inviteTest'
                    break
            }
            this.my_url = this.appConfig.BASE_URL[env] + '#/register?invite_code=' + this.invite_code
        },
        onCopy: function(e) {
            this.$message.success('复制成功')
        },
        onError: function(e) {
            this.$message.success('复制失败')
        },
        inviteInfo() {
            api.inviteInfo({}).then((res) => {
                if (res.success) {
                    this.ruleData = res.data
                }
            })
        },
        refreshTable() {
            this.getTableList(true)
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
            }
            if (isReset) {
                this.pagination.current = 1
                params.page = this.pager.current = 1
            }
            api.rewardList(params).then((res) => {
                this.spinning = false
                if (res.success) {
                    this.rewardData = res.data
                    this.dataSource = res.data.list
                    this.pagination.total = res.data.total
                }
            })
        },
    },
}
</script>

<style lang="less" scoped></style>
