import httpRequest from '@/utils/http-request'
import { API_BASE_URL } from '@/utils/DOMAIN.js'
const axios = new httpRequest(API_BASE_URL.ZX)

// 错误日志上报
export const logjson = data => axios.post('/applog-upload/api/v1/logjson', data)
