import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    scrollBehavior() {
        return { x: 0, y: 0 }
    },
    routes: [
        {
            name: 'index',
            path: '/',
            meta: { title: 'helpCenter', auth: true, cs: true },
            component: () => import(`@/pages/fund/index/views/index/index.vue`)
        },
        {
            name: 'index',
            path: '/index',
            meta: { title: 'helpCenter', auth: true, cs: true },
            component: () => import(`@/pages/fund/index/views/index/index.vue`)
        },
        {
            name: 'fund-introduce',
            path: '/fund-introduce',
            meta: { title: 'helpCenter', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/fund-Introduce/index.vue`)
        },
        {
            name: 'trade-rule',
            path: '/trade-rule',
            meta: { title: 'helpCenter', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/trade-rule/index.vue`)
        },
        {
            name: 'fund-files',
            path: '/fund-files',
            meta: { title: 'helpCenter', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/fund-files/index.vue`)
        },
        {
            name: 'fund-details',
            path: '/fund-details',
            meta: { title: 'helpCenter', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/fund-details/index.vue`)
        },
        {
            name: 'risk-assessment',
            path: '/risk-assessment',
            meta: { title: 'helpCenter', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/risk-assessment/index.vue`)
        },
        {
            name: 'risk-assessment-result',
            path: '/risk-assessment-result',
            meta: { title: 'helpCenter', auth: true, cs: true },
            component: () =>
                import(
                    `@/pages/fund/index/views/risk-assessment-result/index.vue`
                )
        },
        {
            name: 'risk-appropriate-result',
            path: '/risk-appropriate-result',
            meta: { title: 'helpCenter', auth: true, cs: true },
            component: () =>
                import(
                    `@/pages/fund/index/views/risk-appropriate-result/index.vue`
                )
        },
        {
            name: 'open-permissions',
            path: '/open-permissions',
            meta: { title: 'helpCenter', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/open-permissions/index.vue`)
        },
        {
            name: 'order-record',
            path: '/order-record',
            meta: { title: 'helpCenter', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/order-record/index.vue`)
        },
        {
            name: 'fund-subscribe',
            path: '/fund-subscribe',
            meta: { title: 'helpCenter', auth: true, cs: true },
            component: () =>
                import(
                    `@/pages/fund/index/views/subscribe-redemption/subscribe.vue`
                )
        },
        {
            name: 'fund-redemption',
            path: '/fund-redemption',
            meta: { title: 'helpCenter', auth: true, cs: true },
            component: () =>
                import(
                    `@/pages/fund/index/views/subscribe-redemption/redemption.vue`
                )
        },
        {
            name: 'order-record-detail',
            path: '/order-record-detail',
            meta: { title: 'helpCenter', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/order-record-detail/index.vue`)
        }
    ]
})
