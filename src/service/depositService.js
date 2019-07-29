/**
 * 入金相关接口
 * @ Author LINJAIJUN
 * @ Date 2019/01/05
 */
import httpRequest from '@/utils/http-request'
const axios = new httpRequest()

export default {
    // 保存附件信息
    recordAttachmentMultiple(data) {
        return axios.post(
            `/stock-capital-server/api/save-attachment-multiple/v1`,
            data
        )
    },
    // 查询公司银行账户详情
    queryCustBankAccountInfoByAccountId(data) {
        return axios.post(`/stock-capital-server/api/bankaccount-info/v1`, data)
    },
    // 客户入金申请
    rechargeApply(data, config) {
        return axios.post(
            `/stock-capital-server/api/recharge-apply/v1`,
            data,
            config
        )
    },
    // 获取银行展示信息列表
    bankInfoDisplaySelect(data) {
        return axios.get(
            `/config-manager/api/bank-info-display-select/v1`,
            data
        )
    },
    // 获取预约银行卡列表 1-香港办理 2-大陆办理
    bankCardList(data) {
        return axios.get(`/config-manager/api/bank-card-list/v1`, data)
    },
    // 消息管理：拉取小黄条消息(强通知)
    getNoteMsg(data) {
        return axios.get(`/message-center/api/v1/msgoper/getnotemsg`, data)
    },
    // 查看客户预约办卡信息
    queryInfoBank(data) {
        return axios.post(
            `/stock-capital-server/api/bank-card-reservation-info/v1`,
            data
        )
    },
    // 客户申请预约办卡信息
    newReservation(data) {
        return axios.post(
            `/stock-capital-server/api/bank-card-reservation-new/v1/`,
            data
        )
    },
    // 客户编辑预约办卡信息
    editReservation(data) {
        return axios.post(
            `/stock-capital-server/api/bank-card-reservation-edit/v1/`,
            data
        )
    },
    // 获取开户基本信息
    getOpenAccountBasicInfo() {
        return axios.getForm(
            `/user-account-server/api/get-open-account-basic-info/v1`
        )
    },
    // 申请二级账户
    subAccountApply(data) {
        return axios.post(`/stock-capital-server/api/subaccount-apply/v1`, data)
    },
    // 查询自己的二级账户多个
    subAccountQuery(data) {
        return axios.post(`/stock-capital-server/api/subaccount-query/v1`, data)
    },
    // 查询自己的二级账户(有效账户)
    subAccountQueryValid(data) {
        return axios.post(
            `/stock-capital-server/api/subaccount-qryvalid/v1`,
            data
        )
    },
    // 获取当前用户信息
    getCurrentUser() {
        return axios.getForm(`/user-server/api/get-current-user/v1`)
    },
    // 开关判断
    getAppSystem(data) {
        return axios.post(`/config-manager/api/get-app-system/v1`, data)
    },
    // 条件查询分页公司银行账户按照账户类型排序列表
    queryAppOrderAcctype(data) {
        return axios.post(
            `/stock-capital-server/api/bankaccount-qryatype/v1`,
            data
        )
    },
    //通过银行列表查询关联公司银行（对应收款银行）
    queryAccountBankRef(data) {
        return axios.post(
            `/stock-capital-server/api/bankaccount-bank-ref/v1/`,
            data
        )
    },
    // APP查询银行列表
    queryHkBankList(data) {
        return axios.get(`/config-manager/api/bank-info-hk-select/v1`, data)
    },
    // 转账银行登记本人记录查询(线上开户登记银行卡列表)
    queryBankCardBookList(data) {
        return axios.post(
            `/stock-capital-server/api/bankcard-book-list/v1/`,
            data
        )
    },
    // 转账银行登记本人编辑
    delBankCardBook(data) {
        return axios.post(
            `/stock-capital-server/api/bankcard-book-edit/v1/`,
            data
        )
    },
    // 查询客户最后一次入金详情
    rechargeLastSuccess(data) {
        return axios.post(
            `/stock-capital-server/api/recharge-lastsuccess/v1/`,
            data
        )
    },
    // 公司银行账户效验支持币种查询
    bankAccountValid(data) {
        return axios.post(
            `/stock-capital-server/api/bankaccount-valid/v1`,
            data
        )
    }
}
