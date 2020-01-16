import httpRequest from '@/utils/http-request'
import { API_BASE_URL } from '@/utils/DOMAIN.js'
const axios = new httpRequest(API_BASE_URL.HZ)
// 请求短url
export const getShortUrl = params => {
    return axios.get(`/news-shorturl/api/v1/geturl`, params)
}
