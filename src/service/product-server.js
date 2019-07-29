/**
 * 奖励中心相关接口
 * @ Author QIUWEI
 * @ Date 2019/04/9
 */
import httpRequest from '@/utils/http-request'
import { API_BASE_URL } from '@/utils/DOMAIN.js'
const axios = new httpRequest()
const imgAxios = new httpRequest(API_BASE_URL.HZ)
// 获取用户优惠券列表(
export function couponList(params) {
    return axios.get('/product-server/api/user-coupon-list/v1', params)
}
// 用户使用优惠券
export function couponUse(params) {
    return axios.get('/product-server/api/user-coupon-use/v1', params)
}
//银行卡四要素验证
export function bankCardVerification(params) {
    return axios.post('/product-server/api/bank-card-verification/v1', params)
}
//提交用户提现信息
export function submitWithdrawRecord(params) {
    return axios.post('/product-server/api/submit-withdraw-record/v1', params)
}

//客户当前套擦展示
export function userPackageView() {
    return axios.post('/product-server/api/user_package_view/v1')
}

//客户套擦切换
export function userPackageSwitch(packageCode) {
    return axios.post('/product-server/api/user_package_switch/v1', {
        packageCode
    })
}

//客户温馨提示
export function userPackageHomeSwitchTip() {
    return axios.post('/product-server/api/user_package_Home_switch_tip')
}

//活动中心广告列表
export function getAdList(params) {
    return imgAxios.get(
        `/news-configserver/api/v1/query/other_advertisement`,
        params
    )
}

//开户信息
export function getOpenAccountBasicInfo() {
    return axios.getForm(
        `/user-account-server/api/get-cust-open-account-info/v1`
    )
}
//获取用户是否已开户
export function getOpeningStatus() {
    return axios.get('/product-server/api/get-opening-status/v1')
}
//获取用户已提交信息
export function getWithdrawRecord(params) {
    return axios.get('/product-server/api/get-withdraw-record/v1', params)
}

//获取用户已提交信息
export function userCouponConditionList(params) {
    return axios.getForm(
        '/product-server/api/user-coupon-condition-list/v1',
        params
    )
}

//通过微信现金红包使用现金券
export function withdrawByWechat(params) {
    return axios.post('/product-server/api/withdraw-by-wechat/v1', params)
}
// 绑定微信后获取是否有未使用的现金券
export function getRestCoupon() {
    return axios.post('/product-server/web/has-rmb-coupons/v1')
}
