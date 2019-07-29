import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
    routes: [
        {
            path: '/home',
            name: 'home',
            alias: '//',
            meta: { title: 'uSmart', auth: false, cs: true },
            component: () =>
                import(`@/pages/open-account-hk/apply/views/home/index.vue`)
        },
        {
            name: 'select-pages',
            path: '/step/1',
            meta: {
                title: 'uSmart',
                auth: true,
                cs: true
            },
            component: () =>
                import(
                    `@/pages/open-account-hk/apply/views/select-pages/index.vue`
                )
        },
        {
            path: '/apply-header',
            meta: { title: 'uSmart', auth: true },
            component: () =>
                import(
                    `@/pages/open-account-hk/apply/biz-components/apply-header/index.vue`
                ),
            children: [
                {
                    name: 'personal',
                    path: '/step/2',
                    meta: { title: 'uSmart', auth: true, cs: true },
                    component: () =>
                        import(
                            `@/pages/open-account-hk/apply/views/personal/index.vue`
                        )
                },
                {
                    name: 'asset-status',
                    path: '/step/3',
                    meta: { title: 'uSmart', auth: true, cs: true },
                    component: () =>
                        import(
                            `@/pages/open-account-hk/apply/views/asset-status/index.vue`
                        )
                },
                {
                    name: 'essential',
                    path: '/step/4',
                    meta: { title: 'uSmart', auth: true, cs: true },
                    component: () =>
                        import(
                            `@/pages/open-account-hk/apply/views/essential/index.vue`
                        )
                },
                {
                    name: 'confirm-info',
                    path: '/step/5',
                    meta: { title: 'uSmart', auth: true, cs: true },
                    component: () =>
                        import(
                            `@/pages/open-account-hk/apply/views/confirm-info/index.vue`
                        )
                }
            ]
        },
        {
            name: 'add-addr-prove',
            path: '/step/7',
            meta: { title: 'uSmart', auth: true, cs: true },
            component: () =>
                import(
                    `@/pages/open-account-hk/apply/views/add-addr-prove/index.vue`
                )
        },
        {
            name: 'sign',
            path: '/step/6',
            meta: { title: 'uSmart', auth: true, cs: true },
            component: () =>
                import(`@/pages/open-account-hk/apply/views/sign/index.vue`)
        },
        {
            path: '/submit-record/:log?',
            name: 'submit-record',
            meta: { title: 'uSmart', auth: false, cs: true },
            component: () =>
                import(
                    `@/pages/open-account-hk/apply/views/submit-record/index.vue`
                )
        },
        {
            path: '/collection-infomation/:bankCode',
            name: 'collection-infomation',
            meta: { title: 'uSmart', auth: false, cs: true },
            component: () =>
                import(
                    `@/pages/open-account-hk/apply/views/collection-infomation/index.vue`
                )
        },
        {
            path: '/select-bank',
            name: 'select-bank',
            meta: { title: 'uSmart', auth: false, cs: true },
            component: () =>
                import(
                    `@/pages/open-account-hk/apply/views/select-bank/index.vue`
                )
        },
        {
            path: '/know-more',
            name: 'know-more',
            meta: { title: 'uSmart', auth: true, cs: true },
            component: () =>
                import(
                    `@/pages/open-account-hk/apply/views/confirm-info/know-more/index.vue`
                )
        },
        {
            path: '/pdf-preview',
            name: 'pdf-preview',
            meta: { title: '', auth: true, cs: true },
            component: () => import(`@/components/pdf-preview/index.vue`)
        }
    ]
})
