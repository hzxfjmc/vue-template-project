import httpRequest from '@/utils/http-request'
const axios = new httpRequest()

/**
 * 查询恒生资金账户信息
 * @param {Number} moneyType 请求参数 币种类型 0：人民币 1：美元 2：港币
 */
export const hsAccountInfo = moneyType => {
    return axios.post('/stock-capital-server/api/hs-account-info/v1', {
        moneyType
    })
}
