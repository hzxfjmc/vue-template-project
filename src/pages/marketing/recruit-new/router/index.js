import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    routes: [
        {
            name: 'activity-index',
            path: '/index',
            alias: '//',
            meta: {
                title: '迎新活動',
                shareTitle: '【uSMART迎新獎賞 成功開戶即賞你工行及港鐵各1股】',
                shareDesc:
                    '由即日至9月30 日, 成功開戶嘅新客戶，即賞你工商銀行及港鐵各１股，30日美股LV1串流報價，仲有180日免佣免平台費！',
                shareLink: window.location.href,
                shareImg: `${window.location.origin}/webapp/marketing/images/luckyShare.png`
            },
            component: () =>
                import(
                    `@/pages/marketing/recruit-new/views/activity-index/index.vue`
                )
        },
        {
            name: 'explain',
            path: '/explain',
            meta: {
                title: '迎新活動',
                shareTitle: '【uSMART迎新獎賞 成功開戶即賞你工行及港鐵各1股】',
                shareDesc:
                    '由即日至9月30 日, 成功開戶嘅新客戶，即賞你工商銀行及港鐵各１股，30日美股LV1串流報價，仲有180日免佣免平台費！',
                shareLink:
                    window.location.origin +
                    '/webapp/marketing/recruit-new.html' +
                    window.location.search,
                shareImg: `${window.location.origin}/webapp/marketing/images/luckyShare.png`
            },
            component: () =>
                import(
                    `@/pages/marketing/recruit-new/views/activity-explain/index.vue`
                )
        },
        {
            name: 'register',
            path: '/register',
            meta: {
                title: '迎新活動',
                shareTitle: '【uSMART迎新獎賞 成功開戶即賞你工行及港鐵各1股】',
                shareDesc:
                    '由即日至9月30 日, 成功開戶嘅新客戶，即賞你工商銀行及港鐵各１股，30日美股LV1串流報價，仲有180日免佣免平台費！',
                shareLink:
                    window.location.origin +
                    '/webapp/marketing/recruit-new.html' +
                    window.location.search,
                shareImg: `${window.location.origin}/webapp/marketing/images/luckyShare.png`
            },
            component: () =>
                import(`@/pages/marketing/recruit-new/views/register/index.vue`)
        },
        {
            name: 'done',
            path: '/done',
            meta: {
                title: '迎新活動',
                shareTitle: '【uSMART迎新獎賞 成功開戶即賞你工行及港鐵各1股】',
                shareDesc:
                    '由即日至9月30 日, 成功開戶嘅新客戶，即賞你工商銀行及港鐵各１股，30日美股LV1串流報價，仲有180日免佣免平台費！',
                shareLink:
                    window.location.origin +
                    '/webapp/marketing/recruit-new.html' +
                    window.location.search,
                shareImg: `${window.location.origin}/webapp/marketing/images/luckyShare.png`
            },
            component: () =>
                import(
                    `@/pages/marketing/recruit-new/views/register-done/index.vue`
                )
        }
    ]
})
