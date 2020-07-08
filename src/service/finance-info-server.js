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

/**
 * 获取基金列表
 */
export const getFundList = () => {
    return axios.post('/finance-info-server/api/get-fund-list/v1', {
        displayLocation: 1
    })
}

//获取基金详情
export const getFundDetail = params => {
    return axios.post(`/finance-info-server/api/get-fund-detail/v2`, params)
}

//基金净值查询
export const getFundNetPrice = params => {
    return axios.post(`/finance-info-server/api/get-fund-net-price/v1`, params)
}

//获取基金列表V2
export const getFundListV2 = params => {
    return axios.post(`/finance-info-server/api/get-fund-list/v2`, params)
}

//获取已发布的基金底层分类
export const getReleaseFundAssetType = params => {
    return axios.post(
        `/finance-info-server/api/get-release-fund-asset-type/v1`,
        params
    )
}

//基金净值历史查询接口
export const getFundNetPriceHistoryV1 = params => {
    return axios.post(
        `/finance-info-server/api/get-fund-net-price-history/v1`,
        params
    )
}

//获取基金分红列表
// 获取基金分红列表
export const getFundDividendList = params => {
    return axios.post(
        `/finance-info-server/api/get-fund-dividend-list/v1`,
        params
    )
}

//获取基金首页信息
export const getFundHomepageInfo = params => {
    return axios.post(
        `/finance-info-server/api/get-fund-homepage-info/v1`,
        params
    )
}

//基金收益率描点查询接口
export const getFundApyPointV1 = params => {
    return axios.post(`/finance-info-server/api/get-fund-apy-point/v1`, params)
}

//基金历史业绩查询接口
export const getFundPerformanceHistory = params => {
    return axios.post(
        `/finance-info-server/api/get-fund-performance-history/v1`,
        params
    )
}

//获取基金推荐列表
export const getFundRecommendList = params => {
    return axios.post(
        `/finance-info-server/api/get-fund-recommend-list/v1`,
        params
    )
}

//获取现金+基金详情
export const getBaoFundInfo = params => {
    return axios.post(`/finance-info-server/api/get-bao-fund-info/v1`, params)
}

//获取基金节假日
export const getFundHoliday = params => {
    return axios.post(`/finance-info-server/api/get-fund-holiday/v1`, params)
}

//获取基金简要信息
export const getFundSimpleInfoList = params => {
    return axios.post(
        `/finance-info-server/api/get-fund-simple-info-list/v1`,
        params
    )
}
// 获取申购费用
export const getFundFeeConfigV1 = params => {
    return axios.post(`/finance-info-server/api/get-fund-fee-config/v1`, params)
}

// 获取基金经理info
export const getFundManagerData = params => {
    return axios.post(
        `finance-info-server/api/get-fund-manager-data/v1`,
        params
    )
}
// 基金收益率描点查询接口v2，包括基准对比
export const getFundApyPointV2 = params => {
    return axios.post(`/finance-info-server/api/get-fund-apy-point/v2`, params)
}

// 基金收益率统计
export const getFundReturnV1 = params => {
    return axios.post(`/finance-info-server/api/get-fund-return/v1`, params)
}

// 获取基金分析数据
export const getFundAnalysisDataV1 = params => {
    return axios.post(
        `/finance-info-server/api/get-fund-analysis-data/v1`,
        params
    )
}
