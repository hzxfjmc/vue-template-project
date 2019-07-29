import Vue from 'vue'
import { messages } from '@/utils/i18n-message/market/monthly/index'
import i18n from '@/utils/common/plugins/yx-i18n/index'
import config from '../../0-config'

Vue.use(i18n, {
    lang: config.lang,
    messages
})
