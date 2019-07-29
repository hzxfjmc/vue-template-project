import sensors from '../../0-third/sensors'
import JSBridge from '@/utils/js-bridge'
import { getUrlParam, generateUUID } from '../../0-utils'

// 埋点：新闻是否滚动到底部
export function buringNewsToEnd(scrollEl) {
    if (JSBridge.isYouxinApp) {
        this.$nextTick(() => {
            // 数据上报：Newspageview - 浏览资讯详情页面
            const dataReport = () => {
                const content = this.data.content || this.data.html_content
                const len = content.replace(/<[^>]+>/g, '').length
                const prop_publish_time = this.data.release_time
                sensors.getAppStatus(function(app_info) {
                    sensors.identify(app_info.distinct_id)
                    sensors.track('yxstock_app_news_to_end', {
                        prop_view_page: 'info_detail',
                        prop_info_source: getUrlParam('source') || 'undefined',
                        prop_info_id: getUrlParam('newsid'),
                        prop_info_alg_id: getUrlParam('algid') || 'undefined',
                        prop_news_is_to_end: true,
                        prop_news_newscharacter: len,
                        prop_publish_time
                    })
                })
            }
            const winHeight = scrollEl.clientHeight
            const articleEl = document.getElementsByClassName('js-article')[0]
            const contentHeight = articleEl.offsetHeight
            const contentTop = articleEl.offsetTop
            const finishedTop = contentHeight + contentTop - winHeight - 10 // 留下10的空隙，防止临界问题
            if (finishedTop <= 0) {
                dataReport.call(this)
            } else {
                let flag = false
                scrollEl.onscroll = () => {
                    if (!flag && scrollEl.scrollTop >= finishedTop) {
                        flag = true
                        dataReport.call(this)
                    }
                }
            }
        })
    }
}

// 埋点app外文章被打开统计
export async function buringWebViewScreen(stocks = '', data) {
    if (!JSBridge.isYouxinApp) {
        let userId = localStorage.market_uuid
        if (!userId) {
            userId = generateUUID()
            localStorage.market_uuid = userId
        }
        sensors.track('yxstock_web_view_screen', {
            prop_view_page: 'info_detail',
            prop_info_source: getUrlParam('source') || 'undefined',
            prop_info_id: getUrlParam('newsid'),
            prop_fakeuserid: userId, // 虚拟用户id
            prop_stock_id: stocks, // 股票id列表，‘|’分隔
            prop_publish_time: data.release_time
        })
    }
}

// 埋点跳转APP
export function buringGoToAppStock(stock, data) {
    if (JSBridge.isYouxinApp) {
        sensors.track('yxstock_app_view_click', {
            prop_view_page: 'info_detail',
            prop_info_source: getUrlParam('source') || 'undefined',
            prop_info_id: getUrlParam('newsid'),
            prop_view_id: stock, // 股票代码：hk00700
            prop_view_name: '', // 无
            prop_publish_time: data.release_time
        })
    }
}
