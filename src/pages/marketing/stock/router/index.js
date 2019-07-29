import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    routes: [
        {
            name: 'stock',
            path: '/',
            meta: { title: '免费拿股票' },
            component: () =>
                import(`@/pages/marketing/stock/views/index/index.vue`)
        }
    ]
})
