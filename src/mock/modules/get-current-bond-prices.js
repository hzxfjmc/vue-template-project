import { host } from '../utils/host'
import { formatMockData } from '../utils//util'
// 债券当前价格
export default [
    host + '/finance-info-server/api/get-current-bond-prices/v1',
    'post',
    formatMockData(0, '', {
        currentPrice: {
            buyPrice: '',
            buyYtm: '',
            sellPrice: '',
            sellYtm: '',
            updateTime: ''
        }
    })
]
