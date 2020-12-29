import httpRequest from '@/utils/http-request'
const axios = new httpRequest()

//根据uuid和市场获取当前用户正在生效的资金账户
export const getMarketValidFundAccount = params => {
    return axios.get(
        `user-account-server/api/get-market-valid-fund-account/v1`,
        params
    )
}

// 获取客户专业投资者认证结果
export const getInvestmentCerificationResult = params => {
    return axios.get(
        `user-account-server/api/get-investment-cerification-result/v1`,
        params
    )
}

// 策略跟投-检查跟投策略相关账户数据
export const checkFollowInvestmentInfo = () => {
    return axios.getForm(
        `user-account-server/api/check-follow-investment-info/v1`
    )
}
// 机构业务-机构交易员申请业务拦截器
export const orgTraderApplyInterceptor = params => {
    return axios.post(
        `/user-account-server/api/org-trader-apply-interceptor/v1`,
        params
    )
}
