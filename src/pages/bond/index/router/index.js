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
            name: 'transanction-sell',
            path: '/transanction-sell',
            meta: { title: '卖出' },
            component: () =>
                import(`@/pages/bond/index/views/transanction-sell/index.vue`)
        },
        {
            name: 'transanction-buy',
            path: '/transanction-buy',
            meta: { title: '买入' },
            component: () =>
                import(`@/pages/bond/index/views/transanction-buy/index.vue`)
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
            path: '/risk-warning',
            meta: { title: '港美股开户' },
            component: () =>
                import(`@/pages/bond/index/views/risk-assessment/index.vue`)
        },
        {
            name: 'risk-assessment-result',
            path: '/risk-assessment-result',
            meta: { title: '港美股开户' },
            component: () =>
                import(
                    `@/pages/bond/index/views/risk-assessment-result/index.vue`
                )
        }
    ]
})
