import Vue from 'vue'
import '../0-utils/common'
import './utils/setLang'
import App from './App.vue'
import { setTitle } from '@/utils/html-utils'

const $t = Vue.prototype.$t
setTitle($t('smartChoice'))

Vue.config.productionTip = false

new Vue({
    render: h => h(App)
}).$mount('#app')
