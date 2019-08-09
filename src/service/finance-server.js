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
