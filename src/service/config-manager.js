import httpRequest from '@/utils/http-request'
import damian, { API_BASE_URL } from '@/utils/DOMAIN.js'
const api = new httpRequest(API_BASE_URL.JY + '/config-manager/api')
export default {
    getAppSystem(serviceIdList) {
        return api.post(`/get-app-system/v1`, { serviceIdList })
    },
    getAppSystemKh(serviceIdList) {
        return api.post(`/get-app-system-kh/v1`, { serviceIdList })
    }
}
export function getAppSystem(serviceIdList) {
    return api.post(`/get-app-system/v1`, { serviceIdList })
}
export function getCostemp() {
    let env = damian.IS_PRO ? 'PRD' : 'DEV'
    return api.get(`/get-cred-app/v1`, { appIndentifier: env })
}
export const bankInfoHKSelect = () => {
    return api.getForm(`/bank-info-hk-select/v1`)
}

export const bankInfoHKSelectInfo = bankCode => {
    return api.getForm(`/bank-info-hk-select-info/v1`, { bankCode })
}

export const cfgProSelect = serviceCode => {
    return api.post(`/cfg-pro-select/v1?serviceCode=${serviceCode}`)
}

export const customerStatusSelect = () => {
    return api.getForm(`/customer-status-select/v1`)
}

export const kindlyReminderSelect = data => {
    return api.getForm(`/kindly-reminder-select/v1`, data)
}

// APP查询香港银行列表
export function bankInfoHkSelect(data) {
    return api.get(`/bank-info-hk-select/v1`, data)
}
