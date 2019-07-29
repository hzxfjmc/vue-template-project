import httpRequest from '@/utils/http-request'
const axios = new httpRequest()

// google登录
export const googleLogin = authCode => {
    return axios.getForm(`/user-oversea-server/web/google-web-login/v1`, {
        authCode
    })
}
// facebook登录
export const facebookLoginByAuthCode = authCode => {
    return axios.getForm(`/user-oversea-server/web/facebook-web-login/v1`, {
        authCode
    })
}
