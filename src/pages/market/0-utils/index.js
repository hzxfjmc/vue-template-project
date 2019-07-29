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

// 获取地址栏参数
export const getUrlParam = name => {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let loc = decodeURIComponent(window.location.search)
    let r = loc.substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
}

// 获取元素距离文档的距离
export const offsetToBody = el => {
    if (el.offsetParent) {
        return {
            left: el.offsetLeft + offsetToBody(el.offsetParent).left,
            top: el.offsetTop + offsetToBody(el.offsetParent).top
        }
    } else {
        return {
            left: el.offsetLeft,
            top: el.offsetTop
        }
    }
}

// 防抖函数
export const debounce = function(func, wait, immediate) {
    let timeout, args, context, timestamp, result

    const later = function() {
        // 据上一次触发时间间隔
        const last = Date.now() - timestamp

        // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last)
        } else {
            timeout = null
            // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.apply(context, args)
                if (!timeout) context = args = null
            }
        }
    }

    return function() {
        context = this
        args = arguments
        timestamp = Date.now()
        const callNow = immediate && !timeout
        // 如果延时不存在，重新设定延时
        if (!timeout) timeout = setTimeout(later, wait)
        if (callNow) {
            result = func.apply(context, args)
            context = args = null
        }
        return result
    }
}

// 节流函数
export const throttle = function(func, wait, options) {
    let timeout, context, args, result
    let previous = 0
    if (!options) options = {}

    const later = function() {
        previous =
            options.leading === false ? 0 : Date.now() || new Date().getTime()
        timeout = null
        result = func.apply(context, args)
        if (!timeout) context = args = null
    }

    const throttled = function() {
        const now = Date.now() || new Date().getTime()
        if (!previous && options.leading === false) previous = now
        const remaining = wait - (now - previous)
        context = this
        args = arguments
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout)
                timeout = null
            }
            previous = now
            result = func.apply(context, args)
            if (!timeout) context = args = null
        } else if (!timeout && options.trailing !== false) {
            // 判断是否设置了定时器和 trailing
            timeout = setTimeout(later, remaining)
        }
        return result
    }

    throttled.cancel = function() {
        clearTimeout(timeout)
        previous = 0
        timeout = context = args = null
    }

    return throttled
}

export const isArray = value =>
    Object.prototype.toString.call(value) === '[object Array]'

export const isObject = value =>
    Object.prototype.toString.call(value) === '[object Object]'

export const isString = value =>
    Object.prototype.toString.call(value) === '[object String]'

export const isNumber = value =>
    Object.prototype.toString.call(value) === '[object Number]'
