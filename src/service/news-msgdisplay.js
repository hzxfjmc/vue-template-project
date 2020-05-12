import httpRequest from '@/utils/http-request'
const axios = new httpRequest()

// 要闻专题详情接口
export const getSpSubjectDetail = params => {
    return axios.get(
        `/news-msgdisplay/api/v1/abstract/sp_subject_detail`,
        params
    )
}
