import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    scrollBehavior() {
        return { x: 0, y: 0 }
    },
    routes: [
        {
            name: 'home',
            path: '/',
            meta: { title: 'uMoney', auth: true, cs: true },
            component: () => import(`@/pages/yxbao/index/views/home/index.vue`)
        },
        {
            name: 'yxbao-details',
            path: '/yxbao-details',
            meta: { title: 'fundDetails', auth: true, cs: true },
            component: () =>
                import(`@/pages/yxbao/index/views/yxbao-details/index.vue`)
        },
        {
            name: 'order-list',
            path: '/order-list',
            meta: { title: 'orderList', auth: true, cs: true },
            component: () =>
                import(`@/pages/yxbao/index/views/order-list/index.vue`)
        },
        {
            name: 'order-details',
            path: '/order-details',
            meta: { title: 'accountDetails', auth: true, cs: true },
            component: () =>
                import(
                    `@/pages/yxbao/index/views/yxbao-order-details/index.vue`
                )
        },
        {
            name: 'account-details',
            path: '/account-details',
            meta: { title: 'orderDetails', auth: true, cs: true },
            component: () =>
                import(
                    `@/pages/yxbao/index/views/yxbao-order-details/account-details.vue`
                )
        },
        {
            name: 'trade-rule',
            path: '/trade-rule',
            meta: { title: 'tradeRule', auth: true, cs: true },
            component: () =>
                import(`@/pages/yxbao/index/views/trade-rule/index.vue`)
        },
        {
            name: 'transfer-into',
            path: '/transfer-into',
            meta: { title: 'transferInto', auth: true, cs: true },
            component: () =>
                import(`@/pages/yxbao/index/views/transfer-into-out/into.vue`)
        },
        {
            name: 'transfer-out',
            path: '/transfer-out',
            meta: { title: 'transferOut', auth: true, cs: true },
            component: () =>
                import(`@/pages/yxbao/index/views/transfer-into-out/out.vue`)
        },
        {
            name: 'income-details',
            path: '/income-details',
            meta: { title: 'incomeDetails', auth: true, cs: true },
            component: () =>
                import(`@/pages/yxbao/index/views/income-details/index.vue`)
        },
        {
            name: 'risk-assessment',
            path: '/risk-assessment',
            meta: { title: 'riskAssessment', auth: true, cs: true },
            component: () =>
                import(`@/pages/yxbao/index/views/risk-assessment/index.vue`)
        },
        {
            name: 'risk-assessment-result',
            path: '/risk-assessment-result',
            meta: { title: 'riskAsessmentResult', auth: true, cs: true },
            component: () =>
                import(
                    `@/pages/yxbao/index/views/risk-assessment-result/index.vue`
                )
        },
        {
            name: 'risk-appropriate-result',
            path: '/risk-appropriate-result',
            meta: { title: 'riskAppropriateResult', auth: true, cs: true },
            component: () =>
                import(
                    `@/pages/yxbao/index/views/risk-appropriate-result/index.vue`
                )
        },
        {
            name: 'open-permissions',
            path: '/open-permissions',
            meta: { title: 'openPermissions', auth: true, cs: true },
            component: () =>
                import(`@/pages/yxbao/index/views/open-permissions/index.vue`)
        },
        {
            name: 'yxbao-desc',
            path: '/yxbao-desc',
            meta: { title: 'yxbaoDesc', auth: true, cs: true },
            component: () =>
                import(`@/pages/yxbao/index/views/yxbao-desc/index.vue`)
        }
    ]
})
