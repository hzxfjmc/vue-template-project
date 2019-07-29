<template lang="pug">
    .cancel-email.cancel-email-hk
        .logo
            .logo-left
                img(src="@/assets/img/email/logo-hk-new.png")
            //.logo-right
                img(src="@/assets/img/email/logo-right.png")
        .content
            p.title 取消訂閱
            p.description 我們衷心感謝閣下一直透過訂閱通訊與我們保持聯繫。如果未能繼續為閣下提供服務，我們將深感惋惜和遺憾，亦尊重閣下的決定。如要取消訂閱，請於以下填上閣下的電郵地址，按“遞交申請”。我們隨時歡迎閣下再次訂閱通訊。我們保證，無論任何時候，您的所有個人資訊都會受到<a href="https://usmartsecurities.com/hk/zh-hk/privacy">私隱政策</a>妥善保護。
            p.address-eamil 您的電郵地址
            p.enter
                input(v-model="email" readonly="readonly").enter-adress
            .selsect
                .type-select
                    span.choose.active
                    span.text 取消訂閱這個類型的郵件(市埸推廣宣傳通訊)
                //.type-select
                    span.choose(@click="changeChoose($event, 2)" :class="{'active': !selectFlag}")
                    span.text 取消訂閱所有類型的郵件
            .submit-button(@click="submitApply()") 遞交申請
        .footer 
            p.login 請登入
                a(href="https://m.yxzq.com/webapp/template/email.html#/jumper/hk") uSMART
                span 了解詳情，感謝您的支持！
            .foot-left
                p.connection 聯絡我們
                p.way
                    span.icon.telphone
                    span.text +852 3018 4526
                p.way
                    span.icon.email
                    span.text cs@usmarthk.com
            .foot-right
                img(src="@/assets/img/email/qrCode.png")
</template>

<script>
import { insertBlackEmail } from '@/service/message-server.js'

export default {
    data() {
        return {
            selectFlag: true,
            cancelType: 1,
            email: this.$route.query.email
        }
    },
    methods: {
        changeChoose({ target }, type) {
            if (Array.from(target.classList).includes('active')) {
                return
            }
            this.selectFlag = !this.selectFlag
            this.cancelType = type
        },
        async submitApply() {
            if (!this.email) {
                this.$toast('請填寫電郵地址')
            }
            try {
                await insertBlackEmail({
                    email: this.email
                })
                this.$toast('遞交申請成功')
            } catch (e) {
                this.$toast(e.msg || '系統繁忙，請稍後再試')
            }
        }
    }
}
</script>

<style lang="scss">
@import '@/assets/styles/template/cancel-email-hk.scss';
@media (min-width: 560px) {
    // 兼容pc页面
    html {
        font-size: 75px;
    }
    html,
    body {
        max-width: 960px;
        .logo-left img {
            width: 208px !important;
        }
        .submit-button {
            width: 335px !important;
            margin: unset !important;
            height: 44px !important;
            line-height: 44px !important;
        }
        .enter {
            width: 441px;
        }
    }
}
</style>
