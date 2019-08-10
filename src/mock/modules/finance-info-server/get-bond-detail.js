import { host } from '../../utils/host'
import { formatMockData, comp } from '../../utils/util'
import Mock from 'mockjs'
// 债券信息详情
const formatData = formatMockData({
    bondEditableInfo: {
        creditRating: {
            rank: /A{1,5}/,
            agency: '@cword(2, 6)'
        },
        'displayOrder|1-100': 0,
        'isDisplay|1': true,
        'isTop|1': true,
        logo: '',
        nameCn: '@cword(1, 30)',
        nameEn: '@word(1, 30)',
        nameHk: '@cword(1, 30)',
        productOverview: '@url(http)',
        raiseManual: '@url(http)',
        riskLevel: {
            name: '@cword(2, 6)',
            'type|1-10': 0
        },
        bindStock: {
            stockCode: /\d{6}/,
            stockMarket: {
                name: '@cword(2, 6)',
                'type|1-10': 0
            }
        },
        stockInfo: {
            stockCode: /00\d{3}/,
            stockMarket: {
                'type|1-10': 1,
                name: '@word(2,5)'
            }
        },
        'tags|1': comp([
            {
                'displayOrder|1-100': 0,
                'id|1-123456789': 0,
                name: {
                    en: '@word(2,8)',
                    zhCn: '@cword(2,8)',
                    zhHk: '@cword(2,8)'
                }
            }
        ]),
        issuer: {
            'id|1-123456789': 1,
            rankInfo: {
                rank: /A{1,5}/,
                agency: '@cword(2, 6)',
                'creditRatingId|1-123456789': 1
            },
            name: '@cword(2,4)',
            nameHK: '@cword(2,4)',
            nameEn: '@word(2,4)'
        }
    },
    bondUneditableInfo: {
        code: /\w\d{1,6}/,
        couponRate: /0\.0\d{3}/,
        'dueTime|1564577990837-2564577990837': 0,
        enumCodeType: {
            name: '@word(2, 6)',
            'type|1-10': 0
        },
        enumCurrency: {
            name: '@cword(2, 6)',
            'type|1-10': 0
        },
        enumDelivery: {
            'type|1-10': 0,
            name: '@word(2, 6)'
        },
        enumInterestBenchmark: {
            'type|1-10': 0,
            name: '@word(2, 6)'
        },
        enumPaymentFrequency: {
            name: '@cword(2, 6)',
            'type|1-10': 0
        },
        enumPaymentType: {
            name: '@cword(2, 6)',
            'type|1-10': 0
        },
        'issueTime|1564577990837-2564577990837': 0,
        'minFaceValue|100-5000': 0,
        'paymentDate|1564577990837-2564577990837': 0
    },
    currentPrice: {
        'buyPrice|1-100.3': 1,
        buyYtm: /\d{1}\.\d{2}%/,
        'sellPrice|1-100.3': 1,
        sellYtm: /\d{1}\.\d{2}%/,
        'updateTime|1564577990837-2564577990837': 0
    },
    'id|1-123456789': 0,
    'prices|1-3': [
        {
            'buyPrice|1-100.3': 1,
            buyYtm: /\d{1}\.\d{2}%/,
            'sellPrice|1-100.3': 1,
            sellYtm: /\d{1}\.\d{2}%/,
            'updateTime|1564577990837-2564577990837': 0
        }
    ]
})
let url = '/finance-info-server/api/get-bond-detail/v1'
let method = 'post'
export default [
    host + url,
    method,
    // formatData
    function(options) {
        console.log('options:>>>', options)
        return Mock.mock(formatData)
    },
    {
        url: host + url,
        method,
        formatData
    }
]
