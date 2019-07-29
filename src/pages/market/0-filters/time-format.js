import dayjs from 'dayjs'

/**
 * @param time
 * @returns {string}
 * 日期：如果是 今天/昨天，则显示 今天/昨天，否则显示 YYYY-MM-DD
 * 时间：显示 HH:mm
 */
const timeFormat = time => {
    if (time) {
        const timeStr = dayjs(time).format('HH:mm')
        let dayStr
        switch (dayjs(time).format('YYYY-MM-DD')) {
            case dayjs().format('YYYY-MM-DD'):
                dayStr = '今天'
                break
            case dayjs()
                .subtract(1, 'day')
                .format('YYYY-MM-DD'):
                dayStr = '昨天'
                break
            default:
                dayStr = dayjs(time).format('YYYY-MM-DD')
                break
        }
        return `${dayStr} ${timeStr}`
    } else {
        return ''
    }
}

export default timeFormat
