// aaaa-bbbb-cccc => aBbbbCccc
import { Toast } from 'vant'
import jsBridge from '@/utils/js-bridge.js'
import LS from '@/utils/local-storage.js'

const camelizeRE = /-(\w)/g
export function camelize(str) {
    return str.replace(camelizeRE, (_, c) => c.toUpperCase())
}

export function isDef(value) {
    return value !== undefined && value !== null
}

export function isObj(x) {
    const type = typeof x
    return x !== null && (type === 'object' || type === 'function')
}

export function guid() {
    var d = Date.now()
    if (
        typeof performance !== 'undefined' &&
        typeof performance.now === 'function'
    ) {
        d += performance.now() //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
}
// 生成图形验证码的key
export const getVerifyCodeKey = moduleName =>
    moduleName + Date.now() + Math.ceil(Math.random() * 100)

// 获取hash中或者search中携带参数
export function getParameter(name) {
    let RegExpObject = new RegExp(
        '[?&]' + encodeURIComponent(name) + '=([^&]*)'
    )
    if ((name = RegExpObject.exec(window.location.search)))
        return decodeURIComponent(name[1])
}

export function goPdfPreview(url) {
    LS.put('pdfUrl', url)
    if (url) {
        const path = `${location.origin}/webapp/open-account-hk/apply.html#/pdf-preview`
        jsBridge.gotoNewWebview(path)
    } else {
        Toast('URL is null')
    }
}
export const debounce = (fn, delay) => {
    // 定时器，用来 setTimeout
    var timer = null
    // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
    return function() {
        // 保存函数调用时的上下文和参数，传递给 fn
        var context = this
        var args = arguments
        // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
        clearTimeout(timer)

        // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
        // 再过 delay 毫秒就执行 fn
        timer = setTimeout(function() {
            fn.apply(context, args)
        }, delay)
    }
}

/**
 * 计算剩余时间
 * @param {Number} t 时间戳
 * return xx年xx天
 */
export const calcCountDownDay = function(t) {
    if (!t) return '--'

    let yearCircle = 365
    let currentTime = new Date().getTime()
    let restDay = (t - currentTime) / 1000 / 60 / 60 / 24 // 秒 分钟 小时 天  --- 得到剩余天数
    restDay = Math.floor(restDay)
    console.log('restDay :', restDay)
    let year = Math.floor(restDay / yearCircle) // 得到剩余年数
    if (year < 1) {
        return restDay + '天'
    } else {
        return year + '年' + (restDay - yearCircle * year) + '天'
    }
}
