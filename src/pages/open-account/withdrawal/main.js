import Vue from 'vue'
import App from './App.vue'
import router from './router'
import routerInterceptor from './router/router-interceptor'
import '@/utils/common'
import jsBridge from '@/utils/js-bridge.js'
import withdrawal from './../store/withdrawal'
import storeMethod from '@/store/index.js'
const store = storeMethod({ withdrawal })
import imgToast from '@/components/img-toast/plugin.js'
Vue.config.productionTip = false
Vue.prototype.$userService = require('@/service/user-server.js').default
Vue.prototype.$accountService = require('@/service/user-account-server.js').default
Vue.prototype.$constant = require('./constant.js').default
Vue.prototype.$jsBridge = jsBridge

Vue.use(imgToast)
let init = async () => {
    try {
        // 刷新 初始化数据 数据持久化
        await store.dispatch('initAction')
        await store.dispatch('withdrawal/initWithdrawalAction')
    } catch (e) {
        console.log(e) // 未登录
    } finally {
        routerInterceptor(router, store)
        new Vue({
            router,
            store,
            render: h => h(App)
        }).$mount('#app')
    }
}
init()
