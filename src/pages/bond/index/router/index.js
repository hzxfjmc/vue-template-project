import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    // 不保留浏览器滚动位置
    scrollBehavior() {
        return { x: 0, y: 0 }
    },
    routes: [
        {
            name: 'index',
            path: '/',
            meta: { title: '债券' },
            component: () => import(`@/pages/bond/index/views/index/index.vue`)
        },
        {
            name: 'bond-detail',
            path: '/bond-detail',
            meta: { title: '债券交易' },
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
            meta: { title: '风险提示' },
            component: () =>
                import(`@/pages/bond/index/views/risk-warning/index.vue`)
        },
        {
            name: 'risk-assessment',
            path: '/risk-assessment',
            meta: { title: '风险测评' },
            component: () =>
                import(`@/pages/bond/index/views/risk-assessment/index.vue`)
        },
        {
            name: 'risk-appropriate-result',
            path: '/risk-appropriate-result',
            meta: { title: '产品匹配' },
            component: () =>
                import(
                    `@/pages/bond/index/views/risk-appropriate-result/index.vue`
                )
        },
        {
            name: 'risk-assessment-result',
            path: '/risk-assessment-result',
            meta: { title: '测评结果' },
            component: () =>
                import(
                    `@/pages/bond/index/views/risk-assessment-result/index.vue`
                )
        }
    ]
})
