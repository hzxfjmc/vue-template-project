import Vue from 'vue'
import router from './router'
import App from './App.vue'
import { Dialog } from 'vant'
Vue.use(Dialog)
import vConsole from '@/utils/common/plugins/v-console.js'
Vue.use(vConsole)

import LS from '@/utils/local-storage.js'

import storeMethod from '@/store/index.js'
const store = storeMethod()
setTimeout(() => {
    console.log('main.js:>>>store:>>>', store.state)
}, 1000)

// import i18n from '@/utils/common/plugins/yx-i18n/index.js'
// Vue.use(i18n, {
//     lang: store.getters.lang,
//     messages: {
//         zhCHS: {},
//         zhCHT: {},
//         en: {}
//     }
// })

import '@/utils/common'

// mock
// import '@/mock/index.js'

// console.log(window.XMLHttpRequest)
let init = async () => {
    try {
        // 这是一个hack，已签名用户签名之后，会保留 isSigned 标记，
        // 这时如果切换新用户进来，该标记还存在，那么新用户进入不了签名页面
        // 这里需要做清除操作
        LS.remove('isSigned')
        // 本地签名同理
        LS.remove('signName')
        // 刷新 初始化数据 数据持久化1
        // 路由拦截器
        // await store.commit('bondIndex/setLang')
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
