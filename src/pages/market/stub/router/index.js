import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default () => {
    const $t = Vue.prototype.$t
    return new Router({
        routes: [
            {
                path: '/detail/:id(\\d+)/:version',
                name: 'detail',
                meta: { title: $t('detail.title') },
                component: () => import('@/pages/market/stub/views/detail.vue')
            },
            {
                path: '/history/:id(\\d+)/:version/:strategyName?',
                name: 'history',
                meta: { title: $t('history.title') },
                component: () => import('@/pages/market/stub/views/history.vue')
            }
        ]
    })
}
