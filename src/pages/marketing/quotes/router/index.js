import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    routes: [
        {
            name: 'index',
            path: '/index',
            meta: { title: 'index.title' },
            component: () =>
                import(`@/pages/marketing/quotes/views/index/index.vue`)
        },
        {
            name: 'buy',
            path: '/buy',
            meta: { title: '友信智投' },
            component: () =>
                import(`@/pages/marketing/quotes/views/buy/index.vue`)
        },
        {
            name: 'buyRecord',
            path: '/buy-record',
            meta: { title: '友信智投' },
            component: () =>
                import(`@/pages/marketing/quotes/views/buy-record/index.vue`)
        }
    ]
})
