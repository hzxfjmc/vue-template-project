import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    routes: [
        {
            name: 'home',
            path: '/',
            meta: { title: 'pageTitle' },
            component: () =>
                import(`@/pages/marketing/my-commission/views/home/index.vue`)
        }
    ]
})
