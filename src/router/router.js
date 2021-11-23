import Main from '@/components/layout/main/index.vue'
import parentView from '@/components/layout/parent-view/index.vue'

import appConfig from '@/config'


export const loginRouter = [{
        path: '/login',
        name: 'login',
        meta: {
            title: '登录',
        },
        component: () =>
            import ('@/views/login/index.vue'),
    },
    {
        path: '/register',
        name: 'register',
        meta: {
            title: '注册',
        },
        component: () =>
            import ('@/views/login/register.vue'),
    },
    {
        path: '/forget',
        name: 'loginForget',
        meta: {
            title: '忘记密码',
        },
        component: () =>
            import ('@/views/login/loginForget.vue'),
    }
]

export const errorRouter = [{
        path: '/*',
        name: 'error-404',
        meta: {
            title: '404-页面不存在',
        },
        component: () =>
            import ('@/views/error-page/404.vue'),
    },
    {
        path: '/403',
        meta: {
            title: '403-权限不足',
        },
        name: 'error-403',
        component: () =>
            import ('@/views/error-page/403.vue'),
    },
    {
        path: '/500',
        meta: {
            title: '500-服务端错误',
        },
        name: 'error-500',
        component: () =>
            import ('@/views/error-page/500.vue'),
    }
]

// 左侧导航
export const menuRouter = [{
            path: '/releaseTask',
            icon: require('../assets/images/home/send.png'),
            icon_on: require('../assets/images/home/send_on.png'),
            meta: {
                title: '发布活动'
            },
            name: 'releaseTask',
            component: Main,
            children: [{
                path: 'index',
                meta: {
                    title: '发布活动'
                },
                name: 'releaseTask_index',
                component: () =>
                    import ('@/views/releaseTask/step1.vue')
            }]
        },
        {
            path: '/activeManage',
            icon: require('../assets/images/home/active.png'),
            icon_on: require('../assets/images/home/active_on.png'),
            meta: {
                title: '活动管理'
            },
            name: 'active',
            component: Main,
            children: [{
                path: 'index',
                meta: {
                    title: '活动管理'
                },
                name: 'active_index',
                component: () =>
                    import ('@/views/active/manage.vue')
            }]
        },
        {
            path: '/taskManage',
            icon: require('../assets/images/home/task.png'),
            icon_on: require('../assets/images/home/task_on.png'),
            meta: {
                title: '任务管理'
            },
            name: 'taskManage',
            component: Main,
            children: [{
                path: 'index',
                meta: {
                    title: '任务管理'
                },
                name: 'taskManage_index',
                component: () =>
                    import ('@/views/task/manage.vue')
            }]
        },
        {
            path: '/checkManage',
            icon: require('../assets/images/home/manage.png'),
            icon_on: require('../assets/images/home/manage_on.png'),
            meta: {
                title: '审号管理'
            },
            name: 'checkManage',
            component: Main,
            children: [{
                path: 'index',
                meta: {
                    title: '审号管理'
                },
                name: 'checkManage_index',
                component: () =>
                    import ('@/views/active/checkManage.vue')
            }]
        },
        {
            path: '/fundManage',
            icon: require('../assets/images/home/money.png'),
            icon_on: require('../assets/images/home/money_on.png'),
            meta: {
                title: '资金管理'
            },
            name: 'fundManage',
            component: Main,
            children: [{
                path: 'index',
                meta: {
                    title: '资金管理'
                },
                name: 'fundManage_index',
                component: () =>
                    import ('@/views/fund/manage.vue')
            }]
        },
        {
            path: '/payment',
            icon: require('../assets/images/home/trans.png'),
            icon_on: require('../assets/images/home/trans_on.png'),
            meta: {
                title: '等待转账'
            },
            name: 'payment',
            component: Main,
            children: [{
                path: 'index',
                meta: {
                    title: '等待转账'
                },
                name: 'payment_index',
                component: () =>
                    import ('@/views/payment/index.vue')
            }]
        },
        {
            path: '/user',
            icon: require('../assets/images/home/user.png'),
            icon_on: require('../assets/images/home/user_on.png'),
            meta: {
                title: '账号信息'
            },
            name: 'user',
            component: Main,
            children: [{
                path: 'index',
                meta: {
                    title: '账号信息'
                },
                name: 'user_index',
                component: () =>
                    import ('@/views/user/index.vue')
            }]
        },
        {
            path: '/blackList',
            icon: require('../assets/images/home/blackod.png'),
            icon_on: require('../assets/images/home/blackod_on.png'),
            meta: {
                title: '黑名单'
            },
            name: 'blackList',
            component: Main,
            children: [{
                path: 'index',
                meta: {
                    title: '黑名单'
                },
                name: 'blackList_index',
                component: () =>
                    import ('@/views/user/blackList.vue')
            }]
        },
        {
            path: '/bill',
            icon: require('../assets/images/home/order.png'),
            icon_on: require('../assets/images/home/order_on.png'),
            meta: {
                title: '查看账单'
            },
            name: 'bill',
            component: Main,
            children: [{
                path: 'index',
                meta: {
                    title: '查看账单'
                },
                name: 'bill_index',
                component: () =>
                    import ('@/views/user/bill.vue')
            }]
        },
        // {
        //     path: '/mark',
        //     icon: require('../assets/images/home/sign.png'),
        //     icon_on: require('../assets/images/home/sign_on.png'),
        //     meta: {
        //         title: '打标神器'
        //     },
        //     name: 'mark',
        //     component: Main,
        //     children: [{
        //         path: 'index',
        //         meta: {
        //             title: '打标神器'
        //         },
        //         name: 'mark_index',
        //         component: () =>
        //             import ('@/views/user/mark.vue')
        //     }]
        // },
        // {
        //     path: '/gift',
        //     icon: require('../assets/images/home/gift.png'),
        //     icon_on: require('../assets/images/home/gift_on.png'),
        //     name: 'isTurnByHref_http://www.yunlipin.net/index.html', //打开新页面  以 isTurnByHref_ 为前缀
        //     meta: {
        //         title: '礼品快递',
        //     },

        // },
    ]
    // 头部导航
export const topRouter = [{
        path: '/',
        icon: "",
        meta: {
            title: "商家中心"
        },
        name: 'home',
        component: Main,
        redirect: '/index',
        children: [{
                path: '/index',
                meta: {
                    title: '商家中心'
                },
                name: 'storeCenter',
                component: () =>
                    import ('@/views/home/storeCenter.vue')
            },
            {
                path: '/invite',
                meta: {
                    title: '邀请赚米'
                },
                name: 'invite',
                component: () =>
                    import ('@/views/home/invite.vue')
            },
            {
                path: '/inviteRule',
                meta: {
                    title: '邀请赚米'
                },
                name: 'inviteRule',
                component: () =>
                    import ('@/views/home/inviteRule.vue')
            },
            {
                path: '/notice',
                meta: {
                    title: '公告中心'
                },
                name: 'notice',
                component: () =>
                    import ('@/views/home/notice.vue')
            },
            {
                path: '/noticeDetail',
                meta: {
                    title: '公告详情'
                },
                name: 'noticeDetail',
                component: () =>
                    import ('@/views/home/noticeDetail.vue')
            },
            {
                path: '/fundDetail',
                meta: {
                    title: '资费说明'
                },
                name: 'fundDetail',
                component: () =>
                    import ('@/views/home/fundDetail.vue')
            },
            {
                path: '/video',
                meta: {
                    title: '视频教程'
                },
                name: 'video',
                component: () =>
                    import ('@/views/home/video.vue')
            },
            {
                path: '/videoDetail',
                meta: {
                    title: '视频教程'
                },
                name: 'videoDetail',
                component: () =>
                    import ('@/views/home/videoDetail.vue')
            },
            {
                path: '/blackCat',
                meta: {
                    title: '黑猫实验室'
                },
                name: 'blackCat',
                component: () =>
                    import ('@/views/home/blackCat.vue')
            },
            {
                path: '/blackCatDetail',
                meta: {
                    title: '黑猫实验室'
                },
                name: 'blackCatDetail',
                component: () =>
                    import ('@/views/home/blackCatDetail.vue')
            },
            {
                path: '/dailyCoin',
                meta: {
                    title: '每日领鲸币'
                },
                name: 'dailyCoin',
                component: () =>
                    import ('@/views/home/dailyCoin.vue')
            }

        ]
    }]
    // 左侧隐藏 子导航
export const hideRouter = [{
            path: '/releaseTask',
            icon: '',
            meta: {
                title: '发布活动'
            },
            name: 'releaseTask_hide',
            component: Main,
            children: [{
                path: 'step2',
                meta: {
                    title: '发布活动'
                },
                name: 'step2',
                component: () =>
                    import ('@/views/releaseTask/step2.vue')
            }, {
                path: 'step3',
                meta: {
                    title: '发布活动'
                },
                name: 'step3',
                component: () =>
                    import ('@/views/releaseTask/step3.vue')
            }, {
                path: 'step4',
                meta: {
                    title: '发布活动'
                },
                name: 'step4',
                component: () =>
                    import ('@/views/releaseTask/step4.vue')
            }, {
                path: 'step5',
                meta: {
                    title: '发布活动'
                },
                name: 'step5',
                component: () =>
                    import ('@/views/releaseTask/step5.vue')
            }]
        },
        {
            path: '/activeManage',
            icon: '',
            meta: {
                title: '活动详情'
            },
            name: 'activity_hide',
            component: Main,
            children: [{
                path: 'activityDetail',
                meta: {
                    title: '活动详情'
                },
                name: 'activityDetail',
                component: () =>
                    import ('@/views/active/activityDetail.vue')
            }, ]
        },
        {
            path: '/taskManage',
            icon: '',
            meta: {
                title: '任务详情'
            },
            name: 'taskManage_hide',
            component: Main,
            children: [{
                path: 'taskDetail',
                meta: {
                    title: '任务详情'
                },
                name: 'taskDetail',
                component: () =>
                    import ('@/views/task/taskDetail.vue')
            }, {
                path: 'delivery',
                meta: {
                    title: '任务发货'
                },
                name: 'delivery',
                component: () =>
                    import ('@/views/task/delivery.vue')
            }]
        }, {
            path: '/checkManage',
            icon: require('../assets/images/home/manage.png'),
            icon_on: require('../assets/images/home/manage_on.png'),
            meta: {
                title: '审号管理'
            },
            name: 'checkManage_hide',
            component: Main,
            children: [{
                path: 'checkDetail',
                meta: {
                    title: '审号管理'
                },
                name: 'checkDetail',
                component: () =>
                    import ('@/views/active/CheckDetail.vue')
            }]
        },
        {
            path: '/fundManage',
            icon: '',
            meta: {
                title: '资金管理'
            },
            name: 'fundManage_hide',
            component: Main,
            children: [{
                path: 'addBankCard',
                meta: {
                    title: '添加银行卡'
                },
                name: 'addBankCard',
                component: () =>
                    import ('@/views/fund/addBankCard.vue')
            }]
        },
        {
            path: '/user',
            icon: '',
            meta: {
                title: '账号信息'
            },
            name: 'user_hide',
            component: Main,
            children: [{
                    path: 'editPass',
                    meta: {
                        title: '修改登录密码'
                    },
                    name: 'editPass',
                    component: () =>
                        import ('@/views/user/editPass.vue')
                },
                {
                    path: 'editPaypass',
                    meta: {
                        title: '修改支付密码'
                    },
                    name: 'editPaypass',
                    component: () =>
                        import ('@/views/user/editPaypass.vue')
                },
                {
                    path: 'forget',
                    meta: {
                        title: '忘记支付密码'
                    },
                    name: 'forget',
                    component: () =>
                        import ('@/views/user/forget.vue')
                },
                {
                    path: 'remember',
                    meta: {
                        title: '修改支付密码'
                    },
                    name: 'remember',
                    component: () =>
                        import ('@/views/user/remember.vue')
                },
                {
                    path: 'addStore',
                    meta: {
                        title: '添加店铺'
                    },
                    name: 'addStore',
                    component: () =>
                        import ('@/views/user/addStore.vue')
                },
                {
                    path: 'editStore',
                    meta: {
                        title: '修改店铺'
                    },
                    name: 'editStore',
                    component: () =>
                        import ('@/views/user/editStore.vue')
                }
            ]
        },
    ]
    // 所有上面定义的路由都要写在下面的routers里
export const routers = [
    ...loginRouter,
    ...menuRouter,
    ...topRouter,
    ...hideRouter,
    ...errorRouter
]