<template lang="pug">
.bottom-tips
    .line-container.flex
        .border-bottom
        .text 开户前准备好
        .border-bottom
    van-row.tips-imgs
        van-col(span="8")
            .t-item.flex
                img(src='@/assets/img/open-account/IDcard.png')
                span 二代身份证
        van-col(span="8")
            .t-item.flex
                img(src='@/assets/img/open-account/bankcard.png')
                span 银行借记卡
        van-col(span="8")
            .t-item.flex
                img.wifi(src='@/assets/img/open-account/wifi.png')
                span 网络通畅
</template>

<style lang="scss" scoped>
.bottom-tips {
    width: 100%;
    z-index: 100;
    .line-container {
        justify-content: space-between;
        align-items: center;
        .border-bottom {
            width: 50%;
        }
        .text {
            text-align: center;
            width: 150px;
            color: $text-color;
        }
    }
    .tips-imgs {
        margin-top: 26px;
        .t-item {
            flex-direction: column;
            align-items: center;
            img {
                margin: 2px;
                height: 21px;
                width: 30px;
            }
            .wifi {
                margin: 0px;
                height: 25px;
                width: 21px;
            }
            span {
                margin-top: 6px;
                color: $auxiliray-text;
            }
        }
    }
}
</style>
