import sensors from '@/utils/sensors'
// import { appType } from '../html-utils'
import LS from '@/utils/local-storage'

function login() {
    let userId = LS.get('userId')
    if (userId) {
        sensors.login(userId)

        // sensors.login(sensors.store.getFirstId())
    }
}

// 开户页浏览
export function webViewScreen(page, id = '', name = '', isReOpen) {
    if (page) {
        login()
        isReOpen = isReOpen || false
        sensors.track('yxstock_web_view_screen', {
            prop_view_page: page,
            prop_view_id: id,
            prop_view_name: name,
            // 是否重新开户
            prop_reopen: isReOpen
        })
    }
}
// 开户点击
export function webViewClick(page, id, name) {
    login()
    sensors.track('yxstock_web_view_click', {
        prop_view_page: page,
        prop_view_id: id,
        prop_view_name: name
    })
}

// 身份证上传成功
export function uploadId(id, name, result) {
    login()
    // let track = appType.Ch ? 'yxstock_uploadID' : 'hkyxstock_uploadID'
    sensors.track('yxstock_uploadID', {
        prop_view_id: id,
        prop_view_name: name,
        UpdateIDresult: result
    })
}
// 大陆-活体识别成功
export function faceverify(result) {
    login()
    sensors.track('yxstock_faceverify', {
        UpdateIDresult: result
    })
}

// // 香港-开户页浏览
// export function hkWebViewScreen(page, id = '', name = '') {
//     sensors.track('hkyxstock_web_view_screen', {
//         prop_view_page: page,
//         prop_view_id: id,
//         prop_view_name: name
//     })
// }
// // 香港-开户点击
// export function hkWebViewClick(page, id, name) {
//     sensors.track('hkyxstock_web_view_click', {
//         prop_view_page: page,
//         prop_view_id: id,
//         prop_view_name: name
//     })
// }
// // 香港-ID上传成功
// export function hkIdUpload(id, name, result) {
//     sensors.track('hkyxstock_uploadID', {
//         prop_view_id: id,
//         prop_view_name: name,
//         UpdateIDresult: result
//     })
// }
// 香港-地址证明上传成功
export function hkAddressUpload(result) {
    login()
    sensors.track('hkyxstock_uploadaddress', {
        UpdateIDresult: result
    })
}

// 预约银行卡
export function buryingReservebankcard(source) {
    sensors.track('reservebankcard', {
        source
    })
}

export function webAdClick(page, id, type) {
    sensors.track('yxstock_web_ad_click', {
        prop_view_page: page,
        prop_ad_type: type,
        prop_ad_id: id
    })
}
