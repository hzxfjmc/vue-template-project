import axios from 'axios'
import LS from '../local-storage.js'
import { API_BASE_URL } from '../DOMAIN.js'
import getHeadInfo from './get-head-info'
import { guid } from './../tools'
import qs from 'qs'
import Vue from 'vue'

let token = {
    Authorization: LS.get('userToken')
}

export const setToken = (userToken = '') => {
    token.Authorization = userToken
}

let langInfo = {
    langType: ''
}

export const setLangType = type => {
    langInfo.langType = type
}

// // rsa 加密解密 // TODO: 待讨论  生产环境前端不应该暴露公钥出去
// const JSEncrypt = require('jsencrypt') // 引入模块
// const URLSafeBase64 = require('urlsafe-base64')
// const jsEncrypt = new JSEncrypt.JSEncrypt() // 实例化加密对象
// const publicKey =
//     'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCajLOdwFMIBQ8k3W48/e4bIj2EFc3O/T54oiLOk+KQgAknvmUHJp/1arN8g9tjAaBKPSbznTe4ZYX3VXI7VTRF7Dhi1+vCkas1OwWkdwzZWg3LOqfUORF3tFmvNOiLLzJQ6H5oLsNNZjMOr2QZrm4srzc1aX3O0BRwQhPkP/XhYwIDAQAB'
// jsEncrypt.setPublicKey(publicKey) // 设置公钥

export default class baseRequest {
    constructor(baseURL) {
        baseURL = baseURL || `${API_BASE_URL.JY}/`
        this.$http = axios.create({
            timeout: 30000,
            baseURL
        })
        this.$http.interceptors.request.use(async config => {
            // 接入层请求头通用信息
            const headerInfo = await getHeadInfo()
            // 修复bug 几乎同时请求是 生产的id 会一致的问题
            headerInfo['X-Time'] = Date.now()
            headerInfo['X-Trans-Id'] = guid()
            headerInfo['X-Request-Id'] = guid()
            // 手动设置语言
            if (langInfo.langType) {
                headerInfo['X-Lang'] = langInfo.langType
            }
            config.headers = {
                ...config.headers,
                ...headerInfo,
                ...token
            }
            // alert(JSON.stringify(token))
            return config
        })
        this.$http.interceptors.response.use(
            ({ data }) => {
                // 图片流
                if (typeof data === 'string') {
                    return data
                }
                if (data.code === 0 || data.code === 301400) {
                    return data.data
                } else if (data.code === 300101) {
                    LS.remove('userToken')
                    // 登录成功后刷新下页面 小概率事件 避免各种复杂情况
                    // jsBridge.callApp('command_user_login').then(() => {
                    //     window.location.reload()
                    // })
                    return Promise.reject({ code: data.code })
                } else {
                    return Promise.reject(data)
                }
            },
            e => {
                console.log(e, '报错了')
                let errorNetwork =
                    Vue.prototype.$t && Vue.prototype.$t('errorNetwork')
                return Promise.reject({
                    msg: errorNetwork || '网络开小差了,请稍后重试'
                })
            }
        )
    }
    // // rsa 加密
    // rsa(str) {
    //     return URLSafeBase64.encode(jsEncrypt.encrypt(str))
    // }
    post(url, params = {}, config = {}) {
        return this.$http.post(url, params, config)
    }
    get(url, params = {}, config = {}) {
        return this.$http.get(url, {
            params,
            ...config
        })
    }
    getForm(url, params = {}) {
        return this.$http({
            params,
            url,
            method: 'get',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {}
        })
    }
    del(url, params = {}) {
        return this.$http.delete(url, params)
    }
    put(url, params = {}, config = {}) {
        return this.$http.put(url, params, config)
    }
    postForm(url, params = {}) {
        return this.$http({
            url,
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify(params)
        })
    }
    postMul(url, params) {
        let formData = new FormData()
        Object.keys(params).forEach(key => {
            formData.append(key, params[key])
        })
        return this.$http({
            url,
            method: 'post',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formData
        })
    }
}
