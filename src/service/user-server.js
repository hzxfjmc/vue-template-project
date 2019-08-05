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
    return axios.get('/user-server/api/risk-assess-result/v1')
}

/**
 * 获取风险测评题目
 */
export const riskAssessSubject = () => {
    return axios.get('/user-server/api/risk-assess-subject/v1')
}
