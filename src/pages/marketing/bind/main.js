import Vue from 'vue'
import App from './app.vue'
import router from './router'
import '@/utils/common'
Vue.config.productionTip = true
import vConsole from '@/utils/common/plugins/v-console.js'
Vue.use(vConsole)

import routerAnalysis from '@/utils/common/plugins/router-analysis.js'
Vue.use(routerAnalysis, router)

let init = async () => {
    new Vue({
        router,
        render: h => h(App)
    }).$mount('#app')
}
init()
