import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    routes: [
        {
            name: 'activity-index',
            path: '/index',
            alias: '//',
            meta: { title: '邀請好友 獲賞現金', ismgm: 'yes' },
            component: () =>
                import(`@/pages/marketing/mgm/views/activity-index/index.vue`)
        },
        {
            name: 'poster',
            path: '/poster',
            meta: { title: '邀請好友 獲賞現金', ismgm: 'yes' },
            component: () =>
                import(`@/pages/marketing/mgm/views/poster/index.vue`)
        },
        {
            name: 'explain',
            path: '/explain',
            meta: { title: '邀請好友 獲賞現金', ismgm: 'yes' },
            component: () =>
                import(`@/pages/marketing/mgm/views/activity-explain/index.vue`)
        },
        {
            name: 'register',
            path: '/register',
            meta: { title: '邀請好友 獲賞現金', ismgm: 'yes' },
            component: () =>
                import(`@/pages/marketing/mgm/views/register/index.vue`)
        },
        {
            name: 'done',
            path: '/done',
            meta: { title: '邀請好友 獲賞現金', ismgm: 'yes' },
            component: () =>
                import(`@/pages/marketing/mgm/views/register-done/index.vue`)
        }
    ]
})
