import httpRequest from '@/utils/http-request'
const http = new httpRequest()

// 客户入金本人最后申请详情-港版开户
export function echargeOpenacctLastinfo() {
    return http.postForm(
        `/stock-capital-server/api/recharge-openacct-lastinfo/v1/`
    )
}
// 客户入金申请-港版开户（开户入金）
export function echargeOpenacctApply(params) {
    return http.post(
        `/stock-capital-server/api/recharge-openacct-apply/v1/`,
        params
    )
}

// 客户入金申请-港版开户(普通入金)
export function rechargeHkApply(params) {
    return http.post(`/stock-capital-server/api/recharge-hk-apply/v1/`, params)
}

export function custBankAccountInfoQueryByaccountid(id) {
    return http.post(`/stock-capital-server/api/bankaccount-info/v1`, { id })
}

// 通过银行列表查询关联公司银行
export function bankAccountBankRef(params) {
    return http.post(
        '/stock-capital-server/api/bankaccount-bank-ref/v1/',
        params
    )
}

// 全量银行列表
export function queryBankAll() {
    return http.postForm('/stock-capital-server/api/bank-all/v1/')
}

// 公司银行账户效验支持币种查询
export function bankAccountValid(data) {
    return http.post(`/stock-capital-server/api/bankaccount-valid/v1`, data)
}

// 客户出金申请
export function withdrawApply(data, config) {
    return http.post(
        `/stock-capital-server/api/withdraw-apply/v1`,
        data,
        config
    )
}

// 查询恒生资金账户信息
export function queryHSFundAccountInfo(data) {
    return http.post(`/stock-capital-server/api/hs-account-info/v1`, data)
}

// 账户类型列表查询
export function queryAccountTypes(data) {
    return http.post(
        `/stock-capital-server/api/query-enum-query-accounttypes/v1/`,
        data
    )
}
// 查询客户所有有效银行卡（绑卡）
export function queryOwnValiBankCardBinding(data) {
    return http.post(`/stock-capital-server/api/binding-qryownvali/v1`, data)
}

// 查询客户银行卡（绑卡）详情
export function queryBankCardBindingDetail(data) {
    return http.post(`/stock-capital-server/api/binding-info/v1`, data)
}

// 添加银行卡（绑卡）
export function saveBankCardBinding(data) {
    return http.post(`/stock-capital-server/api/binding-save/v1`, data)
}

// 编辑银行卡（绑卡）
export function editBankCardBinding(data) {
    return http.post(`/stock-capital-server/api/binding-edit/v1`, data)
}
// 删除银行卡
export function delBankCardBinding(data) {
    return http.post(`/stock-capital-server/api/binding-edit/v1`, data)
}

// 转账银行登记本人记录查询(线上开户登记银行卡列表)
export function bankCardBookList(data) {
    return http.post(`/stock-capital-server/api/bankcard-book-list/v1/`, data)
}

// 转账银行登记本人编辑
export function bankCardBookEdit(data) {
    return http.post(`/stock-capital-server/api/bankcard-book-edit/v1/`, data)
}

// 校验客户所在地是否显示客户经理
export function subAccountRegionValid(data) {
    return http.post(
        `/stock-capital-server/api/subaccount-region-valid/v1`,
        data
    )
}

// 查询自己的二级账户(有效账户)
export function subAccountQryValid(data) {
    return http.post(`/stock-capital-server/api/subaccount-qryvalid/v1`, data)
}

// 获取银行展示信息列表
export function bankInfoDisplaySelect(data) {
    return http.get(`/config-manager/api/bank-info-display-select/v1`, data)
}

// 申请二级账户
export function subAccountApply(data) {
    return http.post(`/stock-capital-server/api/subaccount-apply/v1`, data)
}

// 条件查询分页公司银行账户按照账户类型排序列表
export function bankAccountQryAType(data) {
    return http.post(`/stock-capital-server/api/bankaccount-qryatype/v1`, data)
}
