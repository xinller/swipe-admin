<template>
    <div class="tdProcess-container">
        <!-- 任务详情-  任务进程 -->
        <section>
            <div class="order-durtaion">
                <div class="title">
                    <span class="time-icon"><a-icon type="dashboard"/></span>
                    交易耗时
                </div>
                <div class="time">{{ time_length }}</div>
            </div>
            <a-collapse
                v-if="orderDetail.data"
                class="collapse-process"
                default-active-key="1"
                :bordered="false"
                expandIconPosition="right"
            >
                <a-collapse-panel key="1">
                    <div slot="header" class="coll-header">
                        <span :class="['coll-step', { finished: orderDetail.data.step >= 1 }]">1</span>
                        <span>浏览宝贝 {{ orderDetail.data.step_1 }} </span>
                    </div>
                    <a-row class="coll-content flexct">
                        <a-col :xs="4">货比三家</a-col>
                        <a-col :xs="20" class="pl-10">
                            <p v-if="orderDetail.data.competitive_product_1">
                                竞品1淘口令：{{ orderDetail.data.competitive_product_1 }}
                            </p>
                            <p v-if="orderDetail.data.competitive_product_2">
                                竞品2淘口令：{{ orderDetail.data.competitive_product_2 }}
                            </p>
                        </a-col>
                    </a-row>
                </a-collapse-panel>
                <a-collapse-panel key="2">
                    <div slot="header" class="coll-header">
                        <span :class="['coll-step', { finished: orderDetail.data.step >= 2 }]">2</span>
                        <span>找到宝贝 {{ orderDetail.data.step_2 }}</span>
                    </div>
                    <div class="coll-content" v-if="orderDetail.data.find_goods_img">
                        <span class="mr-10">找到宝贝截图</span>
                        <img
                            :src="orderDetail.data.find_goods_img"
                            class="thumb"
                            @click="showImage(orderDetail.data.find_goods_img)"
                        />
                    </div>
                </a-collapse-panel>
                <a-collapse-panel key="3">
                    <div slot="header" class="coll-header">
                        <span :class="['coll-step', { finished: orderDetail.data.step >= 4 }]">3</span>
                        <span>下单付款 {{ orderDetail.data.step_4 }} </span>
                    </div>
                    <a-row class="coll-content ">
                        <a-col :xs="24">淘宝订单编号 : {{ orderDetail.data.taobao_ordersn }}</a-col>
                        <a-col :xs="24" class="mt-10">买家付款金额 : {{ orderDetail.data.actually_paid }}</a-col>
                        <a-col :xs="24" class="mt-10">买家昵称 : {{ orderDetail.data.taobao_nickname }}</a-col>
                    </a-row>
                </a-collapse-panel>
                <a-collapse-panel key="4">
                    <div slot="header" class="coll-header">
                        <span :class="['coll-step', { finished: orderDetail.data.step >= 5 }]">4</span>
                        <span>商家发货 {{ orderDetail.data.step_5 }}</span>
                    </div>
                    <a-row class="coll-content ">
                        <a-col :xs="24">快递名称 : {{ orderDetail.data.express_name }}</a-col>
                        <a-col :xs="24" class="mt-10">快递单号 :{{ orderDetail.data.express_number }} </a-col>
                    </a-row>
                </a-collapse-panel>
                <a-collapse-panel key="5">
                    <div slot="header" class="coll-header">
                        <span :class="['coll-step', { finished: orderDetail.data.step >= 6 }]">5</span>
                        <span>买家收货 {{ orderDetail.data.step_6 }}</span>
                    </div>
                    <div>
                        <div class="coll-content" v-if="orderDetail.data.confirm_img">
                            <span class="mr-10">交易成功截图</span>
                            <img
                                :src="orderDetail.data.confirm_img"
                                class="thumb"
                                @click="showImage(orderDetail.data.confirm_img)"
                            />
                        </div>
                        <div class="coll-content" v-if="orderDetail.data.evaluation_screenshot">
                            <span class="mr-10">收货评价图</span>
                            <img
                                :src="orderDetail.data.evaluation_screenshot"
                                class="thumb"
                                @click="showImage(orderDetail.data.evaluation_screenshot)"
                            />
                        </div>
                        <div class="coll-content" v-if="orderDetail.data.addevaluation_screenshot">
                            <span class="mr-10">追加评价图</span>
                            <img
                                :src="orderDetail.data.addevaluation_screenshot"
                                class="thumb"
                                @click="showImage(orderDetail.data.addevaluation_screenshot)"
                            />
                        </div>
                    </div>
                </a-collapse-panel>
                <a-collapse-panel key="6">
                    <div slot="header" class="coll-header">
                        <span :class="['coll-step', { finished: orderDetail.data.step >= 7 }]">6</span>
                        <span>商家返款 {{ orderDetail.data.step_7 }}</span>
                    </div>
                    <a-row class="coll-content ">
                        <a-col :xs="24" v-if="orderDetail.data.is_return == 1">
                            货款状况 :
                            <span class="ml-20"
                                >货款已返还 ，当前货款返款金额为 {{ orderDetail.data.pay_amount }}元，该任务发布的垫付货款金额为{{
                                    orderDetail.data.actually_paid
                                }}元
                            </span>
                        </a-col>
                        <a-col :xs="24" class="mt-10" v-if="orderDetail.data.is_bounty == 1">
                            赏金状况 :
                            <span class="ml-20"
                                >赏金已返还 ，当前任务赏金鲸币为{{
                                    orderDetail.data.mi_amount
                                }}鲸币，请仔细核对买家是否完成全部活动要求。
                            </span>
                        </a-col>
                    </a-row>
                </a-collapse-panel>
                <a-collapse-panel key="7">
                    <div slot="header" class="coll-header">
                        <span :class="['coll-step', { finished: orderDetail.data.step >= 8 }]">7</span>
                        <span>交易完成 {{ orderDetail.data.step_8 }}</span>
                    </div>
                </a-collapse-panel>
            </a-collapse>
        </section>
        <a-modal v-model="isShowImage" title="图片" :footer="null">
            <img :src="showImageUrl" alt="" />
        </a-modal>
    </div>
</template>

<script>
import moment from 'moment'
export default {
    name: 'tdProcess',
    props: {
        detail: {
            type: Object,
        },
    },
    watch: {
        detail(val) {
            this.orderDetail = val
            this.getTimeLength()
        },
    },
    data() {
        return {
            orderDetail: this.detail,
            time_length: '',
            showImageUrl: '',
            isShowImage: false,

            // 0-开始购物 1-货比三家 2-找到宝贝  3-设置浏览 4-下单付款  5-商家发货 6-买家收货 7-商家返款 8-交易完成
        }
    },
    mounted() {
        console.log(this.orderDetail)
        this.getTimeLength()
    },
    methods: {
        getTimeLength() {
            if (!this.orderDetail.data) return
            if (this.orderDetail.data.step == 8) {
                var edtime = new Date(this.orderDetail.data.step_8).getTime()
                let stime = this.orderDetail.data.receive_time ? new Date(this.orderDetail.data.receive_time).getTime() : 0
                let length = (edtime - stime) / 1000
                console.log('length', length)
                this.time_length = this.util.timestampToTime(length)
            }
        },
        showImage(url) {
            this.showImageUrl = url
            this.isShowImage = true
        },
    },
}
</script>

<style lang="less" scoped></style>
