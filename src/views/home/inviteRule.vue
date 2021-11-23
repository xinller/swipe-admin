<template>
    <!-- 邀请赚米 -->
    <div class="invite-container">
        <a-row type="flex" justify="center">
            <a-col :xs="24" :md="18" :lg="16">
                <div class="page-title">邀请等级： {{ ruleList.level_name }}</div>

                <a-row :gutter="[16, 16]">
                    <a-col :xs="12" :md="8">
                        <div class="invite-team">
                            <img src="../../assets/images/invite/user1.png" class="icon" />
                            <a-tooltip placement="rightBottom" class="tooltip">
                                <template slot="title"> 徒弟发布首单，您可获得的奖励</template>
                                <span class="mr-5">激活徒弟奖励</span>
                                <a-icon type="question-circle" />
                            </a-tooltip>
                            <div class="mt-25">
                                <span class="num">{{ ruleList.return_amount }}</span
                                >鲸币
                            </div>
                        </div>
                    </a-col>
                    <a-col :xs="12" :md="8">
                        <div class="invite-team">
                            <img src="../../assets/images/invite/user1.png" class="icon" />
                            <a-tooltip placement="rightBottom" class="tooltip">
                                <template slot="title">徒弟每发布一单任务，您可获得的奖励</template>
                                <span class="mr-5">邀请徒弟提成</span>
                                <a-icon type="question-circle" />
                            </a-tooltip>
                            <div class="mt-25">
                                <span class="num">{{ ruleList.bind_account }}%</span>
                            </div>
                        </div>
                    </a-col>
                    <a-col :xs="12" :md="8">
                        <div class="invite-team">
                            <img src="../../assets/images/invite/user1.png" class="icon" />
                            <a-tooltip placement="rightBottom" class="tooltip">
                                <template slot="title">徒孙每发布一单任务，您可获得的奖励 </template>
                                <span class="mr-5">邀请徒孙提成 </span>
                                <a-icon type="question-circle" />
                            </a-tooltip>
                            <div class="mt-25">
                                <span class="num">{{ ruleList.active_amount }}%</span>
                            </div>
                        </div>
                    </a-col>
                </a-row>
                <a-table
                    class="mt-30"
                    :columns="dataColumns"
                    :data-source="dataSource"
                    :rowKey="(record) => record.id"
                    :pagination="false"
                ></a-table>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import * as api from '@/api/api'
export default {
    name: 'inviteRule',
    components: {},
    data() {
        return {
            dataColumns: [
                {
                    title: '邀请等级',
                    dataIndex: 'level_name',
                    key: 'level_name',
                    fixed: 'left',
                    align: 'center',
                },
                {
                    title: '徒弟激活数',
                    dataIndex: 'order_num',
                    key: 'order_num',
                    align: 'center',
                },
                {
                    title: '徒弟激活奖励',
                    dataIndex: 'return_amount',
                    key: 'return_amount',
                    align: 'center',
                },
                {
                    title: '邀请徒弟提成',
                    dataIndex: 'bind_account',
                    key: 'bind_account',
                    align: 'center',
                },
                {
                    title: '邀请徒孙提成',
                    dataIndex: 'active_amount',
                    key: 'active_amount',
                    align: 'center',
                },
            ],
            dataSource: [],
            ruleList: {},
        }
    },
    mounted() {
        this.rewardRule()
    },
    methods: {
        rewardRule() {
            api.rewardRule({}).then((res) => {
                if (res.success) {
                    this.ruleList = res.data.data
                    this.dataSource = res.data.list
                }
            })
        },
    },
}
</script>

<style lang="less" scoped></style>
