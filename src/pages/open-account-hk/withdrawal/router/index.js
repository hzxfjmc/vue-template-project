import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            meta: { title: 'titleWithdrawal', cs: true },
            component: () =>
                import(`@/pages/open-account-hk/withdrawal/views/home/index.vue`)
        },
        {
            path: '/online',
            name: 'online',
            meta: { title: 'titleWithdrawal', cs: true },
            component: () =>
                import(`@/pages/open-account-hk/withdrawal/views/home/withdrawal-online.vue`)
        },
        {
            path: '/offline',
            name: 'offline',
            meta: { title: 'titleWithdrawal', cs: true },
            component: () =>
                import(`@/pages/open-account-hk/withdrawal/views/home/withdrawal-offline.vue`)
        },
        {
            path: '/funds',
            name: 'funds',
            meta: { title: 'titleWithdrawal', cs: true },
            component: () =>
                import(`@/pages/open-account-hk/withdrawal/views/funds/index.vue`)
        },
        {
            path: '/account',
            name: 'account',
            meta: { title: 'titleManageAccount', cs: true },
            component: () =>
                import(`@/pages/open-account-hk/withdrawal/views/account/index.vue`)
        },
        {
            path: '/manage-account',
            name: 'manage-account',
            meta: { title: 'titleManageAccount', cs: true },
            component: () =>
                import(`@/pages/open-account-hk/withdrawal/views/account/manage-account.vue`)
        }
    ]
})
