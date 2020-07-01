export const i18nOrderStatusData = {
    zhCHS: {
        amount: '申购金额',
        againBuy: '再买一笔',
        dialogMsg: '您是否要撤销当前订单? ',
        orderTime: '下单时间',
        orderNum: '订单号',
        orderName: '订单类型',
        orderStatus: '订单状态',
        orderFinish: '完成时间',
        orderNetWorth: '确认净值',
        orderShares: '份额',
        cancelButtonText: '取消',
        confirmButtonText: '确认',
        backoutBtnText: '撤销',
        beConfirmed: '待确认',
        failedRemark: '订单失败原因',
        fee: '手续费',
        debitWay: '扣款方式',
        orderAmount: '订单金额',
        confirmOrderShares: '确认份额',
        cashAccount: currency =>
            `${currency === 'HKD' ? '港股' : '美股'}现金账户`,
        financingAccount: currency =>
            `${currency === 'HKD' ? '港股' : '美股'}融资账户`,
        autoExchange: '自动换汇',
        returnAmount: '返还金额',
        returnRemind:
            '返还金额是指您定投的基金在交易成功后手续费的折扣部分，该笔金额会返还至您的证券账户',
        iKnow: '我知道了'
    },
    zhCHT: {
        amount: '申購金額',
        againBuy: '再買一筆',
        dialogMsg: '您是否要撤銷當前訂單?',
        orderTime: '下單時間',
        orderNum: '訂單號',
        orderName: '訂單類型',
        orderStatus: '訂單狀態',
        orderFinish: '完成時間',
        orderNetWorth: '確認淨值',
        orderShares: '份額',
        cancelButtonText: '取消',
        confirmButtonText: '確認',
        backoutBtnText: '撤銷',
        beConfirmed: '待確認',
        failedRemark: '訂單失敗原因',
        fee: '手續費',
        debitWay: '扣款方式',
        orderAmount: '訂單金額',
        confirmOrderShares: '確認份額',
        cashAccount: currency =>
            `${currency === 'HKD' ? '港股' : '美股'}現金賬戶`,
        financingAccount: currency =>
            `${currency === 'HKD' ? '港股' : '美股'}融資賬戶`,
        autoExchange: '自動換匯',
        returnAmount: '返還金額',
        returnRemind:
            '返還金額是指您定投的基金在交易成功後手續費的折扣部分，該筆金額會返還至您的證券賬戶',
        iKnow: '我知道了'
    },
    en: {
        amount: 'Subscription Investment Amount',
        againBuy: 'One More Order',
        dialogMsg: 'Would you like to cancel the order?',
        orderTime: 'Order Time',
        orderNum: 'Order No.',
        orderName: 'Order Type',
        orderStatus: 'Order Status',
        orderFinish: 'Completion Time',
        orderNetWorth: 'Confirm Net Value',
        orderShares: 'Units',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Confirm',
        backoutBtnText: 'Cancel',
        beConfirmed: 'To Be Confirmed',
        failedRemark: 'Reason',
        fee: 'Handling Fee',
        debitWay: 'Payment Way',
        orderAmount: 'Order Fee',
        confirmOrderShares: 'Confirmed Units',
        cashAccount: currency => `Cash Account(${currency})`,
        financingAccount: currency => `Margin Account(${currency})`,
        autoExchange: 'Auto Exchange',
        returnAmount: 'Subsidy Amount',
        returnRemind:
            'The amount Subsidy refers to the discounted portion of the subscribe fee for the fund you have AIP after the transaction is successful, and the amount will be returned to your securities account',
        iKnow: 'I Know'
    }
}
