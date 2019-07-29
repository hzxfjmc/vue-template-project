<template lang="pug">
    #app
        keep-alive
            router-view
</template>

<script>
export default {
    created() {
        window.h5HistoryBack = () => {
            this.backClickHandler()
            return true
        }
    },
    methods: {
        backClickHandler() {
            if (this.$route.name === 'manage-account') {
                this.$router.push({ name: 'home' })
            } else if (this.$route.name === 'home') {
                this.$jsBridge.callApp('command_close_webview')
            } else {
                this.$jsBridge.callApp('command_go_back')
            }
        }
    }
}
</script>
<style lang="scss">
@import '~@/assets/styles/global.scss';
@import '~@/assets/styles/common.scss';
@import '~@/assets/styles/vant-reset.scss';
@import '~@/assets/styles/vant-reset-hk.scss';
@import '~@/assets/styles/common-hk.scss';
.van-dialog {
    border-radius: 14px !important;
    .van-dialog__header {
        font-size: 20px;
        font-weight: 400;
    }
    .van-dialog__message {
        font-size: 16px;
        line-height: 22px;
    }
}
</style>
