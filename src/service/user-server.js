import httpRequest from '@/utils/http-request'
const axios = new httpRequest()

/**
 * 债券风险提示签名
 * @param {Object} data 请求对象
 *  {String} agreementName 协议名称
 *  {String} agreementUrl 协议URL
 *  {String} autograph 签名
 *  {String} bondName 债券名称
 *  {String} riskTips 风险提示内容
 */
export const bondRiskAutograph = data => {
    return axios.post('/user-server/api/bond-risk-autograph/v1', data)
}

/**
 * 风险测评提交
 * @param {Object} data 请求对象
 *  {Array} assessOptionParams 答题明细
 *      {Object}
 *          {Number} optionNum 选项号
 *          {Number} subjectNum 题目号
 *  {String} subjectVersion 测评题目版本
 */
export const riskAssessAnswer = data => {
    return axios.post('/user-server/api/risk-assess-answer/v1', data)
}

/**
 * 获取当前用户风险测评结果
 */
export const riskAssessResult = () => {
    return axios.getForm('/user-server/api/risk-assess-result/v1')
}

/**
 * 获取风险测评题目
 */
export const riskAssessSubject = () => {
    return axios.getForm('/user-server/api/risk-assess-subject/v1')
}

/**
 * 获取债券协议
 */
export const getBongAgreement = () => {
    return axios.getForm('/user-server/api/get-bond-agreement/v1')
}

export function jsAuth() {
    return axios.getForm(`/user-server/web/js-auth/v1`)
}
// 获取当前用户信息
export function getCurrentUser() {
    return axios.getForm(`/user-server/api/get-current-user/v1`)
}
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
