import httpRequest from '@/utils/http-request'
const axios = new httpRequest()

/**
 * @describe 查询业务团购活动
 * @param {Object}
 */
export const getGroupAction = data => {
    return axios.get(`/zt-group-apiserver/api/v1/group/get-group-action`, data)
}

/**
 * @describe 查询业务团购活动
 * @param {Object}
 */
export const getGroupOrder = data => {
    return axios.get(`/zt-group-apiserver/api/v1/group/get-group-orders`, data)
}

/**
 * @describe 批量查询用户团购单
 * @param {Object}
 */
export const handlerBatchgetUserGroupOrder = data => {
    return axios.post(
        `/zt-group-apiserver/api/v1/group/batchget-user-grouporder`,
        data
    )
}
