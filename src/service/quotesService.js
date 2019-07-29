import httpRequest from '@/utils/http-request'
import { API_BASE_URL } from '@/utils/DOMAIN.js'
const axios = new httpRequest(API_BASE_URL.HZ)

export default {
    /**
     *
     * 股票搜索接口
     * @param {*} q,mkts,type1,type2,type3,from,size
     * @returns
     */
    searchStocks(params) {
        return axios.get(`/quotes-search/api/v2/stocks`, params)
    },
    /**
     *
     *  获取行情数据
     * @param {*} ids
     * @param {*} props
     * @returns
     */
    quote(ids, props) {
        return axios.post(`/quotes-dataservice-app/api/v2/detail`, {
            ids,
            props
        })
    }
}
