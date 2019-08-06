import { host } from '../utils/host'
import { formatMockData } from '../utils//util'
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
        issuerInfo: '@cword(2, 10)',
        name: '@word(1, 10)',
        productOverview: '@url(http)',
        raiseManual: '@url(http)'
    },
    bondUneditableInfo: {
        code: /\w\d{1,6}/,
        'couponRate|1-100': 0,
        'dueTime|1564577990837-2564577990837': 0,
        enumCodeType: {
            name: '@cword(2, 6)',
            'type|1-10': 0
        },
        enumCurrency: {
            name: '@cword(2, 6)',
            'type|1-10': 0
        },
        enumDelivery: /\w{1,10}/,
        enumInterestBenchmark: /\w{1,10}/,
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
export default [
    host + '/finance-info-server/api/get-bond-detail/v1',
    'post',
    // formatData
    function(options) {
        console.log('options:>>>', options)
        return Mock.mock(formatData)
    }
]
