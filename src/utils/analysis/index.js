import { isIOS, isWeixin } from '@/utils/html-utils.js'
import LS from '@/utils/local-storage.js'
import { API_BASE_URL } from '@/utils/DOMAIN.js'
import { guid, getParameter } from '@/utils/tools.js'

// ads_click 广告点击事件换成进入页面事件 默认
// user_register 用户注册  参数 uuid
// 下载事件 download_click 参数uuid 默认 -1
export async function receiveData(actionType = 'ads_click', uuid = -1) {
    let distinctId = LS.get('distinctId')
    if (!distinctId) {
        distinctId = guid()
    }
    let recordData = {}
    const md5 = await import(`blueimp-md5`)
    let token = 'Zqo2TX6Shb86yphvV1Bm'
    let time = new Date().getTime()
    let data = md5.default(token + time)
    recordData.distinct_id = distinctId // 设备id
    recordData.channel_code = getParameter('register-cid') || ''
    recordData.channel_type = getParameter('register-ct') || ''
    recordData.os = isIOS ? 'iOS' : 'Android'
    recordData.os_version = 'os_version'
    recordData.user_agent = navigator.userAgent
    recordData.uuid = uuid
    recordData.t = time
    recordData.data = data
    recordData.action_type = actionType
    // 如果下载渠道不存在且是ads_click事件 则不统计
    if (
        !(recordData.channel_code || recordData.channel_type) &&
        actionType === 'ads_click'
    ) {
        return
    }
    let argStr = ''
    for (let key in recordData) {
        if (recordData[key]) {
            argStr += `&${key}=${encodeURIComponent(recordData[key])}`
        }
    }
    let imgSrc = `${
        API_BASE_URL.ANALYSIS
    }/receive-data/receiveData?${argStr.substr(1)}`
    let img = new Image()
    img.src = imgSrc
}

export const goAppDownLoad = (uuid = -1) => {
    if (isWeixin) {
        receiveData('download_click', uuid)
        window.location.href =
            'https://a.app.qq.com/o/simple.jsp?pkgname=com.yxzq.stock'
        return
    }
    let distinctId = LS.get('distinctId')
    if (!distinctId) {
        distinctId = guid()
    }
    location.href = `http://www.yxzq.com/download.html?appType=1&$register-cid=${getParameter(
        'register-cid'
    )}&register-ct=${getParameter(
        'register-ct'
    )}&uuid=${uuid}&distinctId=${distinctId}`
}
