import { host } from '../utils/host'
import { formatMockData } from '../utils//util'
// 债券信息详情
export default [
    host + '/finance-info-server/api/get-bond-detail/v1',
    'post',
    formatMockData(0, '', {
        bondEditableInfo: {
            creditRating: {
                rank: 'AAA',
                type: '标普'
            },
            displayOrder: 0,
            isDisplay: true,
            isTop: true,
            logo: '',
            name: '',
            productOverview: '',
            raiseManual: ''
        },
        bondUneditableInfo: {
            code: '',
            couponRate: '',
            dueTime: 0,
            enumCodeType: {
                dictCode: '',
                name: '',
                type: 0
            },
            enumCurrency: {
                dictCode: '',
                name: '',
                type: 0
            },
            enumDelivery: '',
            enumInterestBenchmark: '',
            enumPaymentFrequency: {
                dictCode: '',
                name: '',
                type: 0
            },
            enumPaymentType: {
                dictCode: '',
                name: '',
                type: 0
            },
            issueTime: 0,
            minFaceValue: 0
        },
        currentPrice: {
            buyPrice: '',
            buyYtm: '',
            sellPrice: '',
            sellYtm: '',
            updateTime: ''
        },
        id: 0,
        prices: [
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
