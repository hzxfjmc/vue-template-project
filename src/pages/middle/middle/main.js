import Vue from 'vue'
import router from './router'
import App from './app.vue'
import '@/utils/common'
let init = async () => {
    try {
        // 刷新 初始化数据 数据持久化1
        // 路由拦截器
    } catch (e) {
        console.log(e) // 未登录
    } finally {
        new Vue({
            router,
            render: h => h(App)
        }).$mount('#app')
    }
}
init()
