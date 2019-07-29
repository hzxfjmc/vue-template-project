import Vue from 'vue'
import App from './App.vue'
import router from './router'
import storeMethod from '@/store'
import '@/utils/common'
import { Dialog } from 'vant'
import jsBridge from '@/utils/js-bridge.js'
import vConsole from '@/utils/common/plugins/v-console.js'
Vue.use(vConsole)

import routerAnalysis from '@/utils/common/plugins/router-analysis.js'
Vue.use(routerAnalysis, router)

let store = storeMethod()
Vue.config.productionTip = false
Vue.prototype.$jsBridge = jsBridge
Vue.use(Dialog)

let init = async () => {
    try {
        // 刷新 初始化数据 数据持久化
        await store.dispatch('initAction')
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
