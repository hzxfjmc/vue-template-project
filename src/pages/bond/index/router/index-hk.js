const hkpath = '/hk/'
export default [
    {
        name: 'index',
        path: hkpath,
        meta: { title: '债券' },
        component: () => import(`@/pages/bond/index/views/index/index-hk.vue`)
    },
    {
        name: 'bond-detail',
        path: `${hkpath}/bond-detail`,
        meta: { title: '债券详情' },
        component: () =>
            import(`@/pages/bond/index/views/bond-detail/index.vue`)
    },
    {
        name: 'transaction-sell',
        path: `${hkpath}/transaction-sell`,
        meta: { title: '卖出' },
        component: () =>
            import(`@/pages/bond/index/views/transaction-sell/index.vue`)
    },
    {
        name: 'transaction-buy',
        path: `${hkpath}/transaction-buy`,
        meta: { title: '买入' },
        component: () =>
            import(`@/pages/bond/index/views/transaction-buy/index.vue`)
    },
    {
        name: 'risk-warning',
        path: `${hkpath}/risk-warning`,
        meta: { title: '风险提示' },
        component: () =>
            import(`@/pages/bond/index/views/risk-warning/index.vue`)
    },
    {
        name: 'risk-assessment',
        path: `${hkpath}/risk-assessment`,
        meta: { title: '风险测评' },
        component: () =>
            import(`@/pages/bond/index/views/risk-assessment/index.vue`)
    },
    {
        name: 'risk-appropriate-result',
        path: `${hkpath}/risk-appropriate-result`,
        meta: { title: '产品匹配' },
        component: () =>
            import(`@/pages/bond/index/views/risk-appropriate-result/index.vue`)
    },
    {
        name: 'risk-assessment-result',
        path: `${hkpath}/risk-assessment-result`,
        meta: { title: '测评结果' },
        component: () =>
            import(`@/pages/bond/index/views/risk-assessment-result/index.vue`)
    }
]
