import Vue from 'vue'
import App from './App.vue'
import { router } from './router/index'
import store from './store'
import VueWechatTitle from 'vue-wechat-title'
// import InjectAntPlugin from './plugins/ant'
import appConfig from '@/config'
import util from '@/utils'
import Antd from 'ant-design-vue';
import Uicomponents from '@/components/ui';
import _ from 'lodash'
import VueClipboard from 'vue-clipboard2'


Vue.use(VueClipboard)
Vue.use(Antd);
Vue.use(Uicomponents)
Vue.use(VueWechatTitle)

Vue.config.productionTip = false

/* 全局配置参数 */
Vue.prototype.appConfig = appConfig
Vue.prototype.BASE_URL = appConfig.BASE_URL[process.env.VUE_APP_ENV]
    /* 工具 */
Vue.prototype.util = util

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')