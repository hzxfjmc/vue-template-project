import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    routes: [
        {
            name: 'index',
            path: '/',
            meta: { title: '债券首页' },
            component: () => import(`@/pages/bond/index/views/index/index.vue`)
        },
        {
            name: 'bond-list',
            path: '/bond-list',
            meta: { title: '债券详情' },
            component: () =>
                import(`@/pages/bond/index/views/bond-detail/index.vue`)
        }
    ]
})
