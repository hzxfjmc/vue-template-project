<template lang="pug">
    #app
        keep-alive
            router-view
</template>

<script>
export default {}
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
        padding-right: 20px;
        padding-left: 20px;
    }
    .van-dialog__message {
        font-size: 16px;
        line-height: 22px;
    }
}
#app {
    .wrap-app-hk {
        .error-tip {
            background: rgba(252, 112, 24, 1);
            padding: 7px 10px;
            font-size: 14px;
            font-family: PingFangHK-Regular;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 20px;
            .li-wrap {
                display: flex;
                .error-list {
                    padding-left: 6px;
                }
            }
        }
    }
}
.hk-open-account {
    .container-title {
        padding-top: 25px;
        font-size: 28px;
    }
}
#app {
    .bp-field.van-cell {
        padding: 0 15px 6px 0;
    }
}
</style>
