<template>
    <a-config-provider :getPopupContainer="getPopupContainer" :locale="locale">
        <div v-wechat-title="title" id="app">
            <router-view :class="[appStyle, appSize, skinTheme.class]" />
        </div>
    </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
export default {
    name: 'app',
    data() {
        return {
            locale: zhCN,
            appStyle: this.appConfig.ambient,
            title: this.appConfig.title,
        }
    },
    watch: {
        $route(to, from) {
            this.title = `${this.appConfig.title} - ${to.meta.title}`
        },
    },
    computed: {
        appSize() {
            let appSize = this.$store.state.app.appSize ? this.$store.state.app.appSize : this.appConfig.elementSize
            return appSize
        },
        skinTheme() {
            let skinTheme = this.$store.state.app.skinTheme ? this.$store.state.app.skinTheme : this.appConfig.skinTheme
            return skinTheme
        },
    },
    methods: {
        getPopupContainer(el, dialogContext) {
            if (dialogContext) {
                return dialogContext.getDialogWrap()
            } else {
                return document.body
            }
        },
    },
}
</script>
<style lang="less">
@import './styles/index.less';
</style>
