<template>
    <div class="storeInfo-container  mt-20">
        <div class="row-good">
            <div class="row-item">
                <div class="row-th">宝贝金额</div>
                <div class="row-td">{{ orderDetail.payment_amount }}</div>
            </div>
            <div class="row-item">
                <div class="row-th">运费</div>
                <div class="row-td">{{ orderDetail.is_free_ship == 0 ? 10 : 0 }}</div>
            </div>
            <div class="row-item">
                <div class="row-th">基础赏金</div>
                <div class="row-td" v-if="orderDetail.search_type == 0">
                    {{ orderDetail.buy_price_mi_price * 1 + orderDetail.base_price * 1 }}
                </div>
                <div class="row-td" v-if="orderDetail.search_type != 0">
                    0
                </div>
            </div>

            <div class="row-item">
                <div class="row-th">返款方式</div>
                <div class="row-td">{{ orderDetail.back_type == 0 ? orderDetail.back_type_price : 0 }}</div>
            </div>
            <div class="row-item">
                <div class="row-th">打标</div>
                <div class="row-td">{{ orderDetail.super_sign_price }}</div>
            </div>
            <div class="row-item">
                <div class="row-th">审号</div>
                <div class="row-td">{{ formatExamine(orderDetail) }}</div>
            </div>
            <div class="row-item">
                <div class="row-th">预售</div>
                <div class="row-td">
                    {{ orderDetail.presale_require_price * 1 ? (1 * orderDetail.presale_require_price).toFixed(2) : 0 }}
                </div>
            </div>
            <div class="row-item">
                <div class="row-th">标签</div>
                <div class="row-td">{{ getLabelPrice(orderDetail) }}</div>
            </div>
            <!-- <div class="row-item">
                <div class="row-th">白名单</div>
                <div class="row-td">{{ orderDetail.label_white_price ? (1 * orderDetail.label_white_price).toFixed(2) : 0 }}</div>
            </div> -->
            <div class="row-item">
                <div class="row-th">账号</div>
                <div class="row-td">
                    {{ (orderDetail.buyer_level_price * 1 + orderDetail.week_click_price * 1).toFixed(2) }}
                </div>
            </div>
        </div>
        <div class="row-good">
            <div class="row-item">
                <div class="row-th">评价(总)</div>
                <div class="row-td">{{ orderDetail.buyer_evaluate_price * DISCOUNT }}</div>
            </div>
            <div class="row-item">
                <div class="row-th">追评(总)</div>
                <div class="row-td">{{ orderDetail.add_evaluate_price * DISCOUNT }}</div>
            </div>
            <div class="row-item">
                <div class="row-th">延收</div>
                <div class="row-td">{{ orderDetail.confirm_type_price }}</div>
            </div>
            <div class="row-item">
                <div class="row-th">服务费</div>
                <div class="row-td">{{ orderDetail.basic_service_fee }}</div>
            </div>
            <div class="row-item">
                <div class="row-th">其他</div>
                <div class="row-td">{{ orderDetail.confirm_time_price }}</div>
            </div>
            <div class="row-item">
                <div class="row-th">任务数</div>
                <div class="row-td">{{ orderDetail.order_num }}</div>
            </div>
            <div class="row-item">
                <div class="row-th">货款</div>
                <div class="row-td">{{ orderDetail.payment_amount }}</div>
            </div>
            <div class="row-item">
                <div class="row-th">折扣</div>
                <div class="row-td">{{ DISCOUNT * 100 }}%</div>
            </div>
            <div class="row-item">
                <div class="row-th">鲸币</div>
                <div class="row-td">{{ orderDetail.mi_amount }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as api from '@/api/api'
export default {
    name: 'orderPrice',
    props: {
        detail: {
            type: Object,
        },
    },
    watch: {
        detail: {
            deep: true,
            handler: function(newVal) {
                this.orderDetail = Object.assign({}, this.orderDetail, newVal)
                this.getTotal()
            },
        },
        // detail(newVal) {
        //     this.orderDetail = Object.assign({}, newVal)
        //     console.log('this.orderDetail', this.orderDetail)
        //     this.getTotal()
        // },
    },
    data() {
        return {
            orderDetail: {
                payment_amount: 0,
                mi_amount: 0, //合计
                is_free_ship: 1, //是否包邮
                buy_price_mi_price: 0, //基础赏金阶段价格
                base_price: 0, //基础赏金 (+活动类型)
                basic_service_fee: 0, //服务费
                back_type_price: 0,
                back_type: 1, //返款方式

                // base_activity_price: 0, //活动类型价格
                search_type: 0, // 0-关键词  1-淘口令 2-二维码

                super_sign_price: 0, //超级打标

                examine_price: 0, //审核价格
                taoqi_value_price: 0, //淘气值
                tao_year_price: 0, //淘龄
                screenshot_require_price: 0, //截图价格和

                label_area_price: 0, //地域标签价
                label_sex_price: 0,
                label_age_price: 0,
                label_pro_price: 0,
                label_cate_price: 0,
                label_huabei_price: 0,
                label_super_price: 0, //超级会员

                label_white_price: 0, //白名单

                presale_require_price: 0, //预售价格
                buyer_level_price: 0, //等级
                week_click_price: 0, //周点击
                buyer_evaluate_price: 0, //评价
                buyer_evaluate_length: 0,
                add_evaluate_price: 0, //追加评
                add_evaluate_length: 0,
                confirm_type_price: 0, //确认收货时间
                confirm_time_price: 0, //完成时间

                receive_mode: 0, //是否标签
                order_num: 1, //发布数量
            },
            // totalPrice: 0,
        }
    },

    computed: {
        ...mapGetters(['DISCOUNT']),
    },
    created() {
        this.getUserDetail()
    },
    mounted() {
        this.orderDetail = Object.assign({}, this.orderDetail, this.detail)
        this.getTotal()
    },
    methods: {
        // 获取折扣比例
        getUserDetail() {
            api.getUserDetail().then((res) => {
                if (res.success) {
                    this.$store.commit('setDiscount', res.data.discount / 100)
                }
            })
        },
        getTotal() {
            let total =
                (this.orderDetail.is_free_ship == 1 ? 0 : 10) +
                this.orderDetail.basic_service_fee * 1 +
                this.orderDetail.super_sign_price * 1 +
                this.formatExamine(this.orderDetail) +
                this.getLabelPrice(this.orderDetail) +
                this.orderDetail.label_white_price * 1 +
                this.orderDetail.presale_require_price * 1 +
                this.orderDetail.buyer_level_price * 1 +
                this.orderDetail.week_click_price * 1 +
                this.orderDetail.confirm_type_price * 1 +
                this.orderDetail.confirm_time_price * 1
            if (this.orderDetail.back_type == 0) {
                total += this.orderDetail.back_type_price * 1
            }
            if (this.orderDetail.search_type == 0) {
                total += this.orderDetail.buy_price_mi_price * 1 + this.orderDetail.base_price * 1
            }
            let ev_price = this.orderDetail.buyer_evaluate_price * 1 + this.orderDetail.add_evaluate_price * 1
            this.orderDetail.mi_amount = (this.DISCOUNT * total * this.orderDetail.order_num + ev_price * this.DISCOUNT).toFixed(
                2
            )
        },
        formatExamine(orderDetail) {
            if (this.orderDetail.examine_type == 1) {
                return (
                    orderDetail.examine_price * 1 +
                    orderDetail.taoqi_value_price * 1 +
                    orderDetail.tao_year_price * 1 +
                    orderDetail.screenshot_require_price * 1
                )
            } else {
                return 0
            }
        },
        getLabelPrice(config) {
            // 试客标签
            if (config.receive_mode == 1) {
                // 需要
                let label_receive_price =
                    config.label_area_price * 1 +
                    config.label_sex_price * 1 +
                    config.label_age_price * 1 +
                    config.label_pro_price * 1 +
                    config.label_cate_price * 1 +
                    config.label_huabei_price * 1 +
                    config.label_super_price * 1 +
                    config.label_white_price * 1
                return label_receive_price
            } else {
                return 0
            }
        },
    },
}
</script>

<style lang="less" scoped></style>
