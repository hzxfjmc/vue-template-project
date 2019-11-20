const hkpath = '/hk'

let routerList = [
    {
        name: 'hk-index',
        path: '/',
        meta: { title: '债券' },
        component: () => import(`@/pages/bond/index/views/index/index-hk.vue`)
    },
    {
        name: 'hk-bond-detail',
        path: '/bond-detail',
        meta: { title: '债券详情' },
        component: () =>
            import(`@/pages/bond/index/views/bond-detail/index-hk.vue`)
    },
    {
        name: 'hk-transaction-sell',
        path: '/transaction-sell',
        meta: { title: '卖出' },
        component: () =>
            import(`@/pages/bond/index/views/transaction-sell/index-hk.vue`)
    },
    {
        name: 'hk-transaction-buy',
        path: '/transaction-buy',
        meta: { title: '买入' },
        component: () =>
            import(`@/pages/bond/index/views/transaction-buy/index-hk.vue`)
    },
    {
        name: 'hk-risk-warning',
        path: '/risk-warning',
        meta: { title: '风险提示' },
        component: () =>
            import(`@/pages/bond/index/views/risk-warning/index-hk.vue`)
    },
    {
        name: 'hk-risk-assessment',
        path: '/risk-assessment',
        meta: { title: '风险测评' },
        component: () =>
            import(`@/pages/bond/index/views/risk-assessment/index-hk.vue`)
    },
    {
        name: 'hk-risk-appropriate-result',
        path: '/risk-appropriate-result',
        meta: { title: '产品风险匹配' },
        component: () =>
            import(
                `@/pages/bond/index/views/risk-appropriate-result/index-hk.vue`
            )
    },
    {
        name: 'hk-risk-assessment-result',
        path: '/risk-assessment-result',
        meta: { title: '测评结果' },
        component: () =>
            import(
                `@/pages/bond/index/views/risk-assessment-result/index-hk.vue`
            )
    }
]

routerList.forEach(routerItem => {
    routerItem.path = `${hkpath}${routerItem.path}`
})

export default routerList
