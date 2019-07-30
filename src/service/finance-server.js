// 债券信息查询接口
import httpRequest from '@/utils/http-request'
const axios = new httpRequest()

// 获取债券列表
export const getBondList = () => {
    return axios.post('/finance-server/api/get-bond-list/v1')
}

// 获取债券信息详情
export const getBondDetail = id => {
    return axios.post('/finance-server/api/get-bond-detail/v1', {
        id
    })
}

// 获取债券价格详情
export const getBondPrices = id => {
    return axios.post('/finance-server/api/get-bond-prices/v1', {
        id
    })
}

// 获取债券当前价格
export const getCurrentBondPrices = id => {
    return axios.post('/finance-server/api/get-current-bond-prices/v1', {
        id
    })
}
