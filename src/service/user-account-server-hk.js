import httpRequest from '@/utils/http-request'
const axios = new httpRequest()
/**
 * 大陆身份证 1
 */

/**
 * 香港身份证 2
 */

/**
 * 护照 3
 */

/**
 * 香港永久居民身份证 4
 */
export const addHkIdentifyInfo = params => {
    return axios.post(
        '/user-account-server/api/add-hk-identify-info/v1',
        params
    )
}

/**
 *
 * 开始港版开户
 * @param {*}
 * @returns
 */
export const startHkOpenAccount = identifyType => {
    return axios.post(`/user-account-server/api/start-hk-open-account/v1`, {
        identifyType
    })
}

/**
 *
 * 获取港版开户状态
 * @param {*}
 * @returns
 */
export const getHKOpenAccountInfo = () => {
    return axios.getForm(
        `/user-account-server/api/get-hk-open-account-info/v1`,
        {}
    )
}
/**
 *
 * 获取港版开户结果
 * @param {*}
 * @returns
 */
export const getHkOpenAccountResult = () => {
    return axios.getForm(
        `/user-account-server/api/get-hk-open-account-result/v1`,
        {}
    )
}
/**
 *
 * 获取客户个人资料信息
 * @param {*}
 * @returns
 */
export const getHKIdentifyInfo = () => {
    return axios.getForm(`/user-account-server/api/get-hk-identify-info/v1`, {})
}

/**
 *
 * 获取财务状况
 * @param {*}
 * @returns
 */
export const getHKAssetInvest = () => {
    return axios.getForm(`/user-account-server/api/get-hk-asset-invest/v1`)
}

/**
 *
 * 获取客户职业和税务信息
 * @param {*}
 * @returns
 */
export const getHKJobAndTaxInfo = () => {
    return axios.getForm(`/user-account-server/api/get-hk-job-and-tax-info/v1`)
}

/**
 *
 * 获取客户资料披露风险确认信息
 * @param {*}
 * @returns
 */
export const getHKDisclosureRisk = () => {
    return axios.getForm(`/user-account-server/api/get-hk-disclosure-risk/v1`)
}

/**
 *
 * 新增港版APP客户财务信息
 * @param {*}
 * @returns
 */
export const addHkAssetInvest = params => {
    return axios.post(`/user-account-server/api/add-hk-asset-invest/v1`, params)
}
/**
 *
 * 新增港版App客户职业状况
 * @param
 * {
	"companyBusiness": "手機製造",
	"companyBusinessCode": 21003,
	"companyName": "小米公司",
	"jobPosition": "經理",
	"jobPositionCode": 21004,
	"jobStatus": "受雇",
	"jobStatusCode": 21001,
	"taxList": [
		{
			"country": 20100,
			"countryCode": "香港",
			"id": 123,
			"taxNumber": "23543135(A)"
		}
	]
}
 * @returns
 */
export const addHKJobAndTaxInfo = parmas => {
    return axios.post(
        `/user-account-server/api/add-hk-job-and-tax-info/v1`,
        parmas
    )
}
/**
 * 港版app资料披露风险确认
 * @param {int32} docStatus
 */
export const confirmHKDisclosureRish = params => {
    return axios.post(
        `/user-account-server/api/confirm-hk-disclosure-risk/v1`,
        params
    )
}

/**
 * 新增港版APP客户签名图片
 * @param {string} signImage
 */
export const addHKCustomerSign = signImage => {
    return axios.post(`/user-account-server/api/add-hk-customer-sign/v1`, {
        signImage
    })
}

/**
 * 港版APP补充住址证明图片
 * @param {int} contactAddress
 * @param {string} proofOfAddress
 */
export const addHkProofOfAddress = params => {
    return axios.post(
        `/user-account-server/api/add-hk-proof-of-address/v1`,
        params
    )
}

/**
 * 财务状况，获取app 开户列表
 * @param {Object}
 */
export const appSystemOtherServer = params => {
    return axios.post(
        `/config-manager-admin/admin-api/app-system-other-server/v1`,
        params
    )
}

/**
 * 财务状况，获取app 开户列表
 * @param {Object}/verify-hk-id-code-status/v1
 */
export const verifyHkIdCodeStatus = params => {
    return axios.post(
        '/user-account-server/api/verify-hk-id-code-status/v1',
        params
    )
}

// 更新客户身份核实状态
// (2, "待核实转账")
export function updateCustIdentifyStatus(data) {
    return axios.post(
        `/user-account-server/api/update-cust-identify-status/v1`,
        data
    )
}

// 获取活体识别token
export function getFaceIdLitToken() {
    return axios.getForm(`/user-account-server/api/get-face-id-lit-token/v1`)
}
