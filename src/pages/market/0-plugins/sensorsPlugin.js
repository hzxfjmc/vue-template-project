import sensors from '@market-third/sensors'
import JSBridge from '@/utils/js-bridge.js'

// 神策埋点相关
export default {
    install(Vue) {
        /**
         * 神策买点通用方法
         * @param event
         * @param options
         * @param options.prop_view_page 页面标题
         * @param options.prop_view_name 按钮名称
         * @param options.prop_info_source 策略名称
         * @param options.prop_stock_id 股票id
         * @param options.prop_info_id 策略id
         */
        Vue.prototype.$buriedPoint = (event, options) => {
            console.log(
                `event: ${event};event options:${JSON.stringify(options)}`
            )
            // app获取用户信息
            JSBridge.isYouxinApp &&
                sensors.getAppStatus(app_info =>
                    sensors.identify(app_info.distinct_id)
                )

            // 发送事件
            sensors.track(event, { ...options })
        }

        /**
         * 股王神策埋点
         * @param options.prop_view_page 策略详情/历史记录
         * @param options.prop_view_name 历史记录/个别股票/符号/订阅/已订阅
         */
        Vue.prototype.$stockBuriedPoint = options => {
            Vue.prototype.$buriedPoint('yxstock_web_click', {
                prop_view_page: '',
                prop_view_name: '',
                prop_info_source: '',
                prop_stock_id: '',
                prop_info_id: '',
                ...options
            })
        }

        /**
         * 消息中心埋点
         * @param options.prop_view_name 标记已读、系统公告、业务提醒、精选活动
         */
        Vue.prototype.$messageBuriedPoint = options => {
            Vue.prototype.$buriedPoint('yxstock_web_click', {
                prop_view_page: '消息中心',
                prop_view_name: '',
                ...options
            })
        }
    }
}
