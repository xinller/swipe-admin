<template>
    <!-- 任务详情 -->
    <a-spin :spinning="spinning" class="taskDetail-container">
        <!-- 0-待接手 1-待接手付款 2-待发货 3-待收货评价 4-待返款 5-待追评 6-已完成 7-已关闭 -->
        <a-steps :current="task_status" class="steps-box" size="small">
            <a-step title="待接手" />
            <a-step title="进行中" />
            <a-step title="待发货" />
            <a-step title="待收货评价" />
            <a-step title="待返款" />
            <a-step title="交易完成" />
        </a-steps>

        <!-- 待接手  -->
        <section class="order-info" v-if="task_status == 0">
            <div class="order-info-title">当前任务状态：任务已经发布，等待买家接手</div>
            <p>请确定活动信息正确，如活动信息填写有误可关闭任务重新发布。</p>
            <p>如超过3天仍没有买家接手，系统将自动关闭任务并退款给商家。</p>
            <div class="order-info-footer">
                <a-button shape="round" @click="closeConfirm(1)">
                    <span><a-icon type="bell" /> 关闭任务 </span>
                </a-button>
            </div>
        </section>
        <!-- 进行中 -->
        <section class="order-info" v-if="task_status == 1">
            <div class="order-info-title">当前任务状态：买家已接手，等待买家下单付款。</div>
            <p>
                买家还有
                <span class="special-color">{{ orderDetail.end_t_show }}</span
                >来对本任务进行付款操作，如果买家未在该期限内处理，该任务会被释放回活动大厅并重派给其他买家。
            </p>
            <p v-if="orderInfo.is_pre == 1">
                任务有预售要求的付款有效期为{{
                    orderInfo.pre_end_hours
                }}小时。（例如：商家要求买家加入购车3小时后付款，如买家过了9小时后仍未付款，系统会重新派发。）
            </p>
            <!-- <div class="order-info-yy -->
        </section>
        <!-- 待发货 -->
        <section class="order-info" v-if="task_status == 2">
            <div class="order-info-title">当前任务状态：买家已付款，等待商家发货</div>
            <p>如买家未按照要求操作或返款有问题，请及时联系平台客服处理。</p>
            <p>
                您还有
                <span class="special-color">{{ orderDetail.end_send_time }}</span
                >来对本任务进行处理，如果您未在该期限内处理，系统会强制发货。
            </p>
            <p>请真实发货，由于物流问题导致的交易纠纷本平台概不负责。</p>
            <div class="order-info-footer">
                <a-button type="primary" shape="round" @click="toDelivery">
                    <span>发货</span>
                </a-button>
            </div>
        </section>
        <!-- 待收货评价 -->
        <section class="order-info" v-if="task_status == 3">
            <div class="order-info-title">当前任务状态：商家已发货，等待买家收货评价</div>
            <p>如买家未按照要求操作或签收有问题，请及时联系平台客服处理。</p>
        </section>
        <!-- 待返款 -->
        <section class="order-info" v-if="task_status == 4">
            <template>
                <div class="order-info-title">当前任务状态：买家已收货评价，等待买家追评</div>
                <p>如买家未按照要求操作或返款有问题，请及时联系平台客服处理。</p>
                <p>
                    您还有
                    <span class="special-color">{{ orderDetail.end_step_7 }}</span
                    >来对本任务进行处理，如果您未在该期限内处理，系统会自动返款给买家。
                </p>
                <p>
                    买家还有
                    <span class="special-color">{{ orderDetail.end_addeve_time }}</span>
                    来对本任务进行追评，如果买家未在该期限内追评，系统会结束追评进程，并将追评部分的赏金将退还给商家。
                </p>
            </template>
            <div class="order-info-footer">
                <a-button
                    :disabled="orderDetail.data.is_return == 1"
                    type="primary"
                    shape="round"
                    class="mr-10"
                    @click="refundConfirm(1)"
                >
                    <span>{{ orderDetail.data.is_return == 1 ? '货款已返款' : '货款返款' }}</span>
                </a-button>
                <!-- 去返款 : 货款已返款(禁用)+赏金返款 -->
                <a-button
                    :disabled="orderDetail.data.is_bounty == 1"
                    type="primary"
                    shape="round"
                    class="mr-10"
                    @click="refundConfirm(2)"
                >
                    <span>{{ orderDetail.data.is_bounty == 1 ? '赏金已返款' : '赏金返款' }}</span>
                </a-button>
                <!-- 判断普通评价赏金显示隐藏 -->
                <a-button
                    v-if="orderDetail.data.eve_amount > 0"
                    :disabled="orderDetail.data.is_eve == 1"
                    type="primary"
                    shape="round"
                    class="mr-10"
                    @click="refundConfirm(4)"
                >
                    <span>{{ orderDetail.data.is_eve == 1 ? '评价赏金已返款' : '评价赏金返款' }}</span>
                </a-button>
                <!-- 判断追加评价赏金 显示隐藏 -->
                <a-button
                    v-if="orderDetail.grab.add_evaluate == 1 && orderDetail.data.adaeve_amount > 0"
                    :disabled="orderDetail.data.is_addeve == 1"
                    type="primary"
                    shape="round"
                    @click="refundConfirm(3)"
                >
                    <span>{{ orderDetail.data.is_addeve == 1 ? '追评赏金已返款' : '追评赏金返款' }}</span>
                </a-button>
            </div>
            <!-- 判断显示隐藏 -->
            <div class="mt-10" v-if="orderDetail.data.pay_amount < orderDetail.data.actually_paid">
                <p class="special-color">
                    <a-icon type="info-circle" />
                    由于买家实付金额大于货款押金，亲需要补交差价后再才做返款，若超过1天天未操作，平台有权强制补交差价并返款
                </p>
                <p>
                    当前货款返款金额为
                    {{ orderDetail.data.pay_amount }}元，该任务发布的垫付货款金额为{{
                        orderDetail.data.actually_paid
                    }}元，需补充-{{
                        orderDetail.data.actually_paid - orderDetail.data.pay_amount
                    }}元，核实无误后点击右侧按钮补交差价。
                    <a-button :disabled="orderDetail.data.is_makedifferent == 1" type="primary" shape="round" @click="makeDiff"
                        ><span>{{ orderDetail.data.is_makedifferent == 1 ? '差价已补' : '立即补交差价' }}</span></a-button
                    >
                </p>
            </div>
        </section>

        <!-- 待追评 -->

        <section class="order-info order-finish" v-if="task_status == 5">
            <div class="order-info-title">当前任务状态：交易等待买家追评</div>
            <p>等待追评</p>
            <!-- 判断追加评价赏金 显示隐藏 -->
            <a-button
                v-if="orderDetail.grab.add_evaluate == 1 && orderDetail.data.adaeve_amount > 0 && is_addeve == 0"
                :disabled="orderDetail.data.is_addeve == 1"
                type="primary"
                shape="round"
                @click="refundConfirm(3)"
            >
                <span>{{ orderDetail.data.is_addeve == 1 ? '追评赏金已返款' : '追评赏金返款' }}</span>
            </a-button>
        </section>
        <!-- 交易已完成 -->
        <section class="order-info order-finish" v-if="task_status == 6">
            <div class="order-info-title">当前任务状态：交易已经完成</div>
            <p>交易成功，如有售后问题，请及时联系平台客服处理。</p>
            <p
                style="color:red"
                v-if="orderDetail.data.is_bounty == 0 || orderDetail.data.is_eve == 0 || orderDetail.data.is_addeve == 0"
            >
                您还有赏金未返还买家 , 请尽快操作, 以免造成买手投诉!
            </p>
            <!-- 去返款 : 货款已返款(禁用)+赏金返款 -->
            <a-button
                :disabled="orderDetail.data.is_bounty == 1"
                type="primary"
                shape="round"
                class="mr-10"
                @click="refundConfirm(2)"
                v-if="orderDetail.data.is_bounty == 0"
            >
                <span>{{ orderDetail.data.is_bounty == 1 ? '赏金已返款' : '赏金返款' }}</span>
            </a-button>
            <!-- 判断普通评价赏金显示隐藏 -->
            <a-button
                v-if="orderDetail.data.eve_amount > 0 && orderDetail.data.is_eve == 0"
                :disabled="orderDetail.data.is_eve == 1"
                type="primary"
                shape="round"
                class="mr-10"
                @click="refundConfirm(4)"
            >
                <span>{{ orderDetail.data.is_eve == 1 ? '评价赏金已返款' : '评价赏金返款' }}</span>
            </a-button>
            <!-- 判断追加评价赏金 显示隐藏 -->
            <a-button
                v-if="orderDetail.grab.add_evaluate == 1 && orderDetail.data.adaeve_amount > 0 && orderDetail.data.is_addeve == 0"
                :disabled="orderDetail.data.is_addeve == 1"
                type="primary"
                shape="round"
                @click="refundConfirm(3)"
            >
                <span>{{ orderDetail.data.is_addeve == 1 ? '追评赏金已返款' : '追评赏金返款' }}</span>
            </a-button>
        </section>
        <!-- 交易关闭 -->
        <section class="order-info order-finish" v-if="task_status == -1" style="background:#eee">
            <div class="order-info-title">当前任务状态：交易关闭</div>
            <p v-if="orderInfo.close_type == 0">商家关闭任务</p>
            <p v-if="orderInfo.close_type == 1">买手关闭任务:找不到宝贝</p>
            <p v-if="orderInfo.close_type == 2">买手关闭任务:没时间做</p>
            <p v-if="orderInfo.close_type == 3">买手关闭任务:实际价格高于货款</p>
            <p v-if="orderInfo.close_type == 4">买手关闭任务:达不到商家备注要求</p>
            <p v-if="orderInfo.close_type == 5">买手关闭任务:其他原因</p>
            <p v-if="orderInfo.close_type == 6">订单超时</p>
        </section>

        <!-- 补差价弹出层 -->
        <v-pay-modal
            :isReset="isReset"
            :visible="isPayVisible"
            okText="确定"
            @toggle="isPayVisible = !isPayVisible"
            @commit="PayCommit"
        >
            <template slot="footer-content">
                <p class="size-12">活动发布后约1分钟生效,注意刷新活动页!</p>
                <p class="size-12">
                    试客 <span class="c-red">付款后</span> 请及时确认及发货,系统将在
                    <span class="c-red">48个小时后自动把货款返还给试客!</span>
                </p>
                <p class="size-12">
                    试客 <span class="c-red">收货后</span> 请及时确认及返款,系统将在
                    <span class="c-red">48个小时后自动返款!</span>
                </p>
            </template>
        </v-pay-modal>

        <!-- 任务详情 -->
        <a-tabs default-active-key="1" @change="Tabcallback" class="mt-20">
            <a-tab-pane key="1" tab="活动要求">
                <TdRequire :detail="orderDetail"></TdRequire>
            </a-tab-pane>
            <a-tab-pane key="2" tab="任务进程">
                <TdProcess :detail="orderDetail"></TdProcess>
            </a-tab-pane>
            <a-tab-pane key="3" tab="任务日志">
                <TdLog :detail="logInfo"></TdLog>
            </a-tab-pane>
        </a-tabs>
    </a-spin>
</template>

<script>
import VPayModal from '../../components/business/VPayModal'
import TdLog from './tdLog.vue'
import TdProcess from './tdProcess.vue'
import TdRequire from './tdRequire.vue'
import * as api from '@/api/api'

export default {
    name: 'taskDetail',
    components: {
        VPayModal,
        TdRequire,
        TdProcess,
        TdLog,
    },
    data() {
        return {
            isPayVisible: false,
            task_status: 0, //任务状态
            orderInfo: '', //任务详情
            taobaoInfo: '', //买家淘宝账号信息
            logInfo: [], //任务日志
            grabInfo: '', //活动要求
            orderDetail: {}, //all
            spinning: false,
            order_id: this.$route.query.id,
            pay_type: '',
            isReset: false,
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        goBack() {
            this.$router.go(-1)
        },
        getData() {
            this.spinning = true
            api.orderDetail({ order_id: this.order_id }).then((res) => {
                this.spinning = false
                if (res.success) {
                    this.orderDetail = res.data
                    this.orderInfo = res.data.data
                    this.task_status = this.orderInfo.status == 7 ? -1 : this.orderInfo.status
                    this.taobaoInfo = res.data.taobao
                    this.logInfo = res.data.log
                    this.grabInfo = res.data.grab

                    this.timeCount()
                }
            })
        },
        timeCount() {
            var token = this.$store.state.user.SWIPE_A_TOKEN
            if (token) {
                this.interval = setInterval(() => {
                    this.change_time()
                }, 1000)
            }
        },
        change_time() {
            let end_t_show = this.util.format_down_time(this.orderDetail.data['end_time'])
            let end_step_7 = this.util.format_down_time(this.orderDetail.data['step_7'])
            this.$set(this.orderDetail, 'end_t_show', end_t_show)
            this.$set(this.orderDetail, 'end_step_7', end_step_7)
            if (this.task_status == 2) {
                let end_send_time = this.util.format_down_time(this.orderDetail.data['send_time'])
                this.$set(this.orderDetail, 'end_send_time', end_send_time)
            }
            if (this.task_status == 3) {
                let end_addeve_time = this.util.format_down_time(this.orderDetail.data['addeve_time'])
                this.$set(this.orderDetail, 'end_addeve_time', end_addeve_time)
            }
        },
        // 关闭任务
        closeConfirm(status) {
            console.log('status', status)
            let content = ''
            if (status == 1) {
                // 待接手
                content = '关闭任务后系统会退还您所有的货款和赏金.'
            } else if (status == 2) {
                // 已接手未付款
                content = (h) => (
                    <div>
                        <p class="size-12">
                            该任务已被买家接手，此时关闭将会扣除部分赏金，若有评价要求，评价部分的赏金可以退还。如买家已经下单，任务关闭后买家将会在淘宝申请退款。
                        </p>
                        <p class="size-14">是否确定关闭该任务？</p>
                    </div>
                )
            }
            this.$confirm({
                title: '确定关闭此任务?',
                content: content,
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk: () => {
                    console.log('OK')
                    api.closeMission({ order_id: this.order_id }).then((res) => {
                        if (res.success) {
                            this.goBack()
                        }
                    })
                },
            })
        },
        // 去发货
        toDelivery() {
            this.$router.push({ name: 'delivery', query: { id: this.order_id } })
        },
        // 货款返款 1, 赏金返款 2
        refundConfirm(status) {
            let content = ''
            if (status == 1) {
                content = '确定返还货款给买家？'
            } else if (status == 2) {
                content = '确定返还赏金给买家？'
            } else if (status == 3) {
                content = '确定返还追评赏金给买家？'
            } else if (status == 4) {
                content = '确定返还评价赏金给买家？'
            }
            this.$confirm({
                title: '提示',
                content: content,
                okText: '确定',
                okType: 'primary',
                cancelText: '取消',
                onOk: () => {
                    console.log('OK')
                    if (status == 1) {
                        this.isPayVisible = true
                        this.pay_type = 'refund'
                    } else if (status == 2) {
                        this.isPayVisible = true
                        this.pay_type = 'reward'
                    } else if (status == 3) {
                        this.isPayVisible = true
                        this.pay_type = 'addreward'
                    } else if (status == 4) {
                        this.isPayVisible = true
                        this.pay_type = 'eveReward'
                    }
                },
                onCancel() {
                    console.log('Cancel')
                },
            })
        },
        // 贷款返款
        refundAmount(pass) {
            api.refundAmount({ order_id: this.order_id, pay_password: pass }).then((res) => {
                if (res.success) {
                    this.$message.success('返款成功')
                    this.isPayVisible = false
                    this.pay_type = ''
                    this.getData()
                } else {
                    this.isReset = !this.isReset
                }
            })
        },
        // 赏金返款
        refundBounty(pass) {
            api.refundBounty({ order_id: this.order_id, pay_password: pass }).then((res) => {
                if (res.success) {
                    this.$message.success('赏金返款成功')
                    this.isPayVisible = false
                    this.pay_type = ''
                    this.getData()
                } else {
                    this.isReset = !this.isReset
                }
            })
        },
        // 追平赏金返款
        addEveRefund(pass) {
            api.addEveRefund({ order_id: this.order_id, pay_password: pass }).then((res) => {
                if (res.success) {
                    this.$message.success('追评赏金返款成功')
                    this.isPayVisible = false
                    this.pay_type = ''
                    this.getData()
                } else {
                    this.isReset = !this.isReset
                }
            })
        },
        // 评价赏金返款
        eveRefund(pass) {
            api.normalEveRefund({ order_id: this.order_id, pay_password: pass }).then((res) => {
                if (res.success) {
                    this.$message.success('评价赏金返款成功')
                    this.isPayVisible = false
                    this.pay_type = ''
                    this.getData()
                } else {
                    this.isReset = !this.isReset
                }
            })
        },
        // 密码确认
        PayCommit(param) {
            console.log('param', param)
            if (this.pay_type == 'diff') {
                this.makeUpDifference(param.password)
            } else if (this.pay_type == 'refund') {
                this.refundAmount(param.password)
            } else if (this.pay_type == 'reward') {
                this.refundBounty(param.password)
            } else if (this.pay_type == 'addreward') {
                this.addEveRefund(param.password)
            } else if (this.pay_type == 'eveReward') {
                this.eveRefund(param.password)
            }
        },
        makeDiff() {
            this.isPayVisible = true
            this.pay_type = 'diff'
        },
        // 补差价
        makeUpDifference(pass) {
            api.makeUpDifference({ order_id: this.order_id, pay_password: pass }).then((res) => {
                if (res.success) {
                    this.$message.success('提交成功')
                    this.isPayVisible = false
                    this.pay_type = ''
                    this.getData()
                } else {
                    this.isReset = !this.isReset
                }
            })
        },
        Tabcallback(key) {
            console.log('key', key)
        },
    },
}
</script>

<style lang="less" scoped></style>
