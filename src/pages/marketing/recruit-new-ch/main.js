import Vue from 'vue'
import App from './app.vue'
import router from './router'
import '@/utils/common'
import storeMethod from '@/store'
import jsBridge from '@/utils/js-bridge.js'
import routerAnalysis from '@/utils/common/plugins/router-analysis.js'
Vue.use(routerAnalysis, router)

// import vConsole from '@/utils/common/plugins/vConsole.js'
// Vue.use(vConsole)
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
