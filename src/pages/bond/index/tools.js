import { appType } from '@/utils/html-utils.js'
/**
 * desc: 计算付息日展示
 * @param {String} d 付息日；可能有多个，大于2个后面接入‘等’；例如 5月8日|7月6日|8月9日：  5月8日、7月6日等
 * @param {Boolean} isSimple 默认为false；是否替换 月、日字样
 * @param {String} dateDivision 默认为 .；分隔符
 * @param {String} connectDivision 默认为 、；连接符
 */
export function calcPaymentDates(
    dates,
    isSimple = false,
    dateDivision = '.',
    connectDivision = '、',
    isReverse = false
) {
    let d = []
    if (!dates) return '--'

    if (isSimple) {
        // 简化处理
        d = dates
            .replace(/年/g, dateDivision)
            .replace(/月/g, dateDivision)
            .replace(/日/g, '')
            .split('|')
    } else {
        d = dates.split('|')
    }
    // 根据情况追加‘等’
    let suffix = d.length > 2 ? '等' : ''

    // 适配港版日期显示  日/月/年
    if (isReverse) {
        d = d.map(dItem => {
            return dItem
                .split(dateDivision)
                .reverse()
                .join(dateDivision)
        })
    }
    return d.slice(0, 2).join(connectDivision) + suffix
}

/**
 * desc 大陆版和港版跳转路由工具函数
 * @param {Object} ctx 上下文
 * @param {String} path 跳转路由路径，需要携带 斜杠 /
 * @param {Object} query 跳转携带参数
 * @param {String} jumpType 跳转方式  push 、 replace
 */
export function jumpRouter({ ctx, path, query = {}, jumpType = 'push' }) {
    if (appType.Hk) {
        path = '/hk' + path
    }
    ctx.$router[jumpType]({
        path,
        query
    })
}
