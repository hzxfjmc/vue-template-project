import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            meta: { title: 'titleDeposit', cs: true },
            component: () =>
                import(`@/pages/open-account-hk/deposit/views/home/index.vue`)
        },
        {
            path: '/online',
            name: 'online',
            meta: { title: 'titleDeposit', cs: true },
            component: () =>
                import(`@/pages/open-account-hk/deposit/views/home/deposit-online.vue`)
        },
        {
            path: '/offline',
            name: 'offline',
            meta: { title: 'titleDeposit', cs: true },
            component: () =>
                import(`@/pages/open-account-hk/deposit/views/home/deposit-offline.vue`)
        },
        {
            path: '/manage-account',
            name: 'manage-account',
            meta: { title: 'titleManageAccount', cs: true },
            component: () =>
                import(`@/pages/open-account-hk/deposit/views/account/manage-account.vue`)
        },
        {
            path: '/add-account',
            name: 'add-account',
            meta: { title: 'titleAddAccount', cs: true },
            component: () =>
                import(`@/pages/open-account-hk/deposit/views/account/add.vue`)
        },
        {
            path: '/submit-record/:log?',
            name: 'submit-record',
            meta: { title: 'titleDeposit', cs: true },
            component: () =>
                import(`@/pages/open-account-hk/apply/views/submit-record/index.vue`)
        },
        {
            path: '/collection-information/:bankCode',
            name: 'collection-information',
            meta: { title: 'titleDeposit', cs: true },
            component: () =>
                import(`@/pages/open-account-hk/apply/views/collection-infomation/index.vue`)
        }
    ]
})
