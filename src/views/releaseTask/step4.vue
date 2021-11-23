<template>
    <a-spin :spinning="spinning" class="releaseTask-container">
        <div class="title">
            发布任务
            <span class="ml-5 c-gray size-12">标题：{{ postTaskInfo.goods_title }} </span>
            <span class="ml-5 c-gray size-12">店铺名：{{ postTaskInfo.store_name }}</span>
        </div>

        <stepCom :activeKey="4" />
        <div class="step-page">
            <!-- 店铺金额信息 每步不一样 -->
            <orderPrice :detail="orderDetail"></orderPrice>
            <div class="section-title">
                增值服务选择
                <v-tooltip placement="topLeft">
                    <template slot="content">选择增值服务后能更加精准的为您匹配适合您产品标签的买家，推荐使用！</template>
                </v-tooltip>
            </div>
            <div class="section-con">
                <!-- 试客标签设置 -->
                <div class="cond-item" v-if="taskInfo.search_type == 0">
                    <div class="cond-left"><div class="cond-title">试客标签设置</div></div>
                    <div class="cond-right">
                        <a-select v-model="taskInfo.receive_mode" @change="changeReceiveMode">
                            <a-select-option :value="0">不需要</a-select-option>
                            <!-- 默认需要 -->
                            <a-select-option :value="1">需要</a-select-option>
                        </a-select>

                        <!-- 不需要 -->
                        <span class="size-12 ml-10 c-red" v-if="taskInfo.receive_mode == 0"
                            >选择试客标签,让试客人群更精准,权重更高,强烈推荐</span
                        >
                        <!-- 需要 价格选择之和 -->
                        <span class="size-12 ml-10 c-red" v-if="taskInfo.receive_mode == 1 && receive_price > 0"
                            >{{ receive_price }}鲸币/单*{{ sendNum }}单 = {{ receive_price * sendNum }}鲸币</span
                        >
                    </div>
                </div>
                <div class="cond-item sign-wrap" v-if="taskInfo.search_type == 0 && taskInfo.receive_mode == 1">
                    <!-- 点击可展开选项 ,选项选择上面才勾选并显示取消, 取消选择时选择中项取消 标题也取消选择勾-->
                    <a-collapse class="sign-collapse">
                        <a-collapse-panel key="1" :show-arrow="false">
                            <template slot="header">
                                <span>
                                    <img
                                        v-if="label_area.length == 0"
                                        src="../../assets/images/task/check.png"
                                        class="check-icon"
                                    />
                                    <img
                                        v-if="label_area.length > 0"
                                        src="../../assets/images/task/oncheck.png"
                                        class="check-icon"
                                    />
                                    地域选择(以下所选地区 <span class="c-red">可接该活动</span>,+{{ label_area_price }}元/单 )
                                </span>
                                <span class="c-primary" v-if="label_area.length > 0" @click="cancelChoose('label_area')"
                                    >取消选择</span
                                >
                            </template>
                            <a-checkbox-group v-model="label_area" @change="changeLabel('label_area')">
                                <a-checkbox :value="item.id" v-for="item in sysConfig_area" :key="item.id">
                                    {{ item.name }}
                                </a-checkbox>
                            </a-checkbox-group>
                        </a-collapse-panel>
                        <a-collapse-panel key="2" :show-arrow="false">
                            <template slot="header">
                                <span>
                                    <img
                                        v-if="label_age.length == 0"
                                        src="../../assets/images/task/check.png"
                                        class="check-icon"
                                    />
                                    <img
                                        v-if="label_age.length > 0"
                                        src="../../assets/images/task/oncheck.png"
                                        class="check-icon"
                                    />
                                    年龄选择(仅限选择年龄段用户 <span class="c-red">可接该活动</span>,+{{ label_age_price }}元/单
                                    )
                                </span>
                                <span class="c-primary" v-if="label_age.length > 0" @click="cancelChoose('label_age')"
                                    >取消选择</span
                                >
                            </template>
                            <a-checkbox-group v-model="label_age" @change="changeLabel('label_age')">
                                <a-checkbox :value="item.id" v-for="item in sysConfig_age" :key="item.id">{{
                                    item.age_name
                                }}</a-checkbox>
                            </a-checkbox-group>
                        </a-collapse-panel>
                        <a-collapse-panel key="3" :show-arrow="false">
                            <template slot="header">
                                <span>
                                    <img
                                        v-if="taskInfo.label_sex == ''"
                                        src="../../assets/images/task/check.png"
                                        class="check-icon"
                                    />
                                    <img
                                        v-if="taskInfo.label_sex != ''"
                                        src="../../assets/images/task/oncheck.png"
                                        class="check-icon"
                                    />
                                    性别选择(仅限选择性别用户 <span class="c-red">可接该活动</span>,+{{ label_sex_price }}元/单 )
                                </span>
                                <span class="c-primary" v-if="taskInfo.label_sex != ''" @click="cancelChoose('label_sex')"
                                    >取消选择</span
                                >
                            </template>
                            <a-radio-group class="radio-list" v-model="taskInfo.label_sex" @change="changeSex">
                                <!-- <a-radio value="0">未知</a-radio> -->
                                <a-radio :value="1">男</a-radio>
                                <a-radio :value="2">女</a-radio>
                            </a-radio-group>
                        </a-collapse-panel>
                        <a-collapse-panel key="4" :show-arrow="false">
                            <template slot="header">
                                <span>
                                    <img
                                        v-if="label_pro.length == 0"
                                        src="../../assets/images/task/check.png"
                                        class="check-icon"
                                    />
                                    <img
                                        v-if="label_pro.length > 0"
                                        src="../../assets/images/task/oncheck.png"
                                        class="check-icon"
                                    />
                                    职业选择(仅限选择职业用户 <span class="c-red">可接该活动</span>,+{{ label_pro_price }}元/单 )
                                </span>
                                <span class="c-primary" v-if="label_pro.length > 0" @click="cancelChoose('label_pro')"
                                    >取消选择</span
                                >
                            </template>
                            <a-checkbox-group v-model="label_pro" @change="changeLabel('label_pro')">
                                <a-checkbox :value="item.id" v-for="item in sysConfig_profession" :key="item.id">
                                    {{ item.profession_name }}
                                </a-checkbox>
                            </a-checkbox-group>
                        </a-collapse-panel>
                        <a-collapse-panel key="5" :show-arrow="false">
                            <template slot="header">
                                <span>
                                    <img
                                        v-if="label_cate.length == 0"
                                        src="../../assets/images/task/check.png"
                                        class="check-icon"
                                    />
                                    <img
                                        v-if="label_cate.length > 0"
                                        src="../../assets/images/task/oncheck.png"
                                        class="check-icon"
                                    />
                                    类目选择(仅限常购该类目的用户 <span class="c-red">可接该活动</span>,+{{
                                        label_cate_price
                                    }}元/单 )
                                </span>
                                <span class="c-primary" v-if="label_cate.length > 0" @click="cancelChoose('label_cate')"
                                    >取消选择</span
                                >
                            </template>
                            <a-checkbox-group v-model="label_cate" @change="changeLabel('label_cate')">
                                <a-checkbox :value="item.id" v-for="item in sysConfig_category" :key="item.id">
                                    {{ item.category_name }}
                                </a-checkbox>
                            </a-checkbox-group>
                        </a-collapse-panel>
                    </a-collapse>
                    <div class="list">
                        <a-checkbox v-model="label_huabei" @change="changeCheckbox($event, 'label_huabei')">
                            <span>
                                花呗 （指已开通花呗的用户
                                <span class="c-red">可接该活动</span>，
                                不是指活动要用花呗付款，开通了花呗的买号在淘宝内部被认为是优质的账号，用这些账号很安全，权重高
                                <span>，+{{ label_huabei_price }}元/单</span>）
                            </span>
                        </a-checkbox>
                    </div>
                    <div class="list">
                        <a-checkbox v-model="label_white" @change="changeCheckbox($event, 'label_white')">
                            <span>
                                白名单 <span class="bp-tip">降权包赔</span> (仅限白名单用户
                                <span class="c-red">可接该活动</span>，
                                大多是店铺的真实粉丝,并通过内部稽查系统从多维度过滤掉降权号,恶意退款号,黑号等,确保粉丝的安全性,具体算法请联系客服.
                                <span>，+{{ label_white_price }}元/单</span>）
                            </span>
                        </a-checkbox>
                    </div>
                    <div class="list">
                        <a-checkbox v-model="label_super" @change="changeCheckbox($event, 'label_super')">
                            <span>
                                超级会员 （仅限淘气值超过1000分的用户
                                <span class="c-red">可接该活动</span>，
                                超级会员配合优质买家秀能够给宝贝快速加权,评价中显示超级会员专属标志
                                <span>，+{{ label_super_price }}元/单</span>）
                            </span>
                        </a-checkbox>
                    </div>
                </div>

                <!-- 超级打标 -->
                <div class="cond-item" v-if="taskInfo.search_type == 0">
                    <div class="cond-left">
                        <div class="cond-title">超级打标 <img src="../../assets/images/task/new.png" class="new-icon" /></div>
                    </div>
                    <div class="cond-right">
                        <a-select v-model="taskInfo.super_sign" @change="changeSuperSign">
                            <a-select-option :value="0">不需要</a-select-option>
                            <a-select-option :value="1">需要</a-select-option>
                        </a-select>
                        <!-- 不需要 -->
                        <span class="ml-10 c-red" v-if="taskInfo.super_sign == 0">
                            <a-popover placement="right">
                                <template slot="content">
                                    <img src="../../assets/images/task/super.png" class="super-img" />
                                </template>
                                <img src="../../assets/images/task/ques-on.png" style="width:16px" />
                                <span class="c-primary">标签效果</span>
                            </a-popover>
                            <span class="c-red size-12">
                                买家做任务之前,会被淘宝系统打上意向购买您商品的人群标签,让任务权重大大增加.
                            </span>
                        </span>
                        <!-- 需要 -->
                        <span class="ml-10 c-red" v-if="taskInfo.super_sign == 1"
                            >{{ super_sign_price }}鲸币/单*{{ sendNum }}单 = {{ super_sign_price * sendNum }}鲸币</span
                        >
                    </div>
                </div>
                <!-- 试客账号等级 -->
                <div class="cond-item" v-if="taskInfo.search_type == 0">
                    <div class="cond-left">
                        <div class="cond-title">试客账号等级</div>
                    </div>
                    <div class="cond-right">
                        <a-select v-model="taskInfo.buyer_level" @change="changeSelect('buyer_level', 'account')">
                            <a-select-option :value="item.id" v-for="item in sysConfig_sys.account" :key="item.id">
                                {{ item.title }}
                            </a-select-option>
                        </a-select>
                        <!-- *1单数量根据上一步发布单量显示 -->
                        <span class="rt-btn ml-10 c-red">
                            {{ formatTotalPrice(orderDetail.buyer_level_price) }}
                        </span>
                    </div>
                </div>
                <!-- 周点数 -->
                <div class="cond-item" v-if="taskInfo.search_type == 0">
                    <div class="cond-left">
                        <div class="cond-title">
                            周点数
                            <v-tooltip>
                                <template slot="content">淘宝账号注册起，到现在总的周平均评价点数。</template>
                            </v-tooltip>
                        </div>
                    </div>
                    <div class="cond-right">
                        <a-select v-model="taskInfo.week_click" @change="changeSelect('week_click', 'week')">
                            <a-select-option :value="item.id" v-for="item in sysConfig_sys.week" :key="item.id">
                                {{ item.title }}
                            </a-select-option>
                        </a-select>

                        <!-- *1单数量根据上一步发布单量显示 -->
                        <span class="rt-btn ml-10 c-red">
                            {{ formatTotalPrice(orderDetail.week_click_price) }}
                            <!-- {{ week_click_price }}鲸币/单*{{ sendNum }}单={{ week_click_price * sendNum }}鲸币 -->
                        </span>
                    </div>
                </div>
                <!-- 确认收货时间 -->
                <div class="cond-item">
                    <div class="cond-left">
                        <div class="cond-title">
                            确认收货时间
                            <v-tooltip>
                                <template slot="content">
                                    是指买家签收物流后，隔多少天再确认收货，适当延收更符合真实购物路径。
                                </template>
                            </v-tooltip>
                        </div>
                    </div>
                    <div class="cond-right">
                        <a-select v-model="taskInfo.confirm_type" @change="changeSelect('confirm_type', 'receive')">
                            <a-select-option :value="item.id" v-for="item in sysConfig_sys.receive" :key="item.id">
                                {{ item.title }}
                            </a-select-option>
                        </a-select>

                        <!-- *1单数量根据上一步发布单量显示 -->
                        <span class="rt-btn ml-10 c-red">
                            {{ formatTotalPrice(orderDetail.confirm_type_price) }}
                        </span>
                    </div>
                </div>
                <!-- 试客评价 -->
                <div class="cond-item">
                    <div class="cond-left">
                        <div class="cond-title">
                            试客评价
                        </div>
                    </div>
                    <div class="cond-right">
                        <a-select v-model="taskInfo.buyer_evaluate">
                            <a-select-option :value="0">5星好评(无文字)</a-select-option>
                            <a-select-option :value="1">5星好评(好评)</a-select-option>
                            <a-select-option :value="2">不评价(只确认收货)</a-select-option>
                            <a-select-option :value="3">优质好评</a-select-option>
                            <a-select-option :value="4">图文好评</a-select-option>
                        </a-select>
                        <span class="size-12 c-red ml-10" v-if="taskInfo.buyer_evaluate == 0">
                            试客只进行5星好评，不进行文字评价 单量较大的商家建议确认收货等默认评价，防止评价被删除
                        </span>
                        <span class="size-12 c-red ml-10" v-if="taskInfo.buyer_evaluate == 1">
                            试客进行5星好评，文字评价填写“好评”两字
                        </span>
                        <span class="size-12 c-red ml-10" v-if="taskInfo.buyer_evaluate == 2">
                            只收货不评价 单量较大的商家建议确认收货等默认评价，防止评价被删除
                        </span>
                        <a-button
                            class="rt-btn size-12 ml-10"
                            v-if="taskInfo.buyer_evaluate == 3"
                            @click="showEvaluateModal('3')"
                        >
                            添加优质好评
                        </a-button>
                        <a-button
                            class="rt-btn size-12 ml-10"
                            v-if="taskInfo.buyer_evaluate == 4"
                            @click="showEvaluateModal('4')"
                        >
                            图文好评
                        </a-button>
                        <!-- 加了评价后显示 一个评价算1单 -->
                        <span class="rt-btn c-red ml-10" v-if="taskInfo.buyer_evaluate == 3 && buyer_evaluate_words.length > 0"
                            >{{ evaluate_yz_price * DISCOUNT }}鲸币/单*{{ buyer_evaluate_words.length }}单={{
                                evaluate_yz_price * buyer_evaluate_words.length * DISCOUNT
                            }}鲸币</span
                        >
                        <span class="rt-btn c-red ml-10" v-if="taskInfo.buyer_evaluate == 4 && buyer_evaluate_words.length > 0"
                            >{{ evaluate_tw_price * DISCOUNT }}鲸币/单*{{ buyer_evaluate_words.length }}单={{
                                evaluate_tw_price * buyer_evaluate_words.length * DISCOUNT
                            }}鲸币</span
                        >
                    </div>
                </div>
                <!-- 追加评价 -->
                <div class="cond-item">
                    <div class="cond-left">
                        <div class="cond-title">
                            追加评价
                        </div>
                    </div>
                    <div class="cond-right">
                        <a-select v-model="taskInfo.add_evaluate">
                            <a-select-option :value="0">不需要</a-select-option>
                            <a-select-option :value="1">需要</a-select-option>
                        </a-select>
                        <a-button class="rt-btn ml-10" v-if="taskInfo.add_evaluate == 1" @click="showEvaluateModal('add')"
                            >设置追评</a-button
                        >
                        <!-- 加了评价后显示 一个评价算1单,看选择那种类型 价格不同 -->
                        <span class="rt-btn c-red ml-10" v-if="add_evaluate_words.length > 0 && taskInfo.add_evaluate == 1"
                            >{{ add_evaluate_price * DISCOUNT }}鲸币/单*{{ add_evaluate_words.length }} 单 =
                            {{ add_evaluate_price * add_evaluate_words.length * DISCOUNT }}鲸币</span
                        >
                    </div>
                </div>

                <!-- 完成时间 -->
                <div class="cond-item">
                    <div class="cond-left">
                        <div class="cond-title">
                            完成时间
                        </div>
                    </div>
                    <div class="cond-right">
                        <a-select v-model="taskInfo.confirm_time" @change="changeSelect('confirm_time', 'montus')">
                            <a-select-option :value="item.id" v-for="item in sysConfig_sys.montus" :key="item.id">
                                {{ item.title }}
                            </a-select-option>
                        </a-select>
                        <!-- *1单数量根据上一步发布单量显示 -->
                        <span class="rt-btn ml-10 c-red">
                            {{ formatTotalPrice(orderDetail.confirm_time_price) }}
                        </span>
                    </div>
                </div>

                <div class="mt-30">
                    <a-button class="btn-next" @click="toPrev">上一步</a-button>
                    <a-button :disabled="loading" type="primary" class="ml-30 btn-next" @click="toNext">下一步</a-button>
                </div>
            </div>
        </div>
        <comentModal
            :visible="isModal"
            :evaluate_type_list="evaluate_type_list"
            :add_evaluate_words="add_evaluate_words"
            :buyer_words="buyer_evaluate_words"
            :add_evaluate_type="taskInfo.add_evaluate_type"
            :modal-type="modalType"
            @toggleModal="toggleEvaluateModal"
        ></comentModal>
    </a-spin>
</template>

<script>
import stepCom from './stepCom'
import orderPrice from './orderPrice'
import comentModal from './comentModal'
import { mapGetters } from 'vuex'
import * as api from '@/api/api'
import moment from 'moment'
export default {
    name: 'step4',
    components: {
        stepCom,
        comentModal,
        orderPrice,
    },
    data() {
        return {
            spinning: false,
            loading: false,
            isModal: false, //评价弹窗
            modalType: '', //评价类型 3-优质好评 4-图文评价 add-追加评价
            radioStyle: {
                display: 'block',
            },
            sysConfig: '', //系统配置信息
            sysConfig_area: [], //地域选择 地区列表
            sysConfig_sys: '', //增值服务金额获取
            sysConfig_age: [], //年龄选择
            sysConfig_category: [], //类目选择
            sysConfig_profession: [], //职业选择

            taskInfo: {
                receive_mode: 0, //试客标签设置 0-不需要 1-需要	  默认需要
                super_sign: 0, // 超级打标 0-不需要 1-需要
                label_area: '', //选择地域字符串id拼接 ‘222,222’
                label_age: '', // 年龄选择字符串id拼接
                label_sex: '', //性别选择  1-男 2-女
                label_pro: '', //职业选中字符串id拼接
                label_cate: '', //类目选择id拼接
                label_huabei: '', //花呗 0-否 1-是
                label_super: '', //是否超级会员 0-否1 1-是
                label_white: 0, //是否白名单 0-否 1-是

                buyer_level: '', // 试客等级列表ID
                week_click: '', //周点数 列表ID
                confirm_type: '', //确认收货类型reveive 列表ID
                confirm_time: '', //完成时间 montus 列表ID
                buyer_evaluate: 0, //评价类型
                buyer_evaluate_words: '', //评价  转义为JSON传过来 images不传为空
                // [{"comment":"无聊","images":"//ID马上代码思密达没事哒码商的"},{"comment":"无聊","images":"//ID马上代码思密达没事哒码商的"}]
                add_evaluate: 0, //追加评价 0-不需要 1-需要
                add_evaluate_type: '',
                add_evaluate_words: '', //
                // [{"comment":"无聊","images":"//ID马上代码思密达没事哒码商的"},{"comment":"无聊","images":"//ID马上代码思密达没事哒码商的"}]
            },
            sendNum: 1, //发单数量
            label_area: [], //选择地域数组
            label_age: [], //年龄选择选中数组
            label_pro: [], //职业选择选中数组
            label_cate: [], //类目选中数组
            label_huabei: false, //是否花呗 绑定true false
            label_white: false, //是否白名单
            label_super: false, //是否超级会员 绑定true false

            receive_price: 0, //试客标签价格总和
            label_area_price: 0,
            label_age_price: 0,
            label_sex_price: 0,
            label_pro_price: 0,
            label_cate_price: 0,
            label_huabei_price: 0,
            label_white_price: 0,
            label_super_price: 0,
            super_sign_price: 0, //超级打标

            evaluate_yz_price: 0, //优质评价价格
            evaluate_tw_price: 0, //图文评价价格
            add_evaluate_price: 0, //追评价格
            evaluate_type_list: [], //追加评价类型列表
            buyer_evaluate_words: [], //评价文本
            add_evaluate_words: [], //追平文本

            orderDetail: {
                label_area_price: 0, //地域标签价
                label_sex_price: 0,
                label_age_price: 0,
                label_pro_price: 0,
                label_cate_price: 0,
                label_huabei_price: 0,
                label_super_price: 0, //超级会员
                label_white_price: 0, //白名单

                super_sign_price: 0, //超级打标
                buyer_level_price: 0, //等级
                week_click_price: 0, //周点击
                buyer_evaluate_price: 0, //评价
                add_evaluate_price: 0, //追加评
                confirm_type_price: 0, //确认收货时间
                confirm_time_price: 0, //完成时间

                receive_mode: 0, //是否标签
            },
        }
    },
    computed: {
        ...mapGetters(['postTaskInfo', 'orderDetailPrice', 'DISCOUNT']),
    },
    mounted() {
        this.getConfig()
    },
    methods: {
        formatTotalPrice(price) {
            if (price == 0) {
                return ''
            } else {
                return `${price * DISCOUNT}鲸币/单*${this.sendNum}单=${price * DISCOUNT * this.sendNum}鲸币`
            }
        },
        // 初始化缓存参数
        initTaskInfo() {
            console.log(this.postTaskInfo)
            if (this.postTaskInfo) {
                this.taskInfo = Object.assign(this.taskInfo, this.postTaskInfo)
                // 价格合并
                this.orderDetail = Object.assign({}, this.orderDetail, this.orderDetailPrice)
                this.sendNum = this.orderDetail.order_num
                // 试客标签设置
                this.setLabelPrice()
                // 超级打标
                this.changeSuperSign()
                // 评价
                if (this.taskInfo.add_evaluate == 1) {
                    this.add_evaluate_words = this.getFormatEvaluate(this.taskInfo.add_evaluate_words)
                    this.taskInfo.add_evaluate_type = Number(this.taskInfo.add_evaluate_type)
                    this.add_evaluate_price = this.taskInfo.add_evaluate_price
                }
                if (this.taskInfo.buyer_evaluate == 3 || this.taskInfo.buyer_evaluate == 4) {
                    // 图文 或优质评价
                    this.buyer_evaluate_words = this.getFormatEvaluate(this.taskInfo.buyer_evaluate_words)
                }
                this.taskInfo.add_evaluate_type = String(this.taskInfo.add_evaluate_type)
                this.setEvaluateCofig()
                // 等级 收货时间 完成时间
                this.setSelectPrice()
            }
        },
        setLabelPrice() {
            this.changeReceiveMode()
            this.label_area = this.taskInfo.label_area ? JSON.parse(this.taskInfo.label_area) : []
            this.label_age = this.taskInfo.label_age ? JSON.parse(this.taskInfo.label_age) : []
            this.label_pro = this.taskInfo.label_pro ? JSON.parse(this.taskInfo.label_pro) : []
            this.label_cate = this.taskInfo.label_cate ? JSON.parse(this.taskInfo.label_cate) : []
            this.setOrderDetail('label_area_price', this.label_area.length > 0 ? this.label_area_price : 0)
            this.setOrderDetail('label_age_price', this.label_age.length > 0 ? this.label_age_price : 0)
            this.setOrderDetail('label_pro_price', this.label_pro.length > 0 ? this.label_pro_price : 0)
            this.setOrderDetail('label_cate_price', this.label_cate.length > 0 ? this.label_cate_price : 0)

            this.label_huabei = this.taskInfo.label_huabei == 1 ? true : false
            this.label_white = this.taskInfo.label_white == 1 ? true : false
            this.label_super = this.taskInfo.label_super == 1 ? true : false
            this.setOrderDetail('label_huabei_price', this.label_huabei ? this.label_huabei_price : 0)
            this.setOrderDetail('label_white_price', this.label_white ? this.label_white_price : 0)
            this.setOrderDetail('label_super_price', this.label_super ? this.label_super_price : 0)
            this.setOrderDetail('label_sex_price', this.label_sex ? this.label_sex_price : 0)
            this.getReceive_price()
        },
        // 获取配置信息
        getConfig() {
            this.spinning = true
            api.valueAddedServices().then((res) => {
                this.spinning = false
                if (res.success) {
                    this.sysConfig = res.data
                    this.sysConfig_area = res.data.area //地域选择 地区列表
                    this.sysConfig_sys = res.data.sys //增值服务金额获取
                    this.sysConfig_age = res.data.age //年龄选择
                    this.sysConfig_category = res.data.category //类目选择
                    this.sysConfig_profession = res.data.profession //职业选择

                    // 设置默认
                    this.taskInfo.buyer_level = this.sysConfig_sys.account[0]['id']
                    this.taskInfo.week_click = this.sysConfig_sys.week[0]['id']
                    this.taskInfo.confirm_type = this.sysConfig_sys.receive[0]['id']
                    this.taskInfo.confirm_time = this.sysConfig_sys.montus[0]['id']

                    this.orderDetail.confirm_type_price = this.sysConfig_sys.receive[0]['parameter_val']
                    this.orderDetail.week_click_price = this.sysConfig_sys.week[0]['parameter_val']
                    this.orderDetail.buyer_level_price = this.sysConfig_sys.account[0]['parameter_val']
                    this.orderDetail.confirm_time_price = this.sysConfig_sys.montus[0]['parameter_val']

                    // 评价
                    this.evaluate_yz_price = this.sysConfig_sys.parity[0]['parameter_val']
                    this.evaluate_tw_price = this.sysConfig_sys.parity[1]['parameter_val']
                    this.evaluate_type_list = this.sysConfig_sys.review

                    // label价格
                    this.label_area_price = this.getConfigPrice(0)
                    this.label_age_price = this.getConfigPrice(1)
                    this.label_sex_price = this.getConfigPrice(2)
                    this.label_pro_price = this.getConfigPrice(3)
                    this.label_cate_price = this.getConfigPrice(4)
                    this.label_huabei_price = this.getConfigPrice(5)
                    this.label_white_price = this.getConfigPrice(6)
                    this.label_super_price = this.getConfigPrice(7)
                    this.super_sign_price = this.getConfigPrice(8)

                    this.initTaskInfo()
                }
            })
        },
        setOrderDetail(labeName, value) {
            this.$set(this.orderDetail, labeName, value)
        },
        getConfigPrice(index) {
            if (this.sysConfig_sys) {
                return this.sysConfig_sys.label[Number(index)].parameter_val
            }
        },
        // 是否标签
        changeReceiveMode() {
            this.setOrderDetail('receive_mode', this.taskInfo.receive_mode)
        },
        // 性别选择
        changeSex() {
            let label_sex_price = this.taskInfo.label_sex != '' ? this.label_sex_price : 0
            this.setOrderDetail('label_sex_price', label_sex_price)
            this.getReceive_price()
        },

        // 地域 年龄 职业 类目
        changeLabel(labelName) {
            this.taskInfo[labelName] = this[labelName].length > 0 ? JSON.stringify(this[labelName]) : ''
            this.orderDetail[labelName + '_price'] = this[labelName].length > 0 ? this[labelName + '_price'] : 0
            this.getReceive_price()
        },
        // 是否花呗 , 是否白名单 ,超级会员
        changeCheckbox(e, labelName) {
            this[labelName] = e.target.checked
            this.taskInfo[labelName] = this[labelName] ? 1 : 0
            this.orderDetail[labelName + '_price'] = this[labelName] ? this[labelName + '_price'] : 0
            this.getReceive_price()
        },
        // 取消选择
        cancelChoose(name) {
            if (name == 'label_sex') {
                this.taskInfo.label_sex = ''
            } else {
                this[name] = []
            }
            this.orderDetail[name + '_price'] = 0
            this.getReceive_price()
        },
        // 获取标签配置金
        getReceive_price() {
            this.receive_price =
                this.orderDetail.label_area_price * 1 +
                this.orderDetail.label_sex_price * 1 +
                this.orderDetail.label_age_price * 1 +
                this.orderDetail.label_pro_price * 1 +
                this.orderDetail.label_cate_price * 1 +
                this.orderDetail.label_huabei_price * 1 +
                this.orderDetail.label_super_price * 1 +
                this.orderDetail.label_white_price * 1
        },
        // 超级打标
        changeSuperSign() {
            let super_sign_price = this.taskInfo.super_sign == 1 ? this.super_sign_price : 0
            this.setOrderDetail('super_sign_price', super_sign_price)
        },
        // 设置
        setSelectPrice() {
            this.changeSelect('buyer_level', 'account')
            this.changeSelect('week_click', 'week')
            this.changeSelect('confirm_type', 'receive')
            this.changeSelect('confirm_time', 'montus')
        },
        // 试客账号等级改变 ,周点数改变 ,确认收货 ,确认时间
        changeSelect(labelName, arrName) {
            this.orderDetail[labelName + '_price'] = this.getPriceByid(this.sysConfig_sys[arrName], this.taskInfo[labelName])
        },
        // 通过id获取价格
        getPriceByid(arr, id) {
            return _.find(arr, (i) => i.id == id)['parameter_val']
        },
        // 设置评价
        showEvaluateModal(type) {
            this.modalType = type
            this.isModal = true
        },
        // 保存评价
        toggleEvaluateModal(param) {
            console.log('param', param)
            if (param.cancel) {
                this.isModal = false
            } else {
                if (param.type == 'add') {
                    this.add_evaluate_words = param.buyer_evaluate_words
                    this.add_evaluate_price = param.add_evaluate_price
                    this.taskInfo.add_evaluate_type = String(param.add_evaluate_type)
                    this.taskInfo.add_evaluate_price = param.add_evaluate_price
                } else if (param.type == 3 || param.type == 4) {
                    this.buyer_evaluate_words = param.buyer_evaluate_words
                }
                this.setEvaluateCofig()
                this.isModal = false
            }
        },
        setEvaluateCofig(param) {
            // 评价
            if (this.taskInfo.buyer_evaluate == 3) {
                // 优质
                this.buyer_evaluate_price = this.evaluate_yz_price
            } else if (this.taskInfo.buyer_evaluate == 4) {
                // 图文
                this.buyer_evaluate_price = this.evaluate_tw_price
            } else {
                this.buyer_evaluate_price = 0
            }

            if (this.taskInfo.add_evaluate == 1) {
                // 需要追
                this.add_evaluate_price = this.add_evaluate_price
            } else {
                this.add_evaluate_price = 0
            }
            this.setOrderDetail('buyer_evaluate_price', this.buyer_evaluate_price * this.buyer_evaluate_words.length)
            // this.setOrderDetail('buyer_evaluate_length', this.buyer_evaluate_words.length)
            this.setOrderDetail('add_evaluate_price', this.add_evaluate_price * this.add_evaluate_words.length)
            // this.setOrderDetail('add_evaluate_length', this.add_evaluate_words.length)
        },
        toPrev() {
            this.$router.go(-1)
        },
        // 提交订单 下一步
        toNext() {
            if (this.loading) return

            this.taskInfo.add_evaluate_words = this.formatEvaluate(this.add_evaluate_words)
            this.taskInfo.buyer_evaluate_words = this.formatEvaluate(this.buyer_evaluate_words)
            this.$store.commit('setOrderDetailPrice', { ...this.orderDetail })
            this.$store.commit('setPostTaskInfo', { ...this.taskInfo })
            this.loading - true
            if (this.$route.query.id) {
                // 修改
                this.taskInfo.grab_id = this.$route.query.id
                console.log('this.taskInfo', this.taskInfo)
                if (this.taskInfo.search_keyword_arr) {
                    delete this.taskInfo.search_keyword_arr
                }
                api.editOrder(this.taskInfo).then((res) => {
                    if (res.success) {
                        this.$router.push({ name: 'step5', query: { id: this.$route.query.id } })
                    }
                })
            } else {
                // 新增发布
                api.publicOrder(this.taskInfo).then((res) => {
                    this.loading - false
                    if (res.success) {
                        this.$router.push({ name: 'step5', query: { id: res.data.id } })
                    }
                })
            }
        },
        formatEvaluate(arr) {
            if (!arr) return ''
            _.each(arr, (v) => {
                v.images = v.images.join()
            })
            console.log(arr)
            return JSON.stringify(arr)
        },
        getFormatEvaluate(arr) {
            console.log('arr', arr)
            if (!arr) return [{ comment: '', images: [] }]
            arr = typeof arr == 'string' ? JSON.parse(arr) : arr
            _.each(arr, (v) => {
                if (v.images) {
                    let images = typeof v.images == 'string' ? v.images.split(',') : v.images
                } else {
                    v.images = []
                }
            })
            return arr
        },
    },
}
</script>

<style lang="less" scoped></style>
