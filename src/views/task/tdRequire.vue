<template>
    <div class="tdRequire-container">
        <!-- 任务详情- 活动要求 -->
        <section>
            <a-row class="task-info" v-if="orderData">
                <a-col :xs="6">
                    <div>任务编号</div>
                    <div>{{ orderData.order_code }}</div>
                </a-col>
                <a-col :xs="6">
                    <div>活动编号</div>
                    <div>{{ orderData.order_sn }}</div>
                </a-col>
                <a-col :xs="6">
                    <div>发布时间</div>
                    <div>{{ orderData.public_time }}</div>
                </a-col>
            </a-row>
            <!-- 活动信息 -->
            <div class="section-title">活动信息</div>
            <div class="section-table">
                <a-row class="row-thd">
                    <a-col class="col-th" :xs="3">宝贝</a-col>
                    <a-col class="col-th" :xs="4">活动类型</a-col>
                    <a-col class="col-th" :xs="3">店铺名</a-col>
                    <a-col class="col-th" :xs="2">货款单价</a-col>
                    <a-col class="col-th" :xs="2">拍下数量</a-col>
                    <a-col class="col-th" :xs="2">运费</a-col>
                    <a-col class="col-th" :xs="2">总货款</a-col>
                    <a-col class="col-th" :xs="2">赏金</a-col>
                    <a-col class="col-th" :xs="2">技术服务费</a-col>
                    <a-col class="col-th" :xs="2">总金额</a-col>
                </a-row>
                <a-row type="flex" align="middle" v-if="orderData">
                    <a-col class="col-th" :xs="3">
                        <img :src="orderDetail.data.goods_image" class="thumb" />
                    </a-col>
                    <a-col class="col-th" :xs="4">淘宝/天猫{{ orderData.activity_type == 0 ? '普通' : '优质' }}试用活动</a-col>
                    <a-col class="col-th" :xs="3">
                        <img src="../../assets/images/task/taobao.png" class="tb-icon" v-if="orderDetail.data.platform_type" />
                        <img src="../../assets/images/task/jd.png" class="tb-icon" v-if="orderDetail.data.platform_type == 1" />
                        <img src="../../assets/images/task/pdd.png" class="tb-icon" v-if="orderDetail.data.platform_type == 2" />
                        {{ orderData.store_name }}
                    </a-col>
                    <a-col class="col-th" :xs="2">{{ orderData.buy_price }}</a-col>
                    <a-col class="col-th" :xs="2">{{ orderData.buy_num }}</a-col>
                    <a-col class="col-th" :xs="2">{{ orderData.ship_price }}</a-col>
                    <a-col class="col-th" :xs="2">{{ orderData.pay_amount }}</a-col>
                    <a-col class="col-th" :xs="2">{{ (orderData.mi_amount - orderData.basic_service_fee * 1).toFixed(2) }}</a-col>
                    <a-col class="col-th" :xs="2">{{ orderData.basic_service_fee }}</a-col>
                    <a-col class="col-th" :xs="2">
                        {{ orderData.pay_amount * 1 + orderData.mi_amount * 1 }}
                    </a-col>
                </a-row>
            </div>
            <div class="size-12 c-gray mt-10" v-if="orderGrab">
                注意事项:{{ orderGrab.attention_remark }}
                <div v-if="orderGrab.remark_img">
                    <img :src="img" v-for="(img, index) in orderGrab.remark_img.split(',')" :key="index" />
                </div>
            </div>
            <!-- 搜索浏览下单 -->
            <div class="section-title">搜索浏览下单</div>
            <div class="section-table">
                <a-row class="row-thd">
                    <a-col class="col-th" :xs="2" v-if="orderData">
                        {{ orderData.search_type == 0 ? '搜索关键词' : orderData.search_type == 1 ? '淘口令' : '二维码' }}
                    </a-col>
                    <a-col class="col-th" :xs="2">备用关键词</a-col>
                    <a-col class="col-th" :xs="2">排序方式</a-col>
                    <a-col class="col-th" :xs="2">付款人数</a-col>
                    <a-col class="col-th" :xs="2">搜索展示价</a-col>
                    <a-col class="col-th" :xs="2">筛选条件</a-col>
                    <a-col class="col-th" :xs="2">付款方式</a-col>
                    <a-col class="col-th" :xs="4">浏览要求</a-col>
                    <a-col class="col-th" :xs="2">完成时间</a-col>
                    <a-col class="col-th" :xs="2">预售</a-col>
                    <a-col class="col-th" :xs="2">加赏</a-col>
                </a-row>
                <a-row type="flex" align="middle" v-if="orderGrab">
                    <a-col class="col-th" :xs="2">
                        <!-- {{ orderData.keywords }}  -->
                        <div class="keywords" v-if="orderData && orderData.search_type == 0">
                            {{ orderData.keywords }}
                        </div>

                        <div class="keywords" v-if="orderData && orderData.search_type == 1">
                            {{ orderData.keywords }}
                        </div>
                        <div class="keywords" v-if="orderData && orderData.search_type == 2">
                            <img :src="orderData.keywords" style="width:200px" />
                        </div>
                    </a-col>
                    <a-col class="col-th" :xs="2">{{ orderGrab.backup_remark }}</a-col>
                    <a-col class="col-th" :xs="2">{{ orderGrab.sort_type == 0 ? '综合排序' : '销量排序' }}</a-col>
                    <a-col class="col-th" :xs="2">{{ orderGrab.goods_pau_nums }}</a-col>
                    <a-col class="col-th" :xs="2">{{ orderGrab.goods_search_price }}</a-col>
                    <a-col class="col-th" :xs="2"></a-col>
                    <a-col class="col-th" :xs="2">{{ orderGrab.pay_type | format_payType }}</a-col>
                    <a-col class="col-th" :xs="4">{{ orderGrab.browse_require_name }}</a-col>
                    <a-col class="col-th" :xs="2">{{ orderGrab.confirm_long }}分钟</a-col>
                    <a-col class="col-th" :xs="2">{{ orderGrab.is_pre == 0 ? '否' : '是' }}</a-col>
                    <a-col class="col-th" :xs="2">0.00</a-col>
                </a-row>
            </div>
            <!-- 买号标签 -->
            <div class="section-title">买号标签</div>
            <div class="section-table">
                <a-row class="row-thd">
                    <a-col class="col-th" :xs="2">买手账号等级</a-col>
                    <a-col class="col-th" :xs="2">地域</a-col>
                    <a-col class="col-th" :xs="2">年龄</a-col>
                    <a-col class="col-th" :xs="2">职业</a-col>
                    <a-col class="col-th" :xs="2">性别</a-col>
                    <a-col class="col-th" :xs="4">常购类目</a-col>
                    <a-col class="col-th" :xs="2">淘气值</a-col>
                    <a-col class="col-th" :xs="2">花呗</a-col>
                    <a-col class="col-th" :xs="2">白名单</a-col>
                    <a-col class="col-th" :xs="2">超级会员</a-col>
                    <a-col class="col-th" :xs="2">周点数</a-col>
                </a-row>
                <a-row type="flex" align="middle" v-if="orderUser">
                    <a-col class="col-th flexct jus-ct" :xs="2">
                        <div class="flexct jus-ct" v-if="orderUser.taobao_level_num">
                            <img
                                :src="BASE_URL + orderUser.taobao_img"
                                class="level-icon"
                                v-for="i in orderUser.taobao_level_num"
                                :key="i"
                            />
                        </div>
                    </a-col>
                    <a-col class="col-th" :xs="2"
                        >{{ orderUser.receive_province }}{{ orderUser.receive_city }}{{ orderDetail.receive_area }}</a-col
                    >
                    <a-col class="col-th" :xs="2">{{ orderUser.receive_age }}</a-col>
                    <a-col class="col-th" :xs="2">{{ orderUser.receive_job_name }}</a-col>
                    <a-col class="col-th" :xs="2">{{ orderUser.receive_sex_name }}</a-col>
                    <a-col class="col-th" :xs="4">{{ orderUser.receive_cate_name }}</a-col>
                    <a-col class="col-th" :xs="2">{{ orderUser.receive_taobao_value_name }}</a-col>
                    <a-col class="col-th" :xs="2">{{ orderUser.is_huabei == 0 ? '否' : '是' }}</a-col>
                    <a-col class="col-th" :xs="2">{{ orderUser.is_white == 0 ? '否' : '是' }}</a-col>
                    <a-col class="col-th" :xs="2">{{ orderUser.is_super == 0 ? '否' : '是' }}</a-col>
                    <a-col class="col-th" :xs="2">{{ orderUser.receive_week_click }}</a-col>
                </a-row>
            </div>
            <!-- 收货评价 -->
            <div class="section-title">收货评价</div>
            <div class="section-table">
                <a-row class="row-thd">
                    <a-col class="col-th" :xs="4">收货时间</a-col>
                    <a-col class="col-th" :xs="10">评价要求</a-col>
                    <a-col class="col-th" :xs="10">追评要求</a-col>
                </a-row>
                <a-row type="flex" align="middle" v-if="orderGrab">
                    <a-col class="col-th" :xs="4">{{
                        orderGrab.confirm_day_long == 0 ? '物流确认' : orderGrab.confirm_day_long + '天后确认'
                    }}</a-col>
                    <a-col class="col-th " :xs="10">
                        <div class="txt-lf plr-10">评价类型: {{ orderGrab.buyer_evaluate | format_evaluate }}</div>
                        <template v-if="orderGrab.buyer_evaluate_words">
                            <div class="plr-10" v-for="(item, index) in orderGrab.buyer_evaluate_words" :key="index">
                                <div class="txt-lf mt-10">文字内容:{{ item.comment }}</div>
                                <div class="flexct mt-10">
                                    <span class="mr-10">评价图片:</span>
                                    <template v-if="item.images">
                                        <img v-for="(img, i) in item.images.split(',')" :key="i" :src="img" class="thumb mr-10" />
                                    </template>
                                </div>
                            </div>
                        </template>
                    </a-col>
                    <a-col class="col-th plr-10" :xs="10">
                        <div class="plr-10 txt-lf">追加评价 : {{ orderGrab.add_evaluate == 0 ? '不需要' : '需要' }}</div>

                        <template v-if="orderGrab.add_evaluate_words">
                            <div class="plr-10" v-for="(item, index) in orderGrab.add_evaluate_words" :key="index">
                                <div class="txt-lf mt-10">文字内容:{{ item.comment }}</div>
                                <div class="flexct mt-10">
                                    <span class="mr-10">评价图片:</span>
                                    <template v-if="item.images">
                                        <img v-for="(img, i) in item.images.split(',')" :key="i" :src="img" class="thumb mr-10" />
                                    </template>
                                </div>
                            </div>
                        </template>
                    </a-col>
                </a-row>
            </div>
            <!-- 其他 -->
            <div class="section-title">其他</div>
            <div class="section-table">
                <a-row class="row-thd">
                    <a-col class="col-th">截图模式</a-col>
                </a-row>
                <a-row v-if="orderGrab">
                    <a-col class="col-th" v-if="orderGrab.screen_mode == 0"
                        >只需一张截图(只提供一张店外搜索列表找到宝贝截图)</a-col
                    >
                    <a-col class="col-th" v-if="orderGrab.screen_mode == 1"
                        >无需截图(全程没有任何截图、包括付款和评价,安全性高)
                    </a-col>
                    <a-col class="col-th" v-if="orderGrab.screen_mode == 2">全程截图(此方式可能会被淘宝检测 ,谨慎使用)</a-col>
                </a-row>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    name: 'tdRequire',
    props: {
        detail: {
            type: Object,
        },
    },
    watch: {
        detail(nval) {
            this.orderDetail = nval
            this.orderData = nval.data
            this.orderGrab = nval.grab
            this.orderUser = nval.taobao
        },
    },
    filters: {
        // 付款方式
        format_payType(val) {
            switch (Number(val)) {
                case 0:
                    return '无所谓'
                case 1:
                    return '禁止使用花呗、信用卡付款'
                case 2:
                    return '必须使用花呗付款'
            }
        },
        // 评价类型
        format_evaluate(val) {
            switch (Number(val)) {
                case 0:
                    return '5星好评(无文字)'
                case 1:
                    return '5星好评(好评)'
                case 2:
                    return '不评价(只确认收货)'
                case 3:
                    return '优质好评'
                case 4:
                    return '图文好评'
            }
        },
    },
    data() {
        return {
            orderDetail: this.detail,
            orderData: this.detail ? this.detail.data : '',
            orderGrab: this.detail ? this.detail.grab : '',
            orderUser: this.detail ? this.detail.taobao : '',
        }
    },
}
</script>

<style lang="less" scoped></style>
