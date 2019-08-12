import Vue from 'vue'
import dayjs from 'dayjs'

/**
 * 数字转化为千位分隔
 * value | thousand-spilt
 */
Vue.filter('thousand-spilt', function(value) {
    if (!value) {
        return ''
    }
    return value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
})

Vue.filter('idcard', function(num) {
    return num.substring(0, 5) + '*******' + num.substring(num.length - 5)
})
Vue.filter('date-format', function(date, format = 'YYYY-MM-DD HH:mm') {
    return dayjs(date).format(format)
})
//数字化千分位加两位小数
Vue.filter('formatCurrency', function(num) {
    let strVal = String(num)
    if (strVal.indexOf('.') != -1) {
        return `${Number(
            String(Number(strVal).toFixed(2)).split('.')[0]
        ).toLocaleString()}.${String(Number(strVal).toFixed(2)).split('.')[1]}`
    } else {
        return `${Number(strVal).toLocaleString()}.00`
    }
})
//不够五位数补0
Vue.filter('PrefixInteger', function(num) {
    return (Array(5).join('0') + num).slice(-5)
})

// i18n
Vue.filter('i18n', function(i18nData = {}, langType = 'zhCHS') {
    let langTypeMap = {
        zhCHS: 'zhCn',
        zhCHT: 'zhHk',
        en: 'en'
    }
    let resolveData =
        (i18nData[langTypeMap[langType]] && i18nData[langTypeMap[langType]]) ||
        '--'
    return resolveData
})
