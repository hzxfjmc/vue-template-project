/**
 * 切换路由添加loading
 */
import Vue from 'vue'
import { appType } from '@/utils/html-utils.js'
export default router => {
    router.beforeEach((to, from, next) => {
        // 大陆版则跳转大陆入金
        if (appType.Ch && ['/'].includes(to.path)) {
            location.replace(
                location.origin + '/webapp/open-account/deposit.html#/'
            )
            return false
        }
        if (['/'].includes(to.path)) {
            Vue.prototype.$close()
        } else {
            Vue.prototype.$loading()
        }
        next()
    })
    router.afterEach(() => {
        Vue.prototype.$close()
    })
}
