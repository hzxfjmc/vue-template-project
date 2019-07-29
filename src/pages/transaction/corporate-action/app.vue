<template lang="pug">
      yx-container#app
        Navbar(:title='title' :rightShow='rightShow' slot="top" :yRouter='yRouter')
            span.iconfont.icon-assistant(v-if='assistant' slot="icon" @click='goToAssist')
            span(v-else  slot="icon" @click='checkHandler') 查看记录       
        keep-alive(slot="main")
            router-view
</template>

<style lang="scss">
@import '~@/assets/styles/global.scss';
@import '~@/assets/styles/common.scss';
@import '~@/assets/styles/vant-reset.scss';
</style>
<script>
import Navbar from './components/nav-bar.vue'
import JSBridge from '@/utils/js-bridge'
export default {
    components: {
        Navbar
    },
    data() {
        return {
            title: '',
            rightShow: '',
            yRouter: '',
            data: [],
            RequestId: '',
            assistant: false
        }
    },
    watch: {
        $route(to) {
            this.title = to.meta.title
            this.rightShow = to.meta.rightShow
            this.assistant = to.meta.assistant
            this.yRouter = to.meta.yRouter
        }
    },
    methods: {
        checkHandler() {
            this.$router.push({
                name: this.yRouter
            })
        },
        goToAssist() {
            JSBridge.gotoNativeModule('yxzq_goto://customer_service')
        }
    }
}
</script>
<style>
.van-nav-bar__title {
    color: #eee;
}
</style>
