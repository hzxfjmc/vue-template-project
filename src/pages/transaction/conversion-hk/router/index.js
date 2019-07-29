import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
    routes: [
        {
            path: '/header',
            name: 'header',
            component: () =>
                import(
                    `@/pages/transaction/conversion-hk/biz-components/header/index.vue`
                ),
            children: [
                {
                    path: '/home/:step?',
                    name: 'home',
                    alias: '//',
                    meta: { title: 'conversionTitle' },
                    component: () =>
                        import(
                            `@/pages/transaction/conversion-hk/views/home/index.vue`
                        )
                },
                {
                    path: '/add-shares/:step',
                    name: 'add-shares',
                    meta: { title: 'conversionTitle' },
                    component: () =>
                        import(
                            `@/pages/transaction/conversion-hk/views/add-shares/index.vue`
                        )
                },
                {
                    path: '/confirm-info/:step',
                    name: 'confirm-info',
                    meta: { title: 'conversionTitle' },
                    component: () =>
                        import(
                            `@/pages/transaction/conversion-hk/views/confirm-info/index.vue`
                        )
                }
            ]
        },
        {
            path: '/complete',
            name: 'complete',
            meta: { title: 'conversionTitle' },
            component: () =>
                import(
                    `@/pages/transaction/conversion-hk/views/complete/index.vue`
                )
        },
        {
            path: '/log',
            name: 'log',
            meta: { title: 'conversionTitleRecord', hideLog: true },
            component: () =>
                import(`@/pages/transaction/conversion-hk/views/log/index.vue`)
        }
    ]
})
