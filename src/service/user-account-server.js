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
