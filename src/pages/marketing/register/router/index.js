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
                    `@/pages/marketing/register/views/activity-index/index.vue`
                )
        }
    ]
})
