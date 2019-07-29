import { isYouxinApp } from '@/utils/html-utils.js'
import Vue from 'vue'
export default (router, store) => {
    router.beforeEach(async (to, from, next) => {
        document.body.scrollIntoView()
        // 需要绑定手机号但是未绑定的情况 未登录先登录
        if (to.meta.auth !== false) {
            if (isYouxinApp) {
                // app
                try {
                    await store.dispatch('loginCommonAction')
                    next()
                } catch (e) {
                    console.log(e)
                }
            } else {
                // if (!store.getters.isLogin || !store.getters.phoneNumber) {
                //     router.push({
                //         name: 'bind-phone'
                //     })
                // }
                next()
            }
        } else {
            next()
        }
        if (
            ['select-bank', 'collection-infomation', 'submit-record'].includes(
                to.name
            )
        ) {
            Vue.prototype.$loading()
        }
    })
    router.afterEach(() => {
        Vue.prototype.$close()
    })
}
