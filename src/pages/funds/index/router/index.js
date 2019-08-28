import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    scrollBehavior() {
        return { x: 0, y: 0 }
    },
    routes: [
        {
            name: 'funds-details',
            path: '/funds-details',
            meta: { title: '基金详情' },
            component: () =>
                import(`@/pages/funds/index/views/funds-details/index.vue`)
        }
    ]
})
