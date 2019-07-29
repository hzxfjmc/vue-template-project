<template lang="pug">
    .email-jump
        //img(src="@/assets/img/email/jump-logo.png" alt="")
        //a(@click="goPage") 打开{{isHk ? 'uSMART ' : '友信智投'}}app
</template>
<script>
const ch = {
    app: 'yxstock://yx.stock.app',
    homePage: 'https://usmartsecurities.com/mainland/zh-cn',
    download: {
        android:
            'https://hq-prod-app-1257884527.cos.ap-chengdu.myqcloud.com/android/yxzq-client-1.0.0-201907031645-release-jiagu-2-yxzq.apk',
        ios: 'https://apps.apple.com/cn/app/id1450893002'
    },
    serve: `yxstock://yx.stock.app/h5_page?title=在线客服&url=${encodeURIComponent(
        'https://yxzq.udesk.cn/im_client/?web_plugin_id=69271&titleBarVisible=false'
    )}`,
    awardCenter: `yxstock://yx.stock.app/h5_page?url=${encodeURIComponent(
        window.location.origin + '/webapp/marketing/award-center.html#/ch'
    )}`
}
const hk = {
    app: 'yxusmart://yx.usmart.app',
    homePage: 'https://usmartsecurities.com/hk/zh-hk',
    download: {
        android:
            'https://play.google.com/store/apps/details?id=com.usmart.stock',
        ios: 'https://apps.apple.com/app/id1463024118'
    }
}

import { isAndroid } from '@/utils/html-utils'

export default {
    data() {
        return {
            isHk: this.$route.params.type === 'hk',
            // 跳转的page
            page: this.$route.query.page,
            pageObj: {}
        }
    },
    mounted() {
        let ua = window.navigator.userAgent.toLowerCase()
        let isMobile = /(iphone|ipad|opera mini|android.*mobile|netfront|psp|blackberry|windows phone)/gi.test(
            ua
        )
        this.pageObj = this.isHk ? hk : ch
        if (!isMobile) {
            window.location.href = this.pageObj.homePage
        } else {
            if (ua.match(/MicroMessenger/i) === 'micromessenger') {
                alert(
                    '当前浏览器不支持跳转，请点击右上角选择原生浏览器打开跳转'
                )
            } else {
                this.goPage()
            }
        }
    },
    methods: {
        goPage() {
            let isJump = false
            document.addEventListener('visibilitychange', () => {
                isJump = true
            })
            let appUrl
            if (this.page && this.pageObj[this.page]) {
                appUrl = this.pageObj[this.page]
            } else {
                appUrl = this.pageObj.app
            }
            window.location.href = appUrl
            setTimeout(() => {
                if (!isJump) {
                    window.location.href = this.pageObj.download[
                        isAndroid ? 'android' : 'ios'
                    ]
                }
            }, 1500)
        }
    }
}
</script>
<style lang="scss" scoped>
.email-jump {
    text-align: center;
    padding-top: 80px;
    img {
        width: 96px;
        height: 96px;
        display: block;
        margin: 0 auto 34px;
    }
    a {
        padding: 6px 23px;
        color: #fff;
        background: #0155fe;
        font-size: 16px;
        border-radius: 25px;
    }
}
</style>
