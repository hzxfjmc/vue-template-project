import { jsBridge } from 'yx-base-h5'
import { debounce } from './tools'

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

// 设置Webview可见时回调函数
export const setAppVisibleCallback = function(cb, context, options) {
    context = context || window
    const defaultOpts = {
        delay: 300
    }
    options = Object.assign({}, defaultOpts, options)
    jsBridge.callAppNoPromise(
        'command_watch_activity_status',
        {},
        'appVisible',
        'appInvisible'
    )
    const prevAppVisible = window.appVisible || function() {}
    window.appVisible = debounce(function(data) {
        let res = data
        if (data && typeof data === 'string') {
            res = JSON.parse(data)
        }
        if (res && res.data.status !== 'visible') {
            return
        }
        cb && cb.apply(context)
        prevAppVisible(data)
    }, options.delay)
}

export default jsBridge
