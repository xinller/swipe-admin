<template>
    <div class="activityDetail-container">
        <div class="goods-wrap">
            <div class="sec-title">活动信息</div>
            <a-row type="flex" align="middle" class="sec-info">
                <a-col :xs="8">
                    <div>活动编号：{{ orderDetail.order_sn }}</div>
                    <div class="mt-5">创建时间：{{ orderDetail.create_time }}</div>
                    <div class="mt-5 c-primary">审核状态： {{ orderDetail.examine_status | format_status }}</div>
                </a-col>
                <!-- <a-col :xs="8" class="ptb-10">
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
                </a-col> -->
                <a-col :xs="8" class="sec-info-total pr-15">
                    <div class="size-16">
                        总金额 <span class="size-20">¥ {{ orderDetail.pay_amount * 1 + orderDetail.mi_amount * 1 }}</span>
                    </div>
                    <div>赏金 ¥ {{ orderDetail.mi_amount }}</div>
                    <div>货款 ¥ {{ orderDetail.pay_amount }}</div>
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
            <div class="sec-title">买家提交截图</div>
            <a-row class="list-screen" :gutter="[16, 16]">
                <a-col :xs="12" :md="8" class="screen" v-for="item in orderDetail.examine_img" :key="item.id">
                    <img :src="item.value" alt="" />
                    <div class="mt-10">{{ item.title }}</div>
                </a-col>
            </a-row>

            <div class="mt-30">
                <a-button
                    class="mr-10"
                    :disabled="loading"
                    type="primary"
                    v-if="orderDetail.examine_status != 1"
                    @click="commit(1)"
                    >审核通过</a-button
                >
                <a-button :disabled="loading" type="danger" v-if="orderDetail.examine_status != 1" @click="commit(2)"
                    >审核拒绝</a-button
                >
            </div>
        </div>
    </div>
</template>

<script>
import activeInfoDetail from '../../components/business/activeInfoDetail'
import * as api from '@/api/api'
export default {
    name: 'activityDetail',
    components: {
        activeInfoDetail,
    },
    data() {
        return {
            orderDetail: {},
            loading: false,
        }
    },
    mounted() {
        this.getOrderDetail()
    },
    filters: {
        format_status(val) {
            switch (Number(val)) {
                case 0:
                    return '未审核'
                case 1:
                    return '已通过'
                case 2:
                    return '已拒绝'
            }
        },
    },
    methods: {
        getOrderDetail() {
            api.examineDetail({ order_id: this.$route.query.id }).then((res) => {
                if (res.success) {
                    this.orderDetail = res.data
                    this.task_num = res.data.order_num
                }
            })
        },
        commit(status) {
            this.loading = true
            api.toExamine({ order_id: this.$route.query.id, examine_status: status }).then((res) => {
                if (res.success) {
                    this.$message.success('提交成功')
                    this.getOrderDetail()
                }
            })
        },
    },
}
</script>

<style lang="less" scoped>
.list-screen {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .screen {
        text-align: center;
        img {
            width: 100%;
        }
    }
}
</style>
