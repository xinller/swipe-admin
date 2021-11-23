<template>
    <div class="tdLog-container">
        <!-- 任务详情 - 任务日志 -->
        <a-row class="log-list" type="flex" align="middle" v-for="item in logInfo" :key="item.id">
            <a-col :xs="8">{{ item.create_time }}</a-col>
            <a-col :xs="8">{{ item.taobao_nickname }} </a-col>
            <a-col :xs="8">{{ item.remark }} </a-col>
        </a-row>
        <!-- <a-row class="log-list" type="flex" align="middle">
            <a-col :xs="8">2020-11-16 21:16:09</a-col>
            <a-col :xs="8">love曦晨若兮 </a-col>
            <a-col :xs="8">买家已接手 </a-col>
        </a-row>
        <a-row class="log-list" type="flex" align="middle">
            <a-col :xs="8">2020-11-16 21:16:09</a-col>
            <a-col :xs="8">love曦晨若兮 </a-col>
            <a-col :xs="8">买家搜索宝贝 </a-col>
        </a-row>
        <a-row class="log-list" type="flex" align="middle">
            <a-col :xs="8">2020-11-16 21:16:09</a-col>
            <a-col :xs="8">love曦晨若兮 </a-col>
            <a-col :xs="8">买家浏览聊天收藏 </a-col>
        </a-row>
        <a-row class="log-list" type="flex" align="middle">
            <a-col :xs="8">2020-11-16 21:16:09</a-col>
            <a-col :xs="8">love曦晨若兮 </a-col>
            <a-col :xs="8">买家已下单付款 </a-col>
        </a-row> -->
    </div>
</template>

<script>
export default {
    name: 'tdLog',
    props: {
        detail: {
            type: Array,
        },
    },
    watch: {
        detail(nval) {
            this.logInfo = nval
        },
    },
    data() {
        return {
            logInfo: this.detail,
        }
    },
}
</script>

<style lang="less" scoped></style>
