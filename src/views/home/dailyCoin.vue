<template>
    <!-- 每日领鲸币 -->
    <a-spin :spinning="spinning" class="dailyCoin-container">
        <div class="title">消保权益说明</div>
        <div class="tb-card" v-if="v1">
            <a-row class="tb-list" type="flex" align="middle">
                <a-col span="4" class="tb-item">消保等级</a-col>
                <a-col span="5" class="tb-item">V1消保</a-col>
                <a-col span="5" class="tb-item">V2消保</a-col>
                <a-col span="5" class="tb-item">V3消保</a-col>
                <a-col span="5" class="tb-item">特殊消保</a-col>
            </a-row>
            <a-row class="tb-list" type="flex" align="middle">
                <a-col span="4" class="tb-item">绑定店铺数量</a-col>
                <a-col span="5" class="tb-item">{{ v1.bind_num }}</a-col>
                <a-col span="5" class="tb-item">{{ v2.bind_num }}</a-col>
                <a-col span="5" class="tb-item">{{ v3.bind_num }}</a-col>
                <a-col span="5" class="tb-item">{{ v4.bind_num }}</a-col>
            </a-row>
            <a-row class="tb-list" type="flex" align="middle">
                <a-col span="4" class="tb-item">会员功能</a-col>
                <a-col span="5" class="tb-item">{{ v1.is_member == 0 ? '无' : '有' }}</a-col>
                <a-col span="5" class="tb-item">{{ v2.is_member == 0 ? '无' : '有' }}</a-col>
                <a-col span="5" class="tb-item">{{ v3.is_member == 0 ? '无' : '有' }}</a-col>
                <a-col span="5" class="tb-item">{{ v4.is_member == 0 ? '无' : '有' }}</a-col>
            </a-row>
            <a-row class="tb-list" type="flex" align="middle">
                <a-col span="4" class="tb-item">
                    每日奖励
                    <a-tooltip placement="top">
                        <template slot="title">
                            <span>用户每日可领取的奖励，消保等级越高，领取的奖励越多。</span>
                        </template>
                        <a-icon type="question-circle" class="c-gray" />
                    </a-tooltip>
                </a-col>
                <a-col span="5" class="tb-item">{{ v1.daily_reward == 0 ? '无' : '有' }}</a-col>
                <a-col span="5" class="tb-item">{{ v1.daily_reward == 0 ? '无' : '有' }}</a-col>
                <a-col span="5" class="tb-item">{{ v1.daily_reward == 0 ? '无' : '有' }}</a-col>
                <a-col span="5" class="tb-item">{{ v1.daily_reward == 0 ? '无' : '有' }}</a-col>
            </a-row>
            <a-row class="tb-list" type="flex" align="middle">
                <a-col span="4" class="tb-item">退款包赔</a-col>
                <a-col span="5" class="tb-item"
                    >配合售后处理赔{{ v1.refund_guarantee }}%，未配合直接退款赔{{ v1.refund_undo }}%，客单价{{
                        v1.refund_proce
                    }}以内</a-col
                >
                <a-col span="5" class="tb-item"
                    >配合售后处理赔{{ v2.refund_guarantee }}%，未配合直接退款赔{{ v2.refund_undo }}%，客单价{{
                        v2.refund_proce
                    }}以内</a-col
                >
                <a-col span="5" class="tb-item"
                    >配合售后处理赔{{ v3.refund_guarantee }}%，未配合直接退款赔{{ v3.refund_undo }}%，客单价{{
                        v3.refund_proce
                    }}以内</a-col
                >
                <a-col span="5" class="tb-item">注册送1个月</a-col>
            </a-row>
        </div>
        <div class="title pt-30">开通消保</div>
        <div class="comtb-container">
            <div class="tabs-container">
                <a-tabs type="card" @change="changeTab">
                    <a-tab-pane key="1" tab="V1消保"></a-tab-pane>
                    <a-tab-pane key="2" tab="V2消保"></a-tab-pane>
                    <a-tab-pane key="3" tab="V3消保"></a-tab-pane>
                    <a-tab-pane key="4" tab="特殊消保"></a-tab-pane>
                </a-tabs>
            </div>
            <a-row class="xb-list" :gutter="[16, 24]" v-if="activeKey">
                <a-col :xs="12" :lg="6" @click="chooseKey('month_one')">
                    <div :class="['xb-item', { active: field == 'month_one' }]">
                        <div class="price">
                            <span class="left">{{ activeKey.month_one }}</span>
                        </div>
                        <div class="text">
                            每日领取 <span class="c-primary">{{ activeKey.daily_reward }}</span> 鲸币
                        </div>
                        <div class="time">1个月</div>
                    </div>
                </a-col>
                <a-col :xs="12" :lg="6" @click="chooseKey('month_three')" v-if="tab_key != 4">
                    <div :class="['xb-item', { active: field == 'month_three' }]">
                        <div class="price">
                            <span class="left">{{ activeKey.month_three }}</span>
                            <span class="right" v-if="format_zk(activeKey.month_three, 3) != 1">
                                {{ (format_zk(activeKey.month_three, 3) * 10).toFixed(2) }}折
                            </span>
                        </div>
                        <div class="text">
                            每日领取 <span class="c-primary">{{ activeKey.daily_reward }}</span> 鲸币
                        </div>
                        <div class="time">3个月</div>
                    </div>
                </a-col>
                <a-col :xs="12" :lg="6" @click="chooseKey('month_six')" v-if="tab_key != 4">
                    <div :class="['xb-item', { active: field == 'month_six' }]">
                        <div class="price">
                            <span class="left">{{ activeKey.month_six }}</span>
                            <span class="right" v-if="format_zk(activeKey.month_six, 6) != 1">
                                {{ (format_zk(activeKey.month_six, 6) * 10).toFixed(2) }}折
                            </span>
                        </div>
                        <div class="text">
                            每日领取 <span class="c-primary">{{ activeKey.daily_reward }}</span> 鲸币
                        </div>
                        <div class="time">6个月</div>
                    </div>
                </a-col>
                <a-col :xs="12" :lg="6" @click="chooseKey('month_twelve')" v-if="tab_key != 4">
                    <div :class="['xb-item', { active: field == 'month_twelve' }]">
                        <div class="price">
                            <span class="left">{{ activeKey.month_twelve }}</span>
                            <span class="right" v-if="format_zk(activeKey.month_twelve, 12) != 1">
                                {{ (format_zk(activeKey.month_twelve, 12) * 10).toFixed(2) }}折
                            </span>
                        </div>
                        <div class="text">
                            每日领取 <span class="c-primary">{{ activeKey.daily_reward }}</span> 鲸币
                        </div>
                        <div class="time">12个月</div>
                    </div>
                </a-col>
            </a-row>
            <div class="txt-ct">
                <a-button @click="commit" :loading="loading" :disabled="loading" type="primary" size="large" shape="round"
                    >确认开通</a-button
                >
            </div>
            <!-- <div class="xb-btn"><a-button type="primary" size="large">确认开通</a-button></div> -->
        </div>
    </a-spin>
</template>

<script>
import * as api from '@/api/api'
import { mapGetters } from 'vuex'
export default {
    name: 'dailyCoin',
    data() {
        return {
            spinning: false,
            loading: false,
            v1: '',
            v2: '',
            v3: '',
            v4: '',
            dataInfo: '',
            activeKey: '',
            field: '',
            tab_key: '',
        }
    },
    computed: {
        ...mapGetters(['updateBalance']),
    },
    mounted() {
        this.getConsumerInfo()
    },
    methods: {
        format_zk(amount, month) {
            if (this.activeKey.month_one == 0) return 0
            return amount / (this.activeKey.month_one * month)
        },
        getConsumerInfo() {
            this.spinning = true
            api.getConsumerInfo().then((res) => {
                this.spinning = false
                if (res.success) {
                    this.dataInfo = res.data
                    this.v1 = res.data[0]
                    this.v2 = res.data[1]
                    this.v3 = res.data[2]
                    this.v4 = res.data[3]
                    this.changeTab(1)
                }
            })
        },
        changeTab(key) {
            this.tab_key = key
            console.log('key', key)
            this.activeKey = this.dataInfo[key - 1]
        },
        chooseKey(key) {
            this.field = key
        },
        commit() {
            if (!this.field) return this.$message.warning('请选择')
            this.loading = true
            let param = {
                id: this.activeKey.id,
                field: this.field,
            }
            api.openConsumer(param).then((res) => {
                this.loading = false
                if (res.success) {
                    this.$message.success(res.data || '开通成功')
                    this.$store.commit('setUpdateBalance', !this.updateBalance)
                    this.field = ''
                }
            })
        },
    },
}
</script>

<style lang="less" scoped></style>
