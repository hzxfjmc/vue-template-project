import Vue from 'vue'
import router from './router'
import App from './App.vue'
import storeMethod from '@/store/index.js'
const store = storeMethod()
// console.log(store)
// import i18n from '@/utils/common/plugins/yx-i18n/index.js'
// Vue.use(i18n, {})

import '@/utils/common'

// mock
// import '@/mock/index.js'
// console.log(window.XMLHttpRequest)
let init = async () => {
    try {
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
