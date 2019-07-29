import httpRequest from '@/utils/http-request'
import { API_BASE_URL } from '@/utils/DOMAIN.js'
const axios = new httpRequest(API_BASE_URL.JY)

export default {
    // 查询行情购买信息
    getQuotationPriceInfo(params) {
        return axios.getForm(
            `/product-server/api/get-quotation-price-info/v1`,
            params
        )
    },
    // 查询用户行情权限信息
    getUserQuotationInfo(params) {
        return axios.getForm(
            `/product-server/api/get-user-quotation-info-h5/v1`,
            params
        )
    },
    // 查询用户行情订单信息
    getUserQuotationOrderInfo(params) {
        return axios.post(
            `/product-server/api/get-user-quotation-info/v1`,
            params
        )
    },
    // 用户IP地址变化
    userIpChange(params) {
        return axios.getForm(`/product-server/api/user-ip-change/v1`, params)
    },
    // 行情购买
    userQuotationBuy(params) {
        return axios.post(`/product-server/api/user-quotation-buy/v1`, params)
    },
    // 查询恒生资金账户信息
    fetchCapitalHsfundaccountinfo(params) {
        return axios.post(
            `/stock-capital-server/api/hs-account-info/v1`,
            params
        )
    },
    // 判断用户是否进行过入金或转仓
    userFirstTrade(params) {
        return axios.getForm(`/product-server/api/user-first-trade/v1`, params)
    }
}
