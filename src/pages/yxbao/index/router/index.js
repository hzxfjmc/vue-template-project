import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    scrollBehavior() {
        return { x: 0, y: 0 }
    },
    routes: [
        {
            name: 'home',
            path: '/',
            meta: { title: 'home', auth: true, cs: true },
            component: () => import(`@/pages/yxbao/index/views/home/index.vue`)
        }
    ]
})
