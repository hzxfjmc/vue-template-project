import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    routes: [
        {
            name: 'cancel-email-hk',
            path: '/cancel-email-hk',
            meta: { title: '郵件退訂' },
            component: () =>
                import(`@/pages/template/email/views/cancel-email/hk.vue`)
        },
        {
            name: 'cancel-email-ch',
            path: '/cancel-email-ch',
            meta: { title: '邮件退订' },
            component: () =>
                import(`@/pages/template/email/views/cancel-email/ch.vue`)
        },
        {
            name: 'jumper',
            path: '/jumper/:type',
            meta: { title: 'loading...' },
            component: () =>
                import(`@/pages/template/email/views/jumper/index.vue`)
        }
    ]
})
