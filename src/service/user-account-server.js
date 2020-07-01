import httpRequest from '@/utils/http-request'
const axios = new httpRequest()

// 根据uuid和市场获取当前用户正在生效的资金账户；marketType见枚举 EnumCustomerFundAccountMarket
export const getMarketValidFundAccount = params => {
    return axios.get(
        '/user-account-server/api/get-market-valid-fund-account/v1',
        params
    )
}
