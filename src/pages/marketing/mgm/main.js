import Vue from 'vue'
import App from './app.vue'
import router from './router'
import Intercept from './router/router-intercept.js'
import store from '../store'
import '@/utils/common'
import jsBridge from '@/utils/js-bridge.js'
import vConsole from '@/utils/common/plugins/v-console.js'

import routerAnalysis from '@/utils/common/plugins/router-analysis.js'
Vue.use(routerAnalysis, router)

Vue.use(vConsole)
Vue.config.productionTip = true

Vue.prototype.$jsBridge = jsBridge

let init = async () => {
    try {
        // 刷新 初始化数据 数据持久化
        await store.dispatch('initDepositAction')
    } catch (e) {
        console.log(e) // 未登录
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
