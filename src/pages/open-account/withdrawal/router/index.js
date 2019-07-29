import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            meta: { title: '提取资金', cs: true },
            component: () =>
                import(`@/pages/open-account/withdrawal/views/home/index.vue`)
        },
        {
            path: '/account',
            name: 'addAccount',
            meta: { title: '提取资金', cs: true },
            component: () =>
                import(
                    `@/pages/open-account/withdrawal/views/account/index.vue`
                )
        },
        {
            path: '/account',
            name: 'editAccount',
            meta: { title: '提取资金', cs: true },
            component: () =>
                import(
                    `@/pages/open-account/withdrawal/views/account/index.vue`
                )
        },
        {
            path: '/manage-account',
            name: 'manageAccount',
            meta: { title: '管理收款账户', cs: true },
            component: () =>
                import(
                    `@/pages/open-account/withdrawal/views/account/manage-account.vue`
                )
        },
        {
            path: '/funds',
            name: 'funds',
            meta: { title: '提取资金', cs: true },
            component: () =>
                import(`@/pages/open-account/withdrawal/views/funds/index.vue`)
        }
    ]
})
