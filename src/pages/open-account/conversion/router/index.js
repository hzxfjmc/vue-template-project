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
                    `@/pages/open-account/conversion/biz-components/header/index.vue`
                ),
            children: [
                {
                    path: '/home/:step?',
                    name: 'home',
                    alias: '//',
                    meta: { title: '转入股票' },
                    component: () =>
                        import(
                            `@/pages/open-account/conversion/views/home/index.vue`
                        )
                },
                {
                    path: '/add-shares/:step',
                    name: 'add-shares',
                    meta: { title: '转入股票' },
                    component: () =>
                        import(
                            `@/pages/open-account/conversion/views/add-shares/index.vue`
                        )
                },
                {
                    path: '/confirm-info/:step',
                    name: 'confirm-info',
                    meta: { title: '转入股票' },
                    component: () =>
                        import(
                            `@/pages/open-account/conversion/views/confirm-info/index.vue`
                        )
                }
            ]
        },
        {
            path: '/complete',
            name: 'complete',
            meta: { title: '转入股票' },
            component: () =>
                import(
                    `@/pages/open-account/conversion/views/complete/index.vue`
                )
        },
        {
            path: '/log',
            name: 'log',
            meta: { title: '转入记录' },
            component: () =>
                import(`@/pages/open-account/conversion/views/log/index.vue`)
        }
    ]
})
