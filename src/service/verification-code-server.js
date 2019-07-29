import httpRequest from '@/utils/http-request'
const axios = new httpRequest()
export const verificationCodeServer = params =>
    axios.get(`/verification-code-server/api/getCode/v1`, params)
