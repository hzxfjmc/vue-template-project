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
 * 获取banner图
 */
export const getBondBanner = () => {
    return axios.get('/finance-info-server/api/get-bond-banner/v1')
}
