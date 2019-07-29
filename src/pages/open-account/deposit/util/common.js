import jsBridge from '@/utils/js-bridge'
import { Toast } from 'vant'
export default {
    copy(content) {
        let toastHtml = `
            <div class="toast-box">
                <div class="content">${content}</div>
                <div class="copy-tips">已复制</div>
            </div>
            `
        jsBridge
            .callApp('command_copy_to_pasteboard', {
                content: content
            })
            .then(res => {
                if (res === 'success') {
                    Toast({
                        type: 'html',
                        message: toastHtml
                    })
                }
            })
    },
    // 预约日期
    getDays() {
        let now = new Date()
        let len = 14
        let isNextDay = false
        let hour = now.getHours()
        let weekMap = {
            '0': '日',
            '1': '一',
            '2': '二',
            '3': '三',
            '4': '四',
            '5': '五',
            '6': '六'
        }
        if (hour >= 17) {
            isNextDay = true
        }
        let flag = isNextDay ? 1 : 0
        let days = []
        let dateList = []
        for (let i = flag; i < len; i++) {
            let nextDate = new Date(now.getTime() + i * 24 * 3600 * 1000)
            let year = nextDate.getFullYear()
            let month =
                nextDate.getMonth() + 1 < 10
                    ? `0${nextDate.getMonth() + 1}`
                    : nextDate.getMonth() + 1
            let day =
                nextDate.getDate() < 10
                    ? `0${nextDate.getDate()}`
                    : nextDate.getDate()
            let week = nextDate.getDay()
            days.push(`${year}年${month}月${day}日 周${weekMap[week]}`)
            dateList.push({
                value: `${year}-${month}-${day}`,
                label: `${year}年${month}月${day}日 周${weekMap[week]}`
            })
        }
        return { days: days, dateList: dateList }
    },
    // 预约时间段
    getTime(isNextDay) {
        let timeLine = [
            '10:00-11:00',
            '11:00-12:00',
            '13:00-14:00',
            '14:00-15:00',
            '15:00-16:00',
            '16:00-17:00',
            '17:00-18:00'
        ]
        let viewTimeList = []
        let now = new Date()
        let hour = now.getHours()
        isNextDay = isNextDay || hour >= 17
        if (isNextDay) {
            viewTimeList = timeLine
        } else {
            timeLine.forEach(item => {
                if (hour < item.split('-')[0].slice(0, 2)) {
                    viewTimeList.push(item)
                }
            })
        }
        return viewTimeList
    },
    parseContactTimeToView(val) {
        let weekMap = {
            '0': '日',
            '1': '一',
            '2': '二',
            '3': '三',
            '4': '四',
            '5': '五',
            '6': '六'
        }
        if (val) {
            let arr = val.split(' ')
            let date = new Date(arr[0])
            let year = date.getFullYear()
            let month =
                date.getMonth() + 1 < 10
                    ? `0${date.getMonth() + 1}`
                    : date.getMonth() + 1
            let day =
                date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
            let week = date.getDay()
            return `${year}年${month}月${day}日 周${weekMap[week]} ${arr[1]}`
        }
    }
}
