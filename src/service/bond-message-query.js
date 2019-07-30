// 债券信息查询接口
import httpRequest from '@/utils/http-request'
const axios = new httpRequest()

// 获取债券列表
export const getBondList = () => {
    return axios.post('/finance-server/doc/finance-server/api/get-bond-list/v1')
}
