import { host } from '../../utils/host'
import { formatMockData } from '../../utils/util'
import Mock from 'mockjs'
// 债券当前价格
const formatData = formatMockData({
    currentPrice: {
        'buyPrice|1-100.3': 1,
        buyYtm: /\d{1}\.\d{2}%/,
        'sellPrice|1-100.3': 1,
        sellYtm: /\d{1}\.\d{2}%/,
        'updateTime|1564577990837-2564577990837': 0
    }
})
export default [
    host + '/finance-info-server/api/get-current-bond-prices/v1',
    'post',
    // formatData
    function(options) {
        console.log('options:>>>', options)
        return Mock.mock(formatData)
    }
]
