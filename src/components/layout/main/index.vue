<template>
	<a-layout class="app-main">
		<a-layout-sider :trigger="null" collapsible v-model="collapsed" class="cmh_hidden_sider" collapsedWidth="45">
			<div class="txt-ct ptb-15" v-if="!collapsed">
				<span class="menu_logo">鲸鱼</span>
				<!-- <img src="../../../assets/images/login/logo.png" class="menu_logo" /> -->
			</div>
			<sideMenu :menu-list="menuList" @on-click="handleClickMenu" />
		</a-layout-sider>
		<a-layout>
			<!-- 隐藏小屏导航 -->
			<a-layout-header>
				<a-drawer placement="left" :closable="false" :visible="isDrawer" @close="onCloseDrawer" class="cmh_nav_drawer">
					<template #title>
						<img src="../../../assets/images/login/logo.png" class="menu_logo" />
					</template>
					<sideMenu :menu-list="menuList" @on-click="handleClickMenu" />
				</a-drawer>
				<commonHeader>
					<a-icon
						class="icon_hidden_md mlr-15"
						slot="collapsed"
						:type="collapsed ? 'menu-fold' : 'menu-unfold'"
						@click="handleCollapsed"
					/>
					<a-icon class="icon_visible_md size-18 mlr-15" slot="hamburger" type="menu" @click="isDrawer = true" />
				</commonHeader>
			</a-layout-header>
			<a-layout class="main-content-con">
				<a-layout-content id="contentWrapper" class="content-wrapper">
					<transition name="fade-transform" mode="out-in">
						<!-- <keep-alive :include="cachePage"> -->
						<router-view v-if="isMainAlive" />
						<!-- </keep-alive> -->
					</transition>
				</a-layout-content>
			</a-layout>
		</a-layout>

		<div class="main-contact">
			<div class="open-im" v-if="!isContact" @click="isContact = !isContact"></div>
			<div class="qq-wrap" v-if="isContact">
				<a-icon type="close-circle" class="close" @click="isContact = !isContact"></a-icon>
				<a
					target="_blank"
					:href="'http://wpa.qq.com/msgrd?v=3&uin=' + server_info.customer_service_qq + '&site=qq&menu=yes'"
					class="qq-hover"
				>
					<img
						src="../../../assets/images/user/qq_logo.png"
						class="img-qq qq"
						title="点击这里给我发消息"
						alt="点击这里给我发消息"
					/>
				</a>
				<div class="c-primary size-13 mtb-10 pb-10 line-b pointer">QQ在线咨询</div>
				<vue-qrcode :value="server_info.customer_service_wechat"></vue-qrcode>
				<div class="size-12 mt-10 pointer">微信扫一扫</div>
			</div>
		</div>
		<ExchangeModal :visible="exModalVisible" @toggle="toggleModal"></ExchangeModal>
	</a-layout>
</template>

<script>
import commonHeader from './components/commonHeader'
import sideMenu from './components/sideMenu'
import TagsNav from './components/tagsNav'
import VueQrcode from 'vue-qrcode'

import { menuRouter } from '@/router/router'
import ExchangeModal from '../../business/ExchangeModal'
import * as api from '@/api/api'
export default {
	name: 'appMain',
	components: {
		commonHeader,
		sideMenu,
		TagsNav,
		ExchangeModal,
		VueQrcode,
	},
	provide() {
		return {
			mainReload: this.mainReload,
		}
	},
	data() {
		return {
			allMenu: true,
			isMainAlive: true,
			isDrawer: false, //抽屉导航
			isContact: false,
			server_info: '',
		}
	},
	computed: {
		collapsed() {
			return this.$store.state.app.collapsed
		},
		cachePage() {
			return this.$store.state.app.cachePage
		},
		tagNavList() {
			return this.$store.state.app.tagNavList
		},
		menuList() {
			return this.$store.state.app.menuList
		},
		fnsList() {
			return this.$store.state.app.fnsList
		},
		exModalVisible() {
			return this.$store.state.user.exModalVisible
		},
		userInfo() {
			return this.$store.state.user.userInfo
		},
		updateBalance() {
			return this.$store.state.user.updateBalance
		},
	},
	watch: {
		$route(to) {
			this.addTag(to)
			this.$store.commit('setTagNavList', this.util.getNewTagList(this.tagNavList, to))
		},
		updateBalance(value) {
			console.log('更新balance', value)
			this.getUserBalance()
		},
	},
	mounted() {
		console.log(this.exModalVisible)
		// 如果当前打开页面不在标签栏中
		if (!this.tagNavList.find((item) => item.name === this.$route.name)) {
			this.addTag(this.$route)
		}
		//根据实际情况生成导航数据
		this.$store.commit('setMenulist', menuRouter)

		// 设置皮肤
		this.setSkinTheme()
		this.getUserBalance()
		this.customerService()
	},
	methods: {
		customerService() {
			api.customerService().then((res) => {
				if (res.success) {
					this.server_info = res.data
				}
			})
		},
		getUserBalance() {
			api.getUserBalance().then((res) => {
				if (res.success) {
					// this.userBalance = res.data
					this.$store.commit('setUserBalance', res.data)
				}
			})
		},
		toggleModal() {
			this.$store.commit('showExchange', !this.exModalVisible)
		},
		onCollapse(collapsed, type) {
			console.log(collapsed, type)
			// this.$store.commit("setCollapsed",!this.collapsed)
		},
		onBreakpoint(broken) {
			console.log(broken)
			this.$store.commit('setCollapsed', !this.collapsed)
		},
		// 抽屉导航toggle
		onCloseDrawer() {
			this.isDrawer = false
		},
		// 设置皮肤主题
		setSkinTheme(item) {
			this.$nextTick(() => {
				if (!item || _.isEmpty(item)) item = this.appConfig.skinTheme
				if (item.class == 'skin-blue') return
				this.util.themeColor.changeColor(item.color)
				this.$store.commit('setSkinTheme', item)
			})
		},
		//局部刷新
		mainReload() {
			this.isMainAlive = false
			this.util.delCachePage(this.$route.name)
			this.$nextTick(() => {
				this.isMainAlive = true
				this.$store.commit('addCachePage', this.$route.name)
			})
		},
		handleCollapsed() {
			this.$store.commit('setCollapsed', !this.collapsed)
		},
		addTag(item) {
			const { name, query, params, meta } = item
			this.$store.commit('addTag', {
				route: { name, query, params, meta },
				type: 'push',
			})
		},
		handleClickMenu({ item, key, keyPath }) {
			this.isDrawer = false
			//是否跳转新页面
			if (key.indexOf('isTurnByHref_') > -1) {
				window.open(key.split('_')[1])
				return
			}
			this.$router.replace({
				name: key,
			})
		},
	},
}
</script>
<style lang="less" scoped>
@import './main.less';

.main-contact {
	position: fixed;
	right: 0;
	top: 80px;
	z-index: 1000;
	height: 272px;
}
.menu_logo {
	width: 100px;
	display: inline-block;
	font-size: 32px;
	font-weight: bold;
}
.main-contact {
	.open-im {
		cursor: pointer;
		width: 40px;
		height: 133px;
		background: url('../../../assets/images/user/open_im.png') no-repeat 0 0;
	}
	.qq-wrap {
		width: 109px;
		border: 1px solid #ccc;
		border-radius: 8px;
		text-align: center;
		background: #fff;
		padding: 10px;
		position: relative;
		.qq-hover {
			width: 70px;
			height: 70px;
			overflow: hidden;
			display: inline-block;
			z-index: 9;
			border: 2px solid #fff;
			border-radius: 50%;
			box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
		}
		.close {
			position: absolute;
			top: -10px;
			right: 5px;
			font-size: 24px;
			color: #ccc;
			background: #fff;
		}
		.img-qq {
			width: 60px;
			height: 60px;
		}
		.img-qq.qq {
			max-width: 60px;

			transition: all 0.5s;
			&:hover {
				transform: scale(1.2);
			}
		}
	}
}
</style>
