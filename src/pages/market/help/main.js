import Vue from 'vue'
import '../0-utils/common'
import App from './App.vue'
import router from './router'
import store from './store/index'
import { setTitle } from '@/utils/html-utils'

// 语言
import config from '../0-config'
import { messages } from '@/utils/i18n-message/market/help/index.js'
import i18n from '@/utils/common/plugins/yx-i18n/index.js'

Vue.use(i18n, {
    lang: config.lang,
    messages
})

setTitle(messages[config.lang].helpCenter)

Vue.config.productionTip = false

import { Dialog } from 'vant'
Vue.use(Dialog)
store.dispatch('langTypeAction', config.lang)
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
