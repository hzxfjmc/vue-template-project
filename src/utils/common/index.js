// 错误上报
// import './badjs-report'
// import 'es5-shim'
// import 'es6-shim'
// 神策埋点
import '@/utils/sensors'
// 加载 vue 的一些指令
import './vue-directive'

// 价值 vue filters
import './vue-filter'

// plugins
import './plugins/vant.js'

// 全局组件
import './global-components'

// 上报日志
// import './log-report.js'

import LS from '../local-storage'
// 校验 vue validate
import './global-validate'

import Vue from 'vue'

import axios from '../http-request'

import env from '@/utils/scheme/env'

import { wechatShare } from '@/utils/share/wechat.js'

// 友信证券公共库
import { jsBridge, uSmartInit, htmlUtils, DOMAIN } from 'yx-base-h5'

const { isYouxinIos, isYouxinApp, appType, setTitle } = htmlUtils

import { getUaValue } from '@/utils/html-utils.js'

import { compareVersion } from '@/utils/tools.js'
// 友信证券初始化方法

// import { isYouxinIos, isYouxinApp, appType, setTitle } from '../html-utils.js'
// import jsBridge from '../js-bridge'

// @babel/preset-env会根据源代码中出现的语言特性自动检测需要的 polyfill
// 但不会检测vue模板中的polyfill，防止仅在模板中使用了includes而报错，故需要引用
console.log([].includes)

Vue.prototype.$axios = axios
// fastclick
// import FastClick from 'fastclick'
// FastClick.attach(document.body)

Vue.prototype.$LS = LS
// 是否开启调试模式
Vue.prototype.$debug = true
// 使用bus
Vue.prototype.$bus = new Vue()

// 当前环境和当前的环境配置的host
// import DOMAIN from '../DOMAIN.js'
Vue.prototype.$DOMAIN = DOMAIN

const appOrigin = appType.Ch
    ? location.origin
    : location.origin.replace(/yxzq\.com$/, 'usmartsecurities.com')
Vue.prototype.$appOrigin = appOrigin

const guid = () => {
    var d = Date.now()
    if (
        typeof performance !== 'undefined' &&
        typeof performance.now === 'function'
    ) {
        d += performance.now() //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
}
Vue.prototype.$guid = guid

// 内部方法this指向本身
Vue.prototype.$setTitle = setTitle

function parentIsAlive(component) {
    let parent = component.$parent
    if (parent) {
        if (parent.$options.keepalive) {
            return true
        } else {
            return parentIsAlive(parent)
        }
    }
    return false
}

//设置分享按钮
const setShareButton = async function() {
    const shareIcon = env.isMainlandBlack
        ? require('@/assets/img/fund/icon/icon-share.png')
        : require('@/assets/img/fund/icon/icon-share-hk.png')
    const base64 = shareIcon.replace(
        /^data:image\/(png|ico|jpe|jpeg|gif);base64,/,
        ''
    )
    if (isYouxinApp) {
        jsBridge.callApp('command_set_titlebar_button', {
            position: 2, //position取值1、2
            clickCallback: 'clickShareCallback',
            type: 'custom_icon',
            custom_icon: base64
        })
    }
}

// 设置客服按钮
const setTitleBarCSButton = function() {
    if (isYouxinApp) {
        jsBridge.registerFn('GOTO_CUSTOMER_SERVICE', function() {
            jsBridge.gotoCustomerService()
        })
        jsBridge.callApp('command_set_titlebar_button', {
            position: 2,
            type: 'icon',
            icon: 'service',
            clickCallback: 'GOTO_CUSTOMER_SERVICE'
        })
    }
}

// 清除按钮
const clearTitleBarButton = function() {
    if (isYouxinApp) {
        jsBridge.callApp('command_set_titlebar_button', {
            type: 'hide',
            position: 2,
            icon: '',
            clickCallback: ''
        })
    }
}

// 4.7.0 之前设置客服按钮 之后设置搜索按钮
const compareVersionSearch = function() {
    const appVersion = getUaValue('appVersion')
    const flag = compareVersion(appVersion, '4.7.0')
    return flag === 1 ? true : false
}

// 设置搜索按钮
const setSearchButton = function() {
    if (isYouxinApp) {
        jsBridge.callApp('command_set_titlebar_button', {
            position: 2,
            type: 'icon',
            icon: 'search',
            clickCallback: 'clickSearchCallBack'
        })
    }
}
Vue.mixin({
    mixins: [
        {
            beforeRouteEnter(to, from, next) {
                next(vm => {
                    let meta = to.meta || {}
                    // 设置title
                    let title = meta.title
                    // 如果支持多语言 标题也设置成多语言
                    if (vm.$t && vm.$t(title)) {
                        title = vm.$t(title)
                    }
                    //基金主页不需要关闭下拉刷新
                    if (to.name != 'fund-index' && to.name != 'home') {
                        uSmartInit()
                    }

                    // 香港app开户隐藏title
                    if (
                        appType.Hk &&
                        window.location.pathname.indexOf('apply.html') > -1
                    ) {
                        if (!isYouxinIos) {
                            title = '  ' // 安卓隐藏标题
                        } else {
                            title = '\t \b \n' // ios 隐藏标题处理ios上的bug
                        }
                    }
                    vm.$setTitle(title)

                    if (to.meta.cs) {
                        setTitleBarCSButton()
                    }
                    if (to.meta.share) {
                        setShareButton()
                    }
                    const searchButtonShow = compareVersionSearch()
                    if (to.meta.search && searchButtonShow) {
                        setSearchButton()
                    }

                    // 自定义分享内容
                    if (to.meta.ismgm !== 'yes') {
                        let shareTitle =
                            to.meta.shareTitle ||
                            '享永久港美股免佣，免费拿千元现金、热门股票'
                        let shareDesc =
                            to.meta.shareDesc ||
                            '友信证券，港、美股持牌券商，现在开户即享港、美股永久免佣'
                        let shareLink =
                            to.meta.shareLink || window.location.href
                        let shareImg =
                            to.meta.shareImg ||
                            `${window.location.origin}/webapp/marketing/images/newChShare.png`
                        wechatShare({
                            title: shareTitle,
                            desc: shareDesc,
                            link: shareLink,
                            imgUrl: shareImg
                        })
                    }
                })
            },
            beforeRouteLeave(to, from, next) {
                if (from.meta.cs || from.meta.search || from.meta.share) {
                    clearTitleBarButton()
                }
                next()
            },
            deactivated() {
                if (this.$options.keepalive !== true && !parentIsAlive(this)) {
                    this.$destroy()
                }
            }
        }
    ]
})

let focusFlag = false
if (!/(ipad)|(iphone)/i.test(navigator.userAgent)) {
    let clientHeight = document.body.clientHeight
    let _focusElem = null //输入框焦点
    //利用捕获事件监听输入框等focus动作
    document.body.addEventListener(
        'focus',
        function(e) {
            focusFlag = true
            _focusElem = e.target || e.srcElement
        },
        true
    )
    //因为存在软键盘显示而屏幕大小还没被改变，所以以窗体（屏幕显示）大小改变为准
    window.addEventListener('resize', function() {
        if (_focusElem && document.body.clientHeight < clientHeight) {
            //焦点元素滚动到可视范围的底部(false为底部)
            _focusElem.scrollIntoView(false)
        }
    })
} else {
    // 解决一个很坑的原生浏览器的bug
    document.body.addEventListener(
        'focus',
        function() {
            focusFlag = true
        },
        true
    )
    //获取失去焦点时 窗口向上移的bug
    document.body.addEventListener(
        'focusout',
        function() {
            focusFlag = false
            setTimeout(() => {
                if (!focusFlag) {
                    document.body.scrollTop = document.body.scrollHeight
                }
            }, 300)
        },
        true
    )
}

//系统错误捕获
// const errorHandler = (error, vm) => {
//     console.error(vm)
//     console.error(error)
//     alert('抛出全局异常')
// }

// Vue.config.errorHandler = errorHandler
// Vue.prototype.$throw = error => errorHandler(error, this)
