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
                import(`@/pages/yxbao/index/views/order-details/index.vue`)
        }
    ]
})
