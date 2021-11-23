<template>
    <div class="noticeDetail-container">
        <div class="ntc-title">{{ detailInfo.title }}</div>
        <div class="ntc-time">{{ detailInfo.create_time }}</div>
        <div class="ntc-content" v-html="detailInfo.content"></div>
        <div class="ntc-content">
            <video
                v-if="detailInfo.video_url"
                data-v-d89cb7b4=""
                id="video"
                :src="detailInfo.video_url"
                width="100%;"
                controls="controls"
                name="media"
            ></video>
        </div>
    </div>
</template>

<script>
import * as api from '@/api/api'
export default {
    name: 'noticeDetail',
    data() {
        return {
            detailInfo: '',
        }
    },
    mounted() {
        this.getDetail()
    },
    methods: {
        getDetail() {
            api.videoNewsDetails({ id: this.$route.query.id }).then((res) => {
                if (res.success) {
                    this.detailInfo = res.data
                }
            })
        },
    },
}
</script>

<style lang="less" scoped></style>
