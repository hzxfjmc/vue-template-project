import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    routes: [
        {
            name: 'index',
            path: '/index',
            alias: '//',
            meta: { title: '绑定友信智投账号' },
            component: () =>
                import(`@/pages/marketing/bind/views/index/index.vue`)
        }
    ]
})
