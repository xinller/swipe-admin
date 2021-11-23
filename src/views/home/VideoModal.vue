<template>
    <a-modal v-model="isVisible" :footer="null" @cancel="toggle" :title="Mtitle" :width="1000">
        <video ref="video_el" :src="video_src" width="100%;" controls="controls" autoplay="autoplay" name="media"></video>
    </a-modal>
</template>

<script>
export default {
    name: 'VideoModal',
    props: {
        visible: {
            type: Boolean,
        },
        title: {
            type: String,
        },
        videoInfo: {
            type: Object,
        },
    },
    watch: {
        visible(value) {
            this.isVisible = value
        },
        videoInfo(value) {
            if (value) {
                this.Mtitle = value.title
                this.video_src = value.video_url
            }
        },
    },
    data() {
        return {
            isVisible: this.visible,
            Mtitle: this.title,
            video_src: '',
        }
    },
    methods: {
        toggle() {
            this.$refs.video_el.pause()
            this.$emit('toggle', false)
        },
    },
}
</script>

<style lang="less" scoped>
#video {
    height: 600px;
    object-fit: fill;
    border: 0;
    outline: none;
}
</style>
