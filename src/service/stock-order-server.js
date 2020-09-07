import httpRequest from '@/utils/http-request'
const axios = new httpRequest()

export const ipoRedPoint = params => {
    return axios.post(`stock-order-server/api/ipo-red-point/v1`, params)
}
