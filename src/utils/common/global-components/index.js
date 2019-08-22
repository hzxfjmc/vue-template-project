import Vue from 'vue'

Vue.component('yx-upload-img', () =>
    import('@/biz-components/upload/yxUploadImg.vue')
)

Vue.component('yx-action-sheet', () =>
    import('@/components/action-sheet/index.vue')
)

Vue.component('yx-container', () =>
    import('@/components/yx-container/index.vue')
)

Vue.component('yx-container-better', () =>
    import('@/components/yx-container-better/index.vue')
)
Vue.component('yx-hk-popup', () => import('@/components/yx-hk-popup/index.vue'))

Vue.component('yx-hk-field', () => import('@/components/yx-hk-field/index.vue'))

Vue.component('yx-notify', () => import('@/components/notify/index.vue'))

Vue.component('yx-no-list', () => import('@/biz-components/no-list/index.vue'))

Vue.component('yx-step', () => import('@/components/yx-step.vue'))

Vue.component('yx-popup', () => import('@/components/yx-popup/index.vue'))
