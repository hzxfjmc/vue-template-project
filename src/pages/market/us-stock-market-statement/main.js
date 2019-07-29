// 美股行情声明
import Vue from 'vue'
import '@market-utils/common'
import App from './App.vue'
import router from './router'
import { messages } from '@/utils/i18n-message/market/us-stock-market-statement/index'
import { Dialog } from 'vant'
import setLangPlugin from '@market-plugins/setLangPlugin'
import uaPlugin from '@market-plugins/uaPlugin'
import jsBridgePlugin from '@market-plugins/jsBridgePlugin'
import htmlPlugin from '@market-plugins/htmlPlugin'

Vue.config.productionTip = false

Vue.use(Dialog)
Vue.use(setLangPlugin, { messages })
Vue.use(uaPlugin)
Vue.use(jsBridgePlugin)
Vue.use(htmlPlugin)

new Vue({
    router: router(),
    render: h => h(App)
}).$mount('#app')
