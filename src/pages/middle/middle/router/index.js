import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    routes: [
        {
            name: 'home',
            path: '/home',
            meta: { title: '大陆版引导页' },
            component: () => import(`@/pages/middle/middle/views/index.vue`)
        },
        {
            name: 'hk',
            path: '/hk',
            meta: { title: '香港版引导页' },
            component: () => import(`@/pages/middle/middle/views/hk.vue`)
        },
        {
            name: 'rc',
            path: '/rc',
            meta: { title: '' },
            component: () => import(`@/pages/middle/middle/views/rc.vue`)
        }
    ]
})
