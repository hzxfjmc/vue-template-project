import httpRequest from '@/utils/http-request'
const axios = new httpRequest()

// 判断用户归属地 1：大陆 2：其它
export const getSource = () => {
    return axios.getForm(
        '/customer-relationship-server/web/get-user-attribution/v1'
    )
}
