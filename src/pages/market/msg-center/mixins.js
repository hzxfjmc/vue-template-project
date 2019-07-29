import dayjs from 'dayjs'

export default {
    filters: {
        parseHtml(html, defaultText) {
            const temp = document.createElement('div')
            let res = ''
            temp.innerHTML = html
            res = temp.textContent || temp.innerText
            return res || defaultText
        }
    },
    methods: {
        /**
         * 格式化展示時間
         * @param t
         * @returns {string}
         */
        formatTime(t) {
            return dayjs(t * 1000).format('MM-DD HH:mm')
        }
    }
}
