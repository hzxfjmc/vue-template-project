import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    routes: [
        {
            name: 'index',
            path: '/index',
            alias: '//',
            meta: { title: '邀请好友拿壕礼' },
            component: () =>
                import(`@/pages/marketing/mgm-ch/views/activity-index/index.vue`)
        },
        {
            name: 'poster',
            path: '/poster',
            meta: { title: '邀请好友拿壕礼' },
            component: () =>
                import(`@/pages/marketing/mgm-ch/views/activity-index/index.vue`)
        },
        {
            name: 'record',
            path: '/record',
            meta: { title: '邀请好友拿壕礼' },
            component: () =>
                import(`@/pages/marketing/mgm-ch/views/record/index.vue`)
        }
    ]
})
