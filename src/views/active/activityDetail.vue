<template>
    <a-spin :spinning="spinning" class="activityDetail-container">
        <div class="goods-wrap">
            <div class="sec-title">活动信息</div>
            <a-row type="flex" align="middle" class="sec-info">
                <a-col :xs="8">
                    <div>活动编号：{{ orderDetail.order_sn }}</div>
                    <div class="mt-5">创建时间：{{ orderDetail.create_time }}</div>
                    <div class="mt-5">活动状态： {{ orderDetail.order_status | format_status }}</div>
                </a-col>
                <a-col :xs="8" class="ptb-10">
                    <a-row>
                        <a-col :xs="6">
                            <div>任务总数</div>
                            <div>{{ orderDetail.order_num }}个</div>
                        </a-col>
                        <a-col :xs="4">
                            <div>未发布</div>
                            <div>{{ orderDetail.un_public }}个</div>
                        </a-col>
                        <a-col :xs="4">
                            <div>已发布</div>
                            <div>{{ orderDetail.public_num }}个</div>
                        </a-col>
                        <a-col :xs="4">
                            <div>已完成</div>
                            <div>{{ orderDetail.complete_num }}个</div>
                        </a-col>
                        <a-col :xs="4">
                            <div>已关闭</div>
                            <div>{{ orderDetail.close_num }}个</div>
                        </a-col>
                    </a-row>
                </a-col>
                <a-col :xs="8" class="sec-info-total pr-15">
                    <div class="size-16">
                        总金额 <span class="size-20">¥ {{ orderDetail.payment_amount * 1 + orderDetail.mi_amount * 1 }}</span>
                    </div>
                    <div>赏金 ¥ {{ orderDetail.mi_amount }}</div>
                    <div>货款 ¥ {{ orderDetail.payment_amount }}</div>
                    <div>服务费 ¥ 0</div>
                </a-col>
            </a-row>
            <div class="sec-title">活动预览</div>
            <div class="goods-info">
                <a-row class="row-hd">
                    <a-col :xs="4" class="plr-10">
                        <img src="../../assets/images/task/taobao.png" class="tb-icon" />
                        <span class="ml-10" :title="orderDetail.store_name">{{ orderDetail.store_name }}</span></a-col
                    >
                    <a-col :xs="8">商品信息</a-col>
                    <a-col :xs="4" class="txt-ct">展示价格</a-col>
                    <a-col :xs="4" class="txt-ct">成交价</a-col>
                    <a-col :xs="4" class="txt-ct">下单数量</a-col>
                </a-row>
                <a-row class="row-bd">
                    <a-col :xs="4">
                        <img :src="orderDetail.goods_image" class="goods-thumb" />
                    </a-col>
                    <a-col :xs="8">
                        <div class="goods-desc">
                            <div>{{ orderDetail.goods_title }}</div>
                            <div>主宝贝链接:{{ orderDetail.goods_link }}</div>
                        </div>
                    </a-col>
                    <a-col :xs="4" class="txt-ct">{{ orderDetail.buy_price }}</a-col>
                    <a-col :xs="4" class="txt-ct">{{ orderDetail.buy_price * orderDetail.buy_num }}</a-col>
                    <a-col :xs="4" class="txt-ct">{{ orderDetail.buy_num }}</a-col>
                </a-row>
            </div>
        </div>
        <!-- 活动概况+活动费用详情 -->
        <activeInfoDetail :detail="orderDetail"></activeInfoDetail>
    </a-spin>
</template>

<script>
import activeInfoDetail from '../../components/business/activeInfoDetail'
import * as api from '@/api/api'
import { mapGetters } from 'vuex'
export default {
    name: 'activityDetail',
    components: {
        activeInfoDetail,
    },
    data() {
        return {
            orderDetail: {},
            spinning: false,
        }
    },
    mounted() {
        this.getOrderDetail()
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
    methods: {
        getOrderDetail() {
            this.spinning = true
            api.grabDetail({ order_id: this.$route.query.id }).then((res) => {
                this.spinning = false
                if (res.success) {
                    this.orderDetail = res.data
                    this.task_num = res.data.order_num
                }
            })
        },
    },
}
</script>

<style lang="less" scoped></style>
