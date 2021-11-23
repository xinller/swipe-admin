<template>
    <!-- 资金管理 -->
    <div class="common-container fund-container">
        <div class="page-title">资金管理</div>
        <a-row class="fund-wrap">
            <a-col :xs="12" :md="8">
                <div>
                    <span class="c-gray size-13">可用货款</span>
                    <v-tooltip>
                        <template slot="content">可用于支付活动本金，购买鲸币，支持提现。</template
                        ><template slot="tooltext"
                            ><img src="../../assets/images/task/ques-gray.png" class="ques-icon"
                        /></template>
                    </v-tooltip>
                </div>
                <div class="size-40 mt-10 c-black">{{ userBalance2 }}</div>
            </a-col>
            <a-col :xs="12" :md="16">
                <div>
                    <span class="c-gray size-13">鲸币账户</span>
                    <v-tooltip>
                        <template slot="content"
                            >可用于支付活动赏金，由商家按需购买，不支持退款和提现，只能通过发布活动消耗。</template
                        >
                        <template slot="tooltext"><img src="../../assets/images/task/ques-gray.png" class="ques-icon"/></template>
                    </v-tooltip>
                    <span class="c-primary size-13 ml-10 pointer" @click="toExchange">兑换</span>
                </div>
                <div class="size-40 mt-10 c-black">{{ userBalance1 }}</div>
            </a-col>
        </a-row>
        <div class="tabs-container mt-20">
            <a-tabs type="card" :animated="true" size="small">
                <a-tab-pane key="1" tab="货款充值">
                    <Loan></Loan>
                </a-tab-pane>
                <a-tab-pane key="2" tab="提现">
                    <Withdraw></Withdraw>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>
import Loan from './Loan'
import Withdraw from './Withdraw'
import * as api from '@/api/api'
import { mapGetters } from 'vuex'
export default {
    name: 'fundManage',
    components: {
        Loan,
        Withdraw,
    },
    computed: {
        ...mapGetters(['userBalance1', 'userBalance2']),
    },
    watch: {},
    data() {
        return {
            visible: false,
        }
    },
    mounted() {},
    methods: {
        // 兑换
        toExchange() {
            this.$store.commit('showExchange', true)
        },
    },
}
</script>

<style lang="less" scoped></style>
