export const holdDetailsData = {
    yesterdayEarnings: {
        label: '昨日收益',
        key: '',
        value: '00.00',
        cname: '',
        layout: 'left'
    },
    positionEarnings: {
        label: '持有收益',
        key: '',
        cname: '+',
        value: '00.00',
        layout: 'center'
    },
    // costPrice: {
    //     label: '持仓成本',
    //     key: '',
    //     layout: 'right',
    //     value: '00.00'
    // },
    positionShare: {
        label: '持有份额',
        key: '',
        layout: 'right',
        value: '00.00'
    },
    positionMarketValue: {
        label: '持有金额',
        layout: 'left',
        cname: '$',
        key: '',
        value: '00.00'
    },
    inTransitAmount: {
        label: '待确认金额',
        key: '',
        layout: 'center',
        value: '0.00'
    }
}

export const i18nHoldDetailsData = {
    zhCHS: {
        holdFundTitle: '持仓详情',
        holdDetailsData: {
            yesterdayEarnings: {
                label: '昨日收益'
            },
            positionEarnings: {
                label: '持有收益'
            },
            // costPrice: {
            //     label: '持仓成本'
            // },
            positionShare: {
                label: '持有份额'
            },
            positionMarketValue: {
                label: '持有市值'
            },
            inTransitAmount: {
                label: '待确认金额'
            }
        }
    },
    zhCHT: {
        holdFundTitle: '持倉詳情',
        holdDetailsData: {
            holdDetailsData: {
                yesterdayEarnings: {
                    label: '昨日收益'
                },
                positionEarnings: {
                    label: '持有收益'
                },
                costPrice: {
                    label: '持倉成本'
                },
                positionShare: {
                    label: '持有份額'
                },
                positionMarketValue: {
                    label: '待確認金額'
                },
                inTransitAmount: {
                    label: '待确认金额'
                }
            }
        }
    },
    en: {
        holdFundTitle: 'Positon',
        holdDetailsData: {
            holdDetailsData: {
                yesterdayEarnings: {
                    label: 'Yesterday P/L'
                },
                positionEarnings: {
                    label: 'Total P/L'
                },
                costPrice: {
                    label: 'Cost'
                },
                positionShare: {
                    label: 'Holding Units'
                },
                positionMarketValue: {
                    label: 'Holding Value'
                },
                inTransitAmount: {
                    label: 'Amount to be confirmed'
                }
            }
        }
    }
}
