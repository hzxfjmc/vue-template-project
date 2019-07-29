import { isYouxinApp } from '@/utils/html-utils.js'
export default (router, store) => {
    router.beforeEach(async (to, from, next) => {
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
    })
}
