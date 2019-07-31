import { host } from '../utils/host'
import { formatMockData } from '../utils//util'
// 债券列表
export default [
    host + '/finance-server/api/get-bond-list/v1',
    'post',
    formatMockData(0, '', {
        bondInfoAndCurrentPriceApiResponses: [
            {
                dueTime: 0,
                id: 0,
                issuerName: '',
                logo: '',
                paymentFrequency: {
                    dictCode: '',
                    name: '',
                    type: 0
                },
                price: {
                    buyPrice: '',
                    buyYtm: '',
                    sellPrice: '',
                    sellYtm: '',
                    updateTime: ''
                },
                tags: [
                    {
                        id: 0,
                        name: {
                            en: '',
                            zhCn: '',
                            zhHk: ''
                        }
                    }
                ]
            }
        ]
    })
]
