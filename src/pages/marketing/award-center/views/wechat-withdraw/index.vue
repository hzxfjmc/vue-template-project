<template lang="pug">
    yx-container-better.wechat-withdraw
        div(slot="top")
            van-dialog(
            title="奖励将通过微信服务号发放"
            message="请关注微信服务号：<b>友信智投</b>\n并按指引完成绑定"
            v-model="showDialog"
            confirm-button-text="好的"
            @confirm="showDialog = false")
            van-dialog.error-dialog(
            title="系统繁忙，请您稍后再试"
            :message="`<b>如有疑问请您联系客服</b>\n<span>错误代码：${errCode}</span>`"
            v-model="showErrDialog"
            confirm-button-text="好的"
            @confirm="showErrDialog = false")
            van-dialog(
            :title="`已发放至您的微信：${wechatNickName}`"
            message="请在友信智投服务号中查收微信红包\n逾期未领取红包，将会退回"
            v-model="showSuccessDialog"
            confirm-button-text="好的"
            @confirm="showSuccessDialog = false")
        .main(slot="main")
            div(v-html="content")
        van-button(
        slot="bottom"
        size="large"
        type="primary"
        @click="submit"
        :disabled="disabled"
        class="bottom-button" ) 去领取红包
</template>
<script>
import { queryMessageDetail } from '@/service/news-helpcenter'
import { withdraw } from '../../utils/mixins'

export default {
    mixins: [withdraw],
    data: () => ({
        content: '',
        showDialog: false,
        disabled: false
    }),
    created() {
        this.getRule()
    },
    methods: {
        async getRule() {
            try {
                let data = await queryMessageDetail({
                    key: 'youxinzhitou132018941fhnafwd'
                })
                let content = JSON.parse(data.content)
                this.content =
                    (content && content[0] && content[0].htmlContent) || ''
            } catch (e) {
                this.content = ''
            }
        },
        submit() {
            this.submitHandler(
                () => {
                    this.showDialog = true
                },
                this.$route.query.couponBusinessId,
                () => {
                    this.disabled = true
                }
            )
        }
    }
}
</script>
<style lang="scss">
.wechat-withdraw {
    .main {
        padding: $global-padding;
        img {
            width: 100% !important;
            /*max-width: 100% !important;*/
            height: auto;
        }
    }
    .error-dialog {
        /deep/ {
            b {
                text-align: center;
                font-weight: 500;
                color: #353547;
                font-size: 16px;
                position: relative;
                bottom: 12px;
            }
            span {
                font-size: 12px;
            }
        }
    }
}
</style>
