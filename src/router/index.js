import Vue from 'vue';
import VueRouter from 'vue-router';
import { routers } from './router';
import store from '@/store';
import NProgress from 'nprogress'
import appConfig from '@/config';
import util from '@/utils';
import { Modal } from 'ant-design-vue';
Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
    routes: routers
};

export const router = new VueRouter(RouterConfig);

//NavigationDuplicated的可能解决方案
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

router.beforeEach(async(to, from, next) => {
    //允许打开多少标签页
    if (appConfig.openTagsNav == 0 || store.state.app.tagNavList.length < appConfig.openTagsNav + 1 || util.routeHasExist(store.state.app.tagNavList, to)) {
        NProgress.start()
            //单点登录系统
        if (appConfig.sso) {
            if (store.state.app.noRouterNames.includes(to.name)) {
                next({ name: "error-403" })
            } else {
                next();
            }

        } else {
            if (to.name === 'register' || to.name === 'loginForget') {
                next()
            } else if (store.state.user.token == "" && to.name !== 'login') {
                next({ name: "login" });
            } else {
                if (store.state.app.noRouterNames.includes(to.name)) {
                    next({ name: "error-403" })
                } else {
                    next();
                }
            }
        }
    } else {
        Modal.error({
            title: '提示',
            content: `最多打开${appConfig.openTagsNav}标签页`,
        })
    }
});

router.afterEach(() => {
    NProgress.done();
    try {
        document.getElementById("contentWrapper") != null && document.getElementById("contentWrapper").scrollTo(0, 0)
    } catch (err) {}
});