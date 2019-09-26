import sensors from 'sa-sdk-javascript'
import config from './config'

// 神策服务器地址
const sensorsUrl_test = config.isMainland
    ? 'http://10.55.4.19:8106/sa?project=default'
    : 'http://10.55.4.19:8106/sa?project=production'
const sensorsUrl_pro = config.isMainland
    ? 'https://sc.yxzq.com/sa?project=default'
    : 'https://sc.yxzq.com/sa?project=production'

sensors.init({
    server_url: config.env === 'production' ? sensorsUrl_pro : sensorsUrl_test,
    heatmap_url: location.origin + '/webapp/market/sensors/heatmap.min.js',
    heatmap: {
        // 是否开启点击图，默认 default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭
        clickmap: 'default',
        // 是否开启触达注意力图，默认 default 表示开启，自动采集 $WebStay 事件，可以设置 'not_collect' 表示关闭
        scroll_notice_map: 'default'
    },
    show_log: false
})

// sensors.login('userID')

sensors.quick('autoTrack')

export default sensors
