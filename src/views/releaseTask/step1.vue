<template>
    <!-- 发布活动 -->
    <a-spin :spinning="spinning" class="releaseTask-container">
        <div class="title">发布任务</div>
        <stepCom :activeKey="1" />
        <div class="step1-page">
            <div class="section-title">第一步：选择活动类型</div>
            <div class="section-con">
                <img src="../../assets/images/task/tb-icon.png" class="tb-icon" />
                <a-radio-group v-model="form.activity_type" class="radio-list mt-10">
                    <a-radio :style="radioStyle" :value="1">
                        <span>
                            <span class="radio-type"> 淘宝/天猫 <span class="c-red">优质</span>试用活动</span>
                            <span class="c-gray ml-10"
                                >(优质账号搜索下单，通过内部验号稽查系统筛选白名单和标签，稳定安全，降权包赔。）</span
                            >
                            <img src="../../assets/images/task/hot.png" class="hot" />
                            <v-tooltip placement="top">
                                <template slot="content">
                                    白名单大多是店铺的真实粉丝，并通过内部稽查系统从多维度过滤掉降权号，恶意退款号，黑号等，确保粉丝的安全性，具体算法请联系客服。
                                </template>
                            </v-tooltip>
                            <span class="c-red">+ {{ base_yz_price * this.DISCOUNT }} 元/单</span>
                        </span>
                    </a-radio>
                    <a-radio :style="radioStyle" :value="0">
                        <span>
                            <span class="radio-type"> 淘宝/天猫 <span class="c-red">普通</span>试用活动</span>
                            <span class="c-gray ml-10">(普通账号搜索下单，适合店铺阈值高的商家使用。）</span>
                            <v-tooltip placement="top">
                                <template slot="content">
                                    适合店铺层级高，做单量比列不大的店铺， 如果你的店铺阈值低，为了安全建议使用优质试用。
                                </template>
                            </v-tooltip>
                            <span class="c-red">+ {{ base_pt_price * this.DISCOUNT }} 元/单</span>
                        </span>
                    </a-radio>
                </a-radio-group>
            </div>

            <div class="section-title">第二步:选择店铺</div>
            <div class="section-con">
                <a-radio-group v-model="form.store_id" class="radio-list mt-10">
                    <a-radio :style="radioStyle" :value="item.id" v-for="item in storeList" :key="item.id">
                        <img src="../../assets/images/task/taobao.png" class="taobao" />
                        <span class="radio-text-bd">{{ item.store_name }}</span>
                    </a-radio>
                </a-radio-group>
            </div>

            <div class="section-title">第三步:填写宝贝链接</div>
            <div class="section-con">
                <div class="bb-box">
                    <div class="bb-link">
                        <a-input v-model="form.goods_link" @focus="showHistory"></a-input>
                        <v-tooltip placement="top">
                            <template slot="content">
                                此链接用于核店铺信息，不会对外公布此链接
                            </template>
                        </v-tooltip>
                    </div>
                    <div class="bb-box-history" v-if="goodsShow">
                        <div class="c-gray size-14 p-10">搜索历史</div>
                        <a-list size="small" :pagination="pagination" :data-source="goodsInfo">
                            <a-list-item class="pointer" slot="renderItem" slot-scope="item, index" @click="chooseHistory(item)">
                                <a-list-item-meta :description="item.store_name">
                                    <a slot="title" href="javascript:;">{{ item.goods_title }}</a>
                                    <img :src="item.goods_image" slot="avatar" class="goods_image" />
                                </a-list-item-meta>
                                <div>
                                    <a-icon class="c-primary pointer" type="delete" @click.stop="deleteHistory(index)"></a-icon>
                                </div>
                            </a-list-item>
                        </a-list>
                    </div>
                </div>
                <a-button :loading="loading" :disabled="loading" type="primary" shape="round" class="btn-next" @click="toNext"
                    >验证</a-button
                >
            </div>
        </div>
    </a-spin>
</template>

<script>
import stepCom from './stepCom'
import * as api from '@/api/api'
import { mapGetters } from 'vuex'
export default {
    name: 'step1',
    components: {
        stepCom,
    },
    data() {
        return {
            spinning: false,
            radioStyle: {
                display: 'block',
            },
            loading: false,
            storeList: [],
            form: {
                store_id: '', //店铺id
                goods_link: '', //店铺链接
                activity_type: 0, //活动类型 0-普通 1-优质
                goods_token: '', //商品token 非必填 请求后返回,如果重复请求可用
            },
            pagination: {
                onChange: (page) => {
                    console.log(page)
                },
                pageSize: 5,
            },
            goodsInfo: [],
            goodsShow: false,
            base_yz_price: 0, //优质赏金
            base_pt_price: 0, //普通赏金
        }
    },
    computed: {
        ...mapGetters(['DISCOUNT']),
    },
    created() {
        // 清空任务列表
        this.$store.commit('setPostTaskInfo', {})
        this.$store.commit('setOrderDetailPrice', { clear: true })
        this.getUserDetail()
    },
    mounted() {
        this.getGoodsInfo()
        this.getStoreList()
    },
    methods: {
        // 获取配置信息
        getConfig() {
            this.spinning = true
            api.valueAddedServices().then((res) => {
                this.spinning = false
                if (res.success) {
                    this.base_yz_price = res.data.sys.base[0].parameter_val
                    this.base_pt_price = res.data.sys.base[1].parameter_val
                }
            })
        },
        // 获取折扣比例
        getUserDetail() {
            api.getUserDetail().then((res) => {
                if (res.success) {
                    this.$store.commit('setDiscount', res.data.discount / 100)
                    this.getConfig()
                }
            })
        },
        // 可用店铺列表
        getStoreList() {
            this.spinning = true
            api.getStoreList({ page: 1, rows: 1000 }).then((res) => {
                this.spinning = false
                if (res.success) {
                    this.storeList = res.data.list
                    if (this.storeList.length > 0) {
                        this.form.store_id = res.data.list[0]['id']
                    }
                }
            })
        },
        // 获取缓存的搜索记录
        getGoodsInfo() {
            let goods = localStorage.getItem('goodsInfo')
            this.goodsInfo = goods && goods != 'null' ? JSON.parse(goods) : []
        },
        // 显示历史记录 链接获取焦点  有记录就
        showHistory() {
            if (this.goodsInfo.length > 0) {
                this.goodsShow = true
            }
        },
        // 隐藏历史记录
        hideHistory() {
            this.goodsShow = false
        },
        // 选择历史记录
        chooseHistory(item) {
            console.log('item', item)
            this.form.goods_link = item.goods_link
            this.form.goods_token = item.goods_token
            this.form.store_id = Number(item.store_id)
            this.hideHistory()
        },
        // 删除历史记录
        deleteHistory(index) {
            this.goodsInfo.splice(index, 1)
            localStorage.setItem('goodsInfo', JSON.stringify(this.goodsInfo))
        },

        // 验证
        toNext() {
            // 要判断是否是该店铺的链接 http格式 (宝贝链接格式错误?通过什么判断)
            if (!this.form.goods_link) return this.$message.error('请输入宝贝链接')
            this.loading = true
            this.spinning = true
            api.postTaskStep1(this.form).then((res) => {
                this.loading = false
                this.spinning = false
                if (res.success) {
                    let data = res.data
                    // activity_type: 0,
                    // goods_image:
                    //     'https://img.alicdn.com/imgextra/https://img.alicdn.com/imgextra/i4/2788180790/O1CN01FQCtM61HhrUye6ct2_!!2788180790.jpg_430x430q90.jpg',
                    // goods_link: 'https://detail.tmall.com/item.htm?id=613965694177',
                    // goods_price: '136.00',
                    // goods_title: '正山小种茶叶红茶正宗特级浓香型香散装灌装包装袋装高档送礼专用',
                    // goods_token: 'goods_d8f5f0e9492161572977cdfae6764d36',
                    // store_id: '23',
                    // store_name: '名池旗舰店',

                    let goods_info = {
                        goods_image: data.goods_image,
                        goods_link: data.goods_link,
                        goods_price: data.goods_price,
                        goods_title: data.goods_title,
                        goods_token: data.goods_token,
                        store_id: data.store_id,
                        store_name: data.store_name,
                    }
                    // 设置历史记录
                    this.setGoodsInfo(goods_info)
                    // 任务信息
                    this.$store.commit('setPostTaskInfo', { ...data })
                    // 价格信息
                    let base_activity_price = this.form.activity_type == 0 ? this.base_pt_price : this.base_yz_price
                    this.$store.commit('setOrderDetailPrice', {
                        base_activity_price: base_activity_price,
                    })
                    this.$router.push({ name: 'step2' })
                }
            })
        },
        setGoodsInfo(value) {
            let goodsInfo = this.goodsInfo
            let has = false
            _.each(goodsInfo, (v) => {
                if (v.goods_link === value.goods_link) {
                    v = { ...value }
                    has = true
                    return
                }
            })
            if (!has) {
                goodsInfo.unshift(value)
            }
            localStorage.setItem('goodsInfo', JSON.stringify(goodsInfo))
            this.goodsInfo = goodsInfo
        },
    },
}
</script>

<style lang="less" scoped></style>
