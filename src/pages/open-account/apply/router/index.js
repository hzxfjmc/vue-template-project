import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
    routes: [
        {
            path: '/transfer',
            name: 'transfer',
            meta: { title: '友信智投', auth: false },
            component: () =>
                import(`@/pages/open-account/apply/views/transfer/index.vue`)
        },
        // {
        //     path: '/result',
        //     alias: '//',
        //     name: 'result',
        //     meta: { title: '友信智投', auth: false },
        //     component: () =>
        //         import(`@/pages/open-account/apply/views/result/Index.vue`)
        // },
        {
            path: '/step/0',
            name: 'select-pages',
            meta: { title: '友信智投', cs: true },
            component: () =>
                import(
                    `@/pages/open-account/apply/views/select-pages/index.vue`
                )
        },
        {
            path: '/step/1',
            name: 'idcard',
            meta: { title: '友信智投', cs: true },
            component: () =>
                import(`@/pages/open-account/apply/views/idcard/Index.vue`)
        },
        {
            path: '/step/2',
            name: 'personal',
            meta: { title: '友信智投', cs: true },
            component: () =>
                import(`@/pages/open-account/apply/views/personal/Index.vue`)
        },
        {
            path: '/step/3',
            name: 'essential',
            meta: { title: '友信智投', cs: true },
            component: () =>
                import(`@/pages/open-account/apply/views/essential/Index.vue`)
        },
        {
            path: '/step/4',
            name: 'asset-status',
            meta: { title: '友信智投', cs: true },
            component: () =>
                import(
                    `@/pages/open-account/apply/views/asset-status/Index.vue`
                )
        },
        {
            path: '/step/5',
            name: 'risk-disclosure',
            meta: { title: '友信智投', cs: true },
            component: () =>
                import(
                    `@/pages/open-account/apply/views/risk-disclosure/Index.vue`
                )
        },
        {
            path: '/step/6',
            name: 'faceid-lite',
            meta: { title: '友信智投', cs: true },
            component: () =>
                import(`@/pages/open-account/apply/views/faceid-lite/Index.vue`)
        },
        {
            path: '/step/7',
            name: 'sign-confirm',
            meta: { title: '友信智投', cs: true },
            component: () =>
                import(
                    `@/pages/open-account/apply/views//sign-confirm/Index.vue`
                )
        },
        {
            path: '/step/8',
            name: 'sign',
            meta: { title: '友信智投', cs: true },
            component: () =>
                import(`@/pages/open-account/apply/views/sign/Index.vue`)
        },
        {
            path: '/home',
            name: 'home',
            alias: '//',
            meta: { title: '友信智投', auth: false },
            component: () =>
                import(`@/pages/open-account/apply/views/home/index.vue`)
        },
        {
            path: '/bind-phone',
            name: 'bind-phone',
            meta: { title: '友信智投', auth: false },
            component: () =>
                import(`@/pages/open-account/apply/views/bind-phone/Index.vue`)
        },
        {
            path: '/captcha/:phone',
            name: 'captcha',
            meta: { title: '友信智投', auth: false },
            component: () =>
                import(`@/pages/open-account/apply/views/captcha/Index.vue`)
        },
        {
            path: '/authorization',
            name: 'authorization',
            meta: { title: '友信智投', auth: false },
            component: () =>
                import(
                    `@/pages/open-account/apply/views/sign-confirm/authorization/index.vue`
                )
        }
    ]
})
