import httpRequest from '@/utils/http-request'
import { API_BASE_URL } from '@/utils/DOMAIN.js'
const axios = new httpRequest(API_BASE_URL.HZ)

// 债券订单
/**
 * 下单（买入卖出）
 * @param {Object} data 请求数据
 *  {Number} author_id = 1001
 *  {Number} newsid = 0
 *  {Number} page_size = 3
 */
export const hkauthorfeature = data => {
    return axios.get(
        '/news-relatedwithstock/api/v2/query/hkauthorfeature',
        data
    )
}
