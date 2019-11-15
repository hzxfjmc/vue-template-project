import httpRequest from '@/utils/http-request'
const axios = new httpRequest()

/**
 * 获取用户套餐
 * @param {Number} data 请求参数
 *  {Number} stockBusinessType 0 -股票，1- 债券
 *  {Number} userId 用户id
 */
export const feePackageCurr = data => {
    return axios.post('/product-server/api/fee_package_curr', data)
}

/**
 * 获取活动费用
 * @param {Number} data 请求参数
 *   @param {String} feeType 费用类别 8:活动费
 *   @param {Number} currency 币种: 2港币,1美元
 *   @param {Number} entrustType 委托类型: 1, 电话委托 2, 手机委托 0-全部
 *   @param {Boolean} isBuying 是否买入方向收费
 *   @param {Boolean} isSale 是否卖出方向收费
 *   @param {String} stockType 股票类型: 0-股票(stock),1-基金(Fund),2-红利(Dividend),D-交易权证(WRNT),F-一篮子权证(BWRT),U-债券(BOND),!-全部
 *   @param {Number} feeMethod 用户id
 *   @param {Number} marketType 用户id  0：港股  6：债券  5美股
 * 上面全都非必传参数
 * 查询债券活动费主要传 feeType：8  和 marketType： 6
 */
export const feePackageAgent = data => {
    return axios.post('/product-server/api/fee_package_agent', data)
}
