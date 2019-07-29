/**
 * 出金相关接口
 * @ Author LINJAIJUN
 * @ Date 2019/01/04
 */
import httpRequest from '@/utils/http-request'
const axios = new httpRequest()

export default {
    // 客户出金申请
    withdrawApply(data, config) {
        return axios.post(
            `/stock-capital-server/api/withdraw-apply/v1`,
            data,
            config
        )
    },
    // 查询恒生资金账户信息
    queryHSFundAccountInfo(data) {
        return axios.post(`/stock-capital-server/api/hs-account-info/v1`, data)
    },
    // 账户类型列表查询
    queryAccountTypes(data) {
        return axios.post(
            `/stock-capital-server/api/query-enum-query-accounttypes/v1/`,
            data
        )
    },
    // 查询客户所有有效银行卡（绑卡）
    queryOwnValiBankCardBinding(data) {
        return axios.post(
            `/stock-capital-server/api/binding-qryownvali/v1`,
            data
        )
    },
    // 查询客户银行卡（绑卡）详情
    queryBankCardBindingDetail(data) {
        return axios.post(`/stock-capital-server/api/binding-info/v1`, data)
    },
    // 添加银行卡（绑卡）
    saveBankCardBinding(data) {
        return axios.post(`/stock-capital-server/api/binding-save/v1`, data)
    },
    // 编辑银行卡（绑卡）
    editBankCardBinding(data) {
        return axios.post(`/stock-capital-server/api/binding-edit/v1`, data)
    },
    // 删除银行卡
    delBankCardBinding(data) {
        return axios.post(`/stock-capital-server/api/binding-edit/v1`, data)
    },
    // 获取开户基本信息（大陆版本）
    getOpenAccountBasicInfo() {
        return axios.getForm(
            `/user-account-server/api/get-open-account-basic-info/v1`
        )
    },
    // 获取开户基本信息(通用接口)
    getCustOpenAccountInfo() {
        return axios.getForm(
            `/user-account-server/api/get-cust-open-account-info/v1`
        )
    }
}
