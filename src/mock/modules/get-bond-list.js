import { host } from '../utils/host'
import { formatMockData } from '../utils//util'
import Mock from 'mockjs'
// 债券列表
const formatData = formatMockData({
    'bondInfoAndCurrentPriceApiResponses|0-6': [
        {
            'dueTime|1564577990837-2564577990837': 0,
            'id|1-123456789': 0,
            issuerName: '@cword(2, 6)',
            logo: '@url(http)',
            paymentFrequency: {
                'dictCode|1-10': '@word(1)',
                name: '@cword(2, 6)',
                'type|1-123456789': 0
            },
            price: {
                'buyPrice|1-10': '@word(1)',
                'buyYtm|1-10': '@word(1)',
                'sellPrice|1-10': '@word(1)',
                'sellYtm|1-10': '@word(1)',
                'updateTime|1564577990837-2564577990837': 0
            },
            'tags|0-3': [
                {
                    'id|1-123456789': 0,
                    name: {
                        'en|2-5': '@word(1)',
                        'zhCn|2-5': '@cword(1)',
                        'zhHk|2-5': '@cword(1)'
                    }
                }
            ]
        }
    ]
})
export default [
    host + '/finance-server/api/get-bond-list/v1',
    'post',
    // formatData
    function(options) {
        console.log('options:>>>', options)
        return Mock.mock(formatData)
    }
]
