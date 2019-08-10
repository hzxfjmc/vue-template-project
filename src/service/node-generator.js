import httpRequest from '@/utils/http-request'
const axios = new httpRequest()

/**
 * 获取常见问题url
 * @param {String} code 请求参数
 */
export const getH5List = code => {
    return axios.getForm(`/node-generator/admin-api/get-h5-list/v1?key=${code}`)
}
