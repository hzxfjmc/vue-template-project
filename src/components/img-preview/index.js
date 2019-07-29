import ImagePreviewComponent from './img-preview.vue'
import Vue from 'vue'

const ImagePreviewConstructor = Vue.extend(ImagePreviewComponent)

let $vm
$vm = new ImagePreviewConstructor({
    el: document.createElement('div')
})
$vm.previewImgFlag = false
document.body.appendChild($vm.$el)

const previewImg = (src, flag) => {
    $vm.imgSrc = src
    $vm.show = true
    if (flag === false) {
        $vm.show = false
    }
    return $vm
}

export default previewImg
