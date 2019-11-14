import httpRequest from '@/utils/http-request'
import { DOMAIN } from 'yx-base-h5'
const axios = new httpRequest(DOMAIN.API_BASE_URL.HZ)

/**
 * 获取债券首页banner
 * @param {Number} show_page 20 为债券首页banner
 */
export const bannerAdvertisement = show_page => {
    return axios.get('/news-configserver/api/v1/query/banner_advertisement', {
        show_page
    })
}
