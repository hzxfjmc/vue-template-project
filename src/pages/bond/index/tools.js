/**
 * desc: 计算付息日展示
 * @param {String} d 付息日；可能有多个，大于2个后面接入‘等’；例如 5月8日|7月6日|8月9日：  5月8日、7月6日等
 */
export function calcPaymentDates(dates) {
    let d = dates ? dates.split('|') : ''
    let suffix = d.length > 2 ? '等' : ''
    return d ? d.slice(0, 2).join('、') + suffix : '--'
}
