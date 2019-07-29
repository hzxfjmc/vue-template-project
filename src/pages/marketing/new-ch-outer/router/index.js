import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    routes: [
        {
            name: 'index',
            path: '/index',
            alias: '//',
            meta: {
                title: '友信智投新人礼',
                shareLink: window.location.href,
                shareTitle: '好友送您永久港、美股免佣，还有免费股票和现金!',
                shareDesc:
                    '友信证券，港美股持牌券商，现在开户享永久港、美股免佣',
                shareImg: `${window.location.origin}/webapp/marketing/images/mgmChShare.png`
            },
            component: () =>
                import(
                    `@/pages/marketing/new-ch-outer/views/activity-index/index.vue`
                )
        },
        {
            name: 'register',
            path: '/register',
            meta: {
                title: '友信智投新人礼',
                shareLink:
                    window.location.origin +
                    '/webapp/marketing/new-ch-outer.html' +
                    window.location.search,
                shareTitle: '好友送您永久港、美股免佣，还有免费股票和现金!',
                shareDesc:
                    '友信证券，港美股持牌券商，现在开户享永久港、美股免佣',
                shareImg: `${window.location.origin}/webapp/marketing/images/mgmChShare.png`
            },
            component: () =>
                import(
                    `@/pages/marketing/new-ch-outer/views/register/index.vue`
                )
        }
    ]
})
