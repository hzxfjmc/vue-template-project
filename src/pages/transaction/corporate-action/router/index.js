import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    routes: [
        {
            name: 'home',
            path: '/RC/:rightsId',
            meta: {
                title: '申请供股',
                auth: true,
                rightShow: true,
                assistant: false,
                yRouter: 'record'
            },
            component: () =>
                import(`@/pages/transaction/corporate-action/views/home/index.vue`)
        },
        {
            name: 'rightsDetail',
            path: '/rightsDetail',
            meta: {
                title: '供股详情',
                rightShow: true,
                assistant: true,
                yRouter: 'detail'
            },
            component: () =>
                import(`@/pages/transaction/corporate-action/views/rightsDetail/index.vue`)
        },
        {
            name: 'record',
            path: '/record',
            meta: {
                title: '供股记录',
                rightShow: true,
                assistant: true,
                yRouter: 'command_close_webview'
            },
            component: () =>
                import(`@/pages/transaction/corporate-action/views/record/index.vue`)
        },
        {
            name: 'choose',
            path: '/DS/:rightsId',
            meta: {
                title: '选股选息',
                auth: true,
                rightShow: true,
                assistant: false,
                yRouter: 'chooseRecord'
            },
            component: () =>
                import(`@/pages/transaction/corporate-action/views/choose/index.vue`)
        },
        {
            name: 'chooseRecord',
            path: '/chooseRecord',
            meta: {
                title: '选股选息记录',
                rightShow: true,
                assistant: true,
                yRouter: 'command_close_webview'
            },
            component: () =>
                import(`@/pages/transaction/corporate-action/views/chooseRecord/index.vue`)
        }
    ]
})
