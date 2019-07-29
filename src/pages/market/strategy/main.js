import Vue from 'vue'
import '../0-utils/common'
import './utils/setLang'
import App from './App.vue'
import router from './router'
import JSBridge from '@/utils/js-bridge'
import { Dialog } from 'vant'
import config from '../0-config'
import buryingPoint from './utils/burying-point'

Vue.config.productionTip = false
Vue.use(Dialog)

// 跳轉至個股詳情
Vue.prototype.$gotoStockDetail = stock => {
    // 已退市则不能跳转
    if (stock.delisting) {
        return
    }
    const item = {
        market: stock.secu_code.slice(0, 2),
        symbol: stock.secu_code.slice(2)
    }
    JSBridge.gotoNativeModule(
        `yxzq_goto://stock_quote?market=${item.market}&code=${item.symbol}`
    )
}

// 埋点
Vue.prototype.$buryingPoint = buryingPoint

// 格式化 比率 的数值显示
Vue.filter('formatRate', rate => {
    rate = parseFloat(rate)
    if (isNaN(rate)) {
        return '--'
    }
    const sign = rate > 0 ? '+' : ''
    return sign + (rate * 100).toFixed(2) + '%'
})

if (config.isMainland) {
    document.body.style.background = '#0b121f'
}
new Vue({
    router,
    render: h => h(App),
    // 此处数据较少，不引用状态管理，减少代码大小
    data: {
        stockColorType: config.stockColorType,
        isMainland: config.isMainland,
        isHK: config.isHK,
        strategy_name: ''
    }
}).$mount('#app')
