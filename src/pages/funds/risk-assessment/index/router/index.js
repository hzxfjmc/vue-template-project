import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    scrollBehavior() {
        return { x: 0, y: 0 }
    },
    routes: [
        {
            name: 'risk-assessment',
            path: '/risk-assessment',
            meta: { title: '基金详情' },
            component: () =>
                import(
                    `@/pages/funds/risk-assessment/index/views/risk-assessment/index.vue`
                )
        }
    ]
})
