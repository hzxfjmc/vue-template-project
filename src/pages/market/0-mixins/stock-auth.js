// 股王解锁开锁权限
export default {
    data() {
        return {
            hasAuth: false, // 是否有权限
            authType: 1 // 无权限对应操作类型；0：不需要权限，1：需要登陆， 2,：需要注册
        }
    },
    methods: {
        /**
         * 适配权限数据
         * @param auth.is_auth 是否有权限；0:无权限， 1:有权限
         * @param auth.strategy_group 无权限时对应的操作类型；0：不需要权限，1：需要登陆， 2,：需要注册
         */
        authAdapter(auth = { is_auth: 0, strategy_group: 1 }) {
            this.hasAuth = Boolean(+auth.is_auth)
            this.authType = +auth.strategy_group
        },
        /**
         * 去解锁
         * @param cb 解锁完成回调函数(默认刷新页面)
         */
        unlock(cb = () => window.location.reload()) {
            this.$dialog
                .confirm({
                    message: this.$t('detail').lockText(this.authType - 1),
                    cancelButtonText: this.$t('detail.cancel'),
                    confirmButtonText: this.$t('detail.to_unlock'),
                    confirmButtonColor: '#3c78fa'
                })
                .then(() => {
                    this.unLockOpt(this.authType).then(cb)
                })
                .catch(() => {})
        },
        /**
         * 解锁相关操作
         */
        async unLockOpt() {
            switch (this.authType) {
                case 0:
                    // 不需要权限
                    break
                case 2:
                    // 需要开户
                    await this.$jsBridge.gotoNativeModule(
                        'yxzq_goto://main_trade'
                    )
                    break
                case 1:
                default:
                    // 去登陆
                    await this.$jsBridge.callApp('command_user_login')
            }
        },
        /**
         * 订阅必须登陆
         * @returns {Promise<void>}
         */
        async subscribeAuth(cb) {
            const user = await this.$jsBridge.callApp('get_user_info')
            if (!user.userToken) {
                await this.$jsBridge.callApp('command_user_login')
                window.location.reload()
            } else {
                cb()
            }
        }
    }
}
