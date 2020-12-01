import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    scrollBehavior() {
        return { x: 0, y: 0 }
    },
    routes: [
        {
            name: 'fund-index',
            path: '/',
            meta: { title: 'home', auth: true, search: true },
            component: () =>
                import(`@/pages/fund/index/views/fund-index/index.vue`)
        },
        {
            name: 'index',
            path: '/index',
            meta: { title: 'fundList', auth: true, search: true },
            component: () => import(`@/pages/fund/index/views/index/index.vue`)
        },
        {
            name: 'fund-risk-level',
            path: '/fund-risk-level',
            meta: { title: 'fundRiskLevels', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/fund-risk-level/index.vue`)
        },
        {
            name: 'fund-introduce',
            path: '/fund-introduce',
            meta: { title: 'fundIntroduce', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/fund-Introduce/index.vue`)
        },
        {
            name: 'trade-rule',
            path: '/trade-rule',
            meta: { title: 'tradeRule', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/trade-rule/index.vue`)
        },
        {
            name: 'fund-files',
            path: '/fund-files',
            meta: { title: 'fundFiles', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/fund-files/index.vue`)
        },
        {
            name: 'fund-details',
            path: '/fund-details',
            meta: { title: 'fundDetails', auth: true, share: true },
            component: () =>
                import(`@/pages/fund/index/views/fund-details/index.vue`)
        },
        {
            name: 'hold-fund-details',
            path: '/hold-fund-details',
            meta: { title: 'fundAccount', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/fund-details/hold-index.vue`)
        },
        {
            name: 'risk-assessment',
            path: '/risk-assessment',
            meta: { title: 'riskAssessment', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/risk-assessment/index.vue`)
        },
        {
            name: 'risk-assessment-result',
            path: '/risk-assessment-result',
            meta: { title: 'riskAsessmentResult', auth: true, cs: true },
            component: () =>
                import(
                    `@/pages/fund/index/views/risk-assessment-result/index.vue`
                )
        },
        {
            name: 'risk-appropriate-result',
            path: '/risk-appropriate-result',
            meta: { title: 'riskAppropriateResult', auth: true, cs: true },
            component: () =>
                import(
                    `@/pages/fund/index/views/risk-appropriate-result/index.vue`
                )
        },
        {
            name: 'open-permissions',
            path: '/open-permissions',
            meta: { title: 'openPermissions', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/open-permissions/index.vue`)
        },
        {
            name: 'order-record',
            path: '/order-record',
            meta: { title: 'orderRecord', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/order-record/index.vue`)
        },
        {
            name: 'fund-subscribe',
            path: '/fund-subscribe',
            meta: { title: 'fundSubscribe', auth: true, cs: true },
            component: () =>
                import(
                    `@/pages/fund/index/views/subscribe-redemption/subscribe.vue`
                )
        },
        {
            name: 'fund-redemption',
            path: '/fund-redemption',
            meta: { title: 'fundRedemption', auth: true, cs: true },
            component: () =>
                import(
                    `@/pages/fund/index/views/subscribe-redemption/redemption.vue`
                )
        },
        {
            name: 'order-record-detail',
            path: '/order-record-detail',
            meta: { title: 'orderRecordDetail', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/order-record-detail/index.vue`)
        },
        {
            name: 'income-details',
            path: '/income-details',
            meta: { title: 'incomeDetails', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/income-details/index.vue`)
        },
        {
            name: 'home',
            path: '/home',
            meta: { title: 'home', auth: true, search: true },
            component: () =>
                import(`@/pages/fund/index/views/fund-index/index.vue`)
        },
        {
            name: 'fund-order-list',
            path: '/fund-order-list',
            meta: { title: 'fundOrderList', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/fund-order-list/index.vue`)
        },
        {
            name: 'fund-account',
            path: '/fund-account',
            meta: { title: 'fundAccount', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/fund-account/index.vue`)
        },
        {
            name: 'fund-historical',
            path: '/fund-historical',
            meta: { title: 'fundHistorical', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/fund-historical/index.vue`)
        },
        {
            name: 'fund-index',
            path: '/fund-index',
            meta: { title: 'home', auth: true, search: true },
            component: () =>
                import(`@/pages/fund/index/views/fund-index/index.vue`)
        },
        {
            name: 'fund-historical-list',
            path: '/fund-historical-list',
            meta: { title: 'fundHistoricalList', auth: true, cs: true },
            component: () =>
                import(
                    `@/pages/fund/index/views/fund-historical-list/index.vue`
                )
        },
        {
            name: 'declare-agreement',
            path: '/declare-agreement',
            meta: { title: 'declareTitle', auth: true, cs: true },
            component: () =>
                import(
                    `@/pages/fund/index/views/fund-index/declare-agreement.vue`
                )
        },
        {
            name: 'income-list',
            path: '/income-list',
            meta: { title: 'incomeDetails', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/income-list/index.vue`)
        },
        {
            name: 'fixed-investment',
            path: '/fixed-investment',
            meta: { title: 'A2', auth: true, cs: true },
            component: () =>
                import(
                    `@/pages/fund/index/views/fixed-investment/subscribe.vue`
                )
        },
        {
            name: 'investment-result',
            path: '/investment-result',
            meta: { title: 'investmentResult', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/investment-result/index.vue`)
        },
        {
            name: 'my-investment',
            path: '/my-investment',
            meta: { title: 'myInvestment', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/my-investment/index.vue`)
        },
        {
            name: 'investment-detail',
            path: '/investment-detail',
            meta: { title: 'investmentDetail', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/investment-detail/index.vue`)
        },
        {
            name: 'transaction-record',
            path: '/transaction-record',
            meta: { title: 'InvestmenttransactionRecord', auth: true },
            component: () =>
                import(`@/pages/fund/index/views/transaction-record/index.vue`)
        },
        {
            name: 'fund-analyze-data',
            path: '/fund-analyze-data',
            meta: { title: 'fundAnalyzeData', auth: true, cs: true },
            component: () =>
                import(
                    `@/pages/fund/index/views/fund-details/components/fund-analyze-data/index.vue`
                )
        },
        {
            name: 'fund-exclusive-area',
            path: '/fund-exclusive-area',
            meta: { title: 'exclusiveArea', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/fund-exclusive-area/index.vue`)
        },
        {
            name: 'column-product-list',
            path: '/column-product-list',
            meta: { title: 'productList', auth: true },
            component: () =>
                import(
                    `@/pages/fund/index/views/fund-exclusive-area/column-product-list.vue`
                )
        },
        {
            name: 'fund-invest-combination',
            path: '/fund-invest-combination',
            meta: { title: 'fundInvestCombination', auth: true, cs: true },
            component: () =>
                import(
                    `@/pages/fund/index/views/fund-details/components/fund-invest-combination/index.vue`
                )
        },
        {
            name: 'fund-notic',
            path: '/fund-notic',
            meta: { title: 'fundNotic', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/fund-notic/index.vue`)
        },
        {
            name: 'fund-notic-detail',
            path: '/fund-notic-detail',
            meta: { title: 'fundNoticDetail', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/fund-notic/detail.vue`)
        },
        {
            name: 'fund-company',
            path: '/fund-company',
            meta: { title: 'fundCompany', auth: true, cs: true },
            component: () =>
                import(`@/pages/fund/index/views/fund-company/index.vue`)
        }
    ]
})
