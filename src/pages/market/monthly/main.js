import Vue from 'vue'
import '../0-utils/common'
import './utils/setLang'
import App from './App.vue'
import router from './router'
import { Dialog, Toast } from 'vant'
import JSBridge from '@/utils/js-bridge'
import config from '../0-config'
import { getTradeStatus } from '../0-service/market'

Vue.config.productionTip = false
Vue.use(Dialog)

// 交易密码登录，通过返回true，不通过返回false
// @returns Promise
Vue.prototype.$tradeLogin = async function() {
    // 本地调试不用验证交易密码
    if (config.env !== 'localhost') {
        try {
            // 验证登录密码状态
            const { status } = await getTradeStatus()
            if (!status) {
                try {
                    // 验证登录
                    await JSBridge.callApp('command_trade_login')
                } catch (e) {
                    // 取消操作 或 密码错误（不用提示，APP已提示）
                    return false
                }
            }
        } catch (e) {
            Toast(e.msg || this.$t('common.errorTips'))
            return false
        }
    }
    return true
}

new Vue({
    data: {
        isLangEn: config.isLangEn,
        stockColorType: config.stockColorType // 1-红涨绿跌，2-绿涨红跌
    },
    router,
    render: h => h(App)
}).$mount('#app')
