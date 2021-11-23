<template>
    <!-- 兑换modal -->
    <a-modal class="exchange-modal" v-model="isVisible" :footer="null" :closable="false" title="兑换鲸币" @cancel="toggle">
        <a-input type="number" placeholder="请输入自定义输入" v-model="amount" @input="changeAmount"></a-input>
        <a-row :gutter="[8, 8]">
            <a-col :xs="8" v-for="item in configList" :key="item.id" @click="chooseConfig(item)">
                <div :class="['ex-col', { active: config_id == item.id }]">
                    <div class="num">{{ item.parameter_val }}</div>
                    <div class="img">
                        <img src="../../assets/images/activity/san.png" class="san-icon" />
                    </div>
                    <div class="discount">另赠送{{ item.remark }}</div>
                </div>
            </a-col>
            <!-- <a-col :xs="8">
                <div class="ex-col">
                    <div class="num">5000</div>
                    <div class="img">
                        <img src="../../assets/images/activity/san.png" class="san-icon" />
                    </div>
                    <div class="discount">另赠送200</div>
                </div>
            </a-col>
            <a-col :xs="8">
                <div class="ex-col">
                    <div class="num">10000</div>
                    <div class="img">
                        <img src="../../assets/images/activity/san.png" class="san-icon" />
                    </div>
                    <div class="discount">另赠送500</div>
                </div>
            </a-col> -->
        </a-row>
        <a-row class="mt-10">
            <a-col class="c-black size-14">所需金额</a-col>
            <a-col class="c-red size-18 mt-10">¥{{ cur_amount }}</a-col>
            <a-col class="c-gray mt-10 size-12">兑换成功将从本金账户中扣除，请确保账户余额充足 </a-col>
        </a-row>
        <div class="flexct jus-ed mt-10">
            <a-button class="mr-10" @click="toggle">取消</a-button>
            <a-button type="primary" @click="commit">兑换</a-button>
        </div>
    </a-modal>
</template>

<script>
import * as api from '@/api/api'
export default {
    name: 'exchangeModal',
    props: {
        visible: {
            type: Boolean,
        },
    },
    watch: {
        visible(value) {
            this.isVisible = value
        },
    },
    computed: {
        updateBalance() {
            return this.$store.state.user.updateBalance
        },
    },
    data() {
        return {
            isVisible: this.visible,
            configList: [],
            amount: '',
            config_id: '',
            cur_amount: '0.00',
        }
    },
    mounted() {
        this.exchangeConfig()
    },
    methods: {
        exchangeConfig() {
            api.exchangeConfig().then((res) => {
                if (res.success) {
                    this.configList = res.data
                }
            })
        },
        changeAmount() {
            this.config_id = ''
            this.cur_amount = this.amount
        },
        chooseConfig(item) {
            this.config_id = item.id
            this.cur_amount = item.parameter_val
        },
        commit() {
            if (!this.amount && !this.config_id) return this.$message.warning('请输入或选择兑换数量')

            api.miExchange({ amount: this.amount, id: this.config_id }).then((res) => {
                if (res.success) {
                    this.$message.success('兑换成功')
                    this.reset()
                    this.toggle()
                    this.$store.commit('setUpdateBalance', !this.updateBalance)
                }
            })
        },
        reset() {
            this.config_id = ''
            this.cur_amount = '0.00'
            this.amount = ''
        },
        toggle() {
            this.$emit('toggle', false)
        },
    },
}
</script>

<style lang="less" scoped></style>
