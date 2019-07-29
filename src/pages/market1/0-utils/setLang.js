import Vue from 'vue'
import i18n from '@/utils/common/plugins/yx-i18n/index'
import { getLang } from '@/utils/html-utils'

// 多语言
export default messages => {
    const langType = getLang()
    const langMap = new Map([['1', 'zhCHS'], ['2', 'zhCHT']])
    const lang = langMap.get(langType) || 'zhCHT' // 默认繁体
    Vue.use(i18n, {
        lang,
        messages
    })
}
