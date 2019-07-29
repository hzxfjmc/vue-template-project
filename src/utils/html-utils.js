// 是否ios环境
export const isIOS = /(ipad)|(iphone)/i.test(navigator.userAgent)
// 是否安卓环境
export const isAndroid = /android/i.test(navigator.userAgent)
export const isYouxinApp = /yxzq/i.test(navigator.userAgent)
export const isYouxinAndroid = /yxzq-android/i.test(navigator.userAgent)
export const isYouxinIos = /yxzq-ios/i.test(navigator.userAgent)
export const isWeixin = /micromessenger/i.test(navigator.userAgent)

// 获取APP设置userAgent中的值
export const getUaValue = key => {
    const getUrlParam = name => {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
        let loc = decodeURIComponent(window.location.search)
        let r = loc.substr(1).match(reg)
        if (r != null) return unescape(r[2])
        return null
    }

    const reg = new RegExp(`(^|\\s)${key}\\/[^\\s]+`)
    const match = navigator.userAgent.match(reg)
    let value = match ? match[0].split('/')[1] : getUrlParam(key)
    value = value || ''
    return value
}

// const initReg = (str, point) => {
//     let reg = new RegExp(`(?<=${point}\\/)\\d+`)
//     let result = reg.exec(str)
//     return result && result[0]
// }

// 是否关闭美股交易，0：不关闭，1：关闭 默认不关闭
const usStockTradeCloseValue = getUaValue('usStockTradeClose')

export const usStockTradeClose = usStockTradeCloseValue === '1'

const appTypeRs = getUaValue('appType')

// alert(appTypeRs)

const langTypeRS = getUaValue('langType')

export const channelId = getUaValue('channelId') || ''

// alert(langTypeRS)
export const appType = {
    // 大陆app 友信智投
    Ch: appTypeRs === '1',
    // 香港App uSsmart
    Hk: appTypeRs === '2'
}
export const langType = {
    // 簡體
    Ch: langTypeRS === '1',
    // 繁體
    Hk: langTypeRS === '2',
    // 英文
    En: langTypeRS === '3'
}

let langMap = new Map([['1', 'zhCHS'], ['2', 'zhCHT'], ['3', 'en']])

export const lang = langMap.get(getUaValue('langType')) || 'en'
// 设置标题
export const setTitle = title => {
    document.title = title
    if (/(ipad)|(iphone)/i.test(navigator.userAgent)) {
        const i = document.createElement('iframe')
        i.src = '/favicon.ico'
        i.style.display = 'none'
        i.onload = function() {
            setTimeout(function() {
                i.remove()
            })
        }
        document.body.appendChild(i)
    }
}

/**
 * 获取语言类型
 * @returns {string} 1简体, 2繁体,3英文
 */
export const getLang = () => {
    return getUaValue('langType') || '2'
}

/**
 * 获取股票涨跌颜色类型
 * @returns {string} 1红涨绿跌，2绿涨红跌；默认大陆：红涨绿跌， 港版：绿涨红跌
 */
export const getStockColorType = () => {
    const lang = getLang()
    return getUaValue('stockColorType') || (+lang === 1 ? '1' : '2')
}

/**
 * 获取app版本（大陆版/港版）
 * @returns {string|string} 1大陆版，2港版
 */
export const getAppType = () => {
    return getUaValue('appType') || '2'
}
