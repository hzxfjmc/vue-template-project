import Vue from 'vue'
import Router from 'vue-router'
import { setTitle } from '@/utils/html-utils'

const $t = Vue.prototype.$t

Vue.use(Router)
const router = new Router({
    routes: [
        {
            path: '/',
            name: 'index',
            meta: { title: $t('routeIndex') },
            component: () => import(`./views/index`)
        },
        {
            path: '/history/:auth',
            name: 'history',
            meta: { title: $t('historyRecord') },
            component: () => import(`./views/history`)
        }
    ]
})

router.beforeEach((to, from, next) => {
    setTitle(to.meta.title)
    next()
})

export default router
