<template lang="pug">
    #app
        keep-alive
            router-view
</template>

<style lang="scss">
@import '~@/assets/styles/global.scss';
@import '~@/assets/styles/common.scss';
@import '~@/assets/styles/vant-reset.scss';
.toast-box {
    width: 120px;
    height: 40px;
    padding: 0 5px;
    display: flex;
    display: -webkit-flex;
    text-align: center;
    justify-content: center;
    flex-direction: column;
    justify-items: center;
    .copy-tips {
        padding-top: 10px;
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
</style>
