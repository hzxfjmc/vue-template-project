import httpRequest from '@/utils/http-request'
const axios = new httpRequest()
export default {
    //  活体认证调试用的接口 TODO: 生产环境需要删除
    register(phoneNumber, password, captcha, areaCode = '86') {
        return axios.getForm(`/user-server/api/bind-phone/v1`, {
            areaCode,
            captcha,
            password: axios.rsa(password),
            phoneNumber: axios.rsa(phoneNumber)
        })
    },
    /**
     * 发送短信验证码
     *
     * @param {*} phoneNumber
     * @param {string} [areaCode='86']
     * @param {number} [type=5]
     * @returns
     */
    sendPhoneCapcha(phoneNumber, areaCode = '86', type = 104) {
        return axios.post(`/user-server/api/send-phone-captcha/v1`, {
            areaCode,
            phoneNumber: axios.rsa(phoneNumber),
            type
        })
    },
    /**
     *获取当前用户信息
     * @returns
     */
    getCurrentUser(device = 'web') {
        return axios.getForm(`/user-server/${device}/get-current-user/v1`)
    }
}

/**
 * 网页授权获取用户信息
 * @param {微信返回code} code
 */
export function wechatLoginByAuthCode(code) {
    return axios.getForm(`/user-server/web/wechat-login-by-auth-code/v1`, {
        code: code
    })
}

export function jsAuth() {
    return axios.getForm(`/user-server/web/js-auth/v1`)
}

// 微博授权接口
export function wbLoginByAuthCode(params) {
    return axios.getForm(`/user-server/web/weibo-login/v1`, params)
}

// 大陆版及港版注册登录接口
// 发送短信验证码
export const sendPhoneCaptcha = (phoneNumber, areaCode, type) => {
    return axios.post(`/user-server/web/send-phone-captcha/v1`, {
        phoneNumber,
        areaCode,
        type
    })
}
// 短信验证码登录
export const registerLogin = (params, channelId, type, id) => {
    let str = JSON.stringify({
        'register-cid': channelId, //渠道id
        'register-ct': type, //渠道类型
        'activity-id': id //活动id
    })
    return axios.post(`/user-server/web/web-register-login/v1`, params, {
        headers: {
            'X-Re': str
        }
    })
}
// 手机号加第三方id登录
export const registerLoginById = (params, channelId, type, id) => {
    let str = JSON.stringify({
        'register-cid': channelId, //渠道id
        'register-ct': type, //渠道类型
        'activity-id': id //活动id
    })
    return axios.post(`/user-server/web/third-party-web-sign-in/v1`, params, {
        headers: {
            'X-Re': str
        }
    })
}
// 获取手机验证码(用户输入手机号)---带图形验证码判断
export function sendPhoneCaptchaV2(params) {
    return axios.post(`/user-server/web/send-phone-captcha/v2`, params)
}
// 验证手机号是否注册(WEB)
export function checkPhoneV2(params) {
    return axios.getForm(`/user-server/web/check-phone/v2`, params)
}

// 短信验证码+证件号激活登陆
export function phoneCaptchaActivateLogin(params) {
    return axios.post(
        `/user-server/web/phone-captcha-activate-login/v1`,
        params
    )
}
// 微信用户从公众号绑定手机号码
export function wechatBindPhoneNumber(params) {
    return axios.post(`/user-server/web/wechat-bind-phone-number/v1`, params)
}

// 短信验证码+检查当前用户是否绑定微信和关注公众号
export function checkWechatBind(params) {
    return axios.getForm(`/user-server/web/check-wechat-bind/v1`, params)
}

// 获取当前用户信息
export function getCurrentUser() {
    return axios.getForm(`/user-server/api/get-current-user/v1`)
}
