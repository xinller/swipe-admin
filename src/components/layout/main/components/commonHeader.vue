<template>
    <div class="com_nav">
        <div class="com_collapsed">
            <slot name="collapsed"></slot>
        </div>
        <div class="com_menu">
            <a-menu class="cmh_lf_menu" theme="light" mode="horizontal" @click="menuClick" :selectedKeys="[$route.name]">
                <a-menu-item key="storeCenter">商家中心</a-menu-item>
                <a-menu-item key="invite">邀请赚米</a-menu-item>
                <a-menu-item key="notice">公告中心</a-menu-item>
                <a-menu-item key="fundDetail">资费说明</a-menu-item>
                <a-menu-item key="video">视频教程</a-menu-item>
                <a-menu-item key="blackCat">黑猫实验室</a-menu-item>

                <a-menu-item key="dailyCoin" class="mnrt_show">
                    <div class="flexali">
                        <span class="span-item">每日领鲸币</span>
                    </div>
                </a-menu-item>
                <a-menu-item key="8" class="mnrt_show" @titleClick="titleClick">
                    <div class="cmh_user">
                        <a-dropdown placement="bottomRight">
                            <a class="ant-dropdown-link menu_a" @click="(e) => e.preventDefault()">
                                <span>{{ username }}</span> <a-icon type="down" />
                            </a>
                            <template slot="overlay">
                                <div class="ensure_overlay">
                                    <div class="time">
                                        {{ userDetail.level > 0 ? '消保' : '非消保' }} , 剩余{{
                                            userDetail.level_time | format_time
                                        }}天
                                    </div>
                                    <div class="asset">
                                        <span>货款 {{ userBalance2 }}</span>
                                        <span class="ml-50">鲸币 {{ userBalance1 }}</span>
                                    </div>
                                    <div class="action">
                                        <span class="left">
                                            <router-link to="/fundManage/index">充值</router-link>
                                            <span class="plr-15">|</span>
                                            <span class="c-primary pointer" @click="toExchange">兑换</span>
                                        </span>
                                        <span class="btn pointer" @click="moveTo('dailyCoin')">缴纳保证金</span>
                                    </div>
                                </div>
                            </template>
                        </a-dropdown>
                    </div>
                </a-menu-item>
                <a-menu-item key="9" class="mnrt_show pl-0">
                    <div class="cmh_loginout" @click="on_logout">
                        <a-tooltip placement="bottomRight">
                            <template slot="title">退出登录</template>
                            <span class="span-item">
                                退出登录
                            </span>
                        </a-tooltip>
                    </div>
                </a-menu-item>
            </a-menu>
            <!-- 右侧导航 -->
            <div class="cmh_fns">
                <div class="flexali" @click="moveTo('dailyCoin')">
                    <img src="../../../../assets/images/home/icon_money.png" class="fns_icon" />
                    <span class="span-item c-primary">每日领鲸币</span>
                </div>
                <div class="cmh_user">
                    <a-dropdown placement="bottomRight">
                        <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
                            <img src="../../../../assets/images/home/ensure.png" class="fns_icon" />
                            <span class="c-primary">{{ username }}</span> <a-icon type="down" />
                        </a>
                        <template slot="overlay">
                            <div class="ensure_overlay">
                                <div class="time">
                                    {{ userDetail.level > 0 ? '消保' : '非消保' }} , 剩余{{
                                        userDetail.level_time | format_time
                                    }}天
                                </div>
                                <div class="asset">
                                    <span>货款 {{ userBalance2 }}</span>
                                    <span class="ml-50">鲸币 {{ userBalance1 }}</span>
                                </div>
                                <div class="action">
                                    <span class="left">
                                        <router-link to="/fundManage/index">充值</router-link> <span class="plr-15">|</span>
                                        <span class="c-primary pointer" @click="toExchange">兑换</span>
                                    </span>
                                    <span class="btn pointer" @click="moveTo('dailyCoin')">缴纳保证金</span>
                                </div>
                            </div>
                        </template>
                    </a-dropdown>
                </div>
                <div class="cmh_loginout" @click="on_logout">
                    <a-tooltip placement="bottomRight">
                        <template slot="title">退出登录</template>
                        <span class="span-item">
                            退出登录
                        </span>
                    </a-tooltip>
                </div>
            </div>
        </div>
        <div class="com_collapsed">
            <slot name="hamburger"></slot>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import * as api from '@/api/api'
export default {
    name: 'commonHeader',
    props: {},
    components: {},
    computed: {
        logo() {
            return require(`@/assets/images/logo.png`)
        },
        username() {
            return this.$store.state.user.userInfo ? this.$store.state.user.userInfo.username : ''
        },
        ...mapGetters(['userBalance1', 'userBalance2']),
    },
    watch: {},
    data() {
        return {
            userDetail: '',
        }
    },
    mounted() {
        this.getUserDetail()
    },
    filters: {
        format_time(time) {
            if (!time) return 0
            return Math.floor(moment(time).diff(moment(), 'days', true))
        },
    },
    methods: {
        getUserDetail() {
            api.getUserDetail().then((res) => {
                if (res.success) {
                    this.userDetail = res.data
                }
            })
        },
        menuClick({ key }) {
            if (key == 8) {
                return
            } else {
                this.$router.replace({ name: key })
            }
        },
        titleClick(key) {
            console.log(key)
        },
        moveTo(key) {
            this.$router.replace({ name: key })
        },
        toExchange() {
            this.$store.commit('showExchange', true)
        },
        on_logout() {
            this.$store.commit('setToken', '')
            this.$router.replace({ name: 'login' })
        },
    },
}
</script>

<style lang="less" scoped>
.flexBox(@type) {
    display: flex;
    flex-direction: @type;
    flex-wrap: wrap;
}
.flexali {
    display: flex !important;
    align-items: center;
}
.flex_bt {
    display: flex;
    align-items: center;
    justify-content: span;
}
.com_nav {
    width: 100%;
    height: 48px;
    border-bottom: 1px solid #e8e8e8;
    .flexBox(row);
    flex-wrap: nowrap;
    .com_collapsed {
        height: 48px;
        line-height: 48px;
        // margin-right: 10px;
        // margin-left: 10px;
        i {
            font-size: 20px;
        }
    }
    .com_menu {
        flex: 1;
        .flexBox(row);
        flex-wrap: nowrap;
        overflow-x: auto;
        .cmh_lf_menu {
            flex: 1;
        }
        .ant-menu {
            background-color: transparent;
        }
        .ant-menu-horizontal {
            line-height: 42px;
            border-bottom: 0;
        }
        .cmh_fns {
            height: 44px;
            display: flex;
            align-items: center;
            flex-wrap: nowrap;
            align-items: center;
            width: 330px;
            overflow-x: auto;
            > div {
                padding: 0 10px;
                display: inline-block;
                white-space: nowrap;
                vertical-align: middle;
                .span-item {
                    display: block;
                    height: 44px;
                    line-height: 44px;
                    text-align: center;
                    cursor: pointer;
                    i {
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        line-height: 44px;
                        height: 44px;
                        color: #fff;
                    }
                    &:hover {
                        background-color: rgba(0, 0, 0, 0.05);
                    }
                }
            }
            .cmh_user {
                border-left: 1px solid #f1f1f1;
            }
        }
        a.menu_a {
            color: inherit;
        }
        .fns_icon {
            width: 18px;
            height: 18px;
        }

        .mnrt_show {
            display: none;
        }
        @media screen and (max-width: 992px) {
            .cmh_fns {
                display: none;
            }
            .mnrt_show {
                display: inline-block;
            }
        }
        .ant-menu-horizontal > .ant-menu-item-selected,
        .ant-menu-horizontal > .ant-menu-item-active,
        .ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item:hover {
            border-bottom-color: transparent;
        }
    }
}
.ensure_overlay {
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);
    .time {
        font-size: 13px;
        color: #909399;
    }
    .asset {
        .flexali;
        font-size: 15px;
        margin-top: 15px;
        color: #333;
    }
    .action {
        margin-top: 10px;
        border-top: 1px solid #f1f1f1;
        padding-top: 35px;
        padding-bottom: 10px;
        font-size: 14px;
        color: #909399;
        .flex_bt;
    }
    .btn {
        background: #2a7cff;
        color: #fff;
        font-size: 13px;
        border-radius: 20px;
        padding: 4px 15px;
        margin-left: 90px;
    }
}
@media screen and (max-width: 768px) {
    .ensure_overlay {
        padding: 10px;
        .btn {
            margin-left: 60px;
        }
    }
}
</style>
