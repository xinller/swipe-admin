<template>
    <form
        ref="export_form"
        :action="this.BASE_URL + post_url"
        method="post"
        target="_blank"
        enctype="application/x-www-form-urlencoded"
    >
        <input type="text" :name="index" :value="item" v-for="(item, index) in form" :key="index" />
        <input type="text" name="token" v-model="token" />
        <input type="text" name="secret_token" v-model="secret_token" />
        <input type="text" name="sign" v-model="sign" />
        <input type="text" name="t" v-model="t" />
        <input type="text" name="status" value="0" />
        <input type="submit" value="Submit" />
    </form>
</template>

<script>
import hex_md5 from '@/api/md5'
export default {
    name: 'exportTable',
    props: {
        params: {
            type: Object,
        },
        postUrl: {
            type: String,
        },
    },
    watch: {
        params(val) {
            this.form = val
            this.getPrams()
        },
        postUrl(val) {
            this.post_url = val
        },
    },
    data() {
        return {
            form: this.params,
            post_url: this.postUrl,
            token: '',
            secret_token: '',
            sign: '',
            t: '',
        }
    },
    mounted() {
        this.getPrams()
    },
    methods: {
        getPrams() {
            let apikey = this.appConfig.APIKEY
            this.t = Math.round(new Date().getTime() / 1000)
            this.sign = hex_md5(this.t + apikey).toUpperCase()
            this.token = this.$store.state.user.SWIPE_A_TOKEN
            this.secret_token = this.$store.state.user.userInfo.secret_token
        },
    },
}
</script>

<style lang="less" scoped></style>
