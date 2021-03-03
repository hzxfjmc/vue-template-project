import httpRequest from '@/utils/http-request'
import { API_BASE_URL } from '@/utils/DOMAIN.js'
const axios = new httpRequest(API_BASE_URL.WJ)

// 错误日志上报
export const logjson = data =>
    axios.post('/quotes-applogupload/api/v1/logjson', data)
