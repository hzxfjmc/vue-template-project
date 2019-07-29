// 短线股王
import Vue from 'vue'
import '@market-utils/common'
import App from './App.vue'
import router from './router'
import { messages } from '@/utils/i18n-message/market/stub/index'
import { Dialog } from 'vant'
import setLangPlugin from '@market-plugins/setLangPlugin'
import uaPlugin from '@market-plugins/uaPlugin'
import jsBridgePlugin from '@market-plugins/jsBridgePlugin'
import htmlPlugin from '@market-plugins/htmlPlugin'
import sensorsPlugin from '@market-plugins/sensorsPlugin'
import config from '../0-config'

Vue.config.productionTip = false

Vue.use(Dialog)
Vue.use(setLangPlugin, { messages })
Vue.use(uaPlugin)
Vue.use(jsBridgePlugin)
Vue.use(htmlPlugin)
Vue.use(sensorsPlugin)

if (config.isMainland) {
    document.body.style.background = '#0b121f'
}

new Vue({
    router: router(),
    render: h => h(App)
}).$mount('#app')
