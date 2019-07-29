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
                    import('@/pages/market/msg-center/views/index.vue')
            },
            {
                path: '/list/:type',
                name: 'list',
                meta: {
                    title: $t('list.title'),
                    keepAlive: false
                },
                component: () =>
                    import('@/pages/market/msg-center/views/list.vue'),
                beforeEnter: (to, from, next) => {
                    const { type } = to.params
                    switch (type) {
                        case 'notice':
                            to.params.type = 'notice'
                            to.meta.title = $t('index.sub_titles[0]')
                            break
                        case 'remind':
                            to.params.type = 'remind'
                            to.meta.title = $t('index.sub_titles[1]')
                            break
                        case 'activity':
                            to.params.type = 'activity'
                            to.meta.title = $t('index.sub_titles[2]')
                            break
                        default:
                            to.params.type = 'notice'
                            to.meta.title = $t('index.sub_titles[0]')
                    }
                    next()
                }
            }
        ]
    })
}
