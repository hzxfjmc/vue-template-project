/**
 * @Desc 自定义Toast插件
 * @Author LINJIAJUN
 * @Date 2019/03/05
 */
import imgToast from './img-toast'
let plugin = {}

plugin.install = (Vue, options = {}) => {
    const ToastController = Vue.extend(imgToast)
    ToastController.prototype.close = function() {
        this.showContent = false
        this.$el.addEventListener('animationend', () => {
            this.showWrapper = false
        })
        setTimeout(() => {
            this.cb && this.cb()
        }, 0)
    }

    Vue.prototype.$imgToast = (option = {}) => {
        let instance = new ToastController().$mount(
            document.createElement('div')
        )
        let duration = option.duration || options.duration || 1000
        instance.message = typeof option === 'string' ? option : option.message
        instance.cb = option.cb ? option.cb : ''
        document.body.appendChild(instance.$el)
        setTimeout(function() {
            instance.close()
        }, duration)
    }
}

export default plugin
