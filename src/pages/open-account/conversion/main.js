import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/utils/common'
import conversion from './../store/conversion'
import storeMethod from '@/store/index.js'
import LS from '@/utils/local-storage.js'
import vConsole from '@/utils/common/plugins/v-console.js'
import jsBridge from '@/utils/js-bridge.js'

Vue.use(vConsole)
const store = storeMethod({ conversion })
Vue.config.productionTip = false
Vue.prototype.$stockTransferService = require('@/service/stockTransferService.js').default
Vue.prototype.$quotesService = require('@/service/quotesService.js').default
Vue.prototype.$jsBridge = jsBridge
LS.remove('conversion/form')

let init = async () => {
    try {
        // 刷新 初始化数据 数据持久化
        await store.dispatch('initAction')
        await store.dispatch('getUserInfoAction', 'api')

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
