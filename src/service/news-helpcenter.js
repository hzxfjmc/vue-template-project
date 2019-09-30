import httpRequest from '@/utils/http-request'
import { API_BASE_URL } from '@/utils/DOMAIN.js'
const axios = new httpRequest(API_BASE_URL.HZ)

// 帮助中心
export const queryMessageDetail = params => {
    return axios.get(`/news-helpcenter/api/v1/query/messagedetail`, params)
}
