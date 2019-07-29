import { isIOS, isAndroid, isYouxinApp, appType, langType } from './html-utils'
const JSBridge = {
    isYouxinApp,
    // 友信APP离线环境
    isOfflineYouxinApp: isYouxinApp && location.protocol === 'file:',
    // app类型 友信智投 Or uSmart
    appType,
    // app语言 简体/繁体/英文
    langType,
    hasBridge:
        (isAndroid && 'JSActionBridge' in window) ||
        (isIOS && 'webkit' in window && 'messageHandlers' in window.webkit),

    /**
     * 调用app方法 注册全局事件
     * @param event：事件名称
     * @param data：json数据
     * @param successCallBack: 主动设置成功回掉
     * @param failCallBack: 主动设置失败回掉
     * @returns {Promise<object>}
     */
    callAppNoPromise(event, data = {}, successCallBackName, failCallBackName) {
        if (!this.hasBridge) {
            return
        }
        // 安卓
        if (isAndroid) {
            data = JSON.stringify(data)
            window.JSActionBridge.handlerAction(
                event,
                data,
                successCallBackName,
                failCallBackName
            )
        }
        // ios
        if (isIOS) {
            window.webkit.messageHandlers.JSActionBridge.postMessage({
                method: 'handlerAction',
                data: {
                    actionEvent: event,
                    paramsJsonValue: data,
                    successCallback: successCallBackName,
                    errorCallback: failCallBackName
                }
            })
        }
    },
    /**
     * 调用app方法
     * @param event：事件名称
     * @param data：json数据
     * @param successCallBack: 主动设置成功回掉
     * @param failCallBack: 主动设置失败回掉
     * @returns {Promise<object>}
     */
    callApp(event, data = {}) {
        return new Promise((resolve, reject) => {
            if (!this.hasBridge) {
                reject()
                return
            }

            // 设置回调方法
            const callbackKey =
                Date.now() + '' + Math.floor(Math.random() * 100000)
            window.callBackList = window.callBackList || []
            window.callBackList.push(callbackKey)
            const successName = `s${callbackKey}`
            const failName = `f${callbackKey}`
            window[successName] = function(data) {
                isAndroid && (data = JSON.parse(data))
                if (data.code === -1) {
                    reject(data)
                } else {
                    resolve(data.data)
                }
                // delete window[successName]
                // delete window[failName]
            }
            window[failName] = function(err) {
                isAndroid && (err = JSON.parse(err))
                reject(err)
                // delete window[successName]
                // delete window[failName]
            }
            // 安卓
            if (isAndroid) {
                data = JSON.stringify(data)
                window.JSActionBridge.handlerAction(
                    event,
                    data,
                    successName,
                    failName
                )
            }

            // ios
            if (isIOS) {
                window.webkit.messageHandlers.JSActionBridge.postMessage({
                    method: 'handlerAction',
                    data: {
                        actionEvent: event,
                        paramsJsonValue: data,
                        successCallback: successName,
                        errorCallback: failName
                    }
                })
            }
        })
    },

    /**
     * 注册app调用的方法
     * @param fnName
     * @param fn
     */
    registerFn(fnName, fn) {
        // if (!this.hasBridge) {
        //     return
        // }

        if (typeof fnName !== 'string') {
            throw TypeError('Illegal fnName: Not an string')
        }
        if (typeof fn !== 'function') {
            throw TypeError('Illegal fn: Not an function')
        }

        window[fnName] = function(data) {
            if (isIOS) {
                fn(data)
            }
            if (isAndroid) {
                data = data || '{}'
                fn(JSON.parse(data))
            }
        }
    },

    /**
     * 注销app调用方法
     * @param fnName
     */
    unregisterFn(fnName) {
        if (typeof fnName !== 'string') {
            throw TypeError('Illegal fnName: Not an string')
        }

        delete window[fnName]
    },

    /**
     * 跳转至app模块
     * @param url
     * @param isWaitingResult
     * @returns {*|Promise<Object>}
     */
    gotoNativeModule(url, isWaitingResult = false) {
        if (this.isYouxinApp) {
            this.callApp('goto_native_module', {
                url,
                isWaitingResult
            })
        }
    },

    /**
     * 在APP内新打开
     * @param url
     * @param titleBarVisible
     * @param title
     */
    gotoNewWebview(url, titleBarVisible = true, title = '') {
        this.gotoNativeModule(
            `yxzq_goto://webview?url=${encodeURIComponent(
                url
            )}&titleBarVisible=${titleBarVisible}&title=${title}`
        )
    },

    /**
     * 跳转客服页面
     */
    gotoCustomerService() {
        this.callApp('command_contact_service')
    },

    /**
     * 监控页面活动状态
     * @param activated
     * @param deactivated
     */
    watchPageActivity(activated, deactivated) {
        const successCallBackName =
            'command_watch_activity_status_success_callback'
        const failCallBackName = 'command_watch_activity_status_fail_callback'
        const successCallBack = window[successCallBackName]
        const failCallBack = window[successCallBackName]

        this.registerFn(successCallBackName, function(data) {
            if (
                Object.prototype.toString.apply(successCallBack) ===
                '[object Function]'
            ) {
                successCallBack(data)
            }

            try {
                console.log(data, 'visible')

                if (typeof data === 'string') {
                    data = JSON.parse(data)
                }

                if (data.data.status === 'visible') {
                    activated(data)
                } else {
                    deactivated(data)
                }
            } catch (e) {
                console.log(successCallBackName, e)
            }
        })

        this.registerFn(failCallBackName, function(data) {
            if (
                Object.prototype.toString.apply(failCallBack) ===
                '[object Function]'
            )
                failCallBack(data)

            console.log(failCallBackName, data)
        })

        this.callAppNoPromise(
            'command_watch_activity_status',
            {},
            successCallBackName,
            failCallBackName
        )
    }
}
export default JSBridge
