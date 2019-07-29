/**
 * 有效数字
 * @param val
 * @returns {boolean}
 */
function validNumber(val) {
    return /^[+|-]?\d+(?:|\.\d+)$/.test(val)
}

/**
 * 精度保留
 * @param val
 * @param d
 * @returns {string}
 */
function precision(val, d = 2) {
    return Number(val).toFixed(d)
}

/**
 * 入选价是否有效
 * @param price
 * @returns {boolean}
 */
function validBought(price) {
    return validNumber(price) && price >= 0
}

/**
 * 格式化比率
 * @param val
 * @returns {string}
 */
function formatRate(val) {
    return Number(Math.abs(val) * 100).toFixed(2)
}

/**
 * 格式化比率（带正负号,带百分号）
 * @param rise
 * @returns {string}
 */
function formatRise(rise) {
    return (rise < 0 ? '-' : rise > 0 ? '+' : '') + formatRate(rise) + '%'
}

export default {
    filters: {
        /**
         * 入选价过滤器
         * @param price 入选价
         * @returns {string}
         */
        formatBought(val) {
            return validBought(val) ? precision(val, 3) : '--'
        },
        /**
         * 不带符号的比率
         * @param val
         * @returns {string}
         */
        formatPercentPositive(val) {
            return validNumber(val) ? formatRate(val) + '%' : '--'
        },
        /**
         * 带+/-的比率
         */
        formatPercent(val) {
            return validNumber(val) ? formatRise(val) : '--'
        },
        /**
         * 止盈/止损过滤器
         * @param val 止盈价/止损价
         * @returns {string}
         */
        stopPrice(val) {
            return validNumber(val) ? precision(val, 3) : '--'
        }
    },
    methods: {
        validBought,
        /**
         * 格式化高开阈值
         * @param val
         * @returns {string}
         */
        formatThreshold(val) {
            return validNumber(val) ? formatRate(val) + '%' : '--'
        },
        /**
         * 获取用户交易权限
         * @returns {Promise<number>}
         */
        async getUserAuth() {
            let user_auth = 0 // 未登陆

            try {
                const user = await this.$jsBridge.callApp('get_user_info')
                if (user.userToken) user_auth = 1 // 已登录
                if (user.openedAccount) user_auth = 2 // 已开户
            } catch (e) {
                user_auth = 0
            }

            return user_auth
        },
        /**
         * 获取股票涨幅展示颜色
         * @param rise
         * @returns {{red: boolean, green: boolean}}
         */
        getStockColor(rise) {
            return {
                red:
                    (this.$ua.isRedRiseGreenDrop && rise > 0) ||
                    (this.$ua.isGreenRiseRedDrop && rise < 0),
                green:
                    (this.$ua.isRedRiseGreenDrop && rise < 0) ||
                    (this.$ua.isGreenRiseRedDrop && rise > 0)
            }
        }
    }
}
