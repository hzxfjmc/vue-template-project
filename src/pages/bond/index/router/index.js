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
            name: 'bond-detail',
            path: '/bond-detail',
            meta: { title: '债券详情' },
            component: () =>
                import(`@/pages/bond/index/views/bond-detail/index.vue`)
        },
        {
            name: 'transaction-sell',
            path: '/transaction-sell',
            meta: { title: '卖出' },
            component: () =>
                import(`@/pages/bond/index/views/transaction-sell/index.vue`)
        },
        {
            name: 'transaction-buy',
            path: '/transaction-buy',
            meta: { title: '买入' },
            component: () =>
                import(`@/pages/bond/index/views/transaction-buy/index.vue`)
        },
        {
            name: 'risk-warning',
            path: '/risk-warning',
            meta: { title: '港美股开户' },
            component: () =>
                import(`@/pages/bond/index/views/risk-warning/index.vue`)
        },
        {
            name: 'risk-assessment',
            path: '/risk-assessment',
            meta: { title: '港美股开户' },
            component: () =>
                import(`@/pages/bond/index/views/risk-assessment/index.vue`)
        },
        {
            name: 'risk-appropriate-result',
            path: '/risk-appropriate-result',
            meta: { title: '港美股开户' },
            component: () =>
                import(
                    `@/pages/bond/index/views/risk-appropriate-result/index.vue`
                )
        }
    ]
})
