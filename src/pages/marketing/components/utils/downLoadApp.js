import { receiveData } from '@/utils/analysis/index.js'
import { isAndroid } from '@/utils/html-utils'

const downloadUrl = {
    android: 'https://play.google.com/store/apps/details?id=com.usmart.stock',
    ios: 'https://apps.apple.com/app/id1463024118'
}

export function isMobile() {
    let ua = navigator.userAgent.toLowerCase()
    return /(iphone|ipad|opera mini|android.*mobile|netfront|psp|blackberry|windows phone)/gi.test(
        ua
    )
}
export function isDownLoadApp(goH5, moduleUrl, appUrl, uuid) {
    let ua = navigator.userAgent.toLowerCase()
    if (this.$jsBridge.isYouxinApp) {
        if (goH5) {
            this.$jsBridge.gotoNewWebview(moduleUrl)
        } else {
            this.$jsBridge.gotoNativeModule(moduleUrl)
        }
    } else if (isMobile()) {
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            //  在微信中打开
            this.$alert('請在瀏覽器中打開！')
        } else {
            let isJump = false
            document.addEventListener('visibilitychange', () => {
                isJump = true
            })
            if (goH5) {
                window.location.href = `yxusmart://yx.usmart.app/h5_page?url=${encodeURIComponent(
                    moduleUrl
                )}`
            } else {
                window.location.href = appUrl
            }
            setTimeout(() => {
                if (!isJump) {
                    window.location.href =
                        downloadUrl[isAndroid ? 'android' : 'ios']
                }
            }, 3000)
            receiveData('download_click', uuid)
        }
    } else {
        window.open(`https://usmartsecurities.com/hk/zh-hk/download`, '_blank')
    }
}
