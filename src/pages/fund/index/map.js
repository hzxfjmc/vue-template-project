// 币种枚举：0-人民币 1-美元 2-港元 3-欧元 4-澳元 5-韩元 6-日元
export const enumCurrency = {
    CNY: 0,
    USD: 1,
    HKD: 2,
    EUR: 3,
    AUS: 4,
    KRW: 5,
    JPY: 6
}

export const CURRENCY_NAME = {
    en: {
        0: 'CNY',
        1: 'USD',
        2: 'HKD',
        3: 'EUR',
        4: 'AUS',
        5: 'KRW',
        6: 'JPY'
    },
    zhCHS: {
        0: '人民币',
        1: '美元',
        2: '港币',
        3: '欧元',
        4: '澳元',
        5: '韩元',
        6: '日元'
    },
    zhCHT: {
        0: '人民幣',
        1: '美元',
        2: '港幣',
        3: '歐元',
        4: '澳元',
        5: '韓元',
        6: '日元'
    }
}

// 基金类型枚举
export const FUND_ASSET_TYPE = {
    Equity: {
        label_Cn: '股票型',
        label_Hk: '股票型',
        label_En: 'Equity',
        type: 1,
        value: 1
    },
    Bond: {
        label_Cn: '债券型',
        label_Hk: '債券型',
        label_En: 'Bond',
        type: 2,
        value: 2
    },
    Balanced: {
        label_Cn: '混合型',
        label_Hk: '混合型',
        label_En: 'Balanced',
        type: 3,
        value: 3
    },
    MMF: {
        label_Cn: '货币型',
        label_Hk: '貨幣型',
        label_En: 'MMF',
        type: 4,
        value: 4
    },
    Index: {
        label_Cn: '指数型',
        label_Hk: '指數型',
        label_En: 'Index',
        type: 5,
        value: 5
    },
    Financial: {
        label_Cn: '理财产品',
        label_Hk: '理財產品',
        label_En: 'Financial Product',
        type: 6,
        value: 6
    }
}
