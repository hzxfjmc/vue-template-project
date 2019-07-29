import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    routes: [
        {
            name: 'index',
            path: '/index',
            meta: { title: '友信智投' },
            component: () =>
                import(`@/pages/marketing/ground-push/views/index/index.vue`)
        },
        {
            name: 'login',
            path: '/login',
            meta: { title: '友信智投' },
            component: () =>
                import(`@/pages/marketing/ground-push/views/login/index.vue`)
        },
        {
            name: 'apply',
            path: '/apply',
            meta: { title: '友信智投' },
            component: () =>
                import(`@/pages/marketing/ground-push/views/apply/index.vue`)
        },
        {
            name: 'result',
            path: '/result',
            meta: { title: '友信智投', auth: true },
            component: () =>
                import(`@/pages/marketing/ground-push/views/result/index.vue`)
        },
        {
            name: 'mission',
            path: '/mission',
            meta: { title: '友信智投', auth: true },
            component: () =>
                import(`@/pages/marketing/ground-push/views/mission/index.vue`)
        },
        {
            name: 'missionDetail',
            path: '/mission/:id',
            meta: { title: '友信智投', auth: true },
            component: () =>
                import(`@/pages/marketing/ground-push/views/mission/detail/index.vue`)
        },
        {
            name: 'modify-password',
            path: '/modify-password',
            meta: { title: '友信智投' },
            component: () =>
                import(`@/pages/marketing/ground-push/views/modify-password/index.vue`)
        }
    ]
})
