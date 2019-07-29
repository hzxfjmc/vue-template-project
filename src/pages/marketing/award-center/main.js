import Vue from 'vue'
import App from './app.vue'
import { messages } from '@/utils/i18n-message/marketing/award-center/index.js'
import i18n from '@/utils/common/plugins/yx-i18n/index.js'
import { lang } from '@/utils/html-utils'
Vue.use(i18n, {
    lang: lang,
    messages
})
import router from './router'
import '@/utils/common'
import storeMethod from '@/store'
import jsBridge from '@/utils/js-bridge.js'

const store = storeMethod()
Vue.config.productionTip = true

Vue.prototype.$jsBridge = jsBridge
import vConsole from '@/utils/common/plugins/v-console.js'
Vue.use(vConsole)
let init = async () => {
    try {
        // 刷新 初始化数据 数据持久化1
        await store.dispatch('initAction')
        // 路由拦截器
    } catch (e) {
        console.log(e) // 未登录
    } finally {
        new Vue({
            router,
            store,
            render: h => h(App)
        }).$mount('#app')
    }
}
init()
