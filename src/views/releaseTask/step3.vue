<template>
    <a-spin :spinning="spinning" class="releaseTask-container">
        <div class="title">
            发布任务
            <span class="ml-5 c-gray size-12">标题：{{ postTaskInfo.goods_title }} </span>
            <span class="ml-5 c-gray size-12">店铺名：{{ postTaskInfo.store_name }}</span>
        </div>

        <stepCom :activeKey="3" />
        <div class="step-page">
            <!-- 店铺信息 -->
            <orderPrice :detail="orderDetail"></orderPrice>
            <div class="section-title">
                浏览下单设置
                <v-tooltip placement="topLeft">
                    <template slot="content">请勿选择过多的浏览条件，模拟真实买家操作建议选择1到3项。</template>
                </v-tooltip>
            </div>
            <div class="section-con">
                <div class="cond-item">
                    <div class="cond-left">
                        <div class="cond-title">主宝贝浏览要求</div>
                    </div>
                    <div class="cond-right">
                        <a-checkbox-group v-model="browse_require" @change="scanChange">
                            <a-checkbox :disabled="hasChoose(0)" value="0">
                                <span>主宝贝浏览</span>
                            </a-checkbox>
                            <a-checkbox :disabled="hasChoose(1)" value="1">
                                <span>货比三家</span>
                            </a-checkbox>
                            <a-checkbox :disabled="hasChoose(2)" value="2">
                                <span>浏览评价</span>
                            </a-checkbox>
                            <a-checkbox :disabled="hasChoose(3)" value="3">
                                <span>旺旺聊天</span>
                            </a-checkbox>
                            <a-checkbox :disabled="hasChoose(4)" value="4">
                                <span>收藏宝贝</span>
                            </a-checkbox>
                            <a-checkbox :disabled="hasChoose(5)" value="5">
                                <span>收藏店铺</span>
                            </a-checkbox>
                            <a-checkbox :disabled="hasChoose(6)" value="6">
                                <span>加入购物车</span>
                            </a-checkbox>
                            <a-checkbox :disabled="hasChoose(7)" value="7">
                                <span>主视频浏览</span>
                            </a-checkbox>
                            <a-checkbox :disabled="hasChoose(8)" value="8">
                                <span>五张橱窗图浏览</span>
                            </a-checkbox>
                            <a-checkbox :disabled="hasChoose(9)" value="9">
                                <span>店铺其他宝贝浏览</span>
                            </a-checkbox>
                            <a-checkbox :disabled="hasChoose(10)" value="10">
                                <span>浏览问大家</span>
                            </a-checkbox>
                        </a-checkbox-group>
                    </div>
                </div>
                <div class="cond-item" v-if="taskInfo.search_type == 0">
                    <div class="cond-left">
                        <div class="cond-title">预售要求</div>
                    </div>
                    <div class="cond-right">
                        <span>宝贝加入购物车 </span>
                        <a-select class="s-select" v-model="taskInfo.presale_require" @change="changePre">
                            <a-select-option :value="item.id" v-for="item in sysConfig_sys_pre" :key="item.id">{{
                                item.title
                            }}</a-select-option>
                        </a-select>
                        <span>
                            进行购买
                            <v-tooltip placement="topLeft">
                                <template slot="content">建议使用延时！粉丝先将宝贝加入购物车，在指定的时长后下单购买。</template>
                            </v-tooltip>
                        </span>
                        <!-- *1单数量根据上一步发布单量显示 -->
                        <span class="rt-btn ml-10 c-red">
                            {{ formatTotalPrice(pre_price) }}
                        </span>
                    </div>
                </div>
                <div class="cond-item">
                    <div class="cond-left"><div class="cond-title">试客拍下价格</div></div>
                    <div class="cond-right">
                        <a-input type="number" v-model="taskInfo.buy_price" @blur="changeBuyPrice"></a-input> 元
                        <v-tooltip placement="topLeft">
                            <template slot="content">试客拍下时的付款价格，如果不同等级买号看到商品价格不同，取最大值</template>
                        </v-tooltip>
                    </div>
                </div>
                <div class="cond-item">
                    <div class="cond-left"><div class="cond-title">拍下每单件数</div></div>
                    <div class="cond-right">
                        <a-input
                            type="number"
                            v-model="taskInfo.buy_num"
                            @input="changeBuyNum"
                            @blur="changeBuyNumPrice"
                        ></a-input>
                        件
                        <v-tooltip placement="topLeft">
                            <template slot="content">拍下每单件数</template>
                        </v-tooltip>
                    </div>
                </div>
                <div class="cond-item">
                    <div class="cond-left"><div class="cond-title">是否包邮</div></div>
                    <div class="cond-right">
                        <a-radio-group class="radio-list" v-model="taskInfo.is_free_ship" @change="changeFreeShip">
                            <a-radio :style="radioStyle" :value="1">
                                <span class="radio-text">宝贝包邮,无需修改运费</span>
                            </a-radio>
                            <a-radio :style="radioStyle" :value="0">
                                <span class="radio-text">宝贝不包邮,需要额外多垫付10元邮费,随货款一起对试客实行多退少补! </span>
                            </a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="cond-item">
                    <div class="cond-left"><div class="cond-title">付款方式</div></div>
                    <div class="cond-right">
                        <a-radio-group class="radio-list" v-model="taskInfo.pay_type">
                            <a-radio :style="radioStyle" :value="0">
                                <span class="radio-text">无所谓(可以使用花呗、信用卡等付款,也可以不用)</span>
                            </a-radio>
                            <a-radio :style="radioStyle" :value="1">
                                <span class="radio-text">禁止使用花呗、信用卡付款 </span>
                            </a-radio>
                            <a-radio :style="radioStyle" :value="2">
                                <span class="radio-text">
                                    必须使用花呗付款(花呗付款权重更高,必须在标签中选中花呗账号才可选此项) 选择此项收费2元
                                </span>
                            </a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <!-- <div class="cond-item">
                    <div class="flexct">
                        <a-button>+增加附加商品</a-button>
                        <span class="ml-15 size-13"
                            >（附加商品为进店后在店铺内浏览，与目标宝贝一起下单购买，
                            <span class="c-red">最多可增加2个商品，2元/个</span>）</span
                        >
                    </div>
                </div> -->
                <h1 class="line"></h1>
                <div class="cond-item" v-if="taskInfo.search_type == 0">
                    <div class="cond-left"><div class="cond-title">截图模式</div></div>
                    <div class="cond-right">
                        <a-radio-group class="radio-list" v-model="taskInfo.screen_mode">
                            <a-radio :style="radioStyle" :value="0">
                                <span class="radio-text">只需一张截图(只提供一张店外搜索列表找到宝贝截图)</span>
                            </a-radio>
                            <a-radio :style="radioStyle" :value="1">
                                <span class="radio-text">无需截图(全程没有任何截图、包括付款和评价,安全性高) </span>
                            </a-radio>
                            <a-radio :style="radioStyle" :value="2">
                                <span class="radio-text">全程截图(此方式可能会被淘宝检测 ,谨慎使用)</span>
                            </a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="cond-item">
                    <div class="cond-left"><div class="cond-title">淘宝订单编号</div></div>
                    <div class="cond-right">
                        <a-radio-group class="radio-list" v-model="taskInfo.taobao_ordersn">
                            <a-radio :style="radioStyle" :value="0">
                                <span class="radio-text">完整订单编号</span>
                            </a-radio>
                            <a-radio :style="radioStyle" :value="1">
                                <span class="radio-text">订单编号后三位 </span>
                            </a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="cond-item" v-if="taskInfo.search_type == 0">
                    <div class="cond-left"><div class="cond-title">详情页验证</div></div>
                    <div class="cond-right">
                        <a-radio-group class="radio-list" v-model="taskInfo.detail_check">
                            <a-radio :style="radioStyle" :value="0">
                                <span class="radio-text">不需要</span>
                            </a-radio>
                            <a-radio :style="radioStyle" :value="1">
                                <span class="radio-text">
                                    需要(商家设置关键词,买手通过寻找商品详情页里关键词,来增加在商品页面的浏览时间,防止秒拍.)
                                </span>
                            </a-radio>
                        </a-radio-group>
                        <div v-if="taskInfo.detail_check == 1">
                            <div class="mb-10">
                                <span class="mr-10">需要验证的关键词:</span>
                                <a-input v-model="taskInfo.detail_check_keyword"></a-input>
                            </div>
                            <div class="mb-10 flexst flexwrap">
                                <span class="mr-10"> 包含模糊关键词的图片:</span>
                                <div class="">
                                    <a-upload
                                        name="avatar"
                                        list-type="picture-card"
                                        class="detail-uploader"
                                        :show-upload-list="false"
                                        :before-upload="beforeUpload"
                                        @change="handleChange"
                                    >
                                        <img v-if="taskInfo.detail_check_image" :src="taskInfo.detail_check_image" alt="avatar" />
                                        <div v-else class="c-gray">
                                            <a-icon type="plus" />
                                        </div>
                                    </a-upload>
                                    <div class="c-primary" @click="checkDlModal">查看示范图例</div>
                                </div>
                            </div>
                            <div class="mb-10 c-gray">
                                <div>温馨提示:</div>
                                <p class="size-12 mt-10">
                                    1、可选择商品首页或详情中的某几个文字作为关键字，关键字内容为2-6个字，可用数字、字母和汉字，不能包含空格、符号、表情、特殊字符等内容。
                                </p>
                                <p class="size-12">
                                    2、关键字图片未处理或关键字内容设置有误会导致买手无法提交核对，由此引起的佣金赔偿问题由商家负责。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <h1 class="line"></h1>
                <div class="cond-item">
                    <div class="cond-left">
                        <div class="cond-title">活动开始时间</div>
                    </div>
                    <div class="cond-right">
                        <a-date-picker v-model="start_time" style="min-width:180px" show-time @change="startChange" />
                        <v-tooltip placement="topLeft" class="ml-10">
                            <template slot="content"> 设置定时活动发布后，可在 活动管理/未发布的活动 下查看任务状态 </template>
                        </v-tooltip>
                    </div>
                </div>
                <div class="cond-item" v-if="sendNum > 1">
                    <div class="cond-left">
                        <div class="cond-title">活动发布间隔</div>
                    </div>
                    <div class="cond-right">
                        <a-input v-model="taskInfo.time_interval" type="number" />分钟
                        <v-tooltip placement="topLeft" class="ml-10">
                            <template slot="content"> 多单活动时，每单活动之间的间隔时长 </template>
                        </v-tooltip>
                    </div>
                </div>
                <div class="cond-item">
                    <div class="cond-left">
                        <div class="cond-title">活动失效时间</div>
                    </div>
                    <div class="cond-right">
                        <!-- 开始时间+72小时 -->
                        <span class="mr-10">{{ failer_time }}</span>
                        <v-tooltip placement="topLeft">
                            <template slot="content">
                                从活动发布成功时间起，72小时内无人接单，该活动会自动失效，多单活动时为第1单的失效时间
                            </template>
                        </v-tooltip>
                    </div>
                </div>
                <div class="cond-item">
                    <div class="cond-left"><div class="cond-title">注意事项</div></div>
                    <div class="cond-right">
                        <a-textarea
                            v-model="taskInfo.attention_remark"
                            :maxLength="255"
                            style="width:100%;height:120px"
                            placeholder="重要!如果对试客有特殊的要求,请在这里填写,试客在做活动时会看到.(此处要求平台只负责传达,无法强制试客按要求执行)."
                        ></a-textarea>
                        <div class="mb-10 txt-rt">255/255</div>

                        <ul class="upload-list-container">
                            <li class="upload-item" v-for="(item, index) in fileList" :key="index">
                                <img :src="item" />
                                <div class="delete"><a-icon @click="deleteImage(index)" type="delete"></a-icon></div>
                            </li>
                            <li class="upload-item upload-box" v-if="fileList.length <= 5">
                                <input @change="fileUpload($event)" type="file" class="file-input" />
                                <div class="upload-add"><a-icon type="plus"></a-icon></div>
                            </li>
                        </ul>
                        <div class="size-13 mt-20">
                            注:如有特殊需求可添加备注图片，图片中不需要显示店铺名或商品名，避免买手直接搜索（非必填项）
                        </div>
                    </div>
                </div>
                <div class="mt-30 mb-20">
                    <a-button class="btn-next" @click="toPrev">上一步</a-button>
                    <a-button type="primary" class="ml-30 btn-next" @click="toNext">下一步</a-button>
                </div>
            </div>
        </div>
    </a-spin>
</template>

<script>
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}
import stepCom from './stepCom'
import orderPrice from './orderPrice'
import { mapGetters } from 'vuex'
import * as api from '@/api/api'
import moment from 'moment'
export default {
    name: 'step3',
    components: {
        stepCom,
        orderPrice,
    },
    data() {
        return {
            BASE_URL: this.BASE_URL,
            spinning: false,
            radioStyle: {
                display: 'block',
            },

            taskInfo: {
                browse_require: '', //浏览要求
                buy_price: 0, //拍下价格
                buy_num: 1, //拍下数量
                is_free_ship: 1, //是否包邮 0-否 1-是
                pay_type: 0, // 付款方式 0-所有 1-非花呗 2-花呗
                screen_mode: 0, //截图模式 0-一张截图 1-无需截图 2-全程截图
                taobao_ordersn: 0, //淘宝订单编号 0-所有 1-后三位
                detail_check: 0, //详情页验证 0-不需要 1-需要
                detail_check_keyword: '', //详情页关键词
                detail_check_image: '', //详情页图片
                start_time: '', //活动开始时间,
                time_interval: '', //间隔时间
                attention_remark: '', //注意事项
                remark_img: '', //备注图片

                presale_require: '', //预售要求id
                is_pre: '', //是否预售 0-否 1-是
            },
            browse_require: ['0'], //浏览要求
            failer_time: '', //活动失效时间
            start_time: null,
            pre_price: 0, //预售价格
            sysConfig_sys_pre: [], //预售时间列表
            sendNum: 1, //发单量
            detail_check_price: 0, //详情检查价格 (无接口暂时)
            fileList: [], //注意事项图片列表

            previewVisible: false,
            previewImage: '',

            orderDetail: {
                payment_amount: 0,
                is_free_ship: 1, //是否包邮
                buy_price_mi_price: 0, //基础赏金多出价格
                presale_require_price: 0, //预售价格
                order_num: 1, //发布数量
            },
            price_low: 0,
            price_high: 0,
            sysConfig_sys_amount: [],
        }
    },
    computed: {
        ...mapGetters(['postTaskInfo', 'orderDetailPrice']),
    },
    mounted() {
        this.getConfig()
    },
    filters: {},
    methods: {
        hasChoose(num) {
            if (this.browse_require.length >= 4) {
                if (_.findIndex(this.browse_require, (v) => v == num) == -1) {
                    return true
                }
            } else {
                return false
            }
        },
        // 获取配置信息
        getConfig() {
            this.spinning = true
            api.valueAddedServices().then((res) => {
                this.spinning = false
                if (res.success) {
                    this.sysConfig_sys_pre = res.data.sys.pre //预售金
                    this.sysConfig_sys_amount = res.data.sys.amount //价格段配置

                    this.getConfigPrice_base()
                    this.initTaskInfo()
                }
            })
        },
        // 获取基础价格配置
        getConfigPrice_base() {
            api.tariffDescription().then((res) => {
                if (res.success) {
                    this.price_low = res.data.base[2].parameter_val //活动宝贝金额<=50
                    this.price_high = res.data.base[3].parameter_val //活动宝贝金额>=50元,每增加100元需要+
                    this.getBasePrice()
                }
            })
        },
        initTaskInfo() {
            // 任务参数合并
            this.taskInfo = Object.assign(this.taskInfo, this.postTaskInfo)
            // 价格合并
            this.orderDetail = Object.assign({}, this.orderDetail, this.orderDetailPrice)
            // 浏览要求
            if (typeof this.taskInfo.browse_require == 'string') {
                this.browse_require = this.taskInfo.browse_require ? JSON.parse(this.taskInfo.browse_require) : ['0']
            } else {
                this.browse_require = this.taskInfo.browse_require
            }
            // 筛选要求
            if (typeof this.taskInfo.screenshot_require == 'string') {
                this.screenshot_require = this.taskInfo.screenshot_require ? JSON.parse(this.taskInfo.screenshot_require) : ['0']
            } else {
                this.screenshot_require = this.taskInfo.screenshot_require
            }
            // 注意事项图片
            this.fileList = this.taskInfo.remark_img ? this.taskInfo.remark_img.split(',') : []
            // 关键词
            let search_keyword = JSON.parse(this.taskInfo.search_keyword)
            let num = 0
            _.each(search_keyword, (v) => (num += Number(v.number)))
            this.sendNum = num == 0 ? 1 : num

            this.setOrderDetail('order_num', this.sendNum)

            // 初始化今天时间
            this.taskInfo.start_time = moment().format('YYYY-MM-DD hh:mm:ss')
            this.start_time = moment()
            this.failer_time = moment()
                .add(3, 'days')
                .format('YYYY-MM-DD hh:mm:ss')

            // 设置预售价默认
            if (this.taskInfo.presale_require == 0) {
                this.taskInfo.presale_require = this.sysConfig_sys_pre[0]['id']
                this.pre_price = this.sysConfig_sys_pre[0]['parameter_val']
                this.taskInfo.is_pre = this.pre_price <= 0 ? 0 : 1
                this.setOrderDetail('presale_require_price', this.pre_price)
            } else {
                this.changePre(this.taskInfo.presale_require)
            }

            // 拍下价格
            this.setOrderDetail('payment_amount', this.taskInfo.buy_price * this.taskInfo.buy_num)
            // 是否包邮
            this.changeFreeShip()
        },
        setOrderDetail(labeName, value) {
            this.$set(this.orderDetail, labeName, value)
        },

        changePre(key) {
            this.taskInfo.presale_require = key
            this.pre_price = this.getPriceByid(this.sysConfig_sys_pre, key)
            this.taskInfo.is_pre = this.pre_price <= 0 ? 0 : 1
            this.setOrderDetail('presale_require_price', this.pre_price)
        },
        // 通过id获取价格
        getPriceByid(arr, id) {
            return _.find(arr, (i) => i.id == id)['parameter_val']
        },
        // 活动开始时间
        startChange(value, dateString) {
            this.taskInfo.start_time = dateString
            this.start_time = value
            this.failer_time = value.add(3, 'days').format('YYYY-MM-DD hh:mm:ss')
        },
        // 拍下每单数量 >=1
        changeBuyNum() {
            if (this.taskInfo.buy_num <= 0) {
                this.taskInfo.buy_num = 1
            }
        },
        changeBuyNumPrice() {
            this.setOrderDetail('payment_amount', this.taskInfo.buy_price * this.taskInfo.buy_num)
            this.getBasePrice()
        },
        // 拍下价格
        changeBuyPrice() {
            console.log(typeof this.taskInfo.buy_price)
            this.setOrderDetail('payment_amount', this.taskInfo.buy_price * this.taskInfo.buy_num)
            this.getBasePrice()
        },

        getBasePrice() {
            // 下单金额不同基础加
            let buy_price_mi_price = 0
            if (Number(this.taskInfo.buy_price)) {
                let buy_price = this.taskInfo.buy_price
                if (this.taskInfo.buy_num > 1) {
                    buy_price = this.taskInfo.buy_price * this.taskInfo.buy_num
                }

                let config = _.find(this.sysConfig_sys_amount, (v) => {
                    if (buy_price <= Number(v.remark)) {
                        return true
                    }
                })
                buy_price_mi_price = config.parameter_val * 1
                console.log('buy_price_mi_price', buy_price_mi_price)
                // if (buy_price <= 50) {
                //     buy_price_mi_price = this.price_low * 1
                // } else {
                //     buy_price_mi_price = this.price_high * 1 + this.price_high * Math.ceil((buy_price - 50) / 100)
                // }
            } else {
                buy_price_mi_price = 0
            }
            this.setOrderDetail('buy_price_mi_price', buy_price_mi_price)
        },
        // 是否包邮
        changeFreeShip() {
            this.setOrderDetail('is_free_ship', this.taskInfo.is_free_ship)
        },
        // 主宝贝浏览要求
        scanChange(keys) {
            if (keys.length > 4) this.$message.warning('最多添加四条浏览要求')
            this.browse_require = keys
            this.taskInfo.browse_require = keys.length > 0 ? JSON.stringify(keys) : ''
        },
        // 获取价格
        formatTotalPrice(price) {
            if (price == 0) {
                return ''
            } else {
                return `${price}鲸币/单*${this.sendNum}单=${(price * this.sendNum).toFixed(2)}鲸币`
            }
        },
        toPrev() {
            this.$router.go(-1)
        },
        toNext() {
            console.log(this.taskInfo.buy_price)
            if (this.browse_require.length > 4) return this.$message.warning('浏览要求最多添加四个哦')
            if (!Number(this.taskInfo.buy_price)) return this.$message.warning('请输入拍下价格')
            if (this.taskInfo.detail_check == 1) {
                // 需要验证
                if (!this.taskInfo.detail_check_keyword) return this.$message.warning('请输入详情页验证关键词')
                if (!this.taskInfo.detail_check_image) return this.$message.warning('请上传详情页验证图片')
            }
            if (this.sendNum > 1 && !this.taskInfo.time_interval) return this.$message.warning('请设置发布时间间隔')
            if (this.fileList.length > 0) {
                this.taskInfo.remark_img = this.fileList.join()
            }
            this.taskInfo.browse_require = JSON.stringify(this.browse_require)

            if (this.$route.query.id) {
                delete this.taskInfo.browse_require_list
                delete this.taskInfo.browse_require_arr
                delete this.taskInfo.browse_require_name
            }
            this.$store.commit('setOrderDetailPrice', { ...this.orderDetail })
            this.$store.commit('setPostTaskInfo', { ...this.taskInfo })
            this.$router.push({ name: 'step4', query: this.$route.query })
        },
        // 查看实例图片
        checkDlModal() {
            const h = this.$createElement
            this.$info({
                title: '关键词-示例图片',
                content: h('div', {}, [
                    h(
                        'p',
                        '以下关键字图片供各位商家参考，左图是原图（不要上传），右图是标准图片（需上传），用箭头标示位置，否则将罚没佣金。'
                    ),
                    h('img', {
                        style: { width: '100%' },
                        attrs: {
                            src: require('../../assets/images/task/detail_yz.png'),
                        },
                    }),
                ]),
                onOk() {},
            })
        },
        beforeUpload() {
            return false
        },
        async handleChange(info) {
            console.log('info', info)
            let file = info.file
            if (!file) return
            let fileBase64 = await getBase64(file)
            api.image_upload({ base_str: fileBase64, type: 2 }).then((res) => {
                if (res.success) {
                    let url = this.BASE_URL + res.data
                    this.$set(this.taskInfo, 'detail_check_image', url)
                }
            })
        },
        // 删除图片
        deleteImage(index) {
            this.fileList.splice(index, 1)
        },
        // 上传图片
        async fileUpload(e) {
            let file = e.target.files[0]
            console.log('file', file)
            if (!file) return
            let fileBase64 = await getBase64(file)
            api.image_upload({ base_str: fileBase64, type: 2 }).then((res) => {
                if (res.success) {
                    let url = this.BASE_URL + res.data
                    this.fileList.push(url)
                }
            })
        },
    },
}
</script>

<style lang="less" scoped></style>
