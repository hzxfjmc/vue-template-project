export const holdDetailsData = {
    positionMarketValue: {
        label: '持有资产',
        layout: 'left',
        cname: '$',
        key: '',
        value: '00.00'
    },
    weekEarnings: {
        label: '近7日收益',
        key: '',
        value: '00.00',
        cname: '+',
        layout: 'center'
    },
    positionEarnings: {
        label: '持仓收益',
        key: '',
        cname: '+',
        value: '00.00',
        layout: 'right'
    },
    positionShare: {
        label: '持有份额',
        key: '',
        layout: 'left',
        value: '00.00'
    },
    redeemDeliveryShare: {
        label: '赎回中(份额）',
        key: '',
        layout: 'center',
        value: '0.00'
    },
    inTransitAmount: {
        label: '申购中(金额）',
        key: '',
        layout: 'right',
        value: '0.00'
    }
}

export const i18nHoldDetailsData = {
    zhCHS: {
        holdFundTitle: '持仓详情',
        holdDetailsData: {
            weekEarnings: {
                label: '近7日收益'
            },
            positionEarnings: {
                label: '持仓收益'
            },
            positionShare: {
                label: '持有份额'
            },
            positionMarketValue: {
                label: '持有资产'
            },
            inTransitAmount: {
                label: '申购中(金额）'
            },
            redeemDeliveryShare: {
                label: '赎回中(份额）'
            }
        }
    },
    zhCHT: {
        holdFundTitle: '持倉詳情',
        holdDetailsData: {
            weekEarnings: {
                label: '昨日收益'
            },
            positionEarnings: {
                label: '持有收益'
            },
            positionShare: {
                label: '持有份額'
            },
            positionMarketValue: {
                label: '持有市值'
            },
            inTransitAmount: {
                label: '待確認金額'
            },
            redeemDeliveryShare: {
                label: '赎回份额'
            }
        }
    },
    en: {
        holdFundTitle: 'Positon',
        holdDetailsData: {
            weekEarnings: {
                label: 'Yesterday P/L'
            },
            positionEarnings: {
                label: 'Total P/L'
            },
            positionShare: {
                label: 'Holding Units'
            },
            positionMarketValue: {
                label: 'Holding Value'
            },
            inTransitAmount: {
                label: 'Amount to be CFMD'
            },
            redeemDeliveryShare: {
                label: '赎回份额'
            }
        }
    }
}
