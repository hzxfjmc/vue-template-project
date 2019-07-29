// 消息中心
import Vue from 'vue'
import '@market-utils/common'
import App from './App.vue'
import router from './router'
import { messages } from '@/utils/i18n-message/market/msg-center/index'
import { Dialog, Toast } from 'vant'
import setLangPlugin from '@market-plugins/setLangPlugin'
import jsBridgePlugin from '@market-plugins/jsBridgePlugin'
import htmlPlugin from '@market-plugins/htmlPlugin'
import sensorsPlugin from '@market-plugins/sensorsPlugin'

Vue.config.productionTip = false

Vue.use(Dialog)
Vue.use(Toast)
Vue.use(setLangPlugin, { messages })
Vue.use(jsBridgePlugin)
Vue.use(htmlPlugin)
Vue.use(sensorsPlugin)

new Vue({
    router: router(),
    render: h => h(App)
}).$mount('#app')
