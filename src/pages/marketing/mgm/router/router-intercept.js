import { isYouxinApp } from '@/utils/html-utils.js'
import { wechatShare } from '@/utils/share/wechat.js'
import jsBridge from '@/utils/js-bridge'
import LS from '@/utils/local-storage.js'
import { setToken } from '@/utils/http-request'
import { getParameter } from '@/utils/tools'

let inviteCode = ''
let inviteName = ''
let activityId = ''

// 微信分享
function share(inviteName, inviteCode, activityId) {
    wechatShare({
        title: '【uSMART友信智投 邀請好友 獲賞現金及股票】',
        desc: `好友${inviteName}邀請您齊齊攞高達港幣$2,600現金獎賞及匯豐銀行、港交所、港鐵等股票`,
        link: `${window.location.origin}/webapp/marketing/mgm.html?ICode=${inviteCode}&n=${inviteName}&id=${activityId}#/`,
        imgUrl: `${window.location.origin}/webapp/marketing/images/facebook.jpg`
    })
}

export default (router, store) => {
    router.beforeEach(async (to, from, next) => {
        // 需要绑定手机号但是未绑定的情况 未登录先登录
        if (isYouxinApp) {
            try {
                let data = await jsBridge.callApp('get_user_info')
                LS.put('userToken', data.userToken)
                setToken(data.userToken)
                store.dispatch('setUserInfo', {
                    inviteName: data.userName,
                    inviteCode: data.invitationCode,
                    userToken: data.userToken
                })
            } catch (e) {
                console.log(e)
            } finally {
                next()
            }
        } else {
            if (store.getters.userInfo.userToken) {
                inviteCode = store.getters.userInfo.inviteCode
                inviteName = store.getters.userInfo.inviteName
                activityId = store.getters.activityId
            } else {
                let name = getParameter('n')
                let id = getParameter('id')
                let code = getParameter('ICode')
                inviteCode = code || store.getters.userInfo.inviteCode
                inviteName = name || store.getters.userInfo.inviteName
                activityId = id || store.getters.activityId
                if (name && code) {
                    store.dispatch('setUserInfo', {
                        inviteName: name,
                        inviteCode: code
                    })
                }
            }
            share(inviteName, inviteCode, activityId)
            getParameter('id') &&
                store.dispatch('setActivityId', getParameter('id'))
            next()
        }
    })
}
