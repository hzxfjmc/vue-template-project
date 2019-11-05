import { jsBridge } from 'yx-base-h5'

export const gotoNewWebView = url => {
    if (jsBridge.isYouxinApp) {
        jsBridge.gotoNewWebview(url)
    } else {
        window.location.href = url
    }
}

export default jsBridge
