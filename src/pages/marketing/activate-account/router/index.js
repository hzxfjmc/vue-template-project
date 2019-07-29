import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            meta: { title: '激活账号' },
            component: () =>
                import(
                    `@/pages/marketing/activate-account/views/home/index.vue`
                )
        },
        {
            path: '/result',
            name: 'result',
            meta: { title: '激活账号' },
            component: () =>
                import(
                    `@/pages/marketing/activate-account/views/result/index.vue`
                )
        }
    ]
})
