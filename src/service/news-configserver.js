import httpRequest from '@/utils/http-request'
const axios = new httpRequest()

/**
 * 获取债券首页banner
 * @param {Number} show_page 20 为债券首页banner
 */
export const bannerAdvertisement = show_page => {
    return axios.get('/news-configserver/api/v1/query/banner_advertisement', {
        show_page
    })
}
