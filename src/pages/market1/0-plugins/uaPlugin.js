import { getLang, getStockColorType, getAppType } from '@/utils/html-utils'

// ua 插件
export default {
    install(Vue) {
        const appType = +getAppType()
        const lang = +getLang()
        const stockColorType = +getStockColorType()
        Vue.prototype.$ua = {
            lang, // 语言类型：1简体, 2繁体, 3英文
            isCn: lang === 1,
            isHk: lang === 2,
            isEn: lang === 3,

            appType, // app类型：1大陆版，2港版
            isMainland: appType === 1, // 大陆版
            isHK: appType === 2, // 港版

            stockColorType, // 股票涨跌颜色：1红涨绿跌，2绿涨红跌
            isRedRiseGreenDrop: stockColorType === 1,
            isGreenRiseRedDrop: stockColorType === 2
        }
    }
}
