import Vue from 'vue'
import { messages } from '@/utils/i18n-message/quotes'
import i18n from '@/utils/common/plugins/yx-i18n/index.js'
// import jsBridge from '@/utils/js-bridge'

import { lang } from '@/utils/html-utils'

// 默认简体
// let lang =
//     (jsBridge.langType.Ch && 'zhCHS') ||
//     (jsBridge.langType.Hk && 'zhCHT') ||
//     (jsBridge.langType.En && 'zhEN') ||
//     'zhEN'

Vue.use(i18n, {
    lang: lang,
    messages
})
