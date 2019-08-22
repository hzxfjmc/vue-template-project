import { getUaValue } from '@/utils/html-utils'

const appType = getUaValue('appType') || '1'
const langType = getUaValue('langType') || '1'
const langMap = new Map([['1', 'zhCHS'], ['2', 'zhCHT'], ['3', 'en']])
const lang = langMap.get(langType) || 'zhCHS'

let config = {
    env: '', // 环境：localhost、development、test、production
    isWechat: /micromessenger/i.test(navigator.userAgent),
    hzHost: '', // 行情资讯接口服务器
    jyHost: '', // 交易接口服务器
    lang, // zhCHS、zhCHT、en
    appType, // 1-内地版、2-香港版
    langType, // 1-简体、2-繁体、3-英文
    isMainland: appType === '1',
    isHK: appType === '2',
    isLangZhCn: langType === '1',
    isLangZhHk: langType === '2',
    isLangEn: langType === '3',
    stockColorType: getUaValue('stockColorType') || appType // 1-红涨绿跌，2-绿涨红跌
}

let envConfig = {
    // 本地环境
    localhost: {
        env: 'localhost'
    },
    // 线上开发环境
    'm-dev': {
        env: 'development',
        hzHost: 'http://hz-dev.yxzq.com',
        jyHost: 'http://jy-dev.yxzq.com'
    },
    // 线上测试环境
    'm-sit': {
        env: 'test',
        hzHost: 'http://hz-sit.yxzq.com',
        jyHost: 'http://jy-sit.yxzq.com'
    },
    // 线上测试环境
    'm1-sit': {
        env: 'test1',
        hzHost: 'http://hz1-sit.yxzq.com',
        jyHost: 'http://jy1-sit.yxzq.com'
    },
    // uat环境
    'm-uat': {
        env: 'uat',
        hzHost: 'http://hz-uat.yxzq.com',
        jyHost: 'http://jy-uat.yxzq.com'
    },
    // uat1环境(预审用)
    'm1-uat': {
        env: 'uat1',
        hzHost: 'https://hz1-uat.yxzq.com',
        jyHost: 'https://jy1-uat.yxzq.com'
    },
    // 香港体验环境
    'm-hk': {
        env: 'hk',
        hzHost: 'https://hz-hk.yxzq.com',
        jyHost: 'https://jy-hk.yxzq.com'
    },
    // 线上生产环境
    m: {
        env: 'production',
        hzHost: 'https://hz.yxzq.com',
        jyHost: 'https://jy.yxzq.com'
    }
}

// 离线环境修正host
const isOffline = location.protocol === 'file:'
let offlineHostname
if (isOffline) {
    const offlineEnv = getUaValue('environment')
    offlineHostname = {
        dev: 'm-dev.yxzq.com',
        sit: 'm-sit.yxzq.com',
        uat: 'm-uat.yxzq.com',
        uat1: 'm1-uat.yxzq.com',
        mock: 'm-sit.yxzq.com',
        prd: 'm.yxzq.com'
    }[offlineEnv]
}

const hostname = offlineHostname ? offlineHostname : location.hostname
const flag = hostname.split('.')[0]
config = { ...config, ...envConfig[flag] }
export default config
