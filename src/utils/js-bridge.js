import { jsBridge } from 'yx-base-h5'

//h5页面跳转
export const gotoNewWebView = url => {
    if (jsBridge.isYouxinApp) {
        jsBridge.gotoNewWebview(url)
    } else {
        window.location.href = url
    }
}

//下拉刷新
export const enablePullRefresh = enable => {
    jsBridge.callApp('command_enable_pull_refresh', { enable: enable })
}

export default jsBridge
