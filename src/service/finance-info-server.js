import httpRequest from '@/utils/http-request'
const axios = new httpRequest()

// 债券信息查询接口
/**
 * 获取债券列表
 * @param {Number} data 请求参数
 *  {Number} pageNum 当前页
 *  {Number} pageSize 每页条数
 */
export const getBondList = data => {
    return axios.post('/finance-info-server/api/get-bond-list/v1', data)
}

/**
 * 获取债券信息详情
 * @param {Number} id 债券id
 */
export const getBondDetail = id => {
    return axios.post('/finance-info-server/api/get-bond-detail/v1', {
        id
    })
}

/**
 * 获取债券价格详情
 * @param {Number} id 债券id
 */
export const getBondPrices = id => {
    return axios.post('/finance-info-server/api/get-bond-prices/v1', {
        id
    })
}

/**
 * 获取债券当前价格
 * @param {Number} id 债券id
 */
export const getCurrentBondPrices = id => {
    return axios.post('/finance-info-server/api/get-current-bond-prices/v1', {
        id
    })
}

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
    return axios.post('/finance-info-server/api/bond-order/v1', data)
}
