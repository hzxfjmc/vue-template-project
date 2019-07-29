import jsBridge from '@/utils/js-bridge.js'
import { isYouxinApp } from '@/utils/html-utils.js'
export default (router, store) => {
    router.beforeEach(async (to, from, next) => {
        // 需要绑定手机号但是未绑定的情况 未登录先登录
        if (to.meta.auth !== false) {
            console.log(store.getters)
            if (isYouxinApp) {
                // app
                try {
                    let data
                    if (!store.getters.isLogin) {
                        data = await jsBridge.callApp('command_user_login')
                        store.dispatch('commandUserInfo', data)
                        await store.dispatch('getUserInfoAction')
                    } else if (!store.getters.phoneNumber) {
                        data = await jsBridge.callApp(
                            'command_bind_mobile_phone'
                        )
                        store.dispatch('commandUserInfo', data)
                        await store.dispatch('getUserInfoAction')
                    }
                } catch (e) {
                    return
                }
            } else if (!store.getters.isLogin || !store.getters.phoneNumber) {
                // router.push({
                //     name: 'bind-phone'
                // })
            }
        }
        next()
    })
}
