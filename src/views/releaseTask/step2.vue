<template>
    <a-spin :spinning="spinning" class="releaseTask-container">
        <div class="title">
            发布任务
            <span class="ml-5 c-gray size-12">标题：{{ postTaskInfo.goods_title }} </span>
            <span class="ml-5 c-gray size-12">店铺名：{{ postTaskInfo.store_name }}</span>
        </div>

        <stepCom :activeKey="2" />
        <div class="step-page">
            <!-- 店铺信息 -->
            <orderPrice :detail="orderDetail"></orderPrice>
            <!-- 活动类型 -->
            <div class="section-title">活动类型</div>
            <div class="section-con">
                <div class="type-item">
                    <span class="ty-title">活动类型</span>
                    <span class="ml-15">淘宝/天猫{{ taskInfo.activity_type == 0 ? '普通' : '优质' }}试用活动</span>
                </div>
                <div class="type-item">
                    <span class="ty-title">宝贝链接</span> <span class="ml-15">{{ taskInfo.goods_link }}</span>
                </div>
            </div>
            <!-- 返款方式 -->
            <div class="section-title">返款方式</div>
            <div class="section-con">
                <a-radio-group class="radio-list mt-10" v-model="taskInfo.back_type" @change="changeBackType">
                    <a-radio :style="radioStyle" :value="0">
                        <span class="radio-text"
                            >平台返款
                            <span class="c-dgray"
                                >（本金和赏金由平台返款给买家，费用比商家返款高<span class="c-red"
                                    >{{ orderDetail.back_type_price }}元</span
                                >
                                ）</span
                            ></span
                        >
                    </a-radio>
                    <a-radio :style="radioStyle" :value="1">
                        <span class="radio-text"
                            >商家返款 <span class="c-dgray">（商家自行返款本金给买家，无需充值到平台，限时优惠）</span></span
                        >
                    </a-radio>
                </a-radio-group>
            </div>
            <!-- 审号方式 -->
            <div class="section-title">审号方式</div>
            <div class="section-con">
                <a-radio-group class="radio-list mt-10" v-model="taskInfo.examine_type" @change="changeExamineType">
                    <a-radio :style="radioStyle" :value="0">
                        <span class="radio-text"
                            >平台审核 <span class="c-dgray">(平台根据相关规则进行验号审核,具体规则请到公告中心查看)</span></span
                        >
                    </a-radio>
                    <a-radio :style="radioStyle" :value="1">
                        <span class="radio-text"
                            >商家审核 <span class="c-dgray">（每个买手接任务前需上传最新的截图供商家审核）</span>
                            <a class="c-blue">查看商家审核规则</a>
                            <span class="c-red"
                                >(+
                                {{ screenshot_require_price * 1 + taoqi_value_price * 1 + tao_year_price * 1 * DISCOUNT }}
                                元/单)</span
                            >
                        </span>
                    </a-radio>
                </a-radio-group>
                <!-- 商家审核可选 -->
                <div class="check-group" v-if="taskInfo.examine_type == 1">
                    <div class="cond-item">
                        <div class="cond-left"><div class="cond-title">截图要求</div></div>
                        <div class="cond-right">
                            <a-checkbox-group v-model="screenshot_require" @change="changeScreenRequire">
                                <a-checkbox :value="item.id" v-for="item in cutList" :key="item.id">
                                    <span>{{ item.title }}</span>
                                    <span class="c-red" v-if="item.parameter_val > 0"
                                        >(+{{ item.parameter_val * DISCOUNT }}元/单)</span
                                    >
                                </a-checkbox>
                            </a-checkbox-group>
                        </div>
                    </div>
                    <div class="cond-item">
                        <div class="cond-left"><div class="cond-title">淘气值要求</div></div>
                        <div class="cond-right">
                            <a-radio-group v-model="taskInfo.taoqi_value" @change="changeTQvalue">
                                <a-radio :value="item.id" v-for="item in taoqVList" :key="item.id">
                                    <span>{{ item.title }}</span>
                                    <span class="c-red" v-if="item.parameter_val > 0"
                                        >(+{{ item.parameter_val * DISCOUNT }}元/单)</span
                                    >
                                </a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                    <div class="cond-item">
                        <div class="cond-left"><div class="cond-title">淘龄</div></div>
                        <div class="cond-right">
                            <a-radio-group v-model="taskInfo.tao_year" @change="changeTyear">
                                <a-radio :value="item.id" v-for="item in ageList" :key="item.id">
                                    <span>{{ item.title }}</span>
                                    <span class="c-red" v-if="item.parameter_val > 0"
                                        >(+{{ item.parameter_val * DISCOUNT }}元/单)</span
                                    >
                                </a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                    <div class="cond-item">
                        <div class="cond-left"><div class="cond-title">审核补充说明</div></div>
                        <div class="cond-right">
                            <a-textarea
                                v-model="taskInfo.examine_supple_remark"
                                :max-length="100"
                                placeholder="最多输入100字"
                                :auto-size="{ minRows: 3, maxRows: 5 }"
                                style="width:100%"
                            />
                        </div>
                    </div>
                    <div class="cond-item" style="display:block">
                        <div class="c-red mt-30">重要提醒:</div>
                        <div class="size-12 c-gray mt-10">
                            1、请不要提出过高/无理要求/故意全部拒绝，否则平台有权修改、关闭任务并强制扣除任务赏金。
                        </div>
                        <div class="size-12 c-gray mt-10">
                            2、无论是商家通过还是自动通过，商家拒绝买手任务需要正当理由（不能与平台相关规定冲突),否则平台仍将扣除任务赏金。
                        </div>
                    </div>
                </div>
            </div>
            <!-- 告知试客这些条件可以找到宝贝 -->
            <div class="section-title">告知试客这些条件可以找到宝贝</div>
            <div class="section-con">
                <div class="cond-item">
                    <div class="cond-left">
                        <span class="cond-title">宝贝主图</span>
                        <v-tooltip placement="topRight">
                            <template slot="content">
                                粉丝都是通过手机下单，请务必提供移动端主搜图！如果PC主图和移动端主搜图不同，请点击“修改”进行手动上传
                            </template>
                        </v-tooltip>
                    </div>
                    <div class="cond-right flexed">
                        <img :src="taskInfo.goods_image" class="good-img" />
                        <a-upload
                            name="file"
                            :showUploadList="false"
                            :headers="headers"
                            :beforeUpload="beforeUpload"
                            @change="fileChange"
                        >
                            <span class="c-primary pointer">修改</span>
                        </a-upload>
                    </div>
                </div>
                <div class="cond-item">
                    <div class="cond-left">
                        <span class="cond-title">进店方式</span>
                    </div>
                    <div class="cond-right">
                        <a-radio-group v-model="taskInfo.search_type" @change="changeSearchType">
                            <a-radio :value="0" :style="radioStyle" class="mt-10">
                                <span class="radio-text">搜索关键词</span>
                            </a-radio>
                            <a-radio :value="1" :style="radioStyle" class="mt-10"><span class="radio-text">淘口令</span></a-radio>
                            <a-radio :value="2" :style="radioStyle" class="mt-10"><span class="radio-text">二维码</span></a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <!-- 搜索关键词 -->
                <div v-if="taskInfo.search_type == 0">
                    <div class="cond-item">
                        <div class="cond-left mb-10">
                            <span class="cond-title">搜索关键词</span>
                            <v-tooltip placement="topRight">
                                <template slot="content">
                                    请确保搜索结果在120位以内，若是长尾关键词请不要过量发布试用活动
                                </template>
                            </v-tooltip>
                        </div>
                        <div class="cond-right cond-key-list">
                            <div class="flexct flexwrap" v-for="(item, index) in search_keyword" :key="'keyword' + index">
                                <div class="flexct  mb-10 mr-10">
                                    <span class="mr-10">搜索关键词{{ index + 1 }}</span>
                                    <a-input v-model="item.keyword"></a-input>
                                </div>
                                <div class="flexct  mb-10">
                                    <span class="mr-10">发单量</span>
                                    <a-input v-model="item.number" type="number" @input="changeKeyNum(item, index)"></a-input>
                                    <span class="ml-5">
                                        单
                                        <a-icon
                                            v-if="search_keyword.length > 1"
                                            @click="delKeyword(index)"
                                            type="delete"
                                            class="c-primary ml-5 mb-10"
                                        />
                                    </span>
                                </div>
                            </div>
                            <a-button block class="mt-10 add-keyword" @click="addKeyword"> + 添加关键词</a-button>
                        </div>
                    </div>
                    <div class="cond-item">
                        <div class="cond-left mb-10">
                            <span class="cond-title">备用关键词</span>
                            <v-tooltip placement="topRight">
                                <template slot="content">
                                    防止买家主关键词找不到宝贝而关闭活动，为了不影响活动完成率，如果宝贝销量低，可以填写备用关键词，买家搜索主关键词10分钟后可使用备用关键词，非必填项。
                                </template>
                            </v-tooltip>
                        </div>
                        <div class="cond-right"><a-input placeholder="非必填项" v-model="taskInfo.backup_remark"></a-input></div>
                    </div>
                    <div class="cond-item">
                        <div class="cond-left mb-10"><span class="cond-title">排序方式</span></div>
                        <div class="cond-right">
                            <a-radio-group name="radioGroup" v-model="taskInfo.sort_type">
                                <a-radio :value="0">综合排序</a-radio>
                                <a-radio :value="1">销量排序</a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                    <div class="cond-item">
                        <div class="cond-left mb-10"><span class="cond-title">商品现有付款人数约</span></div>
                        <div class="cond-right">
                            <a-input type="number" v-model="taskInfo.goods_pau_nums"></a-input>
                            <span class="mlr-5">人</span>
                            <v-tooltip placement="topRight">
                                <template slot="content">
                                    务必亲自搜索，确认人数准确。
                                </template>
                            </v-tooltip>
                        </div>
                    </div>
                    <div class="cond-item">
                        <div class="cond-left mb-10"><span class="cond-title">搜索列表页展示价格</span></div>
                        <div class="cond-right">
                            <a-input type="number" v-model="taskInfo.goods_search_price"></a-input>
                            <span class="mlr-5">元</span>
                            <v-tooltip placement="topRight">
                                <template slot="content">
                                    如果宝贝有区间价，务必亲自用手淘搜索，确认价格准确
                                </template>
                            </v-tooltip>
                        </div>
                    </div>
                    <h1 class="line" />
                    <div class="cond-item ">
                        <div class="flexct">
                            <a-button class="mr-10" @click="toggleScreenCond">
                                +{{ isScreenCondShow ? '隐藏' : '添加' }}筛选条件
                            </a-button>
                            <v-tooltip placement="topRight">
                                <template slot="content">
                                    如果宝贝销量过低，或者关键词不容易找，可以设置筛选条件，允许买家卡价格，卡发货地等，非必填项。
                                </template>
                            </v-tooltip>
                        </div>
                    </div>
                    <!-- 额外筛选条件 -->
                    <div v-if="isScreenCondShow">
                        <div class="cond-item">
                            <div class="cond-left"><div class="cond-title">筛选条件</div></div>

                            <div class="cond-right">
                                <a-checkbox-group v-model="screen_condition" @change="changeScreenCond">
                                    <a-checkbox value="0">
                                        <span>包邮</span>
                                    </a-checkbox>
                                    <a-checkbox value="1">
                                        <span>手机专享</span>
                                    </a-checkbox>
                                    <a-checkbox value="2">
                                        <span>淘金币折扣</span>
                                    </a-checkbox>
                                    <a-checkbox value="3">
                                        <span>7+天退货</span>
                                    </a-checkbox>
                                    <a-checkbox value="4">
                                        <span>天猫</span>
                                    </a-checkbox>
                                    <a-checkbox value="5">
                                        <span>全球购</span>
                                    </a-checkbox>
                                    <a-checkbox value="6">
                                        <span>海外商品</span>
                                    </a-checkbox>
                                    <a-checkbox value="7">
                                        <span>消费者保障</span>
                                    </a-checkbox>
                                    <a-checkbox value="8">
                                        <span>货到付款</span>
                                    </a-checkbox>
                                    <a-checkbox value="9">
                                        <span>花呗分期</span>
                                    </a-checkbox>
                                </a-checkbox-group>
                            </div>
                        </div>
                        <div class="cond-item">
                            <div class="cond-left"><div class="cond-title">价格区间</div></div>
                            <div class="cond-right">
                                <a-input class="sm-input" v-model="taskInfo.goods_price_limit_start" type="number"></a-input>
                                -
                                <a-input class="sm-input" v-model="taskInfo.goods_price_limit_end" type="number"></a-input>
                                元
                            </div>
                        </div>
                        <div class="cond-item">
                            <div class="cond-left"><div class="cond-title">发货地</div></div>
                            <div class="cond-right">
                                <a-input class="mr-10" v-model="taskInfo.public_goods_addr"></a-input>
                                <span>(出于安全考虑，请勿大量使用)</span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 淘口令 -->
                <div v-show="taskInfo.search_type == 1">
                    <div class="cond-item">
                        <div class="cond-left mb-10">
                            <span class="cond-title">淘口令</span>
                        </div>
                        <div class="cond-right cond-key-list">
                            <div class="flexct flexwrap" v-for="(item, index) in search_keyword_tkl" :key="index">
                                <div class="flexct  mb-10 mr-10">
                                    <a-textarea
                                        style="width:250px;height:100px"
                                        placeholder="请输入淘口令"
                                        v-model="item.keyword"
                                    ></a-textarea>
                                </div>
                                <div class="flexct  mb-10">
                                    <span class="mr-10">发单量</span>
                                    <a-input v-model="item.number" type="number" @input="changeKeyNum1(item, index)"></a-input>
                                    <span class="ml-5">
                                        单
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="cond-item">
                        <div class="cond-left mb-10">
                            <span class="cond-title">实物图</span>
                        </div>
                        <div class="cond-right cond-key-list">
                            <ul class="upload-list-container">
                                <li class="upload-item" v-for="(item, index) in images_tkl" :key="index">
                                    <img :src="item" />
                                    <div class="delete"><a-icon @click="deleteImage(index)" type="delete"></a-icon></div>
                                </li>
                                <li class="upload-item upload-box" v-if="images_tkl.length <= 5">
                                    <input @change="fileUpload($event)" type="file" class="file-input" />
                                    <div class="upload-add"><a-icon type="plus"></a-icon></div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <!-- 二维码 -->
                <div v-show="taskInfo.search_type == 2">
                    <div class="cond-item">
                        <div class="cond-left mb-10">
                            <span class="cond-title">二维码</span>
                        </div>
                        <div class="cond-right cond-key-list">
                            <div class="flexct flexwrap" v-for="(item, index) in search_keyword_ewm" :key="index">
                                <div class="flexct  mb-10 mr-10">
                                    <a-upload
                                        name="avatar"
                                        list-type="picture-card"
                                        class="detail-uploader"
                                        :show-upload-list="false"
                                        :before-upload="beforeUpload"
                                        @change="handleChange_search1($event, index)"
                                    >
                                        <img v-if="item.keyword" :src="item.keyword" alt="avatar" />
                                        <div v-else class="c-gray">
                                            <a-icon :type="fileLoading ? 'loading' : 'plus'" />
                                        </div>
                                    </a-upload>
                                </div>
                                <div class="flexct  mb-10">
                                    <span class="mr-10">发单量</span>
                                    <a-input v-model="item.number" type="number" @input="changeKeyNum2(item, index)"></a-input>
                                    <span class="ml-5">
                                        单
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="cond-item">
                        <div class="cond-left mb-10">
                            <span class="cond-title">实物图</span>
                        </div>
                        <div class="cond-right cond-key-list">
                            <ul class="upload-list-container">
                                <li class="upload-item" v-for="(item, index) in images_ewm" :key="index">
                                    <img :src="item" />
                                    <div class="delete"><a-icon @click="deleteImage(index)" type="delete"></a-icon></div>
                                </li>
                                <li class="upload-item upload-box" v-if="images_ewm.length <= 5">
                                    <input @change="fileUpload($event)" type="file" class="file-input" />
                                    <div class="upload-add"><a-icon type="plus"></a-icon></div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <a-button type="primary" shape="round" class="btn-next mb-20" @click="toNext">下一步</a-button>
            </div>
        </div>
    </a-spin>
</template>

<script>
import stepCom from './stepCom'
import orderPrice from './orderPrice'
import { mapGetters } from 'vuex'
import * as api from '@/api/api'
export default {
    name: 'step2',
    components: {
        stepCom,
        orderPrice,
    },
    data() {
        return {
            BASE_URL: this.BASE_URL,
            spinning: false,
            fileLoading: false,
            radioStyle: {
                display: 'block',
            },
            headers: {
                authorization: 'authorization-text',
            },
            isScreenCondShow: false, //是否显示添加筛选条件

            cutList: [], //截图配置列表
            taoqVList: [], //淘气值配置列表
            ageList: [], //淘龄配置列表

            taskInfo: {
                store_id: '', // 1: 店铺id
                goods_link: '', //1: 店铺链接
                activity_type: '', //1: 活动类型 0-普通 1-优质
                goods_image: '', //1: 宝贝主图
                back_type: 1, //返款方式  0-平台 1-商家
                examine_type: 0, //审核方式 0-平台 1-商家
                screenshot_require: '', //截图要求 根据/Sender/goodsSearchConfig接口 获取cut字段中的列表id 选择后用id组成数组 转义JSON字符串
                taoqi_value: '', //淘气值 id
                tao_year: '', //淘龄 id
                examine_supple_remark: '', //审核补充说明
                search_type: 0, //进店方式 0-关键词  1-淘口令 2-二维码
                search_keyword: '', //搜索关键词 转义成JSON字符串  [{"keyword":"鞋子","number":2},{"keyword":"吴建豪同款","number":2}]
                backup_remark: '', //备用关键词
                sort_type: 0, //排序方式 0-综合排序 1-销量排序
                goods_pau_nums: '', //商品现有付款人数
                goods_search_price: '', //搜索列表展示价格
                screen_condition: '', //筛选条件
                goods_price_limit_start: '', //价格区间
                goods_price_limit_end: '', //价格区间
                public_goods_addr: '', //发货地
            },
            screenshot_require: [], //截图要求 数组
            search_keyword: [{ keyword: '', number: 1, images: '' }], //搜索关键词 数组
            search_keyword_ewm: [{ keyword: '', number: 1, images: '' }], //二维码关键词
            search_keyword_tkl: [{ keyword: '', number: 1, images: '' }], //淘口令关键词
            images_ewm: [], //二维码图
            images_tkl: [], //淘口令图
            screen_condition: [], //筛选条件
            screenshot_require_price: 0, //截图价格
            taoqi_value_price: 0,
            tao_year_price: 0,

            orderDetail: {
                buy_price_mi_price: 0, //基础赏金多出价格
                base_price: 0, //基础赏金 (+技术费)
                basic_service_fee: 0, //服务费
                back_type_price: 0, //返款金额
                back_type: 1, // 返款方式 1-商家 0-平台
                search_type: 0, //搜索方式  0-关键词  1-淘口令 2-二维码

                examine_price: 0, //审核价格
                taoqi_value_price: 0, //淘气值
                tao_year_price: 0, //淘龄
                screenshot_require_price: 0, //截图价格和
                order_num: 1, //发布数量
            },
        }
    },
    computed: {
        ...mapGetters(['postTaskInfo', 'DISCOUNT', 'orderDetailPrice']),
    },
    mounted() {
        this.goodsSearchConfig()
    },
    methods: {
        // 获取搜索配置信息
        goodsSearchConfig() {
            this.spinning = true
            api.goodsSearchConfig().then((res) => {
                this.spinning = false
                if (res.success) {
                    this.cutList = res.data.cut
                    this.taoqVList = res.data.value
                    this.ageList = res.data.age

                    // 设置初始审号值
                    this.changeScreenRequire([this.cutList[0]['id']])
                    this.taskInfo.taoqi_value = this.taoqVList[0]['id']
                    this.taskInfo.tao_year = this.ageList[0]['id']
                    if (this.$route.query.id) {
                        this.getDetail()
                    } else {
                        this.initTaskInfo()
                    }
                }
            })
        },
        // 复制 获取
        getDetail() {
            if (!this.$route.query.id) return
            api.grabDetail({ order_id: this.$route.query.id }).then((res) => {
                if (res.success) {
                    this.$store.commit('setPostTaskInfo', { ...res.data })
                    this.initTaskInfo()
                }
            })
        },

        // 初始化参数
        initTaskInfo() {
            this.taskInfo = Object.assign(this.taskInfo, this.postTaskInfo)
            console.log(' this.taskInfo', this.taskInfo)
            if (typeof this.taskInfo.screenshot_require == 'string') {
                this.screenshot_require = this.taskInfo.screenshot_require ? JSON.parse(this.taskInfo.screenshot_require) : []
            } else {
                this.screenshot_require = this.taskInfo.screenshot_require
            }
            if (typeof this.taskInfo.screen_condition == 'string') {
                this.screen_condition = this.taskInfo.screen_condition ? JSON.parse(this.taskInfo.screen_condition) : []
            } else {
                this.screen_condition = this.taskInfo.screen_condition
            }
            if (
                this.taskInfo.goods_price_limit_start ||
                this.taskInfo.goods_price_limit_end ||
                this.public_goods_addr ||
                this.screen_condition.length > 0
            ) {
                this.isScreenCondShow = true
            } else {
                this.isScreenCondShow = false
            }
            let search_keyword = []
            if (typeof this.taskInfo.search_keyword == 'string') {
                search_keyword = this.taskInfo.search_keyword
                    ? JSON.parse(this.taskInfo.search_keyword)
                    : [{ keyword: '', number: 1, images: '' }]
            } else {
                search_keyword = this.taskInfo.search_keyword
                    ? this.taskInfo.search_keyword
                    : [{ keyword: '', number: 1, images: '' }]
            }
            if (this.taskInfo.search_type == 0) {
                this.search_keyword = search_keyword
            } else if (this.taskInfo.search_type == 1) {
                this.search_keyword_tkl = search_keyword
                this.images_tkl = search_keyword[0].images ? search_keyword[0].images.split(',') : []
            } else if (this.taskInfo.search_type == 2) {
                this.search_keyword_ewm = search_keyword
                this.images_ewm = search_keyword[0].images ? search_keyword[0].images.split(',') : []
            }
            let num = 0
            _.each(this.search_keyword, (v) => (num += Number(v.number)))

            this.taskInfo.taoqi_value = Number(this.taskInfo.taoqi_value)
            this.taskInfo.tao_year = Number(this.taskInfo.tao_year)
            this.changeTQvalue()
            this.changeTyear()
            this.changeExamineType()
            this.getScreenPrice(this.screenshot_require)
            this.setOrderDetail('order_num', num)

            this.initPrice()
        },
        // 获取活动类型价格配置信息
        initPrice() {
            api.valueAddedServices().then((res) => {
                this.spinning = false
                if (res.success) {
                    let base_yz_price = res.data.sys.base[0].parameter_val
                    let base_pt_price = res.data.sys.base[1].parameter_val
                    let base_activity_price = this.taskInfo.activity_type == 0 ? base_pt_price : base_yz_price
                    console.log('base_activity_price', base_activity_price)
                    this.orderDetail.back_type_price = res.data.sys.base[2].parameter_val
                    // 价格合并
                    this.orderDetail = Object.assign({}, this.orderDetail, this.orderDetailPrice)
                    this.getBasePrice(base_activity_price)
                }
            })
        },
        // 获取基础价格配置
        getBasePrice(base_activity_price) {
            api.tariffDescription().then((res) => {
                if (res.success) {
                    let config = res.data.base
                    this.setOrderDetail('basic_service_fee', config[0].parameter_val)
                    // 手淘搜索 + 优质/普通
                    let base_price = config[1].parameter_val * 1 + base_activity_price * 1
                    this.setOrderDetail('base_price', base_price)
                }
            })
        },
        setOrderDetail(labeName, value) {
            this.$set(this.orderDetail, labeName, value)
        },
        // 返款方式改变
        changeBackType() {
            this.setOrderDetail('back_type', this.taskInfo.back_type)
        },
        // 搜索方式改变
        changeSearchType() {
            this.setOrderDetail('search_type', this.taskInfo.search_type)
        },
        // 审号方式改变获取价格
        changeExamineType() {
            if (this.taskInfo.examine_type == 1) {
                // 商家审核
                this.orderDetail = Object.assign(this.orderDetail, {
                    examine_type: 1,
                    taoqi_value_price: this.taoqi_value_price,
                    tao_year_price: this.tao_year_price,
                    screenshot_require_price: this.screenshot_require_price,
                })
            } else {
                // 平台审核
                this.orderDetail = Object.assign(this.orderDetail, {
                    examine_type: 0,
                    taoqi_value_price: 0,
                    tao_year_price: 0,
                    screenshot_require_price: 0,
                })
            }
        },
        // 截图要求改变
        changeScreenRequire(keys) {
            this.screenshot_require = keys
            this.taskInfo.screenshot_require = JSON.stringify(this.screenshot_require)
            this.getScreenPrice(keys)
        },
        // 淘气值
        changeTQvalue() {
            this.getTQvaluePrice(this.taskInfo.taoqi_value)
        },
        // 淘龄
        changeTyear() {
            this.getTyearPrice(this.taskInfo.tao_year)
        },
        // 获取截图价格
        getScreenPrice(keys) {
            let screenshot_require_price = 0
            if (keys && keys.length > 0) {
                _.each(keys, (key) => {
                    screenshot_require_price += Number(_.find(this.cutList, (o) => o.id === key).parameter_val)
                })
                this.screenshot_require_price = screenshot_require_price
                this.setOrderDetail('screenshot_require_price', screenshot_require_price)
            } else {
                this.screenshot_require_price = 0
                this.setOrderDetail('screenshot_require_price', 0)
            }
        },
        // 获取淘气值价格
        getTQvaluePrice(key) {
            let curObj = _.find(this.taoqVList, (o) => o.id === key)
            let taoqi_value_price = curObj ? curObj.parameter_val : 0
            this.taoqi_value_price = taoqi_value_price
            this.setOrderDetail('taoqi_value_price', taoqi_value_price)
        },
        // 获取淘龄价格
        getTyearPrice(key) {
            let curObj = _.find(this.ageList, (o) => o.id === key)
            let tao_year_price = curObj ? curObj.parameter_val : 0
            this.tao_year_price = tao_year_price
            this.setOrderDetail('tao_year_price', tao_year_price)
        },

        // 筛选条件
        changeScreenCond(keys) {
            this.screen_condition = keys
            this.taskInfo.screen_condition = keys.length > 0 ? JSON.stringify(this.screen_condition) : ''
        },
        // 显示隐藏筛选条件
        toggleScreenCond() {
            this.isScreenCondShow = !this.isScreenCondShow
        },
        // 添加 - 搜索关键词
        addKeyword() {
            this.search_keyword.push({ keyword: '', number: 1 })
        },
        // 删除 - 搜索关键词
        delKeyword(index) {
            this.search_keyword.splice(index, 1)
        },
        // 修改 -搜索关键词数量 必须大于1
        changeKeyNum(item, index) {
            if (item.number <= 0) {
                this.search_keyword[index]['number'] = 1
            }
        },
        // 修改 -搜索关键词数量 必须大于1
        changeKeyNum1(item, index) {
            if (item.number <= 0) {
                this.search_keyword_tkl[index]['number'] = 1
            }
        },
        // 修改 -搜索关键词数量 必须大于1
        changeKeyNum2(item, index) {
            if (item.number <= 0) {
                this.search_keyword_ewm[index]['number'] = 1
            }
        },
        // 修改主图
        async fileChange({ file, fileList }) {
            if (file.status == 'removed') return
            let fileDataBase64 = await this.util.getBase64(file)
            api.image_upload({ base_str: fileDataBase64, type: 2 }).then((res) => {
                if (res.success) {
                    this.$set(this.taskInfo, 'goods_image', this.BASE_URL + res.data)
                }
            })
        },
        beforeUpload(file) {
            return false
        },
        async handleChange_search1(info, index) {
            console.log('info', info)
            let file = info.file
            if (!file) return
            let fileBase64 = await this.util.getBase64(file)
            this.fileLoading = true
            api.image_upload({ base_str: fileBase64, type: 2 }).then((res) => {
                this.fileLoading = false
                if (res.success) {
                    let url = this.BASE_URL + res.data
                    this.search_keyword_ewm[index].keyword = url
                    let obj = this.search_keyword_ewm[index]
                    this.$set(this.search_keyword_ewm, index, obj)
                }
            })
        },
        //
        // 淘口令/二维码实物图
        deleteImage(index) {
            if (this.taskInfo.search_type == 1) {
                this.images_tkl.splice(index, 1)
            } else if (this.taskInfo.search_type == 2) {
                this.images_ewm.splice(index, 1)
            }
        },
        // 上传图片
        async fileUpload(e) {
            let file = e.target.files[0]
            if (!file) return
            let fileBase64 = await this.util.getBase64(file)
            api.image_upload({ base_str: fileBase64, type: 2 }).then((res) => {
                if (res.success) {
                    let url = this.BASE_URL + res.data
                    // this.fileList.push(url)
                    if (this.taskInfo.search_type == 1) {
                        this.images_tkl.push(url)
                    } else if (this.taskInfo.search_type == 2) {
                        this.images_ewm.push(url)
                    }
                }
            })
        },
        // 下一步
        toNext() {
            this.taskInfo.screenshot_require = JSON.stringify(this.screenshot_require)
            this.taskInfo.screen_condition = JSON.stringify(this.screen_condition)
            let search_keyword = []
            if (this.taskInfo.search_type == 0) {
                search_keyword = this.search_keyword
            } else if (this.taskInfo.search_type == 1) {
                search_keyword = this.search_keyword_tkl
                if (this.images_tkl.length == 0) return this.$message.warning('请上传至少一张实物图')
                search_keyword[0].images = this.images_tkl.join()
            } else if (this.taskInfo.search_type == 2) {
                search_keyword = this.search_keyword_ewm
                if (this.images_ewm.length == 0) return this.$message.warning('请上传至少一张实物图')
                search_keyword[0].images = this.images_ewm.join()
            }
            console.log('search_keyword', search_keyword)
            let hasNone = _.filter(search_keyword, (v) => v.keyword == '')
            if (hasNone.length > 0) {
                if (this.taskInfo.search_type == 0) return this.$message.warning('请将搜索关键词内容填写完整')
                else if (this.taskInfo.search_type == 1) return this.$message.warning('请输入淘口令')
                else if (this.taskInfo.search_type == 2) return this.$message.warning('请上传搜索二维码')
            }
            if (this.taskInfo.search_type == 0) {
                if (!this.taskInfo.goods_pau_nums) return this.$message.warning('请输入收货人数')
                if (!this.taskInfo.goods_search_price) return this.$message.warning('请输入展示价格')
            }

            this.taskInfo.search_keyword = JSON.stringify(search_keyword)
            console.log(' this.taskInfo', this.taskInfo)

            this.$store.commit('setPostTaskInfo', { ...this.taskInfo })
            this.$store.commit('setOrderDetailPrice', { ...this.orderDetail })
            this.$router.push({ name: 'step3', query: this.$route.query })
        },
    },
}
</script>
<style lang="less" scoped></style>
