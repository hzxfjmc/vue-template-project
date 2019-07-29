<template lang="pug">
    #app
        keep-alive
            router-view
</template>
<script>
export default {
    watch: {
        $route: {
            handler: 'initGlobalCallBack'
        }
    },
    methods: {
        closeHandle() {
            this.$jsBridge.callApp('command_close_webview')
        },
        initGlobalCallBack() {
            window.h5ClosePage = () => {
                this.closeHandle()
                return true
            }
            // window.h5HistoryBack = () => {
            //     if (this.$route.name !== 'home') {
            //         this.$router.replace({ path: '/' })
            //     } else {
            //         this.closeHandle()
            //     }
            //     return true
            // }
        }
    }
}
</script>

<style lang="scss">
@import '../../../../src/assets/styles/global.scss';
@import '../../../../src/assets/styles/common.scss';
@import '../../../../src/assets/styles/vant-reset.scss';
</style>
