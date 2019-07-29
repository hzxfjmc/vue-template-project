import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            meta: {
                title: '抽獎活動頁',
                shareTitle: '【uSMART迎新獎賞 首次存款即刻送港美股票俾你】',
                shareDesc:
                    '由即日至9月30日, 當你嘅首次存款/轉倉等值為港幣$20,000或以上，即可參加幸運大抽獎或即時拎走指定股票',
                shareLink: window.location.href,
                shareImg: `${window.location.origin}/webapp/marketing/images/luckyShare.png`
            },
            component: () =>
                import(`@/pages/marketing/lucky-draw/views/home/index.vue`)
        },
        {
            path: '/result',
            name: 'result',
            meta: {
                title: '『智』幸運大抽獎'
            },
            component: () =>
                import(`@/pages/marketing/lucky-draw/views/result/index.vue`)
        },
        {
            path: '/lucky',
            name: 'lucky',
            meta: {
                title: '活動抽獎説明頁',
                shareTitle: '【uSMART迎新獎賞 首次存款即刻送港美股票俾你】',
                shareDesc:
                    '由即日至9月30日, 當你嘅首次存款/轉倉等值為港幣$20,000或以上，即可參加幸運大抽獎或即時拎走指定股票',
                shareLink:
                    window.location.origin +
                    '/webapp/marketing/lucky-draw.html' +
                    window.location.search,
                shareImg: `${window.location.origin}/webapp/marketing/images/luckyShare.png`
            },
            component: () =>
                import(`@/pages/marketing/lucky-draw/views/detail/lucky.vue`)
        },
        {
            path: '/stock',
            name: 'stock',
            meta: {
                title: '活動領取股票説明頁',
                shareTitle: '【uSMART迎新獎賞 首次存款即刻送港美股票俾你】',
                shareDesc:
                    '由即日至9月30日, 當你嘅首次存款/轉倉等值為港幣$20,000或以上，即可參加幸運大抽獎或即時拎走指定股票',
                shareLink:
                    window.location.origin +
                    '/webapp/marketing/lucky-draw.html' +
                    window.location.search,
                shareImg: `${window.location.origin}/webapp/marketing/images/luckyShare.png`
            },
            component: () =>
                import(`@/pages/marketing/lucky-draw/views/detail/stock.vue`)
        },
        {
            path: '/middle',
            name: 'middle',
            meta: {
                title: '活動提示頁'
            },
            component: () =>
                import(`@/pages/marketing/lucky-draw/views/middle/index.vue`)
        },
        {
            path: '/other',
            name: 'other',
            meta: {
                title: '選擇活動頁'
            },
            component: () =>
                import(`@/pages/marketing/lucky-draw/views/other/index.vue`)
        }
    ]
})
