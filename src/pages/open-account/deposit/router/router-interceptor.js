import { Toast } from 'vant'
import { appType } from '@/utils/html-utils.js'
/**
 * 切换路由添加loading
 */
export default router => {
    router.beforeEach((to, from, next) => {
        // 香港版则跳转港版入金
        if (appType.Hk && ['/'].includes(to.path)) {
            location.replace(
                location.origin + '/webapp/open-account-hk/deposit.html#/'
            )
            return false
        }
        if (['/'].includes(to.path)) {
            Toast.clear()
        } else {
            Toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0,
                position: 'center'
            })
        }
        next()
    })
    router.afterEach(() => {
        Toast.clear()
    })
}
