import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    routes: [
        {
            path: '/test',
            name: 'test',
            meta: { title: '测试页' },
            component: () =>
                import(`@/pages/open-account/deposit/views/home/test.vue`)
        },
        {
            path: '/',
            name: 'home',
            meta: { title: '入金', cs: true },
            component: () =>
                import(`@/pages/open-account/deposit/views/home/index.vue`)
        },
        {
            path: '/choose-method',
            name: 'choose-method',
            meta: { title: '入金', cs: true },
            component: () =>
                import(
                    `@/pages/open-account/deposit/views/home/choose-method.vue`
                )
        },
        {
            path: '/hk-transfer-method',
            name: 'hk-transfer-method',
            meta: { title: '入金', cs: true },
            component: () =>
                import(
                    `@/pages/open-account/deposit/views/home/hk-transfer-method.vue`
                )
        },
        {
            path: '/mainland-transfer-method',
            name: 'mainland-transfer-method',
            meta: { title: '入金', cs: true },
            component: () =>
                import(
                    `@/pages/open-account/deposit/views/home/mainland-transfer-method.vue`
                )
        },
        {
            path: '/transfer-fps',
            name: 'transfer-fps',
            meta: { title: '入金', cs: true },
            component: () =>
                import(
                    `@/pages/open-account/deposit/views/home/transfer-fps.vue`
                )
        },
        {
            path: '/transfer-money',
            name: 'transfer-money',
            meta: { title: '入金', cs: true },
            component: () =>
                import(
                    `@/pages/open-account/deposit/views/home/transfer-money.vue`
                )
        },
        {
            path: '/transfer-money-mainland',
            name: 'transfer-money-mainland',
            meta: { title: '入金', cs: true },
            component: () =>
                import(
                    `@/pages/open-account/deposit/views/home/transfer-money-mainland.vue`
                )
        },
        {
            path: '/deposit-notice',
            name: 'deposit-notice',
            meta: { title: '入金', cs: true },
            component: () =>
                import(
                    `@/pages/open-account/deposit/views/home/deposit-notice.vue`
                )
        },
        {
            path: '/guide',
            name: 'guide',
            meta: { title: '入金指南' },
            component: () =>
                import(
                    `@/pages/open-account/deposit/views/deposit-guide/index.vue`
                )
        },
        {
            path: '/guide-detail-hk',
            name: 'guide-detail-hk',
            meta: { title: '入金指南' },
            component: () =>
                import(
                    `@/pages/open-account/deposit/views/deposit-guide/detail-hk.vue`
                )
        },
        {
            path: '/guide-detail-mainland',
            name: 'guide-detail-mainland',
            meta: { title: '入金指南' },
            component: () =>
                import(
                    `@/pages/open-account/deposit/views/deposit-guide/detail-mainland.vue`
                )
        },
        {
            path: '/bank-card-processing',
            name: 'bank-card-processing',
            meta: { title: '香港银行卡办理', cs: true },
            component: () =>
                import(
                    `@/pages/open-account/deposit/views/bank-card-processing/index.vue`
                )
        },
        {
            path: '/reservation',
            name: 'reservation',
            meta: { title: '香港银行卡办理-填写预约信息', cs: true },
            component: () =>
                import(
                    `@/pages/open-account/deposit/views/bank-card-processing/reservation.vue`
                )
        },
        {
            path: '/reservation-guide',
            name: 'reservation-guide',
            meta: { title: '香港银行卡办理', cs: true },
            component: () =>
                import(
                    `@/pages/open-account/deposit/views/bank-card-processing/reservation-guide.vue`
                )
        },
        {
            path: '/select-bank',
            name: 'select-bank',
            meta: { title: '入金', cs: true },
            component: () =>
                import(
                    `@/pages/open-account/deposit/views/account/select-bank.vue`
                )
        },
        {
            path: '/submit-record/:log?',
            name: 'submit-record',
            meta: { title: '存入资金', cs: true },
            component: () =>
                import(
                    `@/pages/open-account-hk/apply/views/submit-record/index.vue`
                )
        },
        {
            path: '/collection-information/:bankCode',
            name: 'collection-information',
            meta: { title: '存入资金', cs: true },
            component: () =>
                import(
                    `@/pages/open-account-hk/apply/views/collection-infomation/index.vue`
                )
        },
        {
            path: '/manage-account',
            name: 'manage-account',
            meta: { title: '管理银行账户', cs: true },
            component: () =>
                import(
                    `@/pages/open-account-hk/deposit/views/account/manage-account.vue`
                )
        },
        {
            path: '/add-account',
            name: 'add-account',
            meta: { title: '添加银行账户', cs: true },
            component: () =>
                import(`@/pages/open-account/deposit/views/account/add.vue`)
        },
        {
            path: '/sub-account-manager',
            name: 'sub-account-manager',
            meta: { title: '入金', cs: true },
            component: () =>
                import(
                    `@/pages/open-account/deposit/views/sub-account/sub-account-manager.vue`
                )
        },
        {
            path: '/sub-account-default',
            name: 'sub-account-default',
            meta: { title: '入金', cs: true },
            component: () =>
                import(
                    `@/pages/open-account/deposit/views/sub-account/sub-account-default.vue`
                )
        },
        {
            path: '/sub-account-dealing',
            name: 'sub-account-dealing',
            meta: { title: '入金', cs: true },
            component: () =>
                import(
                    `@/pages/open-account/deposit/views/sub-account/sub-account-dealing.vue`
                )
        }
    ]
})
