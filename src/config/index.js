export default {
    /**
     * @description app运行环境["his13","web"]
     */
    ambient: 'web',
    /**
     * @description 单点登录系统
     */
    sso: false,
    /**
     * @description 配置显示在浏览器标签的title
     */
    title: '鲸鱼',
    /**
     * @description 配置允许打开多少标签页（默认 0 不限制）
     */
    openTagsNav: 0,
    /**
     * @description 配置页面元素大小（ default 中, large 大, small 小）
     */
    elementSize: 'default',
    /**
     * @description 皮肤主题（其他主题定义查看模板“动态皮肤” colorList）
     */
    skinTheme: {
        class: 'skin-lightblue',
        key: '亮蓝',
        color: '#00A8FC',
    },
    /**
     * @description 配置默认首页
     */
    homepage: {
        title: '首页',
        path: '/index',
        name: 'storeCenter',
    },
    BASE_URL: {
        // dev: 'http://seller.zmhit.top/',
        dev: 'http://seller.aipaymi.online/',
        build: 'http://seller.aipaymi.online/',
        buildTest: 'http://seller.zmhit.top/',
        invite: 'http://www.aipaymi.online/seller/',
        inviteTest: 'http://www.aipaymi.online/seller/',
        // inviteTest: 'http://www.aipaymi.online/test/seller/'
    },
    APIKEY: '0C6EDDD8839410BDF1A3D35A46008E94'
}