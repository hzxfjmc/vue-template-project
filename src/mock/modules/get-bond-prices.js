import { host } from '../utils/host'
import { formatMockData } from '../utils//util'
// 债券价格详情
export default [
    host + '/finance-info-server/api/get-bond-prices/v1',
    'post',
    formatMockData(0, '', {
        bondDetailPriceInfo: {
            buyPrice: '',
            buyYtm: '',
            sellPrice: '',
            sellYtm: '',
            updateTime: ''
        },
        bondPrices: [
            {
                buyPrice: '',
                buyYtm: '',
                sellPrice: '',
                sellYtm: '',
                updateTime: ''
            }
        ]
    })
]
