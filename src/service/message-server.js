import httpRequest from '@/utils/http-request'
const axios = new httpRequest()

// 存入退订邮箱
export const insertBlackEmail = param =>
    axios.post('/message-server/api/insert-black-email/v1', param)
