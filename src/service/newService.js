import httpRequest from '@/utils/http-request'
import { API_BASE_URL } from '@/utils/DOMAIN.js'
const axios = new httpRequest(API_BASE_URL.HZ)
export default {
    // 开户相关banner
    getOpenSuccessBanner(params) {
        return axios.get(`/news-configserver/api/v1/query/banner`, params)
    }
}
