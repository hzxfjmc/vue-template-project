import sensors from '../../0-third/sensors'
import JSBridge from '@/utils/js-bridge'
import { getUrlParam } from '../../0-utils'

if (JSBridge.isYouxinApp) {
    sensors.getAppStatus(function(app_info) {
        sensors.identify(app_info.distinct_id)
    })
}
export default function buryingPoint(options = {}) {
    sensors.track('yxstock_web_click', {
        prop_view_page: document.title,
        prop_view_name: options.view_name || '',
        prop_info_source: options.info_source || '',
        prop_stock_id: options.stock_id || '',
        prop_info_id: getUrlParam('id')
    })
}
