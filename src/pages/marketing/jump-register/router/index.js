import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    routes: [
        {
            name: 'index',
            path: '/index',
            alias: '//',
            meta: { title: '友信智投新人礼', shareLink: window.location.href },
            component: () =>
                import(
                    `@/pages/marketing/jump-register/views/activity-index/index.vue`
                )
        },
        {
            name: 'register',
            path: '/register',
            meta: {
                title: '友信智投新人礼',
                shareLink:
                    window.location.origin +
                    '/webapp/marketing/jump-register.html' +
                    window.location.search
            },
            component: () =>
                import(
                    `@/pages/marketing/jump-register/views/register/index.vue`
                )
        }
    ]
})
