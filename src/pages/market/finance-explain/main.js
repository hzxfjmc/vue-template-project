import Vue from 'vue'
import '../0-utils/common'
import App from './App.vue'
import { setTitle } from '@/utils/html-utils'
setTitle('财务字段说明')

Vue.config.productionTip = false

new Vue({
    render: h => h(App)
}).$mount('#app')
