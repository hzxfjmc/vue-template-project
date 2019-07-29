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
            meta: { title: $t('common.monthlyStock') },
            component: () => import(`./views/index`)
        },
        {
            path: '/edit/:stockCode/:exchangeType',
            name: 'create',
            meta: { title: $t('router.create') },
            component: () => import(`./views/edit`)
        },
        {
            path: '/edit/:stockCode/:exchangeType/:planId',
            name: 'update',
            meta: { title: $t('router.updateMonthlyPlan') },
            component: () => import(`./views/edit`)
        },
        {
            path: '/mine',
            name: 'mine',
            meta: { title: $t('router.mine') },
            component: () => import(`./views/mine`)
        },
        {
            path: '/mine/finish',
            name: 'mine-finish',
            meta: { title: $t('router.mineFinish') },
            component: () => import(`./views/mine-finish`)
        },
        {
            path: '/list',
            name: 'list',
            meta: { title: $t('common.monthlyStock') },
            component: () => import(`./views/list`)
        },
        {
            path: '/detail/:planId',
            name: 'detail',
            meta: { title: $t('router.detail') },
            component: () => import(`./views/detail`)
        },
        {
            path: '/record/:planDetailId',
            name: 'record',
            meta: { title: $t('router.record') },
            component: () => import(`./views/record`)
        }
    ]
})

router.beforeEach((to, from, next) => {
    setTitle(to.meta.title)
    next()
})

export default router
