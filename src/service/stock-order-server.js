/**
 * 公司行动相关接口
 * @ Author QIUWEI
 * @ Date 2019/02/26
 */
import httpRequest from '@/utils/http-request'
const axios = new httpRequest()
const guid = () => {
    var d = Date.now()
    if (
        typeof performance !== 'undefined' &&
        typeof performance.now === 'function'
    ) {
        d += performance.now() //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
}

// 客户申请修改接口
export function applyModify(params) {
    return axios.post('/stock-order-server/api/action-modify/v1', params, {
        headers: {
            'X-Request-Id': guid()
        }
    })
}
// 客户申请接口
export function apply(params) {
    return axios.post('/stock-order-server/api/action-apply/v1', params, {
        headers: {
            'X-Request-Id': guid()
        }
    })
}
// 客户申请记录详情
export function getDetail(params) {
    return axios.post('/stock-order-server/api/action-record-info/v1', params, {
        headers: {
            'X-Request-Id': guid()
        }
    })
}
// 客户申请记录列表
export function getList(params) {
    return axios.post('/stock-order-server/api/action-record-list/v1', params, {
        headers: {
            'X-Request-Id': guid()
        }
    })
}
// 公司行动信息查询
export function getAction(params) {
    return axios.post('/stock-order-server/api/action-info/v1', params, {
        headers: {
            'X-Request-Id': guid()
        }
    })
}
// 查询恒生资金账户信息
export function MoneyCanTake(params) {
    return axios.post('/stock-capital-server/api/hs-account-info/v1', params, {
        headers: { 'X-Request-Id': guid() }
    })
}
//页面计算联动接口
export function caculate(params) {
    return axios.post(
        '/stock-order-server/api/calculation-linkage/v1',
        params,
        { headers: { 'X-Request-Id': guid() } }
    )
}
