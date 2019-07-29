import Vue from 'vue'
import App from './app.vue'
import router from './router'
import '@/utils/common'
import jsBridge from '@/utils/js-bridge.js'
Vue.config.productionTip = true
import vConsole from '@/utils/common/plugins/v-console.js'
Vue.use(vConsole)

import routerAnalysis from '@/utils/common/plugins/router-analysis.js'
Vue.use(routerAnalysis, router)

Vue.prototype.$jsBridge = jsBridge

let init = async () => {
    new Vue({
        router,
        render: h => h(App)
    }).$mount('#app')
}
init()
