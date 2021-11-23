import request from './request';
import appConfig from "@/config";
import axios from 'axios'
import qs from 'qs'

/**公共 - 获取图形验证码 */
export async function getCaptcha(data) {
    try {
        const res = await request({
            url: "login/captcha",
            method: "POST",
            data: data
        });
        return res;
    } catch (err) {
        return false;
    }
}

/** 登录 */
export const login = (data) => {
    return request({
        url: "login/index",
        method: "POST",
        data: data
    });
}

/** 注册 */
export const register = (data) => {
    return request({
        url: "login/register",
        method: "POST",
        data: data
    });
}

/**
 * 获取验证码
 * @param {} data 
 * 1-注册 2-修改(找回)登录密码 3-修改支付密码
 * 
 */
export const getVerify = (data) => {
    return request({
        url: 'login/getVerify',
        method: 'POST',
        data: data
    })
}

/**忘记密码 type=2*/
export const forgetLoginPass = (data) => {
    return request({
        url: 'login/forgetLoginPass',
        method: 'POST',
        data: data
    })
}

/**忘记支付密码 type=3*/
export const forgetPayPass = (data) => {
    return request({
        url: 'member/forgetPayPass',
        method: 'POST',
        data: data
    })
}

/**修改密码 
 * type 2-登录密码 3-支付密码	
 */
export const changePass = (data) => {
    return request({
        url: 'member/changePass',
        method: 'POST',
        data: data
    })
}

/**商家中心 - */
export const sellerCenter = (data) => {
    return request({
        url: 'member/sellerCenter',
        method: 'POST',
        data: data
    })
}


/**邀请赚米-奖励规则 */
export const rewardRule = (data) => {
    return request({
        url: 'member/rewardRule',
        method: 'POST',
        data: data
    })
}


// 邀请奖励
export const inviteInfo = (data) => {
    return request({
        url: '/member/inviteInfo',
        method: 'POST',
        data: data
    })
}

// 邀请奖励明细
export const rewardList = (data) => {
    return request({
        url: '/member/rewardList',
        method: 'POST',
        data: data
    })
}

/**账号信息 - 商户详情 */
export const getUserDetail = (data) => {
    return request({
        url: 'member/getUserDetail',
        method: 'POST',
        data: data
    })
}

/**账号信息 - 商户详情 店铺列表 */
export const storeList = (data) => {
    return request({
        url: 'member/storeList',
        method: 'POST',
        data: data
    })
}

/**账号信息 - 商户详情 添加店铺 */
export const addStore = (data) => {
    return request({
        url: 'member/addStore',
        method: 'POST',
        data: data
    })
}

/**账号信息 - 商户详情 修改店铺 */
export const editStore = (data) => {
    return request({
        url: 'member/editStore',
        method: 'POST',
        data: data
    })
}

// 删除店铺
export const delStore = (data) => {
    return request({
        url: '/member/delStore',
        method: 'POST',
        data: data
    })
}

/**账号信息 - 商户详情 店铺详情 */
export const storeDetail = (data) => {
    return request({
        url: 'member/storeDetail',
        method: 'POST',
        data: data
    })
}

/**账号信息 - 商户详情 修改用户信息 
 * type 类型 QQ号-qq_number 紧急联系人-emergency_contact	
 */
export const editUserInfo = (data) => {
    return request({
        url: 'member/editUserInfo',
        method: 'POST',
        data: data
    })
}

/**账号信息 - 商户详情 设置关联 	
 */
export const releateSet = (data) => {
    return request({
        url: 'member/releateSet',
        method: 'POST',
        data: data
    })
}

/**账号信息 - 商户详情 设置间隔 	
 */
export const setStoreIntervals = (data) => {
    return request({
        url: 'member/setStoreIntervals',
        method: 'POST',
        data: data
    })
}

/**账号信息 - 商户详情 设置店铺启用
 	
 */
export const setStoreOpen = (data) => {
    return request({
        url: 'member/setStoreOpen',
        method: 'POST',
        data: data
    })
}

/**查看账单 
 */
export const tradingRecord = (data) => {
    return request({
        url: 'member/tradingRecord',
        method: 'POST',
        data: data
    })
}

/**查看账单  - 交易类型
 */
export const tradingRecordType = (data) => {
    return request({
        url: 'member/tradingRecordType',
        method: 'POST',
        data: data
    })
}

/**黑名单列表 */
export const balckList = (data) => {
    return request({
        url: 'member/balckList',
        method: 'POST',
        data: data
    })
}

/**黑名单列表  - 添加*/
export const addBalckList = (data) => {
    return request({
        url: 'member/addBalckList',
        method: 'POST',
        data: data
    })
}

/**黑名单列表  - 删除*/
export const delBalckList = (data) => {
    return request({
        url: 'member/delBalckList',
        method: 'POST',
        data: data
    })
}

/**黑名单列表  - 批量删除*/
export const batchDeletionBalckList = (data) => {
    return request({
        url: 'member/batchDeletionBalckList',
        method: 'POST',
        data: data
    })
}


/**资费说明 */
export const tariffDescription = (data) => {
    return request({
        url: 'member/tariffDescription',
        method: 'POST',
        data: data
    })
}

/**获取商户余额 */
export const getUserBalance = (data) => {
    return request({
        url: 'member/getUserBalance',
        method: 'POST',
        data: data
    })
}

/**获取商户余额 */
export const getSysBank = (data) => {
    return request({
        url: 'member/getSysBank',
        method: 'POST',
        data: data
    })
}

/**获取商户余额 银行列表 */
export const getBank = (data) => {
    return request({
        url: 'member/getBank',
        method: 'POST',
        data: data
    })
}

/**获取商户余额 充值 */
export const rechargeBank = (data) => {
    return request({
        url: 'member/rechargeBank',
        method: 'POST',
        data: data
    })
}

/**获取商户余额 获取我的银行卡 */
export const getBankInfo = (data) => {
    return request({
        url: 'member/getBankInfo',
        method: 'POST',
        data: data
    })
}

/**获取商户余额 添加卡 */
export const addBank = (data) => {
    return request({
        url: 'member/addBank',
        method: 'POST',
        data: data
    })
}

/**获取商户余额 添加卡 */
export const editBankInfo = (data) => {
    return request({
        url: 'member/editBankInfo',
        method: 'POST',
        data: data
    })
}

/**获取商户余额 提现 */
export const doWithout = (data) => {
    return request({
        url: 'Withdrawal/doWithout',
        method: 'POST',
        data: data
    })
}

/**获取商户余额 提现手续费 */
export const getWithRate = (data) => {
    return request({
        url: 'Withdrawal/getWithRate',
        method: 'POST',
        data: data
    })
}

/**获取商户余额 充值金额列表 */
export const exchangeConfig = (data) => {
    return request({
        url: 'member/exchangeConfig',
        method: 'POST',
        data: data
    })
}


/**获取商户余额 充值金额列表 */
export const miExchange = (data) => {
    return request({
        url: 'member/miExchange',
        method: 'POST',
        data: data
    })
}

/** 获取消保权益信息
 */
export const getConsumerInfo = (data) => {
    return request({
        url: 'member/getConsumerInfo',
        method: 'POST',
        data: data
    })
}


/** 开通消保
 */
export const openConsumer = (data) => {
    return request({
        url: 'member/openConsumer',
        method: 'POST',
        data: data
    })
}

/** 公告
 */
export const noticeList = (data) => {
    return request({
        url: 'notice/noticeList',
        method: 'POST',
        data: data
    })
}

/** 公告
 */
export const noticeDetail = (data) => {
    return request({
        url: 'notice/noticeDetail',
        method: 'POST',
        data: data
    })
}

/** 视频分类
 */
export const videoCategorys = (data) => {
    return request({
        url: 'news/videoCategorys',
        method: 'POST',
        data: data
    })
}

/** 视频分类
 */
export const videoNewsList = (data) => {
    return request({
        url: 'news/videoNewsList',
        method: 'POST',
        data: data
    })
}

/** 视频分类
 */
export const videoNewsDetails = (data) => {
    return request({
        url: 'news/videoNewsDetails',
        method: 'POST',
        data: data
    })
}

/** 黑猫视频分类
 */
export const categorys = (data) => {
    return request({
        url: 'news/categorys',
        method: 'POST',
        data: data
    })
}

/** 黑猫视频list
 */
export const newsList = (data) => {
    return request({
        url: 'news/newsList',
        method: 'POST',
        data: data
    })
}

/** 黑猫视频detail
 */
export const newsDetails = (data) => {
    return request({
        url: 'news/newsDetails',
        method: 'POST',
        data: data
    })
}

// 发布任务 - 可用店铺列表
export const getStoreList = (data) => {
    return request({
        url: 'Sender/storeList',
        method: 'POST',
        data: data
    })
}

// 发布任务 - 第一步 验证商品是否正确
export const postTaskStep1 = (data) => {
    return request({
        url: 'Sender/postTaskStep1',
        method: 'POST',
        data: data
    })
}

// 发布任务 - 第2步 获取配置信息
export const goodsSearchConfig = (data) => {
    return request({
        url: 'Sender/goodsSearchConfig',
        method: 'POST',
        data: data
    })
}

// 发布任务 - 第4步 获取配置信息
export const valueAddedServices = (data) => {
    return request({
        url: 'Sender/valueAddedServices',
        method: 'POST',
        data: data
    })
}

// 发布任务 - 第4步 提交
export const publicOrder = (data) => {
    return request({
        url: 'Sender/publicOrder',
        method: 'POST',
        data: data
    })
}


// 发布任务 - 第5步 支付页详情
export const grabDetail = (data) => {
    return request({
        url: 'Sender/grabDetail',
        method: 'POST',
        data: data
    })
}

// 发布任务 - 第5步 订单支付
export const postTaskStep4 = (data) => {
    return request({
        url: 'Sender/postTaskStep4',
        method: 'POST',
        data: data
    })
}


// 发布任务 - 传图片
export const image_upload = (data) => {
    return request({
        url: 'Syspara/image_upload',
        method: 'POST',
        data: data
    })
}

// 活动管理 活动列表
export const orderList = (data) => {
    return request({
        url: 'Sender/orderList',
        method: 'POST',
        data: data
    })
}

// 活动管理 活动列表 删除活动 未支付可操作
export const delGrab = (data) => {
    return request({
        url: 'Sender/delGrab',
        method: 'POST',
        data: data
    })
}

// 活动管理 - 取消活动
export const cancleGrab = (data) => {
    return request({
        url: 'Sender/cancleGrab',
        method: 'POST',
        data: data
    })
}

// 模版生成活动
export const copyModel = (data) => {
    return request({
        url: 'Sender/copyModel',
        method: 'POST',
        data: data
    })
}

// 任务管理 -任务列表
export const missionList = (data) => {
    return request({
        url: 'Sender/missionList',
        method: 'POST',
        data: data
    })
}

// 任务管理 -任务发布
export const toPublic = (data) => {
    return request({
        url: 'Sender/toPublic',
        method: 'POST',
        data: data
    })
}


// 任务列表- 批量发布
export const batchPublic = (data) => {
    return request({
        url: 'Sender/batchPublic',
        method: 'POST',
        data: data
    })
}

// 任务管理 -详情
export const orderDetail = (data) => {
    return request({
        url: 'Sender/orderDetail',
        method: 'POST',
        data: data
    })
}

// 任务管理 -商家关闭任务
export const closeMission = (data) => {
    return request({
        url: 'Sender/closeMission',
        method: 'POST',
        data: data
    })
}

// 任务管理 -商家关闭任务
export const batchCloseMission = (data) => {
    return request({
        url: 'Sender/batchCloseMission',
        method: 'POST',
        data: data
    })
}

// 任务管理 -商家删除任务 关闭的单子可
export const deleteMission = (data) => {
    return request({
        url: 'Sender/deleteMission',
        method: 'POST',
        data: data
    })
}

// 任务管理 -商家待发货 确认无误
export const orderConfirmed = (data) => {
    return request({
        url: 'Sender/orderConfirmed',
        method: 'POST',
        data: data
    })
}

//任务列表 - 发货
export const sendOrder = (data) => {
    return request({
        url: 'Sender/sendOrder',
        method: 'POST',
        data: data
    })
}

//任务列表 - 补差价
export const makeUpDifference = (data) => {
    return request({
        url: 'Sender/makeUpDifference',
        method: 'POST',
        data: data
    })
}

//任务列表 - 贷款返款
export const refundAmount = (data) => {
    return request({
        url: 'Sender/refundAmount',
        method: 'POST',
        data: data
    })
}

//任务列表 - 赏金返款
export const refundBounty = (data) => {
    return request({
        url: 'Sender/refundBounty',
        method: 'POST',
        data: data
    })
}

//任务列表 - 追平赏金返款
export const addEveRefund = (data) => {
    return request({
        url: 'Sender/addEveRefund',
        method: 'POST',
        data: data
    })
}


//任务列表 - 评价赏金返款
export const normalEveRefund = (data) => {
    return request({
        url: 'Sender/normalEveRefund',
        method: 'POST',
        data: data
    })
}

// 任务管理 -复制活动
export const copyGrab = (data) => {
    return request({
        url: 'Sender/copyGrab',
        method: 'POST',
        data: data
    })
}

// 任务管理 -复制编辑活动
export const editOrder = (data) => {
    return request({
        url: 'Sender/editOrder',
        method: 'POST',
        data: data
    })
}

// 任务管理 -模版列表
export const modelList = (data) => {
    return request({
        url: 'Sender/modelList',
        method: 'POST',
        data: data
    })
}

// 任务管理 -创建模版
export const createModel = (data) => {
    return request({
        url: 'Sender/createModel',
        method: 'POST',
        data: data
    })
}

// 任务管理 -删除模版
export const deleteModel = (data) => {
    return request({
        url: 'Sender/deleteModel',
        method: 'POST',
        data: data
    })
}

// 任务管理 -批量删除模版
export const batchDeleteModel = (data) => {
    return request({
        url: 'Sender/batchDeleteModel',
        method: 'POST',
        data: data
    })
}

// 任务列表- 标记
export const markOrder = (data) => {
    return request({
        url: 'Sender/markOrder',
        method: 'POST',
        data: data
    })
}

// 任务列表- 批量标记
export const batchMarkOrder = (data) => {
    return request({
        url: 'Sender/batchMarkOrder',
        method: 'POST',
        data: data
    })
}

// 审号管理 - 列表
export const examineList = (data) => {
    return request({
        url: 'Sender/examineList',
        method: 'POST',
        data: data
    })
}

// 审号管理 -详情
export const examineDetail = (data) => {
    return request({
        url: 'Sender/examineDetail',
        method: 'POST',
        data: data
    })
}

// 审号管理 -审核
export const toExamine = (data) => {
    return request({
        url: 'Sender/toExamine',
        method: 'POST',
        data: data
    })
}

//  -发货快递
export const expressList = (data) => {
    return request({
        url: 'Sender/expressList',
        method: 'POST',
        data: data
    })
}

//  商家转账列表 0-未转账 1-返款 2-未到账反馈 3-卖家已退款
export const transList = (data) => {
    return request({
        url: 'Sender/transList',
        method: 'POST',
        data: data
    })
}

// 商家转账列表 转账
export const sellerTrans = (data) => {
    return request({
        url: 'Sender/sellerTrans',
        method: 'POST',
        data: data
    })
}

// 商家转账列表 提交转账凭证
export const refundCertificate = (data) => {
    return request({
        url: 'Sender/refundCertificate',
        method: 'POST',
        data: data
    })
}

// 商家转账列表 导出
export const exportTable = (data) => {
    return request({
        url: 'Sender/export',
        method: 'POST',
        data: data
    })
}

/**表格导出方法
 * {url : 请求接口地址,data:请求参数,filenName:导出文件名称}
 */

export const exportExcel = (data, callback) => {
    console.log('data', data);
    axios({
            method: 'post',
            url: `${data.url}`,
            responseType: 'blob',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: data.data,
        })
        .then((res) => {
            const time = new Date().getTime()
            const link = document.createElement('a')
            let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
            link.style.display = 'none'
            const href = window.URL.createObjectURL(blob)
            link.href = href
            link.download = (data.fileName ? data.fileName + time : time) + '.xls' //下载的文件名
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(href) // 释放掉blob对象
            if (typeof callback === 'function') {
                callback(true)
            }
        })
        .catch((error) => {
            console.log(error)
            if (typeof callback === 'function') {
                callback(false)
            }
            message.error('导出失败')
        })
}


// 商家转账列表 获取已导出未转账数量
export const exportNum = (data) => {
    return request({
        url: 'Sender/exportNum',
        method: 'POST',
        data: data
    })
}

// 商家转账列表 获取已导出未转账数量
export const allTransSuccess = (data) => {
    return request({
        url: 'Sender/allTransSuccess',
        method: 'POST',
        data: data
    })
}

//  黑名单导入
export const blackImport = (params) => {
    return axios({
        method: 'post',
        url: `${appConfig.BASE_URL[process.env.VUE_APP_ENV]}/export/blackImport`,
        headers: {
            'Content-Type': 'multipart/form-data;charset=UTF-8',
        },
        data: params,
    })
}

// 任务列表导出
export const orderExport = (data) => {
    return request({
        url: 'export/orderExport',
        method: 'POST',
        data: data
    })
}


/** 客服
 */
export const customerService = (data) => {
    return request({
        url: '/Syspara/customerService',
        method: 'POST',
        data: data
    })
}