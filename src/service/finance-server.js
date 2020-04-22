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

/**
 * @describe 申购
 * @param {Object}
 * {
 *	"fundId": 1,
 *	"purchaseAmount": "1",
 *	"requestId": "e0669ac526954092b6107473a03ff7a2",
 *	"tradeToken": "977bb092c9ab4111a69442c7113698f7"
 * }
 */
export const fundPurchase = (params, config) => {
    return axios.post(`/finance-server/api/fund-purchase/v1`, params, config)
}

/**
 * @describe 赎回
 * @param {Object}
 * {
 *	"fundId": 1,
 *	"redemptionShare": "1",
 *	"requestId": "e0669ac526954092b6107473a03ff7a2",
 *	"tradeToken": "977bb092c9ab4111a69442c7113698f7"
 * }
 */
export const fundRedemption = params => {
    return axios.post(`/finance-server/api/fund-redemption/v1`, params)
}

// 基金交易记录列表
export const fundOrderList = params => {
    return axios.post(`/finance-server/api/fund-order-list/v1`, params)
}

// 基金交易记录详情
export const fundOrderDetail = params => {
    return axios.post(`/finance-server/api/fund-order-detail/v1`, params)
}

// 撤单
export const cancelFundOrder = params => {
    return axios.post(`/finance-server/api/cancel-fund-order/v1`, params)
}

//获取当前客户持仓收益列表
export const getFundPositionEarningsListV1 = params => {
    return axios.post(
        `/finance-server/api/get-fund-position-earnings-list/v1`,
        params
    )
}

//获取当前客户基金持仓列表V2
export const getFundPositionList = params => {
    return axios.post(`/finance-server/api/get-fund-position-list/v2`, params)
}

//获取当前客户单个基金持仓V2
export const getFundPositionV2 = params => {
    return axios.post(`/finance-server/api/get-fund-position/v2`, params)
}

//开通用户债券佣金套餐
export const openBondFeePackage = () => {
    return axios.post(`/finance-server/api/open-bond-fee-package/v1`)
}

// 获取服务端计算的利息和佣金，对比客户端是否一样
// export const bondOrderCalculate = params => {
//     return axios.post(`/finance-server/api/bond-order-calculate/v1`, params)
// }

//获取当前客户基金持仓列表V3
export const getFundPositionListV3 = () => {
    return axios.post(`/finance-server/api/get-fund-position-list/v3`)
}

//创建定投计划
export const hanlderCreateFundFixedPlan = () => {
    return axios.post(`/finance-server/api/create-fund-fixed-plan/v1`)
}

//定投计划列表详情
export const getFundFixedPlanDetail = () => {
    return axios.post(`/finance-server/api/fund-fixed-plan-detail/v1`)
}

//定投计划列表
export const getFundFixedPlanPage = () => {
    return axios.post(`/finance-server/api/fund-fixed-plan-page/v1`)
}

//定投计划列表
export const getUpdateFundFixedPlanInfo = () => {
    return axios.post(`/finance-server/api/update-fund-fixed-plan-info/v1`)
}

//修改定投计划状态
export const getUpdateFundFixedPlanStatus = () => {
    return axios.post(`/finance-server/api/update-fund-fixed-plan-status/v1`)
}
//友信获取客户持仓
export const getBaoPostion = params => {
    return axios.post(`/finance-server/api/get-bao-position/v1`, params)
}

//友信宝转入转出列表
export const getBaoCapitalTradeList = params => {
    return axios.post(`/finance-server/api/bao-capital-trade-page/v1`, params)
}

//友信宝转入转出
export const getBaoCapitalTrade = params => {
    return axios.post(`/finance-server/api/bao-capital-trade/v1`, params)
}

//友信宝转入转出详情
export const getBaoCapitalTradeDetails = params => {
    return axios.post(`/finance-server/api/bao-capital-trade-detail/v1`, params)
}

//获取当前客户基金总持仓(包含余额宝)
export const getFundTotalPosition = params => {
    return axios.post(`/finance-server/api/get-fund-total-position/v1`, params)
}

//获取最近的扣款日
export const getRecentDeductionDate = params => {
    return axios.post(`/finance-server/api/recent-deduction-date/v1`, params)
}

//定投记录列表
export const getFundFixedRecordPage = params => {
    return axios.post(`/finance-server/api/fund-fixed-record-page/v1`, params)
}
