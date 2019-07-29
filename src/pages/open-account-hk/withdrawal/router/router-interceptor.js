/**
 * 切换路由添加loading
 */
import Vue from 'vue'
export default router => {
    router.beforeEach((to, from, next) => {
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
