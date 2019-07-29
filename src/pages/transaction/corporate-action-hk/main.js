import Vue from 'vue'
import App from './app.vue'
import router from './router'
import '@/utils/common'
import storeMethod from '@/store'
import Intercept from './router/router-intercept.js'
import jsBridge from '@/utils/js-bridge.js'
const store = storeMethod()
import { messages } from '@/utils/i18n-message/transaction/corporate-action-hk/index.js'
import i18n from '@/utils/common/plugins/yx-i18n/index.js'
import { lang } from '@/utils/html-utils'
Vue.use(i18n, {
    lang: lang,
    messages
})

import vConsole from '@/utils/common/plugins/v-console.js'
Vue.use(vConsole)

Vue.config.productionTip = true
Vue.prototype.$jsBridge = jsBridge
let init = async () => {
    try {
        // 刷新 初始化數据 數据持久化1
        await store.dispatch('initAction')
        // 路由拦截器
    } catch (e) {
        // 未登录
    } finally {
        Intercept(router, store)
        new Vue({
            router,
            store,
            render: h => h(App)
        }).$mount('#app')
    }
}
init()
