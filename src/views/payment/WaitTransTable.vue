<template>
	<a-spin :spinning="spinning" class="activeListTable-container payment-table">
		<div class="table-box mt-20">
			<a-row class="row-hd">
				<a-col :xs="6">目标商品信息</a-col>
				<a-col :xs="6">订单信息</a-col>
				<a-col :xs="2">转账金额</a-col>
				<a-col :xs="4">收款方银行信息</a-col>
				<a-col :xs="2">转账状态</a-col>
				<a-col :xs="4">操作</a-col>
			</a-row>
			<a-empty class="ptb-10" v-if="dataList.length == 0" />
			<a-row class="row-tr" v-for="(item, index) in dataList" :key="index">
				<a-col class="middle">
					<a-row type="flex" align="middle">
						<a-col class="col-td flexct" :xs="6">
							<img :src="item.goods_image" class="thumb" />
							<div class="ml-15">
								<div>
									<img src="../../assets/images/task/taobao.png" class="tb-icon" />
									<span>{{ item.store_name }}</span>
								</div>
								<div class="size-12 c-gray mt-5">任务编号:{{ item.order_code }}</div>
							</div>
						</a-col>
						<a-col class="col-td" :xs="6">
							<div class="ac-type">接单旺旺: {{ item.taobao_nickname }} <a-icon type="copy" /></div>
							<div class="ac-type">淘宝订单号:{{ item.taobao_ordersn }} <a-icon type="copy" /></div>
						</a-col>
						<a-col class="col-td" :xs="2">{{ item.pay_amount }}</a-col>
						<a-col class="col-td" :xs="4">
							<div>{{ item.bank_name }} {{ item.bank_hold }} {{ item.bank_open }}</div>
							<div>{{ item.bank_numer }}</div>
						</a-col>
						<a-col class="col-td" :xs="2"
							><span class="c-red">{{ format_status(item.status, item.is_trans) }}</span></a-col
						>
						<a-col class="col-td" :xs="4">
							<a-button
								:disabled="item.is_trans != 0"
								type="primary"
								size="small"
								class="size-12 pointer"
								@click="showRefundModal(item)"
								>{{ item.is_trans == 0 ? '返款' : '已返款' }}</a-button
							>

							<!-- <div class="mt-5 ">转账超时,请尽快返款</div> -->
						</a-col>
					</a-row>
				</a-col>
			</a-row>
			<a-pagination
				class="txt-rt"
				v-model="pagination.current"
				:pageSize="pagination.pageSize"
				:pageSizeOptions="pagination.pageSizeOptions"
				show-size-changer
				show-quick-jumper
				:total="pagination.total"
				:show-total="(total) => `共 ${pagination.total} 条`"
				@change="changePageSize"
				@showSizeChange="changeSize"
			/>
		</div>
		<a-modal v-model="visible" class="refund-modal" :footer="null" title="返款" :width="600">
			<div class="flex-bt">
				<span class="size-14">返款方式</span>
				<span class="size-14 c-primary pointer" @click="editUserInfo">设为默认返款方式</span>
			</div>
			<div class="back-type">
				<div :class="['back-type-item', { active: back_type == 1 }, { default: default_paytype == 1 }]" @click="chooseType(1)">
					<i>默认</i>
					<img src="../../assets/images/user/wechat.png" class="back-icon" />
					<span>微信支付</span>
				</div>
				<div :class="['back-type-item', { active: back_type == 0 }, { default: default_paytype == 0 }]" @click="chooseType(0)">
					<i>默认</i>
					<img src="../../assets/images/user/bank.png" class="back-icon" />
					<span>银行卡转账</span>
				</div>
			</div>
			<div class="back-box">
				<!-- 微信支付 -->
				<div class="back-left" v-if="back_type == 1">
					<div class="size-14">
						收款信息
						<a-popconfirm placement="bottomLeft" ok-text="确定" cancel-text="取消" @confirm="confirmPost">
							<template slot="title">
								<p>确认上报吗?</p>
							</template>
							<span class="c-primary">点击上报该收款码异常</span>
						</a-popconfirm>
					</div>
					<img :src="BASE_URL + now_userInfo.wx_address" class="back-qrcode" />
				</div>
				<!-- 银行卡支付 -->
				<div class="back-left" v-if="back_type == 0">
					<div class="size-13 mt-5">收款信息</div>
					<div class="card-bank">
						<div class="card-con">
							<div class="flex-bt">
								<span class="bname">{{ now_userInfo.bank_name }}</span>
								<span class="size-13">{{ now_userInfo.bank_hold }}</span>
							</div>
							<div class="size-16 mb-20">{{ now_userInfo.bank_number }}</div>
						</div>
						<div
							class="card-ft"
							v-clipboard:copy="now_userInfo.bank_number"
							v-clipboard:success="onCopy"
							v-clipboard:error="onError"
						>
							复制卡号
						</div>
					</div>
					<div class="size-12">使用手机转账时可使用扫描方式,快速读取银行卡号</div>
				</div>
				<div class="back-right">
					<div class="size-14 mb-10">应返货款</div>
					<div class="back-amount">{{ now_userInfo.pay_amount }}</div>
					<a-input-search type="number" placeholder="0.00" @change="changeAmount" v-model="to_amount">
						<a-button slot="enterButton">
							元
						</a-button>
					</a-input-search>
					<div class="size-14 c-gray mt-5">请输入实际转账金额</div>
					<div class="size-14 c-gray mt-5">转账成功后请点击下方按钮确认返款</div>
					<a-button :disabled="onDiasbed" shape="round" type="primary" block class="mt-15" @click="toTrans(1)">确认返款</a-button>
					<div class="size-12 c-red mt-5">若因虚假返款,导致买家退款投诉等情况发生,平台概不负责.</div>
				</div>
			</div>
			<div class="back-footer">
				若买家银行卡信息有误，请点击
				<span class="c-red pointer" @click="toTrans(4)">返款失败 <a-icon type="exclamation-circle"/></span>
			</div>
		</a-modal>
	</a-spin>
</template>

<script>
import * as api from '@/api/api'
export default {
	name: 'waitTransTable',
	props: {
		param: {
			type: Object,
		},
		isLoading: {
			type: Boolean,
		},
	},
	watch: {
		isLoading(newVal) {
			this.loading = newVal
			this.page = 1
			this.getTableList()
		},
		param(nval) {
			this.form = nval
		},
	},
	data() {
		return {
			visible: false,
			onDiasbed: true,
			loading: this.isLoading,
			form: this.param,
			dataList: [],
			pagination: {
				pageSize: 10, //每页条数
				pageSizeOptions: ['10', '20', '30', '40'],
				current: 1,
				showSizeChanger: true,
				showQuickJumper: true,
				total: 0,
			},
			total: 0,
			spinning: false,
			now_userInfo: {},
			back_type: 0, //0-银行卡  1-微信
			default_paytype: 0, //默认返款方式
			to_amount: '',
		}
	},

	computed: {
		pager() {
			if (this.pagination === false) return false
			let option = {
				current: 1,
				pageSize: 10,
			}
			return _.merge({}, option, this.pagination)
		},
	},
	created() {
		this.getUserDetail()
	},
	mounted() {
		this.getTableList()
	},
	methods: {
		getUserDetail() {
			api.getUserDetail().then((res) => {
				if (res.success) {
					this.default_paytype = res.data.default_paytype
				}
			})
		},
		editUserInfo() {
			api.editUserInfo({ type: 'default_paytype', val: this.back_type }).then((res) => {
				if (res.success) {
					this.getUserDetail()
				}
			})
		},
		chooseType(type) {
			this.back_type = type
		},
		// is_trans 0-待转账 1-已转账 2转失败
		//  status 0-未转账 1-返款 2-未到账反馈 3-买家已返款 4-客服退款
		format_status(status, is_trans) {
			if (status == 0 && is_trans == 0) {
				return '等待转账'
			} else if (status == 0 && is_trans == 1) {
				return '等待买家确认'
			} else if (status == 0 && is_trans == 2) {
				return '转账失败'
			} else if (status == 0) {
				return '未转账反馈'
			} else if (status == 1 && is_trans == 1) {
				return '转账成功'
			} else if (status == 3) {
				return '等待买家确认'
			} else if (status == 4) {
				return '已退款'
			}
		},
		showRefundModal(item) {
			// 未返
			if (item.is_trans == 0) {
				this.visible = true
				this.now_userInfo = item
			}
		},
		changeAmount() {
			if (this.to_amount > 0) {
				this.onDiasbed = false
			} else {
				this.onDiasbed = true
			}
		},
		// 转账成功
		toTrans(type) {
			this.onDiasbed = true
			if (type == 1) {
				if (!this.to_amount) return this.$message.warning('请输入转账金额')
			}
			api
				.sellerTrans({ id: this.now_userInfo.id, status: type, type: this.back_type, actual_payment: this.to_amount })
				.then((res) => {
					this.onDiasbed = false
					if (res.success) {
						this.$message.success('操作成功')
						this.refreshTable()
						this.visible = false
						this.to_amount = ''
					}
				})
		},
		// 上报错误
		confirmPost() {
			alert(99)
		},
		onCopy: function(e) {
			this.$message.success('复制成功')
		},
		onError: function(e) {
			this.$message.success('复制失败')
		},
		refreshTable() {
			this.pagination.current = 1
			this.pagination.pageSize = 10
			this.getTableList()
		},
		changePageSize(page, pageSize) {
			this.pagination.pageSize = pageSize
			this.pagination.current = page
			this.getTableList()
		},
		changeSize(current, size) {
			this.pagination.pageSize = size
			this.pagination.current = current
			this.getTableList()
		},
		getTableList(isReset) {
			this.spinning = true
			let params = {
				page: this.pager.current,
				rows: this.pager.pageSize,
				...this.form,
			}
			if (isReset) {
				params.page = this.pager.current = 1
			}
			console.log('params', params)
			api.transList(params).then((res) => {
				this.spinning = false
				if (res.success) {
					this.dataList = res.data.list
					this.pagination.total = res.data.total
				}
			})
		},
	},
}
</script>

<style lang="less" scoped></style>
