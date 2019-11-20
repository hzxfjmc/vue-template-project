import { selectProtocolInfo } from '@/service/config-manager.js'
import { appType, lang } from '@/utils/html-utils.js'
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
    let moreMap = {
        zhCHS: '等',
        zhCHT: '等',
        en: 'etc.'
    }
    // 根据情况追加‘等’
    let suffix = d.length > 2 ? moreMap[lang] : ''

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

/**
 * 获取 产品概览、募集说明书
 * @param {String} key 获取 pdf 的 key，在中台协议配置中配置
 * @param {String} cb 请求成功后执行的回调函数
 */
export async function handleSelectProtocolInfo(key, cb) {
    try {
        let data = await selectProtocolInfo(key)
        cb && cb(data)
        console.log('handleSelectProtocolInfo:pdfType>>>data :', data)
    } catch (e) {
        console.log('handleSelectProtocolInfo:pdfType>>>error :', e)
    }
}
