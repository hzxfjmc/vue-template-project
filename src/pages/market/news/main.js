import Vue from 'vue'
import '../0-utils/common'
import './utils/setLang'
import App from './App.vue'
import { setTitle } from '@/utils/html-utils'
import dayjs from 'dayjs'
import config from '../0-config'
import { Dialog } from 'vant'

Vue.config.productionTip = false

Vue.use(Dialog)
const $t = Vue.prototype.$t
setTitle($t('newsDetails'))

Vue.prototype.$timeFormat = function(time) {
    if (time) {
        const timeStr = dayjs(time).format('HH:mm')
        let dayStr
        switch (dayjs(time).format('YYYY-MM-DD')) {
            case dayjs().format('YYYY-MM-DD'):
                dayStr = this.$t('today')
                break
            case dayjs()
                .subtract(1, 'day')
                .format('YYYY-MM-DD'):
                dayStr = this.$t('yesterday')
                break
            default:
                dayStr = dayjs(time).format('YYYY-MM-DD')
                break
        }
        return `${dayStr} ${timeStr}`
    } else {
        return ''
    }
}

const logoUrl = config.isMainland
    ? `${location.origin}/webapp/market/images/logo-mainland.png?v=2019070501`
    : `${location.origin}/webapp/market/images/logo-hk.png?v=2019070501`

new Vue({
    data: {
        logoUrl,
        isMainland: config.isMainland,
        appType: config.appType,
        langType: config.langType
    },
    render: h => h(App)
}).$mount('#app')
