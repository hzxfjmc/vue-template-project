export const TRADE_TYPES = {
    // 申购
    SUBSCRIBE: 1,
    // 赎回
    REDEMPTION: 2,
    // 其他
    OTHER: 3,
    // 分红
    DIVIDEND: 4
}

export const ORDER_STATUS = {
    // 确认中
    CONFIRMING: 1,
    // 交易中
    DEALING: 2,
    // 交易取消
    CANCEL: 3,
    // 交易失败
    FAILED: 4,
    // 交易成功
    SUCCEED: 5
}

export const accountTypeMap = {
    // 现金
    CASH: 1,
    // 融资
    FINANCING: 2
}

// 分红类型
export const DIVIDEND_TYPE = {
    // 不分红
    NO_DIVIDEND: 1,
    // 现金分红
    CASH_DIVIDEND: 2,
    // 分红再投资
    SHARE_DIVIDEND: 3
}
