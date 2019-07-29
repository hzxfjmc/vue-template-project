import Vue from 'vue'
import App from './app.vue'
import router from './router'
import '@/utils/common'
import jsBridge from '@/utils/js-bridge.js'
import routerAnalysis from '@/utils/common/plugins/router-analysis.js'
Vue.use(routerAnalysis, router)

Vue.config.productionTip = true

Vue.prototype.$jsBridge = jsBridge

let init = async () => {
    new Vue({
        router,
        render: h => h(App)
    }).$mount('#app')
}
init()
