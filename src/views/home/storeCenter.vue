<template>
    <div class="storeCenter-container">
        <!-- banner -->
        <a-row class="store-banner">
            <a-col :span="24" class="txt-ct">
                <img src="../../assets/images/home/banner.png" />
            </a-col>
        </a-row>
        <!-- 公告 -->
        <a-row class="store-notice">
            <a-col :span="24" class="notice_wrap" v-for="item in noticeData" :key="item.id" @click="toNotice(item)">
                <a-icon type="bell" class="bell" />
                <div class="notice_list">{{ item.title }}</div>
            </a-col>
        </a-row>
        <!-- 商铺信息 -->
        <a-row class="store-user">
            <a-col :xs="8" :lg="4" class="c-gray">
                店铺
            </a-col>
            <a-col :xs="8" :lg="6">
                已添加
            </a-col>
            <a-col :xs="8" :lg="8" class="c-primary">
                <router-link :to="{ name: 'user_index' }">店铺管理</router-link>
            </a-col>
        </a-row>
        <a-row class="store-ensure">
            <a-col :xs="16" :lg="10" class="c-gray">
                未加入消费者保障服务
            </a-col>
            <a-col :xs="8" :lg="8" class="c-primary">
                <router-link :to="{ name: 'dailyCoin' }">缴纳保证金</router-link>
            </a-col>
        </a-row>
        <!-- 商家金额 -->
        <a-row class="store-asset flexwrap">
            <a-col :xs="12" :md="10" :lg="10">
                <div class="desc">
                    <span class="c-gray mr-5">货款账户</span>
                    <a-tooltip placement="right">
                        <template slot="title">
                            <span class="size-12">可用于支付活动本金，购买鲸币，支持提现。</span>
                        </template>
                        <a-icon type="question-circle" class="c-gray" />
                    </a-tooltip>
                    <span class="c-primary ml-5"><router-link :to="{ name: 'fundManage_index' }">充值</router-link> </span>
                </div>
                <div class="num" v-if="userBalance2">{{ userBalance2 }}</div>
            </a-col>
            <a-col :xs="12" :md="10" :lg="10">
                <div class="desc">
                    <span class="c-gray mr-5">鲸币账户</span>
                    <a-tooltip placement="right">
                        <template slot="title">
                            <span class="size-12"
                                >可用于支付活动赏金，由商家按需购买，不支持退款和提现，只能通过发布活动消耗。</span
                            >
                        </template>
                        <a-icon type="question-circle" class="c-gray" />
                    </a-tooltip>
                    <span class="c-primary ml-5 pointer" @click="toExchange">兑换</span>
                </div>
                <div class="num" v-if="userBalance1">{{ userBalance1 }}</div>
            </a-col>
            <a-col :xs="4" :md="4" :lg="4" class="txt-rt">
                <span class="store-btn pointer" @click="toRelease">发布任务</span>
            </a-col>
        </a-row>
        <!-- 须知 -->
        <a-row class="store-note" :gutter="[16, 16]" type="flex" justify="start">
            <a-col :xs="24" :md="12" :lg="8">
                <div class="note-item">
                    <div class="title">活动管理</div>
                    <a-row class="detail">
                        <a-col :span="12">未支付活动：{{ sellInfo ? sellInfo.activity.unpay : 0 }}</a-col>
                        <a-col :span="12">已取消活动：{{ sellInfo ? sellInfo.activity.cancle : 0 }}</a-col>
                    </a-row>
                    <a-row class="detail">
                        <a-col :span="12">进行中活动：{{ sellInfo ? sellInfo.activity.doing : 0 }}</a-col>
                        <a-col :span="12">已完成活动：{{ sellInfo ? sellInfo.activity.complete : 0 }}</a-col>
                    </a-row>
                    <div class="title mt-25">任务管理</div>
                    <a-row class="detail">
                        <a-col :span="12">待接手：{{ sellInfo ? sellInfo.mission.unreceive : 0 }}</a-col>
                        <a-col :span="12">进行中：{{ sellInfo ? sellInfo.mission.doing : 0 }}</a-col>
                    </a-row>
                    <a-row class="detail">
                        <a-col :span="12">待发货：{{ sellInfo ? sellInfo.mission.send : 0 }}</a-col>
                        <a-col :span="12">待收货：{{ sellInfo ? sellInfo.mission.parse : 0 }}</a-col>
                    </a-row>
                    <a-row class="detail">
                        <a-col :span="12">待返款：{{ sellInfo ? sellInfo.mission.return : 0 }}</a-col>
                        <a-col :span="12">已完成：{{ sellInfo ? sellInfo.mission.complete : 0 }}</a-col>
                    </a-row>
                    <a-row class="detail">
                        <a-col :span="12">未发布：{{ sellInfo ? sellInfo.mission.unpublic : 0 }}</a-col>
                        <a-col :span="12">已关闭：{{ sellInfo ? sellInfo.mission.close : 0 }}</a-col>
                    </a-row>
                </div>
            </a-col>

            <a-col :xs="24" :md="12" :lg="8">
                <div class="note-item">
                    <div class="title">商家须知</div>
                    <div class="tip">
                        【云礼品】代发快递礼品菜鸟面单空包，低至2元每单黑科技双打标任务，一单抵三单权重（已恢复使用）
                    </div>
                    <ul class="question">
                        <li v-for="item in sellInfo.notice" :key="item.id">
                            <router-link :to="'/noticeDetail?id=' + item.id">{{ item.title }}</router-link>
                        </li>
                    </ul>
                </div>
            </a-col>

            <a-col :xs="24" :md="12" :lg="8">
                <div class="note-item">
                    <div class="title">视频教程</div>
                    <div class="teach-img" @click="showVideo(video_one)">
                        <img :src="video_one.images" />
                        <img src="../../assets/images/home/play2.png" class="play_btn" />
                    </div>
                    <ul class="question">
                        <li v-for="item in video_list" :key="item.id" @click="showVideo(item)">
                            <img src="../../assets/images/home/play.png" class="play" />
                            <span class="video-span pointer">{{ item.title }}</span>
                        </li>
                    </ul>
                </div>
            </a-col>
        </a-row>
        <!-- 兑换modal -->

        <VideoModal :visible="video_show" :videoInfo="videoInfo" @toggle="video_show = false"></VideoModal>
    </div>
</template>

<script>
import * as api from '@/api/api'
import VideoModal from './VideoModal'
import { mapGetters } from 'vuex'
export default {
    name: 'storeCenter',
    components: {
        VideoModal,
    },
    computed: {
        ...mapGetters(['exModalVisible', 'userBalance1', 'userBalance2']),
    },
    watch: {},
    data() {
        return {
            visible: false,
            video_show: false,
            videoInfo: {},
            noticeData: [],
            sellInfo: '',
            video_one: '',
            video_list: [],
        }
    },
    mounted() {
        this.getData()
        this.getCenter()
    },
    methods: {
        // 发布任务
        toRelease() {
            this.$router.replace({ name: 'releaseTask_index' })
        },
        // 兑换
        toExchange() {
            this.$store.commit('showExchange', true)
        },
        // 商家中心
        getCenter() {
            api.sellerCenter().then((res) => {
                if (res.success) {
                    this.sellInfo = res.data
                    this.video_one = res.data.video[0]
                    this.video_list = _.filter(res.data.video, (v, index) => index > 0)
                }
            })
        },
        // 视频播放
        showVideo(item) {
            this.videoInfo = item
            this.video_show = true
        },
        // 公告
        getData() {
            this.loading = true
            api.noticeList({
                page: 1,
                rows: 10,
            }).then((res) => {
                this.loading = false
                if (res.success) {
                    this.noticeData = res.data.list
                }
            })
        },
        // 公告详情
        toNotice(item) {
            this.$router.push({ name: 'noticeDetail', query: { id: item.id } })
        },
    },
}
</script>

<style lang="less" scoped></style>
