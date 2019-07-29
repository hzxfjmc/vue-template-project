import Vue from 'vue'
import App from './App.vue'
import router from './router'
import routerInterceptor from './router/router-interceptor'
import '@/utils/common'
import jsBridge from '@/utils/js-bridge.js'
import deposit from './../store/deposit'
import storeMethod from '@/store/index.js'
import imgToast from '@/components/img-toast/plugin.js'
import bankCardList from '@/biz-components/bank-card-list'
import bankListDl from '@/biz-components/bank-list-dl'
import historyRecord from '@/biz-components/history-record'
import titleHeader from '@/biz-components/title-header'
import i18n from '@/utils/common/plugins/yx-i18n/index.js'
import { messages } from '@/utils/i18n-message/open-account/deposit/index.js'
const store = storeMethod({ deposit })
import vConsole from '@/utils/common/plugins/v-console.js'
Vue.use(vConsole)
Vue.use(i18n, {
    lang: 'zhCHS',
    messages
})
Vue.config.productionTip = false
Vue.prototype.$userService = require('@/service/user-server.js').default
Vue.prototype.$accountService = require('@/service/user-account-server.js').default
Vue.prototype.$depositService = require('@/service/depositService.js').default
Vue.prototype.$constant = require('./constant.js').default
Vue.prototype.$jsBridge = jsBridge

Vue.component('bank-card-list', bankCardList)
Vue.component('bank-list-dl', bankListDl)
Vue.component('history-record', historyRecord)
Vue.component('title-header', titleHeader)

Vue.use(imgToast)
let init = async () => {
    try {
        // 刷新 初始化数据 数据持久化
        await store.dispatch('initAction')
        await store.dispatch('deposit/initDepositAction')
        // 路由拦截器
    } catch (e) {
        console.log(e) // 未登录
    } finally {
        routerInterceptor(router)
        new Vue({
            router,
            store,
            render: h => h(App)
        }).$mount('#app')
    }
}
init()
