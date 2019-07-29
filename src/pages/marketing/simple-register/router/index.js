import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    routes: [
        {
            name: 'index',
            path: '/index',
            alias: '//',
            meta: { title: '首页', shareLink: window.location.href },
            component: () =>
                import(
                    `@/pages/marketing/simple-register/views/activity-index/index.vue`
                )
        }
    ]
})
