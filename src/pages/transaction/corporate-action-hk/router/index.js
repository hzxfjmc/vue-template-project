import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
    routes: [
        {
            name: 'home',
            path: '/RC/:rightsId',
            meta: {
                title: 'router1',
                auth: true,
                rightShow: true,
                assistant: false,
                yRouter: 'record'
            },
            component: () =>
                import(`@/pages/transaction/corporate-action-hk/views/home/index.vue`)
        },
        {
            name: 'rightsDetail',
            path: '/rightsDetail',
            meta: {
                title: 'router2',
                rightShow: true,
                assistant: true,
                yRouter: 'detail'
            },
            component: () =>
                import(`@/pages/transaction/corporate-action-hk/views/rightsDetail/index.vue`)
        },
        {
            name: 'record',
            path: '/record',
            meta: {
                title: 'router3',
                rightShow: true,
                assistant: true,
                yRouter: 'command_close_webview'
            },
            component: () =>
                import(`@/pages/transaction/corporate-action-hk/views/record/index.vue`)
        },
        {
            name: 'choose',
            path: '/DS/:rightsId',
            meta: {
                title: 'router4',
                auth: true,
                rightShow: true,
                assistant: false,
                yRouter: 'chooseRecord'
            },
            component: () =>
                import(`@/pages/transaction/corporate-action-hk/views/choose/index.vue`)
        },
        {
            name: 'chooseRecord',
            path: '/chooseRecord',
            meta: {
                title: 'router5',
                rightShow: true,
                assistant: true,
                yRouter: 'command_close_webview'
            },
            component: () =>
                import(`@/pages/transaction/corporate-action-hk/views/chooseRecord/index.vue`)
        }
    ]
})
