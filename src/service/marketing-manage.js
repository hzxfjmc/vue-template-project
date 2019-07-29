import httpRequest from '@/utils/http-request'
import { API_BASE_URL } from '@/utils/DOMAIN.js'
const axios = new httpRequest(API_BASE_URL.JY)

// 查看二维码
export const myQrCode = params => {
    return axios.post(
        `/customer-relationship-server/web/auth-my-qr-code/v1`,
        params
    )
}
// 申请成为地推人员
export const add = params => {
    return axios.post(`/customer-relationship-server/web/add/v1`, params)
}
// 查看详情
export const taskDetail = params => {
    return axios.post(
        `/customer-relationship-server/web/auth-task-detail/v1`,
        params
    )
}
// 查看任务
export const taskList = params => {
    return axios.post(
        `/customer-relationship-server/web/auth-task-list/v1`,
        params
    )
}
// 获取手机短信验证码
export const getPhoneCaptcha = params => {
    return axios.post(
        `/customer-relationship-server/web/get-phone-captcha/v1`,
        params
    )
}
// 登录
export const login = params => {
    return axios.post(`/customer-relationship-server/web/login/v1`, params)
}
// 修改密码
export const modifyPassword = params => {
    return axios.post(
        `/customer-relationship-server/web/modify-password/v1`,
        params
    )
}
