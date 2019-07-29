import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
    routes: [
        {
            name: 'ch',
            path: '/ch',
            meta: { title: 'awardCenterTitle' },
            component: () =>
                import(
                    `@/pages/marketing/award-center/views/ch-award/index.vue`
                )
        },
        {
            name: 'activity-center',
            path: '/activity-center',
            meta: { title: 'activityCenterTitle' },
            component: () =>
                import(
                    `@/pages/marketing/award-center/views/activitys/index.vue`
                )
        },
        {
            name: 'withdrawrmb',
            path: '/withdraw-rmb',
            meta: { title: '提现指引' },
            component: () =>
                import(
                    `@/pages/marketing/award-center/views/wechat-withdraw/index.vue`
                )
        }
    ]
})
