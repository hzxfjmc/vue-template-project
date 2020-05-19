import httpRequest from '@/utils/http-request'
import { API_BASE_URL } from '@/utils/DOMAIN.js'
const axios = new httpRequest(API_BASE_URL.HZ)

// 要闻专题详情接口
export const getSpSubjectDetail = params => {
    return axios.get(
        `/news-msgdisplay/api/v1/abstract/sp_subject_detail`,
        params
    )
}
