import util from '@/utils';
import appConfig from "@/config";

const app = {
    state: {
        hotkeyPriority: "",
        tagNavList: [appConfig.homepage],
        menuList: [],
        subMenuList:[],
        collapsed: false,
        noRouterNames: [],
        cachePage: [],
        skinTheme: null,
        appSize: null,
        dontCache: ["level-2", "level-3-1"] // 在这里定义你不想要缓存的页面的name属性值(参见路由配置router.js)
    },
    mutations: {
        //设置页面元素大小
        setAppSize(state, val) {
            state.appSize = val
        },
        //设置皮肤主题
        setSkinTheme(state, val) {
            state.skinTheme = val
        },
        //设置尺寸大小
        setCollapsed(state, status) {
            state.collapsed = status
        },
        //更新没有权限路由Name集合
        setNoRouterNames(state, names) {
            state.noRouterNames = names
        },
        //更新快捷键指令优先级
        updateHotkeyPriority(state, val) {
            state.hotkeyPriority = val
        },
        //更新左侧导航
        setMenulist(state, list) {
            state.menuList = list
        },
        //更新二级导航
        setSubMenulist(state, list) {
            state.subMenuList = list
        },
        //添加标签导航
        addTag(state, { route, type = 'unshift' }) {
            let router = util.getRouteTitleHandled(route)
            if (!util.routeHasExist(state.tagNavList, router)) {
                if (type === 'push') state.tagNavList.push(router)
                else {
                    if (router.name === appConfig.homepage.name) state.tagNavList.unshift(router)
                    else state.tagNavList.splice(1, 0, router)
                }
            }
        },
        //设置标签导航
        setTagNavList(state, list = {}) {
            let tagList = []
            if (list) {
                tagList = [...list]
            }
            if (tagList[0] && tagList[0].name !== appConfig.homepage.name) tagList.shift()
            let homeTagIndex = tagList.findIndex(item => item.name === appConfig.homepage.name)
            if (homeTagIndex > 0) {
                let homeTag = tagList.splice(homeTagIndex, 1)[0]
                tagList.unshift(homeTag)
            }
            this.commit('setCachePage', tagList)
            state.tagNavList = tagList
        },
        //设置缓存页面
        setCachePage(state, pages) {
            let names = pages.map((item) => {
                return item.name
            }).filter(item => {
                return !util.hasOneOf(state.dontCache, [item])
            })
            names.push("ParentView") //多级路由手动添加成缓存
            state.cachePage = names
        }
    }
};

export default app;