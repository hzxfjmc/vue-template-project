import httpRequest from '@/utils/http-request'
const axios = new httpRequest()

export default {
    /**
     *
     * 新增转入信息
     * @param {*}
     * brokerId: 对手券商
        brokerName: 券商名称
        contact: 联络人
        exchangeType: 交易类别 0 港股 5 每股
        fundAccount: 资金账户
        settlementCode: 结算编码
        stockInfo: 转出股票json
        telephone: 联络电话
        transferAccount: 客户在对手券商账户号
        transferMode: 转股方式
        transferType:  转股类型 0 转出 1 转入
        userId: 用户id
     * @returns
     */
    addStockTransfer(form) {
        return axios.post(`/stock-order-server/api/add-stocktransfer/v1`, form)
    },
    appQueryStockTransfer(form) {
        return axios.post(`/stock-order-server/api/stocktransfer/v1`, form)
    },
    // 查询第三方证券信息
    // brokerId 雪花id
    // brokerName 券商名称
    // exchangeType 交易类型
    // id orderBy 排序 orderDirection 排序方式
    // pageNum   pageSize  pageSizeZero 是否不分页
    // requestId 请求id settlementCode 结算编码
    appAddBrokerInfo(form) {
        return axios.post(`/stock-order-server/api/brokerinfo/v1`, form)
    }
}
