import httpRequest from '@/utils/http-request'
const axios = new httpRequest()

// 债券订单
/**
 * 下单（买入卖出）
 * @param {Object} data 请求数据
 *  {Number} bondId 债券ID
 *  {Number} direction 买卖方向
 *  {Number} entrustPrice 委托价
 *  {Number} entrustQuantity 委托数量（份数）
 *  {String} requestId 请求ID
 *  {String} tradeToken 交易令牌
 */
export const bondOrder = data => {
    return axios.post('/finance-server/api/bond-order/v1', data)
}

/**
 * 获取应计利息计算天数
 * @param {Number} bondId 债券id
 */
export const getBondInterestCalculate = bondId => {
    return axios.post('/finance-server/api/get-bond-interest-calculate/v1', {
        bondId
    })
}

/**
 * 获取当前客户债券持仓
 * @param {Number} market 1 hk 港债  2 us 美债
 */
export const getBondPosition = market => {
    return axios.post('/finance-server/api/get-bond-position/v1', {
        market
    })
}

/**
 * @describe 获取当前客户基金持仓
 * @param {Object}
 */
export const getFundPosition = params => {
    return axios.post(`/finance-server/api/get-fund-position/v1`, params)
}
