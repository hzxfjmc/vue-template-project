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
            component: () => import(`@/pages/funds/index/views/index/index.vue`)
        },
        {
            name: 'funds-introduce',
            path: '/funds-introduce',
            meta: { title: '基金介绍' },
            component: () =>
                import(`@/pages/funds/index/views/funds-Introduce/index.vue`)
        },
        {
            name: 'funds-details',
            path: '/funds-details',
            meta: { title: '基金详情' },
            component: () =>
                import(`@/pages/funds/index/views/funds-details/index.vue`)
        },
        {
            name: 'risk-assessment',
            path: '/risk-assessment',
            meta: { title: '基金详情' },
            component: () =>
                import(`@/pages/funds/index/views/risk-assessment/index.vue`)
        },
        {
            name: 'risk-assessment-result',
            path: '/risk-assessment-result',
            meta: { title: '测评结果' },
            component: () =>
                import(
                    `@/pages/funds/index/views/risk-assessment-result/index.vue`
                )
        }
    ]
})
