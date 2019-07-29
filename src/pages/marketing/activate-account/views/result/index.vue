<template lang="pug">
    .activate-account-container
        .content-box
            .title 您的賬號己激活！
            .sub-title 立即體驗uSmart
            .btn-container
                van-button(
                    size="large"
                    slot="bottom"
                    type="primary"
                    @click="downloadApp"
                    class="bottom-button" ) 立即下載
</template>

<script>
export default {
    methods: {
        downloadApp() {
            let url =
                location.origin + '/webapp/template/email.html#/jumper/hk '
            window.open(url)
        }
    }
}
</script>

<style lang="scss" scoped>
.activate-account-container {
    background: #fff;
    padding: 0 16px;
    .content-box {
        text-align: center;
        padding-top: 167px;
        .title {
            font-size: 28px;
            font-family: PingFangHK-Medium;
            font-weight: 500;
            color: rgba(57, 57, 57, 1);
            line-height: 40px;
        }
        .sub-title {
            padding-top: 20px;
            font-size: 18px;
            font-family: PingFangHK-Light;
            font-weight: 300;
            color: rgba(154, 154, 154, 1);
            line-height: 25px;
        }
        .btn-container {
            padding-top: 86px;
            .bottom-button {
                background: rgba(0, 85, 255, 1);
                border-radius: 4px !important;
            }
        }
    }
}
</style>
