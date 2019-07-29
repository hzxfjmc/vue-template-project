export default {
    data() {
        return {
            pollTiming: undefined,
            hkQuoteLevel: 1 // 港股行情权限：0-延时行情、1-BMP行情、2-level1行情、3-level2行情
        }
    },
    created() {
        this.getQuoteLevelAuth()
    },
    deactivated() {
        clearTimeout(this.pollTiming)
    },
    methods: {
        /**
         * 获取港股行情权限
         * @returns {Promise<void>}
         */
        async getQuoteLevelAuth() {
            if (this.$jsBridge.isYouxinApp) {
                const user = await this.$jsBridge.callApp('get_user_info')
                console.log('get_user_info', user)
                if (user.hkQuoteLevel !== undefined)
                    this.hkQuoteLevel = +user.hkQuoteLevel
            }
            console.log('hkQuoteLevel', this.hkQuoteLevel)
        },
        /**
         * 定时拉取股票信息
         * @param fn
         * @param hasHk 是否有港股
         */
        timeoutPollStock(fn, hasHk = false) {
            clearTimeout(this.pollTiming)

            // BMP且有港股不刷新
            if (+this.hkQuoteLevel === 1 && hasHk) return

            this.pollTiming = setTimeout(fn.bind(this), 10000)
        }
    }
}
