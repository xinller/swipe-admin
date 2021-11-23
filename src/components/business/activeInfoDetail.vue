<template>
    <!-- 活动详情 - 概况+费用详情 -->
    <div class="acInfoDtl-container">
        <div class="section-title mb-20">活动概况</div>
        <div>
            <a-row class="active-profile">
                <a-col :xs="24" :md="12" class="ac-col">
                    <h3 class="ac-title">
                        {{ orderDetail.search_type == 0 ? '搜索关键词' : orderDetail.search_type == 1 ? '淘口令' : '二维码' }}:
                    </h3>
                    <p class="ac-text" v-if="orderDetail.search_type != 2">
                        <span v-for="(word, index) in search_keyword" :key="index">{{ word.keyword }}({{ word.number }})单,</span>
                    </p>
                    <div class="ac-text" v-if="orderDetail.search_type == 2">
                        <span v-for="(word, index) in search_keyword" :key="index">
                            <img :src="word.keyword" class="thumb" /> ({{ word.number }})单

                            <br />
                            <div class="mtb-10" v-if="word.images">
                                <span class="mr-10">实物图:</span>
                                <img :src="img" v-for="img in word.images.split(',')" :key="img" class="thumb mr-10" />
                            </div>
                        </span>
                    </div>
                </a-col>
                <a-col :xs="24" :md="12" class="ac-col">
                    <h3 class="ac-title">买号最低要求:</h3>
                    <div class="ac-text">
                        {{ format_buyer_level(orderDetail.buyer_level) }}
                        <!-- <img src="../../assets/images/task/x.png" class="lv-icon" v-for="i in 3" :key="i" /> -->
                    </div>
                </a-col>
            </a-row>
            <a-row class="active-profile">
                <a-col :xs="24" :md="12" class="ac-col">
                    <h3 class="ac-title">备用关键词:</h3>
                    <p class="ac-text">{{ orderDetail.backup_remark }}</p>
                </a-col>
                <a-col :xs="24" :md="12" class="ac-col">
                    <h3 class="ac-title">活动摘要:</h3>
                    <div class="ac-text pb-10">
                        <div class="ac-text-zy">
                            <!-- <span class="buyer-ys" >延收</span> -->
                            <span class="buyer-zp" v-if="orderDetail.add_evaluate == 1">追评</span>
                            <span class="buyer-ys" v-if="orderDetail.is_pre == 1">预售</span>
                            <span class="buyer-s" v-if="orderDetail.activity_type == 1">优</span>
                            <template v-if="orderDetail.browse_require_list && orderDetail.browse_require_list.length > 0">
                                <span class="buyer-s" v-for="i in orderDetail.browse_require_list" :key="i">
                                    {{ util.formatBrowse(i) }}
                                </span>
                            </template>
                        </div>
                    </div>
                </a-col>
            </a-row>
            <a-row class="active-profile">
                <a-col :xs="24" :md="12" class="ac-col">
                    <h3 class="ac-title">返款方式:</h3>
                    <p class="ac-text">{{ orderDetail.back_type == 1 ? '商家返款' : '平台返款' }}</p>
                </a-col>
                <a-col :xs="24" :md="12" class="ac-col">
                    <h3 class="ac-title">审核方式:</h3>
                    <p class="ac-text">{{ orderDetail.examine_type == 1 ? '商家审核' : '平台审核' }}</p>
                </a-col>
            </a-row>
            <a-row class="active-profile">
                <a-col :xs="24" :md="12" class="ac-col" v-if="orderDetail.is_pre == 1">
                    <h3 class="ac-title">预售时间:</h3>
                    <p class="ac-text">{{ format_buyer_pre(orderDetail.presale_require) }}</p>
                </a-col>
                <a-col :xs="24" :md="12" class="ac-col">
                    <h3 class="ac-title">活动开始时间:</h3>
                    <p class="ac-text">{{ orderDetail.start_time }}</p>
                </a-col>
            </a-row>
            <a-row class="active-profile">
                <a-col :xs="24" :md="12" class="ac-col">
                    <h3 class="ac-title">发布间隔:</h3>
                    <div class="ac-text">{{ orderDetail.time_interval }}分钟</div>
                </a-col>
                <a-col :xs="24" :md="12" class="ac-col">
                    <h3 class="ac-title">活动完成时间:</h3>
                    <p class="ac-text">{{ format_confirm_time(orderDetail.confirm_time) }}</p>
                </a-col>
            </a-row>
            <a-row class="active-profile">
                <a-col :xs="24" :md="12" class="ac-col">
                    <h3 class="ac-title">确认收货时间:</h3>
                    <p class="ac-text">{{ format_confirm_type(orderDetail.confirm_type) }}</p>
                </a-col>
                <a-col :xs="24" :md="12" class="ac-col">
                    <h3 class="ac-title">搜索排序:</h3>
                    <div class="ac-text">{{ orderDetail.sort_type == 0 ? '综合排序' : '销量排序' }}</div>
                </a-col>
            </a-row>
            <a-row class="active-profile">
                <a-col :xs="24" :md="12" class="ac-col">
                    <h3 class="ac-title">周点数:</h3>
                    <p class="ac-text">{{ format_week_click(orderDetail.week_click) }}</p>
                </a-col>
                <a-col :xs="24" :md="12" class="ac-col">
                    <h3 class="ac-title">试客标签:</h3>
                    <div class="ac-text">
                        <span class="sign-text" v-if="orderDetail.label_area != 0">地域</span>
                        <span class="sign-text" v-if="orderDetail.label_sex != 0">性别</span>
                        <span class="sign-text" v-if="orderDetail.label_age != 0">年龄</span>
                        <span class="sign-text" v-if="orderDetail.label_pro != 0">职业</span>
                        <span class="sign-text" v-if="orderDetail.label_cate != 0">类目</span>
                        <span class="sign-text" v-if="orderDetail.label_huabei != 0">花呗</span>
                        <span class="sign-text" v-if="orderDetail.label_super != 0">超级会员</span>
                        <span class="sign-text" v-if="orderDetail.label_white != 0">白名单</span>
                    </div>
                </a-col>
            </a-row>

            <a-row class="active-profile" v-if="orderDetail.detail_check == 1">
                <a-col :xs="24" :md="12" class="ac-col">
                    <h3 class="ac-title">验证关键词:</h3>
                    <p class="ac-text">{{ orderDetail.detail_check_keyword }}</p>
                </a-col>
                <a-col :xs="24" :md="12" class="ac-col">
                    <h3 class="ac-title">验证关键词图片</h3>
                    <div class="ac-text">
                        <img :src="orderDetail.detail_check_image" class="ac-img" />
                    </div>
                </a-col>
            </a-row>
            <a-row class="active-profile">
                <a-col :xs="24" :md="12" class="ac-col">
                    <h3 class="ac-title">试客评价类型:</h3>
                    <p class="ac-text">
                        <span v-if="orderDetail.buyer_evaluate == 0">5星好评(无文字)</span>
                        <span v-if="orderDetail.buyer_evaluate == 1">5星好评(好评)</span>
                        <span v-if="orderDetail.buyer_evaluate == 2">不评价(只确认收货)</span>
                        <span v-if="orderDetail.buyer_evaluate == 3">优质好评</span>
                        <span v-if="orderDetail.buyer_evaluate == 4">图文好评</span>
                    </p>
                </a-col>
            </a-row>
            <a-row class="active-profile">
                <a-col :xs="24" :md="12" class="ac-col">
                    <h3 class="ac-title">普通评价:</h3>
                    <div class="ac-text">
                        <div class="flexrow" v-for="(item, index) in buyer_evaluate_words" :key="index">
                            <span>{{ item.comment }}</span>
                            <div class="flex" v-if="item.images">
                                <img v-for="(img, idx) in item.images.split(',')" :src="img" :key="idx" class="ac-img" />
                            </div>
                        </div>
                    </div>
                </a-col>
                <a-col :xs="24" :md="12" class="ac-col">
                    <h3 class="ac-title">追加评价:</h3>
                    <div class="ac-text">
                        <div class="flexrow" v-for="(item, index) in add_evaluate_words" :key="index">
                            <span>{{ item.comment }}</span>
                            <div class="flex" v-if="item.images">
                                <img v-for="(img, idx) in item.images.split(',')" :src="img" :key="idx" class="ac-img" />
                            </div>
                        </div>
                    </div>
                </a-col>
            </a-row>
            <a-row class="active-profile">
                <a-col :xs="24" :md="12" class="ac-col">
                    <h3 class="ac-title">超级打标:</h3>
                    <p class="ac-text">{{ orderDetail.super_sign == 0 ? '不需要' : '需要' }}</p>
                </a-col>
                <a-col :xs="24" :md="12" class="ac-col">
                    <h3 class="ac-title">截图模式:</h3>
                    <div class="ac-text">
                        <span v-if="orderDetail.screen_mode == 0">只需一张截图(只提供一张店外搜索列表找到宝贝截图)</span>
                        <span v-if="orderDetail.screen_mode == 1">无需截图(全程没有任何截图、包括付款和评价,安全性高) </span>
                        <span v-if="orderDetail.screen_mode == 2">全程截图(此方式可能会被淘宝检测 ,谨慎使用)</span>
                        <span> ({{ orderDetail.taobao_ordersn == 0 ? '完整订单编号' : '订单编号后三位' }})</span>
                    </div>
                </a-col>
            </a-row>
            <a-row class="active-profile">
                <a-col :xs="24" :md="12" class="ac-col">
                    <h3 class="ac-title">注意事项:</h3>
                    <p class="ac-text">{{ orderDetail.attention_remark }}</p>
                </a-col>
                <a-col :xs="24" :md="12" class="ac-col">
                    <h3 class="ac-title">注意事项图</h3>
                    <div class="ac-text" v-if="remark_imgs.length > 0">
                        <img v-for="(img, index) in remark_imgs" :src="img" :key="index" class="ac-img" />
                    </div>
                </a-col>
            </a-row>
        </div>

        <div class="section-title mb-20">活动费用详情</div>
        <a-row class="active-fee-table">
            <a-col class="mtb-20">
                <span class="size-14"
                    >鲸币押金: <span class="c-red">{{ orderDetail.mi_amount }}</span
                    >元</span
                >
            </a-col>
            <a-row class="row-tr">
                <a-col :xs="6">
                    <div>费用明细</div>
                </a-col>
                <a-col :xs="6">
                    <div>赏金小计</div>
                </a-col>
                <a-col :xs="6">
                    <div>任务数/个</div>
                </a-col>
                <a-col :xs="6">
                    <div>合计</div>
                </a-col>
            </a-row>
            <a-row class="size-12 row-tr">
                <a-col :xs="6">
                    <div v-if="orderDetail.search_type == 0">
                        基础赏金:{{ orderDetail.base_price * 1 + orderDetail.buy_price_mi_price * 1 }}
                    </div>
                    <div v-if="orderDetail.search_type != 0">基础赏金: 0</div>
                    <div>技术服务费:{{ orderDetail.basic_service_fee * 1 }}</div>
                </a-col>
                <a-col :xs="6">
                    <div v-if="orderDetail.search_type == 0">
                        {{ orderDetail.base_price * 1 + orderDetail.buy_price_mi_price * 1 + orderDetail.basic_service_fee * 1 }}
                    </div>
                    <div v-if="orderDetail.search_type != 0">
                        {{ orderDetail.basic_service_fee * 1 }}
                    </div>
                </a-col>
                <a-col :xs="6">
                    <div>{{ orderDetail.order_num }}</div>
                </a-col>
                <a-col :xs="6">
                    <div v-if="orderDetail.search_type == 0">
                        {{
                            orderDetail.base_price * 1 + orderDetail.buy_price_mi_price * 1 + orderDetail.basic_service_fee * 1
                        }}*{{ orderDetail.order_num }}*{{ DISCOUNT }}
                        =
                        {{
                            (
                                (orderDetail.base_price * 1 +
                                    orderDetail.buy_price_mi_price * 1 +
                                    orderDetail.basic_service_fee * 1) *
                                orderDetail.order_num *
                                DISCOUNT
                            ).toFixed(2)
                        }}
                    </div>
                    <div v-if="orderDetail.search_type != 0">
                        {{ orderDetail.basic_service_fee * 1 }}*{{ orderDetail.order_num }}*{{ DISCOUNT }} =
                        {{ (orderDetail.basic_service_fee * orderDetail.order_num * DISCOUNT).toFixed(2) }}
                    </div>
                </a-col>
            </a-row>
            <a-row class="size-12 row-tr">
                <a-col :xs="6">
                    <div>超级打标：{{ orderDetail.super_sign_price }}</div>
                    <div>
                        审号:{{
                            (
                                orderDetail.examine_price * 1 +
                                orderDetail.screenshot_require_price * 1 +
                                orderDetail.taoqi_value_price * 1 +
                                orderDetail.tao_year_price * 1
                            ).toFixed(2)
                        }}
                    </div>
                    <div>预售:{{ orderDetail.presale_require_price }}</div>
                    <div>试客标签:{{ getLabelPrice(orderDetail) }}</div>
                    <div>白名单：{{ orderDetail.label_white_price }}</div>
                    <div>确认收货时间(延收):{{ orderDetail.confirm_type_price }}</div>
                    <div>试客等级:{{ orderDetail.buyer_level_price }}</div>
                    <div>周点数：{{ orderDetail.week_click_price }}</div>
                    <div v-if="orderDetail.back_type == 0">返款方式:{{ orderDetail.back_type_price }}</div>
                    <div>其他:{{ orderDetail.confirm_time_price }}</div>
                </a-col>
                <a-col :xs="6">
                    <div>{{ getTotalPrice(orderDetail) }}</div>
                    <!-- <div>+2(追评)</div> -->
                </a-col>
                <a-col :xs="6">
                    <div>{{ orderDetail.order_num }}</div>
                </a-col>
                <a-col :xs="6">
                    <div>
                        {{ getTotalPrice(orderDetail) }}*{{ orderDetail.order_num }}*{{ DISCOUNT }}=
                        {{ (getTotalPrice(orderDetail) * orderDetail.order_num * DISCOUNT).toFixed(2) }}
                    </div>
                </a-col>
            </a-row>
            <a-row class="size-12 row-tr">
                <a-col :xs="6">
                    <div>
                        试客评价:{{ orderDetail.buyer_evaluate_price }}
                        <span v-if="orderDetail.buyer_evaluate_words">({{ orderDetail.buyer_evaluate_words.length }})单</span>
                    </div>
                    <div>
                        试客追评:{{ orderDetail.add_evaluate_price }}
                        <span v-if="orderDetail.add_evaluate_words">{{ orderDetail.add_evaluate_words.length }}单</span>
                    </div>
                </a-col>
                <a-col :xs="6">
                    {{ getTotalEvaPrice(orderDetail) }}
                </a-col>
                <a-col :xs="6"></a-col>
                <a-col :xs="6">
                    {{ getTotalEvaPrice(orderDetail) }} *{{ this.DISCOUNT }}=
                    {{ getTotalEvaPrice(orderDetail) * this.DISCOUNT }}
                </a-col>
            </a-row>
            <a-col class="mtb-20">
                <span class="size-14">
                    货款押金:
                    <span class="c-red">{{ orderDetail.back_type != 1 ? orderDetail.payment_amount : 0 }}</span
                    >元
                    <span class="size-12 c-gray" v-if="orderDetail.back_type == 1">（您已选择自主返款，无需预付货款押金）</span>
                </span>
            </a-col>
            <a-row class="size-12 row-tr">
                <a-col :xs="6">宝贝金额</a-col>
                <a-col :xs="4">邮费</a-col>
                <a-col :xs="4">小计</a-col>
                <a-col :xs="4">任务数/个</a-col>
                <a-col :xs="6">合计</a-col>
            </a-row>
            <a-row class="size-12 row-tr">
                <a-col :xs="6"
                    >{{ orderDetail.buy_price }}*{{ orderDetail.buy_num }} =
                    {{ orderDetail.buy_price * orderDetail.buy_num }}</a-col
                >
                <a-col :xs="4">{{ orderDetail.is_free_ship == 1 ? 0 : 10 }}</a-col>
                <a-col :xs="4">{{ orderDetail.buy_price * 1 + 10 * 1 }}</a-col>
                <a-col :xs="4">{{ orderDetail.order_num }}</a-col>
                <a-col :xs="6">{{ format_total(orderDetail) }}</a-col>
            </a-row>
            <a-row class="row-total">
                <a-col
                    >总计 : <span class="size-20 c-red">¥{{ orderDetail.mi_amount }}</span></a-col
                >
                <a-col
                    >鲸币押金 : <span class="size-14 c-red">{{ orderDetail.mi_amount }}</span
                    >元
                    <span v-if="orderDetail.back_type != 1">
                        +货款押金 <span class="c-red">{{ orderDetail.payment_amount }}</span
                        >元
                    </span></a-col
                >
            </a-row>
        </a-row>
    </div>
</template>

<script>
import * as api from '@/api/api'
import { mapGetters } from 'vuex'
export default {
    name: 'activeInfoDetail',
    props: {
        detail: {
            type: Object,
        },
    },
    watch: {
        detail(newVal) {
            this.orderDetail = newVal
            this.getRemark()
            // this.getTotalPrice()
        },
    },
    data() {
        return {
            remark_imgs: [],
            buyer_evaluate_words: [],
            add_evaluate_words: [],
            search_keyword: [],
            sysConfig: '',
            orderDetail: this.detail,
            priceTaskConfig: this.$store.state.task.priceTaskConfig,
        }
    },
    computed: {
        ...mapGetters(['DISCOUNT']),
    },
    created() {
        this.getUserDetail()
    },
    mounted() {
        this.getRemark()
        this.getConfig()
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
        getRemark() {
            console.log(this.orderDetail)
            this.remark_imgs = this.orderDetail.remark_img ? this.orderDetail.remark_img.split(',') : []
            this.buyer_evaluate_words = this.orderDetail.buyer_evaluate_words
            this.add_evaluate_words = this.orderDetail.add_evaluate_words
            this.search_keyword = this.orderDetail.search_keyword_arr
            // this.search_keyword = JSON.parse(this.orderDetail.search_keyword)
        },
        formatRequire(type) {
            if (!this.orderDetail.browse_require) return false
            else {
                let reqs = this.orderDetail.browse_require
                return _.findIndex(reqs, (v) => v == type) >= 0
            }
        },
        // 获取配置信息
        getConfig() {
            api.valueAddedServices().then((res) => {
                console.log('res', res)
                if (res.success) {
                    this.sysConfig = res.data
                }
            })
        },
        // 确认收货时间类型
        format_confirm_type(id) {
            if (this.sysConfig) {
                let arr = this.sysConfig.sys.receive
                let obj = _.find(arr, (v) => v.id == id)
                return obj ? obj['title'] : ''
            }
        },
        // 周点数
        format_week_click(id) {
            if (this.sysConfig) {
                let arr = this.sysConfig.sys.week
                let obj = _.find(arr, (v) => v.id == id)
                return obj ? obj['title'] : ''
            }
        },
        // 完成时间类型
        format_confirm_time(id) {
            if (this.sysConfig) {
                let arr = this.sysConfig.sys.montus
                let obj = _.find(arr, (v) => v.id == id)
                return obj ? obj['title'] : ''
            }
        },
        // 买号等级
        format_buyer_level(id) {
            if (this.sysConfig) {
                let arr = this.sysConfig.sys.account
                let obj = _.find(arr, (v) => v.id == id)
                return obj ? obj['title'] : ''
            }
        },
        // 预售
        format_buyer_pre(id) {
            if (this.sysConfig) {
                let arr = this.sysConfig.sys.pre
                let obj = _.find(arr, (v) => v.id == id)
                return obj ? obj['title'] : ''
            }
        },
        // 宝贝总价
        format_total(orderDetail) {
            let stotal = orderDetail.buy_price * orderDetail.buy_num + (orderDetail.is_free_ship == 1 ? 0 : 10 * 1)
            return `${stotal}*${orderDetail.order_num} = ${stotal * orderDetail.order_num}`
        },
        // 标签总价
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
                    config.label_super_price * 1
                return label_receive_price
            } else {
                return 0
            }
        },
        getTotalPrice(config) {
            // 总鲸币
            let total_price_dj =
                config.super_sign_price * 1 +
                config.examine_price * 1 +
                config.screenshot_require_price * 1 +
                config.taoqi_value_price * 1 +
                config.tao_year_price * 1 +
                config.presale_require_price * 1 +
                this.getLabelPrice(config) +
                config.label_white_price * 1 +
                config.confirm_type_price * 1 +
                config.buyer_level_price * 1 +
                config.week_click_price * 1 +
                // config.buyer_evaluate_price * 1 +
                // config.add_evaluate_price * 1 +
                config.confirm_time_price * 1
            if (config.back_type == 0) {
                console.log('config', config)
                total_price_dj = total_price_dj * 1 + config.back_type_price * 1
            }
            return total_price_dj.toFixed(2)
        },
        getTotalEvaPrice(config) {
            let total = config.buyer_evaluate_price * 1 + config.add_evaluate_price * 1
            return total.toFixed(2)
        },
    },
}
</script>

<style lang="less" scoped></style>
