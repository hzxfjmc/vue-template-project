import Vue from 'vue'
import App from './App.vue'
import router from './router'
import routerInterceptor from './router/router-interceptor'
import jsBridge from '@/utils/js-bridge'
import deposit from '../store/deposit'
import storeMethod from '@/store/index.js'
import imgToast from '@/components/img-toast/plugin.js'
import bankCardList from '@/biz-components/bank-card-list'
import bankList from '@/biz-components/bank-list'
import historyRecord from '@/biz-components/history-record'
import titleHeader from '@/biz-components/title-header'
import '@/utils/common'
import './const/index'
import common from './util/common'
import { messages } from '@/utils/i18n-message/open-account-hk/deposit/index.js'
import i18n from '@/utils/common/plugins/yx-i18n/index.js'
import { lang } from '@/utils/html-utils'
const store = storeMethod({ deposit })

Vue.use(i18n, {
    lang: lang,
    messages
})

Vue.config.productionTip = false
Vue.prototype.$jsBridge = jsBridge
Vue.prototype.$depositService = require('@/service/depositService.js').default
Vue.prototype.$common = common

Vue.component('bank-card-list', bankCardList)
Vue.component('bank-list', bankList)
Vue.component('history-record', historyRecord)
Vue.component('title-header', titleHeader)

Vue.use(imgToast)
let init = async () => {
    try {
        // 刷新 初始化数据 数据持久化
        await store.dispatch('initAction')
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
