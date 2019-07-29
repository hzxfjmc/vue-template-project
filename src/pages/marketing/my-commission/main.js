import Vue from 'vue'
import App from './app.vue'
import router from './router'
import '@/utils/common'
import storeMethod from '@/store'
import jsBridge from '@/utils/js-bridge.js'

import i18n from '@/utils/common/plugins/yx-i18n/index.js'
import { messages } from '@/utils/i18n-message/open-account-hk/apply/index.js'

import { lang } from '@/utils/html-utils.js'
Vue.use(i18n, {
    lang,
    messages
})

const store = storeMethod()
Vue.config.productionTip = true

Vue.prototype.$jsBridge = jsBridge

let init = async () => {
    try {
        // 刷新 初始化数据 数据持久化1
        await store.dispatch('initAction')
        // 路由拦截器
    } catch (e) {
        console.log(e) // 未登录
    } finally {
        new Vue({
            router,
            store,
            render: h => h(App)
        }).$mount('#app')
    }
}
init()
