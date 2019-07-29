import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/utils/common'
import './const'
import apply from '@/store/modules/open-account-apply.js'
import storeMethod from '@/store/index.js'
import Intercept from './router/router-intercept.js'
import jsBridge from '@/utils/js-bridge.js'

import i18n from '@/utils/common/plugins/yx-i18n/index.js'
import vConsole from '@/utils/common/plugins/v-console.js'
import { messages } from '@/utils/i18n-message/open-account-hk/apply/index.js'
Vue.use(i18n, {
    lang: 'zhCHS',
    messages
})

Vue.use(vConsole)
const store = storeMethod({ apply })
Vue.config.productionTip = true
Vue.prototype.$userService = require('@/service/user-server.js').default
Vue.prototype.$accountService = require('@/service/user-account-server.js').default
Vue.prototype.$configService = require('@/service/config-manager.js').default
Vue.prototype.$newService = require('@/service/newService.js').default
Vue.prototype.$jsBridge = jsBridge

let init = async () => {
    try {
        // 刷新 初始化数据 数据持久化1
        await store.dispatch('apply/initApplyAction')
        // 路由拦截器
    } catch (e) {
        console.log(e) // 未登录
    } finally {
        Intercept(router, store)
        new Vue({
            router,
            store,
            render: h => h(App)
        }).$mount('#app')
    }
}
init()
