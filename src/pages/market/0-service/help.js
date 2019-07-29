import config from '../0-config'
import Http from '../0-utils/http'

const http = new Http(config.hzHost)
const baseUrl = '/news-configserver/api'
const helpBaseUrl = '/news-helpcenter/api'

/**
 * 获取常见问题列表
 * @param data
 * 参数：无
 */
export const getCommonQuestionList = (data = {}) =>
    http.get(helpBaseUrl + '/v1/query/commonquestionlist', { params: data })

/**
 * 获取匹配搜索问题
 * @param data
 * 参数：{
 *     keyword
 * }
 */
export const autoSearchList = (data = {}) =>
    http.get(helpBaseUrl + '/v1/query/autosearch', { params: data })

/**
 * 获取帮助中心banner
 * @param data
 * 参数：{
 *     show_page：展示位置代码9
 *
 * }
 */
export const getBanner = (data = {}) =>
    http.get(baseUrl + '/v1/query/banner_advertisement', { params: data })

/**
 * 获取帮助中心首页
 * @param data
 * 参数：无
 */
export const getHomePageList = (data = {}) =>
    http.get(helpBaseUrl + '/v1/query/homepage', { params: data })

/**
 * 获取帮助一级
 * @param data
 * 参数：id:一级id
 */
export const getCategoryHomePage = (data = {}) =>
    http.get(helpBaseUrl + '/v1/query/categoryhomepage', { params: data })

/**
 * 获取获取搜索接口列表
 * @param data
 * 参数：{
 *     keyword:关键词
 *     index:偏移量
 *     size:每页条数
 * }
 */
export const getSearchList = (data = {}) =>
    http.get(helpBaseUrl + '/v1/query/keysearch', { params: data })
