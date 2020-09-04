import httpRequest from '@/utils/http-request'
const axios = new httpRequest()

// 判断用户归属地 1：大陆 2：其它
export const getSource = () => {
    return axios.getForm(
        '/customer-relationship-server/web/get-user-attribution/v1'
    )
}

//查询PI专栏下更多产品信息
export const listPiColumnAndProductV1 = param => {
    return axios.post(
        `customer-relationship-server/web/list-pi-column-and-products/v1`,
        param
    )
}

//Pi专栏下产品申购意向预约
export const commitReserveProductRecordV1 = param => {
    return axios.post(
        `customer-relationship-server/web/commit-reserve-product-record/v1`,
        param
    )
}

// 查询PI专栏下更多产品信息
export const listPiColumnMoreProductV1 = param => {
    return axios.post(
        `customer-relationship-server/web/list-pi-column-more-products/v1`,
        param
    )
}
