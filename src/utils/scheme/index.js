import env from './env'
import { getUaValue } from '../html-utils'
import { compareVersion } from '@/utils/tools.js'
const scheme = {
    mailandBase: 'yxstock://yx.stock.app',
    hkBase: 'yxusmart://yx.usmart.app',

    /**
     * 在APP外，打开APP指定页面（根据url参数区分大陆版、香港版）
     * 1.在微信中，弹出引导页
     * 2.未安装，安卓和ios，都跳转对应的下载页面
     * 3.已安装，安卓：跳转App；ios：跳转App，h5页面将会跳转下载链接
     * @param path APP路径
     * @param middlePage 中间页(某些情况需尝试打开APP)路径，默认下载页，将自动给该链接添加appUrl参数
     */
    gotoApp(path = '', middlePage = env.appDownloadUrl) {
        const ua = navigator.userAgent
        const isQQ = /qq\/\d/i.test(ua)
        const isWeibo = /\sweibo\s/i.test(ua)
        if (env.isWechat || env.isWxwork || isQQ || isWeibo) {
            this.showLeadin()
            return
        }
        // scheme跳转
        const base = env.isMainland ? this.mailandBase : this.hkBase
        const url = base + path
        // 在appDownloadUrl中添加query参数appUrl，目标链接在安卓中将会用iframe继续打开appUrl
        const getMiddlePage = () => {
            const hashIndex = middlePage.indexOf('#')
            const hasHash = hashIndex > -1
            const noHashUrl = hasHash
                ? middlePage.slice(0, hashIndex)
                : middlePage
            const hash = hasHash ? middlePage.slice(hashIndex) : ''
            const sign = middlePage.indexOf('?') > -1 ? '&' : '?'
            const query = `appUrl=${encodeURIComponent(url)}`
            return noHashUrl + sign + query + hash
        }
        if (env.isAndroid) {
            const t1 = Date.now()
            let iframe = document.createElement('iframe')
            iframe.src = url
            iframe.style = 'display: none'
            document.body.appendChild(iframe)
            iframe.parentNode.removeChild(iframe)
            iframe = null
            const t2 = Date.now()
            const delay = 200
            setTimeout(() => {
                // 未安装APP（安卓部分机型会不一致）
                if (t2 - t1 < delay + 100) {
                    location.href = getMiddlePage()
                }
            }, delay)
            return
        }
        if (env.isIos) {
            // ios safari，alert不能卡住进程
            const uaVersion = getUaValue('Version', false)
            if (compareVersion('11.0.0', uaVersion) >= 0) {
                location.href = getMiddlePage()
            } else {
                location.href = url
                setTimeout(() => (location.href = middlePage), 200)
            }
            return
        }
        location.href = url
    },

    // 中间页跳转APP
    middlePageTryGotoApp(appUrl) {
        if (env.isAndroid) {
            let iframe = document.createElement('iframe')
            iframe.src = appUrl
            iframe.style = 'display: none'
            document.body.appendChild(iframe)
        } else if (env.isIos) {
            location.href = appUrl
        }
    },

    /**
     * 跳转APP中的webview
     * @param url h5链接(全url)
     * @param options
     * @param options.middlePage 中间页面地址，默认下载页面
     * @param options.titleBarVisible titleBar是否显示
     * @param options.title titleBar标题
     */
    gotoWebview(url, options = {}) {
        options.titleBarVisible =
            options.titleBarVisible === undefined
                ? true
                : options.titleBarVisible
        options.title = options.title || ''
        const targetPath = `/h5_page?url=${encodeURIComponent(url)}&titleBarVisible=${options.titleBarVisible}&title=${options.title}` // eslint-disable-line
        this.gotoApp(targetPath, options.middlePage)
    },

    // 跳转个股详情
    gotoStockDetail(market, code, options = {}) {
        this.gotoApp(
            `/stock_detail?market=${market}&code=${code}`,
            options.middlePage
        )
    },

    // 显示引导下载
    showLeadin() {
        const root = document.createElement('div')
        root.style.zIndex = 999
        root.style.position = 'fixed'
        root.style.left = 0
        root.style.right = 0
        root.style.top = 0
        root.style.bottom = 0
        root.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
        root.style.backgroundImage = `url(${require('./download-hands-tip.png')})`
        root.style.backgroundPosition = 'right top'
        root.style.backgroundRepeat = 'no-repeat'
        root.style.textAlign = 'center'
        const p = document.createElement('p')
        p.style.color = '#fff'
        p.style.fontSize = '24px'
        p.style.marginTop = '300px'
        p.innerText = '请在浏览器中打开'
        const button = document.createElement('button')
        button.style.display = 'block'
        button.style.background = 'transparent'
        button.style.border = '2px solid #fff'
        button.style.borderRadius = '30px'
        button.style.color = '#fff'
        button.style.outline = 'none'
        button.style.cursor = 'pointer'
        button.style.textAlign = 'center'
        button.style.width = '200px'
        button.style.margin = '0 auto 30px'
        button.style.height = '60px'
        button.style.lineHeight = '58px'
        button.style.fontSize = '24px'
        button.style.marginTop = '50px'
        button.innerText = '知道了'
        root.appendChild(p)
        root.appendChild(button)
        document.body.appendChild(root)

        button.onclick = () => {
            root.parentNode.removeChild(root)
        }
    }
}

export default scheme
