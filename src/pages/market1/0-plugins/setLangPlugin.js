import i18n from '@/utils/common/plugins/yx-i18n/index'
import { getLang } from '@/utils/html-utils'

// 设置语言插件
export default {
    install(Vue, { messages }) {
        const langType = getLang()
        const langMap = new Map([['1', 'zhCHS'], ['2', 'zhCHT'], ['3', 'en']])
        let lang = langMap.get(langType) || 'zhCHT' // 默认繁体

        // 相应语言包不存在时，降级为繁体
        if (Object.keys(messages).indexOf(lang) <= -1) {
            lang = 'zhCHT'
        }

        Vue.use(i18n, {
            lang,
            messages
        })
    }
}
