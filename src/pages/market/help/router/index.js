import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            meta: { title: '帮助与客服首页' },
            component: () => import(`@/pages/market/help/views/index.vue`)
        },
        {
            path: '/list/:id',
            name: 'list',
            meta: { title: '帮助中心列表页' },
            component: () => import(`@/pages/market/help/views/help-list.vue`)
        },
        {
            path: '/result',
            name: 'searchResult',
            meta: { title: '帮助中心列表页' },
            component: () =>
                import(`@/pages/market/help/views/question-result.vue`)
        }
    ]
})
