import jsBridge from '@/utils/js-bridge.js'

// jsBridge插件
export default {
    install(Vue) {
        Vue.prototype.$jsBridge = jsBridge
    }
}
