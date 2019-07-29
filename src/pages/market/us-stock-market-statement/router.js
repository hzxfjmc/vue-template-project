import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default () => {
    const $t = Vue.prototype.$t
    return new Router({
        routes: [
            {
                path: '/',
                name: 'index',
                meta: { title: $t('index.title') },
                component: () =>
                    import(
                        '@/pages/market/us-stock-market-statement/views/index.vue'
                    )
            },
            {
                path: '/statement',
                name: 'statement',
                meta: { title: $t('statement.title') },
                component: () =>
                    import(
                        '@/pages/market/us-stock-market-statement/views/statement.vue'
                    )
            },
            {
                path: '/preview',
                name: 'preview',
                meta: { title: $t('statement.title') },
                component: () =>
                    import(
                        '@/pages/market/us-stock-market-statement/views/preview-v1.vue'
                    )
            }
        ]
    })
}
