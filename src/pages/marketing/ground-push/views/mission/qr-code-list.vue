<template lang="pug">
    .banner-list
        van-swipe(
        :loop="false"
        :show-indicators="false"
        ref="swiper"
        )
            van-swipe-item.qr-code-list
                .img-wrap
                    .title 注册专属二维码
                    div.qrcode(id="reg")
            van-swipe-item.qr-code-list
                .img-wrap
                    .title 开户专属二维码
                    div.qrcode(id="openAccount")
        i.iconfont.icon-previewleft(@click="goLeft")
        i.iconfont.icon-previewright(@click="goRight")
</template>
<script>
import { myQrCode } from '@/service/marketing-manage'
import { Swipe, SwipeItem } from 'vant'
import QRCode from 'qrcodejs2'
export default {
    data: () => ({
        index: 0
    }),
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        QRCode
    },
    async mounted() {
        let { registerUrl, openAccountUrl } = await myQrCode()
        this.$nextTick(() => {
            this.toQrCode('reg', registerUrl)
            this.toQrCode('openAccount', openAccountUrl)
        })
    },
    methods: {
        // 转换二维码
        toQrCode(id, url) {
            new QRCode(id, {
                width: 180,
                height: 180, // 高度
                text: url // 二维码内容
            })
        },
        goLeft() {
            this.$refs.swiper.swipeTo(--this.index)
        },
        goRight() {
            this.$refs.swiper.swipeTo(++this.index)
        }
    }
}
</script>
<style lang="scss" scoped>
.banner-list {
    position: relative;
    .qr-code-list {
        .img-wrap {
            text-align: center;
            .title {
                font-weight: bold;
                font-size: 18px;
            }
            .qrcode {
                /deep/ img {
                    margin: 50px auto;
                }
            }
        }
    }
    i {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        font-size: 50px;
        color: $hk-text-color4;
        z-index: 10;
        &.icon-previewleft {
            left: 0;
        }
        &.icon-previewright {
            right: 0;
        }
    }
}
</style>
