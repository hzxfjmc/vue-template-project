import httpRequest from '@/utils/http-request'
import { DOMAIN } from 'yx-base-h5'
const axios = new httpRequest(DOMAIN.API_BASE_URL.HZ)

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

/**
 * @describe 创建拼团单
 * @param {Object}
 */
export const createGroupOrder = data => {
    return axios.post(
        `/zt-group-apiserver/api/v1/group/create-group-order`,
        data
    )
}

/**
 * @describe 获取拼团广告订单
 * @param {Object}
 */
export const getAdGroupOrders = data => {
    return axios.get(
        `/zt-group-apiserver/api/v1/group/get-ad-group-orders`,
        data
    )
}
