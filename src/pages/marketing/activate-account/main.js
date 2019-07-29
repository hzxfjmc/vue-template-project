import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/utils/common'

import routerAnalysis from '@/utils/common/plugins/router-analysis.js'
Vue.use(routerAnalysis, router)

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
