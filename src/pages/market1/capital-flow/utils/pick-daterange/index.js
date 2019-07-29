import Vue from 'vue'
import Component from './component'
const DaterangePicker = Vue.extend(Component)
const instance = new DaterangePicker().$mount(document.createElement('div'))
document.body.appendChild(instance.$el)

const pickDaterange = function(target) {
    return new Promise(function(resolve, reject) {
        instance.top = target.clientHeight
        instance.show = true
        instance.$off('confirm')
        instance.$off('cancel')
        instance.$on('confirm', resolve)
        instance.$on('cancel', reject)
    })
}
pickDaterange.hide = () => (instance.show = false)

export default pickDaterange
