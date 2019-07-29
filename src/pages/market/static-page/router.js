import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default () => {
    const $t = Vue.prototype.$t
    return new Router({
        routes: [
            // 强者恒强
            {
                path: '/stronger',
                name: 'stronger',
                meta: { title: $t('stronger.title') },
                component: () =>
                    import(
                        /*webpackChunkName: 'stronger'*/ '@/pages/market/static-page/views/stronger.vue'
                    )
            },
            // 大数据挖掘价值
            {
                path: '/big-data',
                name: 'big-data',
                meta: { title: $t('bigData.title') },
                component: () =>
                    import(
                        /*webpackChunkName: 'big-data'*/ '@/pages/market/static-page/views/big-data.vue'
                    )
            },
            // 稳健长虹
            {
                path: '/steady',
                name: 'steady',
                meta: { title: $t('steady.title') },
                component: () =>
                    import(
                        /*webpackChunkName: 'steady'*/ '@/pages/market/static-page/views/steady.vue'
                    )
            },
            // 價值紅利
            {
                path: '/value-bonus',
                name: 'value-bonus',
                meta: { title: $t('valueBonus.title') },
                component: () =>
                    import(
                        /*webpackChunkName: 'value-bonus'*/ '@/pages/market/static-page/views/value-bonus.vue'
                    )
            },
            // alpha
            {
                path: '/alpha',
                name: 'alpha',
                meta: { title: $t('alpha.title') },
                component: () =>
                    import(
                        /*webpackChunkName: 'alpha'*/ '@/pages/market/static-page/views/alpha.vue'
                    )
            },
            // xgboost
            {
                path: '/xgboost',
                name: 'xgboost',
                meta: { title: $t('xgboost.title') },
                component: () =>
                    import(
                        /*webpackChunkName: 'xgboost'*/ '@/pages/market/static-page/views/xgboost.vue'
                    )
            },
            // multi-asset
            {
                path: '/multi-asset',
                name: 'multi-asset',
                meta: { title: $t('multiAsset.title') },
                component: () =>
                    import(
                        /*webpackChunkName: 'multi-asset'*/ '@/pages/market/static-page/views/multi-asset.vue'
                    )
            },
            { path: '/', redirect: '/stronger' }
        ]
    })
}
