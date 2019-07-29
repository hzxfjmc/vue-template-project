// import JSBridge from '@/utils/js-bridge'
// import { getUaValue } from '@/utils/html-utils'

const ORIGIN = `${location.protocol}//${location.hostname}${location.port &&
    ':' + location.port}`

let IS_LOCAL_DEV =
    (location.port && location.port !== '80') ||
    location.host.indexOf('localhost') === 0 ||
    location.host.indexOf('10.210') > -1 ||
    location.host.indexOf('dev.junscript') > -1
let IS_DEV = location.host.indexOf('m-dev.') === 0
let IS_SIT = location.host.indexOf('m-sit.') === 0
let IS_SIT1 = location.host.indexOf('m1-sit.') === 0
let IS_UAT = location.host.indexOf('m-uat.') === 0
let IS_UAT1 = location.host.indexOf('m1-uat.') === 0
let IS_PRO = location.host.indexOf('m.yxzq.com') === 0
let IS_PRO_HK = location.host.indexOf('m-hk.') === 0
let IS_USMART = location.host.indexOf('m.usmartsecurities.com') === 0 //facebook登录及分享域名需要改成https://m.usmartsecurities.com

// if (JSBridge.isOfflineYouxinApp) {
//     const offlineEnv = getUaValue('environment')
//     IS_DEV = offlineEnv === 'dev'
//     IS_SIT = offlineEnv === 'sit'
//     IS_UAT = offlineEnv === 'uat'
//     IS_PRO = offlineEnv === 'prd'
// }

export const ENV = (() => {
    if (IS_DEV) {
        return 'DEV'
    } else if (IS_LOCAL_DEV) {
        return 'LOCAL'
    } else if (IS_SIT) {
        return 'SIT'
    } else if (IS_SIT1) {
        return 'SIT1'
    } else if (IS_UAT) {
        return 'UAT'
    } else if (IS_UAT1) {
        return 'UAT1'
    } else if (IS_PRO) {
        return 'PRO'
    } else if (IS_PRO_HK) {
        return 'PRO_HK'
    } else if (IS_USMART) {
        return 'USMART'
    }
})()

export const BUCKET_ENV = (() => {
    if (IS_DEV) {
        return 'dev'
    } else if (IS_LOCAL_DEV) {
        return 'dev'
    } else if (IS_SIT) {
        return 'sit'
    } else if (IS_SIT1) {
        return 'sit'
    } else if (IS_UAT) {
        return 'uat'
    } else if (IS_UAT1) {
        return 'uat'
    } else if (IS_PRO || IS_PRO_HK) {
        return 'prd'
    }
})()

const MAP_API = {
    LOCAL: {
        JY: ORIGIN,
        HZ: ORIGIN,
        ANALYSIS: 'http://10.55.4.19:8080'
    },
    DEV: {
        JY: 'http://jy-dev.yxzq.com',
        HZ: 'http://hz-dev.yxzq.com',
        WECHAT_APPID: 'wx91f4b186fba28ab1',
        WEIBO_APPID: '64902029',
        ANALYSIS: 'http://10.55.4.19:8080'
    },
    SIT: {
        JY: 'http://jy-sit.yxzq.com',
        HZ: 'http://hz-sit.yxzq.com',
        WECHAT_APPID: 'wx332a1e234a6b259e',
        WEIBO_APPID: '2546066516',
        ANALYSIS: 'http://10.55.4.19:8080'
    },
    SIT1: {
        JY: 'http://jy1-sit.yxzq.com',
        HZ: 'http://hz1-sit.yxzq.com',
        WECHAT_APPID: 'wx332a1e234a6b259e',
        WEIBO_APPID: '2546066516',
        ANALYSIS: 'http://10.55.4.19:8080'
    },
    UAT: {
        JY: 'http://jy-uat.yxzq.com',
        HZ: 'http://hz-uat.yxzq.com',
        WECHAT_APPID: 'wx14edbd47cefa369e', // 此处需要配置高尚的测试好 to do
        WEIBO_APPID: '4242804640',
        ANALYSIS: 'http://10.55.4.19:8080'
    },
    UAT1: {
        JY: 'https://jy1-uat.yxzq.com',
        HZ: 'https://hz1-uat.yxzq.com',
        WECHAT_APPID: 'wx14edbd47cefa369e', // 此处需要配置高尚的测试好 to do
        WEIBO_APPID: '4242804640',
        ANALYSIS: 'http://10.55.4.19:8080'
    },
    PRO: {
        JY: 'https://jy.yxzq.com',
        HZ: 'https://hz.yxzq.com',
        WECHAT_APPID: 'wxa47031c91b5bb4b7',
        WEIBO_APPID: '1560173683',
        ANALYSIS: 'http://sc-h5.yxzq.com'
    },
    PRO_HK: {
        JY: 'https://jy-hk.yxzq.com',
        HZ: 'https://hz-hk.yxzq.com',
        WECHAT_APPID: 'wxa47031c91b5bb4b7',
        WEIBO_APPID: '1560173683',
        ANALYSIS: 'http://sc-h5.yxzq.com'
    },
    USMART: {
        JY: 'https://jy.yxzq.com',
        HZ: 'https://hz.yxzq.com',
        WECHAT_APPID: 'wxe5de22541f2908ae',
        WEIBO_APPID: '1560173683',
        ANALYSIS: 'http://sc-h5.yxzq.com'
    }
}

export const API_BASE_URL = MAP_API[ENV]
export default {
    IS_LOCAL_DEV,
    IS_DEV,
    IS_SIT,
    IS_SIT1,
    IS_UAT,
    IS_UAT1,
    IS_PRO,
    IS_PRO_HK,
    IS_USMART,
    API_BASE_URL
}
