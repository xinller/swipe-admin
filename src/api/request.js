import axios from 'axios'
import qs from "qs";
import Vue from 'vue'
import store from '@/store'
import { router } from '@/router'
import { message } from 'ant-design-vue'
import hex_md5 from './md5'
import appConfig from '@/config';
// 创建一个AXIOS实例 (请求不同服务器地址或超时时长等等可以创建不同的实例)
// const request = axios.create({
// //   timeout: 30000, // 请求超时
//   headers: {
//     'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
//   }, //请求提交方式
// })

const request = (args) => {
    try {
        return axios(args)
    } catch (err) {
        message.error('网络不稳定稍后试试')
    }
}

// 开始设置请求 发起的拦截处理
// config 代表发起请求的参数的实体
axios.interceptors.request.use(
    (config) => {
        // console.log('config', config);
        //设置接口前缀
        config.baseURL = appConfig.BASE_URL[process.env.VUE_APP_ENV];
        let apikey = appConfig.APIKEY
        let timeStamp = Math.round(new Date().getTime() / 1000);
        let sign = hex_md5(timeStamp + apikey).toUpperCase();
        let token = store.state.user.SWIPE_A_TOKEN
        let secret_token = store.state.user.userInfo.secret_token
            //设置提交方式
        if (config.headers['Content-Type'] == 'multipart/form-data;charset=UTF-8') {
            // console.log('data', config.data);
            config.data.append('token', token)
            config.data.append('secret_token', secret_token)
            config.data.append('t', timeStamp)
            config.data.append('sign', sign)
        } else {
            config.headers['Content-Type'] = "application/x-www-form-urlencoded;charset=UTF-8";

            config.data = qs.stringify({
                ...config.data,
                token: token,
                secret_token: secret_token,
                t: timeStamp,
                sign: sign
            })
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 请求到结果的拦截处理
axios.interceptors.response.use(
    (response) => {
        // 返回请求正确的结果
        const { data } = response
        //HTTP状态是200 但服务器判断业务有错误 （200无任务错误）
        if (data.success) {
            return data
        } else {
            if (data.message == 401) {
                // message.error('登录超时,请重新登录')
                store.commit('setToken', '')
                router.push({ name: 'login' })
                return data
            } else {

                return message.error(data.message || '请求失败')
            }
        }
    },
    (error) => {
        console.log('error', error);
        // return error;
        // 错误的请求结果处理，这里的代码根据后台的状态码来决定错误的输出信息
        if (error && error.response) {
            switch (error.response.status) {
                case 400:
                    message.error('错误请求')
                    break
                case 401:
                    message.error('未授权，请重新登录')
                    break
                case 403:
                    message.error('登录超时,请重新登录')
                    store.commit('setToken', '')
                    router.push({ name: 'login' })
                    break
                case 404:
                    message.error('请求错误,未找到该资源')
                    break
                case 405:
                    message.error('请求方法未允许')
                    break
                case 408:
                    message.error('请求超时')
                    break
                case 500:
                    message.error('服务器端出错')
                    break
                case 501:
                    message.error('网络未实现')
                    break
                case 502:
                    message.error('网络错误')
                    break
                case 503:
                    message.error('服务不可用')
                    break
                case 504:
                    message.error('网络超时')
                    break
                case 505:
                    message.error('http版本不支持该请求')
                    break
                default:
                    message.error(`'连接错误'${error.response.status}`)
            }
        } else {
            message.error('连接到服务器失败')
        }

        return Promise.reject(error)
    }
)

export default request