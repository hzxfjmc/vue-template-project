import Vue from 'vue'
import App from './app.vue'
import router from './router'
import store from './store'
import '@/utils/common'
import jsBridge from '@/utils/js-bridge.js'
Vue.config.productionTip = true

import routerAnalysis from '@/utils/common/plugins/router-analysis.js'
Vue.use(routerAnalysis, router)

Vue.prototype.$jsBridge = jsBridge

let init = async () => {
    try {
        // 刷新 初始化数据 数据持久化
        await store.dispatch('initDepositAction')
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
