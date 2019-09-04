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
            path: '/index',
            meta: { title: '精品基金' },
            component: () => import(`@/pages/fund/index/views/index/index.vue`)
        },
        {
            name: 'fund-introduce',
            path: '/fund-introduce',
            meta: { title: '基金介绍' },
            component: () =>
                import(`@/pages/fund/index/views/fund-Introduce/index.vue`)
        },
        {
            name: 'trade-rule',
            path: '/trade-rule',
            meta: { title: '基金介绍' },
            component: () =>
                import(`@/pages/fund/index/views/trade-rule/index.vue`)
        },
        {
            name: 'fund-files',
            path: '/fund-files',
            meta: { title: '相关文件' },
            component: () =>
                import(`@/pages/fund/index/views/fund-files/index.vue`)
        },
        {
            name: 'fund-details',
            path: '/fund-details',
            meta: { title: '基金详情' },
            component: () =>
                import(`@/pages/fund/index/views/fund-details/index.vue`)
        },
        {
            name: 'open-permissions',
            path: '/open-permissions',
            meta: { title: '基金权限开通' },
            component: () =>
                import(`@/pages/fund/index/views/open-permissions/index.vue`)
        },
        {
            name: 'order-record',
            path: '/order-record',
            meta: { title: '订单记录' },
            component: () =>
                import(`@/pages/fund/index/views/order-record/index.vue`)
        },
        {
            name: 'fund-subscribe',
            path: '/fund-subscribe',
            meta: { title: '基金申购' },
            component: () =>
                import(`@/pages/fund/index/views/subscribe/index.vue`)
        },
        {
            name: 'fund-redemption',
            path: '/fund-redemption',
            meta: { title: '基金赎回' },
            component: () =>
                import(`@/pages/fund/index/views/redemption/index.vue`)
        },
        {
            name: 'order-record-detail',
            path: '/order-record-detail',
            meta: { title: '订单记录详情' },
            component: () =>
                import(`@/pages/fund/index/views/order-record-detail/index.vue`)
        }
    ]
})
