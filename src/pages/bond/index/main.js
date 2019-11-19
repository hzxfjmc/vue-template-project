import Vue from 'vue'
import router from './router'
import App from './transfer.vue'
import { Dialog } from 'vant'
Vue.use(Dialog)
import vConsole from '@/utils/common/plugins/v-console.js'
Vue.use(vConsole)

import LS from '@/utils/local-storage.js'

import storeMethod from '@/store/index.js'
import bondIndex from '@/store/modules/bond-index'
const store = storeMethod({ bondIndex })
setTimeout(() => {
    console.log('main.js:>>>store:>>>', store.state)
}, 1000)

import i18n from '@/utils/common/plugins/yx-i18n/index.js'
import bondI18n from '@/utils/i18n-message/bond/index'
Vue.use(i18n, {
    lang: 'zhCHT' || store.getters.lang,
    messages: bondI18n
})

import '@/utils/common'

// mock
// import '@/mock/index.js'

// console.log(window.XMLHttpRequest)
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
