// aaaa-bbbb-cccc => aBbbbCccc
import { Toast } from 'vant'
import jsBridge from '@/utils/js-bridge.js'
import LS from '@/utils/local-storage.js'
import dayjs from 'dayjs'

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
// 防抖
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
 * 节流 规定时间内不管触发多少次只执行一次,与防抖不同，节流可以在第一次时候马上执行
 * @param {Function} fn 实际要执行的业务逻辑函数
 * @param {Number} duration 在规定时间段内，业务逻辑函数只能执行一次，单位毫秒
 */
export const throttle = (fn, duration) => {
    let prev = Date.now(),
        timerid = null
    return function() {
        let now = Date.now()
        let args = arguments
        clearTimeout(timerid) // 一定要提前清除定时器，因为可以 else 分支执行后，设置了一个定时器，如果第二次触发满足 if 条件，则总共会执行两次
        if (now - prev >= duration) {
            // 到了预定时间，执行设定函数
            fn.apply(this, args)
            prev = now
        } else {
            // 没到预定时机，但是事件被触发了，重新起一个定时器
            timerid = setTimeout(() => {
                // 这里保证了最少执行一次，否则达不到 if 条件，函数一次都不会执行
                prev = now
                fn.apply(this, args)
            }, duration)
        }
    }
}
/**
 * 计算剩余时间
 * @param {Number} timestamp 时间戳
 * return xx年xx天
 */
export const calcCountDownDay = function(timestamp) {
    if (!timestamp) return '--'

    let yearCircle = 365
    let currentTime = new Date().getTime()
    let restDay = (timestamp - currentTime) / 1000 / 60 / 60 / 24 // 秒 分钟 小时 天  --- 得到剩余天数
    restDay = Math.floor(restDay)
    let year = Math.floor(restDay / yearCircle) // 得到剩余年数
    if (year < 1) {
        return restDay + '天'
    } else {
        return year + '年' + (restDay - yearCircle * year) + '天'
    }
}

/**
 * 格式化日期
 * @param {Number} date 时间戳
 * @param {String} format 格式
 */
export const dateFormat = function(date, format = 'YYYY-MM-DD HH:mm') {
    return dayjs(date).format(format)
}

// 生成uuid唯一标识
export const generateUUID = () => {
    let d = new Date().getTime()
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function(c) {
            const r = (d + Math.random() * 16) % 16 | 0
            d = Math.floor(d / 16)
            return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
        }
    )
    return uuid
}
