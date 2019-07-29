// 静态页面
import Vue from 'vue'
import '@market-utils/common'
import App from './App.vue'
import router from './router'
import { messages } from '@/utils/i18n-message/market/static-page/index'
import setLangPlugin from '@market-plugins/setLangPlugin'
import htmlPlugin from '@market-plugins/htmlPlugin'
import uaPlugin from '@market-plugins/uaPlugin'

Vue.config.productionTip = false

Vue.use(setLangPlugin, { messages })
Vue.use(htmlPlugin)
Vue.use(uaPlugin)

new Vue({
    router: router(),
    render: h => h(App)
}).$mount('#app')
