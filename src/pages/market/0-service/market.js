import config from '../0-config'
import Http from '../0-utils/http'
import { guid } from '@/utils/tools'

const hzHttp = new Http(config.hzHost) // 行情资讯
const jyHttp = new Http(config.jyHost) // 交易

// 请求拦截
jyHttp.interceptors.request.use(
    async config => {
        config.headers = {
            ...config.headers,
            'X-Time': Date.now(),
            'X-Trans-Id': guid(),
            'X-Request-Id': guid()
        }
        return config
    },
    error => Promise.reject(error)
)

/**
 * 获取普通资讯详情
 * @param data
 * 参数：{
 *     newsid： 普通资讯id
 *     type：1-普通资讯，2-必读资讯
 * }
 */
export const getNewsDetail = (data = null) =>
    hzHttp.get('/news-newsdetail/api/v1/detail', { params: data })

export const translateEnNews = (data = null) =>
    hzHttp.get('/news-newsdetail/api/v1/translate', { params: data })

/**
 * 负反馈
 * @param data
 * 参数：{
 *     newsid：资讯id
 *     feedbacks：负反馈理由，多个用‘|’分隔
 * }
 */
export const doFeedback = (data = null) =>
    hzHttp.post('/news-sharecollect/api/v1/feedback', data)

/**
 * 获取资讯文章相关推荐
 * @param data
 * 参数：{
 *     articleId：资讯id
 *     pageSize：每页返回数量
 * }
 */
export const getRelatedArticle = (data = null) =>
    hzHttp.get('/news-relatedwitharticle/api/v1/query/article', {
        params: data
    })

/**
 * 获取资讯相关个股
 * @param data
 * 参数：{
 *     articleId：资讯id
 * }
 */
export const getRelatedStock = (data = null) =>
    hzHttp.get('/news-relatedwitharticle/api/v1/query/stock', { params: data })

/**
 * 利润表
 * @param data
 * 参数：{
 *     stock：资讯id（例：hk00700）
 * }
 */
export const getIncome = (data = null) =>
    hzHttp.get('/news-basicinfo/api/v1/incomestatement', { params: data })

/**
 * 资产负债表
 * @param data
 * 参数：{
 *     stock：资讯id（例：hk00700）
 * }
 */
export const getBalance = (data = null) =>
    hzHttp.get('/news-basicinfo/api/v1/balancesheet', { params: data })

/**
 * 现金流量表
 * @param data
 * 参数：{
 *     stock：资讯id（例：hk00700）
 * }
 */
export const getCashflow = (data = null) =>
    hzHttp.get('/news-basicinfo/api/v1/cashflow', { params: data })

/**
 * 获取股票详情
 * @param data
 * 参数：{
 *     ids：股票id列表（例：['hk00700']）
 * }
 */
export const getStockDetail = (data = null) =>
    hzHttp.post('/quotes-dataservice-app/api/v2/detail', data)

/**
 * 获取h5生成器详情页面
 * @param data
 * 参数：keyword
 */
export const getGenerator = (data = {}) =>
    hzHttp.get('/news-helpcenter/api/v1/query/messagedetail', { params: data })

/**
 * h5生成器意见反馈
 * @param data
 * 参数：keyword
 */
export const generatorFeedback = (data = {}) =>
    hzHttp.post('/news-helpcenter/api/v1/feedback', data)

/**
 * 月供股股票涨跌幅和折线图
 */
export const getMonthlyStockTrend = (data = {}) =>
    hzHttp.post('/quotes-dataservice-app/api/v2/hktrend', data)

/**
 * 月供股股票涨跌幅和折线图
 */
export const getMonthlyStockBanner = (data = {}) =>
    hzHttp.get('/news-configserver/api/v1/query/banner_advertisement', {
        params: data
    })

/**
 * 月供股首页
 */
export const getRecommendStock = (data = {}) =>
    jyHttp.post('/stock-order-server/api/get-recommend-stock-list/v1', data)

/**
 * 月供股列表
 */
export const getMonthlyStockList = (data = {}) =>
    jyHttp.post('/stock-order-server/api/stock-list/v1', data)

/**
 * 我的月供列表
 */
export const myMonthlyStockList = (data = {}) =>
    jyHttp.post('/stock-order-server/api/yg-plan/v1', data)

/**
 * 創建月供股時的信息
 */
export const getMonthlyStockDetail = (data = {}) =>
    jyHttp.post('/stock-order-server/api/stock-message/v1', data)

/**
 * 創建 月供計劃
 */
export const createMonthlyStock = (data = {}) =>
    jyHttp.post('/stock-order-server/api/add-yg-plan/v1', data)

/**
 * 修改 月供計劃
 */
export const updateMonthlyStock = (data = {}) =>
    jyHttp.post('/stock-order-server/api/update-yg-plan/v1', data)

/**
 * 获取 月供計劃详情下面的列表
 */
export const getMonthlyStockPlanDetail = (data = {}) =>
    jyHttp.post('/stock-order-server/api/get-yg-detail/v1', data)

/**
 * 获取 月供计划详情
 */
export const getMonthlyStockPlanMainInfo = (data = {}) =>
    jyHttp.post('/stock-order-server/api/get-yg-user-plan/v1', data)

/**
 * 编辑月供计划状态
 */
export const editMonthlyStockStatus = (data = {}) =>
    jyHttp.post('/stock-order-server/api/edit-yg-plan/v1', data)

/**
 * 获取月供明细
 */
export const getMonthlyStockDealDetail = (data = {}) =>
    jyHttp.post('/stock-order-server/api/get-yg-deal-detail/v1', data)

/**
 * 获取月供明细中的委托费用
 */
export const getMonthlyStockEntrust = (data = {}) =>
    jyHttp.post('/stock-order-server/api/get-yg-entrust-fee/v1', data)

/**
 * 获取 月供股 字典信息
 */
export const getOrderDicInfo = (data = {}) =>
    jyHttp.post('/stock-order-server/api/dict/v1', data)

// /**
//  * 获取 资金流水 字典信息
//  */
// export const getCapitalDicInfo = (data = {}) =>
//     jyHttp.post('/stock-capital-server/api/get-dict/v1/', data)

/**
 * 模糊查询股票列表
 */
export const searchStockList = (data = {}) =>
    hzHttp.get('/quotes-search/api/v2/stocks', { params: data })

/**
 * 策略详情(长线)
 */
export const getLongStrategyDetail = (data = {}, config = null) =>
    hzHttp.get('/news-strategyserver/api/v1/query/lstrategydetail', {
        params: data,
        ...config
    })

/**
 * 策略详情(长线)趋势
 */
export const getLongStrategyTrend = (data = {}) =>
    hzHttp.get('/news-strategyserver/api/v1/query/returnratelist', {
        params: data
    })

/**
 * 策略详情(长线)历史记录
 */
export const getLongStrategyHistory = (data = {}) =>
    hzHttp.get('/news-strategyserver/api/v1/query/lstrategyhistories', {
        params: data
    })

/**
 *  获取短线股王详情
 * @param data
 * @param _no_loading
 * @returns {*}
 */
export const getStubDetail = (data = {}, _no_loading = true) =>
    hzHttp.get('/news-strategyserver/api/v1/query/sstrategydetail', {
        params: data,
        _no_loading
    })

/**
 * 获取短线股王历史记录交易日
 * @param data
 * @param _no_loading
 * @returns {*}
 */
export const getStubHistoryDate = (data = {}, _no_loading = false) =>
    hzHttp.get('/news-strategyserver/api/v1/query/tradingdaylist', {
        params: data,
        _no_loading
    })

/**
 * 获取短线股王历史纪录
 * @param data
 * @param _no_loading
 * @returns {*}
 */
export const getStubHistory = (data = {}, _no_loading = false) =>
    hzHttp.get('/news-strategyserver/api/v1/query/sstrategyhistories', {
        params: data,
        _no_loading
    })

/**
 * 短线策略订阅接口
 * @param data
 * @returns {*}
 */
export const strategySubscribe = (data = null) =>
    hzHttp.post('/news-strategyserver/api/v1/subscribe', data)

/**
 * 获取消息中心主页信息
 * @param data
 * @returns {*}
 */
export const getMsgCenterIndex = (data = {}) =>
    hzHttp.get('/message-center/api/v1/hkgetmsg', {
        params: data
    })

/**
 * 通知中心具体分类消息列表
 * @param data
 * @returns {*}
 */
export const getMsgCenterDetailList = (data = {}) =>
    hzHttp.get('/message-center/api/v1/catalogs/hkgetmsg', {
        params: data
    })

/**
 * 所有消息标记为已读
 * @param data
 * @returns {AxiosPromise<any> | * | void | this | this | IDBRequest<IDBValidKey> | Promise<void>}
 */
export const markAllMessageRead = (data = {}) =>
    hzHttp.put('/message-center/api/v1/markallread', data)

// 获取客户资金流水
export const fetchFundRecord = (data = {}, config = null) =>
    jyHttp.post('/stock-capital-server/api/fetch-fund-record/v1', data, config)

/**
 * 保存客户美股行情声明
 * @param data
 * @returns {*}
 */
export const saveUsStockMarketStatement = (data = {}) =>
    jyHttp.post(
        '/user-account-server/api/save-cust-us-stock-market-statement/v1',
        data
    )

/**
 * 获取美股行情声明协议
 * @param params
 * @param data
 */
export const getUsStockMarketStatementProtocol = (params = {}, data = {}) =>
    jyHttp.postForm('/config-manager/api/cfg-pro-select/v1', {
        params,
        data,
        _no_loading: true
    })
// export const getUsStockMarketStatementProtocol = (data = {}) =>
//     jyHttp.getForm(
//         '/user-account-server/api/get-cust-us-stock-market-statement/v1',
//         data
//     )

/**
 * 获取职业状况页面选项值
 * @param data
 * @returns {*}
 */
export const getJobOptions = (data = {}) =>
    jyHttp.getForm('/user-account-server/api/get-open-account-job-status/v1', {
        data,
        _no_loading: true
    })

// 获取交易登录状态
export const getTradeStatus = (data = {}) =>
    jyHttp.get('/user-server/api/get-trade-status/v1', {
        params: data,
        data: {}, // 不设置data属性，Content-Type属性将会被一次
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
