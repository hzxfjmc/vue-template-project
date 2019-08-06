import { host } from '../../utils/host'
import { formatMockData } from '../../utils/util'
import Mock from 'mockjs'
// 债券列表
const formatData = formatMockData({
    'bondInfoAndCurrentPriceApiResponses|1-6': [
        {
            bondName: '@cword(2, 6)',
            'dueTime|1564577990837-2564577990837': 0,
            'id|1-123456789': 0,
            'paymentDates|1564577990837-2564577990837': 0,
            paymentFrequency: {
                name: '@cword(2, 6)',
                'type|1-10': 0
            },
            price: {
                'buyPrice|1-100.3': 1,
                buyYtm: /\d{1}\.\d{2}%/,
                'sellPrice|1-100.3': 1,
                sellYtm: /\d{1}\.\d{2}%/,
                'updateTime|1564577990837-2564577990837': 0
            },
            'tags|0-3': [
                {
                    'displayOrder|1-100': 0,
                    'id|1-123456789': 0,
                    name: {
                        en: '@word(2,5)',
                        zhCn: '@cword(2,5)',
                        zhHk: '@cword(2,5)'
                    }
                }
            ]
        }
    ]
})
export default [
    host + '/finance-info-server/api/get-bond-list/v1',
    'post',
    // formatData
    function(options) {
        console.log('options:>>>', options)
        return Mock.mock(formatData)
    }
]
