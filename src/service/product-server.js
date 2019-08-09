import httpRequest from '@/utils/http-request'
const axios = new httpRequest()

/**
 * 获取用户套餐
 * @param {Number} data 请求参数
 *  {Number} stockBusinessType 0 -股票，1- 债券
 *  {Number} userId 用户id
 */
export const feePackageCurr = data => {
    return axios.post('/product-server/api/fee_package_curr', data)
}
