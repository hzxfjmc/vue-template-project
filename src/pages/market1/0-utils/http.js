import axios from 'axios'
import { Toast } from 'vant'
import getHeadInfo from '@/utils/http-request/get-head-info'
import JSBridge from '@/utils/js-bridge'
import config from '../0-config'

export default class http {
    constructor(baseUrl) {
        const instance = axios.create({
            timeout: 30000
        })

        // 300ms未返回结果，显示加载中提示，若返回错误，或正常返回，则隐藏加载中提示
        Toast.allowMultiple() // 允许同时多个Toast实例
        const clearLoading = config => {
            if (config._loading) {
                config._loading.clear()
            }
            clearTimeout(config._loading_timing)
        }

        // 获取token，本地调试可自行配置
        let token =
            config.env === 'localhost'
                ? 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzZXNzaW9uIjoiNDljM2E0NTJhZmM0NGZlMTg0NDk1MjEyZmFmMjhkODIiLCJzb3VyY2UiOiJhcHAiLCJ1dWlkIjozMjQ1NzYzNzY3Mzk4NzI3Njh9.iG39N4oPIL2wlf02jgZg59hDTBmKMpJO__F2m5BOwak'
                : ''
        const getToken = async () => {
            if (!token && JSBridge.isYouxinApp) {
                const user = await JSBridge.callApp('get_user_info')
                token = user.userToken || ''
            }
            return token
        }

        // 请求拦截
        instance.interceptors.request.use(
            async config => {
                if (!config._no_loading) {
                    config._loading_timing = setTimeout(() => {
                        config._loading = Toast.loading({
                            duration: 0,
                            forbidClick: true
                        })
                    }, 300)
                }
                // 请求头信息
                const Authorization = await getToken()
                const headerInfo = await getHeadInfo()
                config.headers = {
                    ...config.headers,
                    ...headerInfo,
                    Authorization
                }
                return config
            },
            error => {
                clearLoading(error.config)
                return Promise.reject(error)
            }
        )

        // 返回拦截
        instance.interceptors.response.use(
            res => {
                clearLoading(res.config)
                if (res.data.code === 0) {
                    return res.data.data
                }
                return Promise.reject(res.data)
            },
            error => {
                clearLoading(error.config)
                return Promise.reject(error)
            }
        )
        instance.defaults.baseURL = baseUrl

        instance.getForm = (
            url,
            { params = {}, data = {}, _no_loading = false } = {
                params: {},
                data: {},
                _no_loading: false
            }
        ) => {
            return instance({
                params,
                url,
                method: 'get',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data,
                _no_loading
            })
        }

        instance.postForm = (
            url,
            { params = {}, data = {}, _no_loading = false } = {
                params: {},
                data: {},
                _no_loading: false
            }
        ) => {
            return instance({
                params,
                url,
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data,
                _no_loading
            })
        }

        return instance
    }
}
