import Vue from 'vue'
import router from './router'
import App from './App.vue'

import { Dialog, PullRefresh } from 'vant'
import vConsole from '@/utils/common/plugins/v-console.js'
import LS from '@/utils/local-storage.js'
import { messages } from '@/utils/i18n-message/fund/index.js'
import storeMethod from '@/store/index.js'
import i18n from '@/utils/common/plugins/yx-i18n/index.js'
import jsBridge from '@/utils/js-bridge'
import imgToast from '@/components/img-toast/index.js'

const store = storeMethod()

Vue.use(vConsole)
Vue.use(Dialog)
Vue.use(PullRefresh)
Vue.use(i18n, {
    lang: store.getters.lang,
    messages
})
Vue.use(imgToast)

Vue.prototype.$jsBridge = jsBridge

import '@/utils/common'

// mock
// import '@/mock/index.js'

let init = async () => {
    try {
        // 切换新用户进来，签名页面,这里需要做清除操作
        LS.remove('signName')
        // 刷新 初始化数据 数据持久化1
        // 路由拦截器
        await store.dispatch('initAction')
        // await store.dispatch('bondIndex/init')
    } catch (e) {
        console.log(e) // 未登录
    } finally {
        new Vue({
            store,
            router,
            render: h => h(App)
        }).$mount('#app')
    }
}
init()
