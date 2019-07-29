import httpRequest from '@/utils/http-request'
const axios = new httpRequest()

export default {
    /**
     *
     * 完整资料确认
     * @param {*}
     * @returns
     */
    getCaCertSn(certDn, certP10) {
        return axios.post(`/user-account-server/api/get-ca-cert-sn/v1`, {
            certDn,
            certP10
        })
    },
    /**
     *
     * 完整资料确认
     * @param {*}
     * @returns
     */
    finishInfoConfirm(params) {
        return axios.post(
            `/user-account-server/api/finish-info-confirm/v1`,
            params
        )
    },
    /**
     *
     * 获取资料确认status
     * @param {*}
     * @returns
     */
    getRiskDisclosure() {
        return axios.getForm(`/user-account-server/api/get-risk-disclosure/v1`)
    },
    /**
     *
     * 开始开户
     * @param {*}
     * @returns
     */
    customerStartOpenAccount() {
        return axios.get(
            `/user-account-server/api/customer-start-open-account/v1`
        )
    },
    /**
     *
     * 获取跳转步骤
     * @param {*}
     * @returns
     */
    getCustomerOpInfoEditStatus() {
        return axios.get(
            `/user-account-server/api/get-customer-op-info-edit-status/v1`
        )
    },
    /**
     *
     * 获取用户职业和联系信息
     * @param {*}
     * @returns
     */
    getUserJobAndContact() {
        return axios.get(
            `/user-account-server/api/get-customer-job-and-contact/v1`
        )
    },
    /**
     *
     * 获取身份证信息
     * @param {*}
     * @returns
     */
    getIdCard() {
        return axios.getForm(`/user-account-server/api/get-id-card/v1`)
    },
    /**
     *
     * 保存P10
     * @param {*} data = certP10
     * @returns
     */
    finishFourElement(certP10) {
        return axios.post(`/user-account-server/api/finish-four-element/v1`, {
            certP10
        })
    },
    /**
     *
     * CA PDF备案
     * @param {*} p1SignData
     * @returns
     */
    finishCaSign(certDn, certSn, fileId, p1SignData) {
        return axios.post(`/user-account-server/api/finish-ca-sign/v1`, {
            certDn,
            certSn,
            fileId,
            p1SignData
        })
    },
    /**
     *
     * 四要素后获取certDN
     * @param {*}
     * @returns
     */
    getCaCertdn() {
        return axios.get(`/user-account-server/api/get-ca-certdn/v1`)
    },
    /**
     *校验四要素
     *{
            cardNumber,
            chineseName,
            familyNameSpell,
            firstNameSpell,
            idAddress,
            identifyNumber,
            telephoneNumber
        }
     * @param {银行卡号} cardNumber
     * @param {中文姓名} chineseName
     * @param {姓 拼音} familyNameSpell
     * @param {名 拼音} firstNameSpell
     * @param {证件地址} idAddress
     * @param {证件号码} identifyNumber
     * @param {银行预留手机号} telephoneNumber
     * @returns
     */
    checkfourElement(params) {
        return axios.post(
            `/user-account-server/api/check-four-element-get-ca-certdn/v1`,
            params
        )
    },
    /**
     * 身份证识别
     * @param idCardPath 身份证照片 正反面
     * @returns
     *  "cardNumber": "",
		"chineseName": "",
		"familyNameSpell": "",
		"firstNameSpell": "",
		"idAddress": "",
		"idBackPath": "",
		"idFrontPath": "",
		"identifyNumber": "",
		"infoEditStatus": 0,
		"telephoneNumber": ""
     */
    ocrIdCard(idCardPath) {
        return axios.getForm(`/user-account-server/api/ocr-id-card/v1`, {
            idCardPath
        })
    },
    // 完成身份证图片上传接口
    finishedIdCardUpload() {
        return axios.post(`/user-account-server/api/finished-id-card-upload/v1`)
    },
    // 银行卡识别
    ocrBankCard(bankCardPath) {
        return axios.getForm(`/user-account-server/api/ocr-bank-card/v1`, {
            bankCardPath
        })
    },
    // 获取资产状况和投资目标
    getAssetInvest() {
        return axios.get(`/user-account-server/api/get-asset-invest/v1`)
    },
    // 设置资产状况和投资目标
    setAssetInvest(params) {
        return axios.put(
            `/user-account-server/api/set-customer-asset-invest/v1`,
            params
        )
    },
    // 风险披露完成
    finishRiskDisclosure() {
        return axios.post(`/user-account-server/api/finish-risk-disclosure/v1`)
    },
    // 获取开户状态
    getOpenAccountStatus() {
        return axios.get(`/user-account-server/api/get-open-account-status/v1`)
    },
    // 获取开户状态
    /**
     *
     *
     * @param {
        "companyName": "", // 公司名称
        "contactAddress": "", // 通讯地址
        "email": "", 邮箱
        "idAddress": "", 身份证地址
        "industry": "", 所属行业
        "infoEditStatus": 0, 开户资料填写
        "jobPosition": "", 职位
        "jobStatus": "" 职业状态
    } params
     * @returns
     */
    setUserJobAndContact(params) {
        return axios.put(
            `/user-account-server/api/set-customer-job-and-contact/v1`,
            params
        )
    },
    // 获取开户基本信息
    getOpenAccountBasicInfo() {
        return axios.getForm(
            `/user-account-server/api/get-open-account-basic-info/v1`
        )
    },
    /**
     *
     * 活体认证完成
     * @param {*} bizToken
     * @param {*} megliveData
     * @returns
     */
    getFaceIdVerifyResult(bizToken, megliveData) {
        return axios.postMul(
            `/user-account-server/api/get-face-id-verify-result/v1`,
            {
                bizToken,
                megliveData
            }
        )
    },
    /**
     *
     * 获取CA PDF签名信息
     * @param {File} signImageBase64
     * @param {certDn} certDn
     * @param {certSn} certSn
     * @returns
     */
    caPdfSign(certDn, certSn, signImageBase64) {
        return axios.post(`/user-account-server/api/get-pdf-hash/v1`, {
            signImageBase64,
            certDn,
            certSn
        })
    },
    /**
     *
     * 活体认证完成
     * @param {*} bizToken
     * @param {*} megliveData
     * @param {*} sign
     * @param {*} signVersion
     * @returns
     */
    getFaceIdVerifyResultV2(bizToken, megliveData, sign, signVersion) {
        return axios.post(
            `/user-account-server/api/get-face-id-verify-result/v2`,
            {
                bizToken,
                megliveData,
                sign,
                signVersion
            }
        )
    },
    // 获取开户基本信息(通用接口)
    getCustOpenAccountInfo() {
        return axios.getForm(
            `/user-account-server/api/get-cust-open-account-info/v1`
        )
    }
}
