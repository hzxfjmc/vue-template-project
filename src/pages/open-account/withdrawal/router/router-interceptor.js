import { Toast } from 'vant'
/**
 * 切换路由添加loading
 */
export default router => {
    router.beforeEach((to, from, next) => {
        // verifyType : 0-港版线上开户 1-港版门店开户 2-iPad展业开户 3-大陆线上开户
        // 港版线上开户用户跳转港版出金流程
        // if (
        //     store.getters['withdrawal/verifyType'] === 0 &&
        //     ['/'].includes(to.path)
        // ) {
        //     location.replace(
        //         location.origin +
        //             '/webapp/open-account-hk/withdrawal.html#/online'
        //     )
        //     return false
        // }
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
