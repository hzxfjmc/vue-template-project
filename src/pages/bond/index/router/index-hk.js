const hkpath = '/hk'

let routerList = [
    {
        name: 'index',
        path: '/',
        meta: { title: '債券交易' },
        component: () => import(`@/pages/bond/index/views/index/index-hk.vue`)
    },
    {
        name: 'bond-detail',
        path: '/bond-detail',
        meta: { title: '債券详情' },
        component: () =>
            import(`@/pages/bond/index/views/bond-detail/index-hk.vue`)
    }
    // {
    //     name: 'transaction-sell',
    //     path: '/transaction-sell',
    //     meta: { title: '賣出' },
    //     component: () =>
    //         import(`@/pages/bond/index/views/transaction-sell/index-hk.vue`)
    // },
    // {
    //     name: 'transaction-buy',
    //     path: '/transaction-buy',
    //     meta: { title: '買入' },
    //     component: () =>
    //         import(`@/pages/bond/index/views/transaction-buy/index-hk.vue`)
    // },
    // {
    //     name: 'risk-warning',
    //     path: '/risk-warning',
    //     meta: { title: '風險提示' },
    //     component: () =>
    //         import(`@/pages/bond/index/views/risk-warning/index-hk.vue`)
    // },
    // {
    //     name: 'risk-assessment',
    //     path: '/risk-assessment',
    //     meta: { title: '風險測評' },
    //     component: () =>
    //         import(`@/pages/bond/index/views/risk-assessment/index-hk.vue`)
    // },
    // {
    //     name: 'risk-appropriate-result',
    //     path: '/risk-appropriate-result',
    //     meta: { title: '產品匹配' },
    //     component: () =>
    //         import(
    //             `@/pages/bond/index/views/risk-appropriate-result/index-hk.vue`
    //         )
    // },
    // {
    //     name: 'risk-assessment-result',
    //     path: '/risk-assessment-result',
    //     meta: { title: '測評結果' },
    //     component: () =>
    //         import(
    //             `@/pages/bond/index/views/risk-assessment-result/index-hk.vue`
    //         )
    // }
]

routerList.forEach(routerItem => {
    routerItem.path = `${hkpath}${routerItem.path}`
})

export default routerList
