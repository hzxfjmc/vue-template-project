import Vue from 'vue'
import '../0-utils/common'
import './utils/setLang'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
    render: h => h(App)
}).$mount('#app')
