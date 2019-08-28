import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    scrollBehavior() {
        return { x: 0, y: 0 }
    },
    routes: [
        {
            name: 'risk-warning',
            path: '/risk-warning',
            meta: { title: '基金详情' },
            component: () =>
                import(
                    `@/pages/risk-warning/index/views/risk-warning/index.vue`
                )
        }
    ]
})
