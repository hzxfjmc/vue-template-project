import { setTitle } from '@/utils/html-utils'

// html相关函数插件
export default {
    install(Vue) {
        Vue.prototype.$html = {
            setTitle
        }
    }
}
