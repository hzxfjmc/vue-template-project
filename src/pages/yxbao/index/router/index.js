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
            meta: { title: 'home', auth: true, cs: true },
            component: () => import(`@/pages/yxbao/index/views/home/index.vue`)
        },
        {
            name: 'fund-details',
            path: '/fund-details',
            meta: { title: 'fundDetails', auth: true, cs: true },
            component: () =>
                import(`@/pages/yxbao/index/views/fund-details/index.vue`)
        },
        {
            name: 'orderList',
            path: '/order-list',
            meta: { title: 'orderList', auth: true, cs: true },
            component: () =>
                import(`@/pages/yxbao/index/views/order-list/index.vue`)
        },
        {
            name: 'orderDetails',
            path: '/order-details',
            meta: { title: 'orderDetails', auth: true, cs: true },
            component: () =>
                import(`@/pages/yxbao/index/views/yxbao-details/index.vue`)
        },
        {
            name: 'accountDetails',
            path: '/account-details',
            meta: { title: 'accountDetails', auth: true, cs: true },
            component: () =>
                import(
                    `@/pages/yxbao/index/views/yxbao-details/account-details.vue`
                )
        },
        {
            name: 'tradeRule',
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
            name: 'incomeDetails',
            path: '/income-details',
            meta: { title: 'incomeDetails', auth: true, cs: true },
            component: () =>
                import(`@/pages/yxbao/index/views/income-details/index.vue`)
        }
    ]
})
