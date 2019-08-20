<template lang="pug">
    .risk-warning-wrapper
        van-panel(title="债券购买风险提示")
            .risk-text-box
                h3 为了降低您的投资风险，请您完整阅读风险披露内容
                p 正文：CFD 是不适合各类投资者的复杂产品，因此您应该始终确保您了解您所购买的产品是如何运作的，它是否能够满足您的需求，您是否能在亏损时拥有头寸以承担损失。
                p 在做出交易决定之前，您应仔细阅读这些条款和产品说明。
                p 在交易 CFD 之前，您务必确信了解所涉及的风险。您是否能在亏损时拥有头寸以承担损失。
        van-panel(title="确认签名" style="margin-top: -0.28rem")
            .signature-input
                input.signature-input__inner(v-model="signName" :placeholder="signNamePlaceholder")
        .statement
            span 本人声明：细收听风险披露录音，清楚明白并完全接受音频中本人已详细收听风险披露录音，清楚明白中本人已详细收听风险披露录音，清楚明白本人已阅读
            a(:href="agreementData && agreementData.protocolUrl") 《{{ agreementData && agreementData.protocolName }}》
        fixed-operate-btn(
            text="确认"
            :disabled="submitBtnDisabled"
            @click="handleSubmitAutograph"
        )
</template>
<script>
import { Panel } from 'vant'
import FixedOperateBtn from '@/pages/bond/index/biz-components/fix-operate-button/index.vue'
import { bondRiskAutograph } from '@/service/user-server.js'
import { selectProtocolInfo } from '@/service/config-manager.js'
import { mapState } from 'vuex'
export default {
    name: 'RickWarning',
    components: {
        [Panel.name]: Panel,
        FixedOperateBtn
    },
    async created() {
        this.id = this.$route.query.id - 0
        this.bondName = this.$route.query.bondName
        // 拉取债券协议
        try {
            let data = await selectProtocolInfo('BOND001')
            this.agreementData = data || {}
            console.log('selectProtocolInfo:data:>>> ', data)
        } catch (e) {
            console.log('selectProtocolInfo:error:>>>', e)
        }
    },
    data() {
        return {
            signName: '', // 签名
            agreementData: {}, // 债券协议
            submitBtnDisabled: true,
            id: 0,
            bondName: ''
        }
    },
    computed: {
        ...mapState(['user']),
        // 签名占位符
        signNamePlaceholder() {
            return (
                (this.user &&
                    this.user.userAutograph &&
                    '请输入签名:' + this.user.userAutograph) ||
                '请输入签名'
            )
        }
    },
    methods: {
        // 提交债券风险签名
        async handleSubmitAutograph() {
            if (this.submitBtnDisabled) return

            try {
                let data = await bondRiskAutograph({
                    agreementName: this.agreementData.protocolName,
                    agreementUrl: this.agreementData.protocolUrl,
                    autograph: this.signName,
                    bondId: this.id,
                    bondName: this.bondName,
                    riskTips: `为了降低您的投资风险，请您完整阅读风险披露内容
                                正文：CFD 是不适合各类投资者的复杂产品，因此您应该始终确保您了解您所购买的产品是如何运作的，它是否能够满足您的需求，您是否能在亏损时拥有头寸以承担损失。
                                在做出交易决定之前，您应仔细阅读这些条款和产品说明。
                                在交易 CFD 之前，您务必确信了解所涉及的风险。您是否能在亏损时拥有头寸以承担损失。
                            `
                })
                // 签名成功，本地设置标记，因为app那边不能实时更新用户信息
                // 需要 h5 这边自己做标记
                localStorage.isSigned = true

                this.$router.push({
                    path: '/risk-appropriate-result',
                    query: {
                        id: this.id,
                        bondName: this.bondName,
                        direction: this.$route.query.direction
                    }
                })
                console.log('bondRiskAutograph:data:>>> ', data)
            } catch (e) {
                console.log('bondRiskAutograph:error:>>> ', e)
                this.$dialog.alert({
                    message: e.msg || '请求失败'
                })
            }
        }
    },
    watch: {
        signName() {
            if (this.signName) {
                this.submitBtnDisabled = false
            } else {
                this.submitBtnDisabled = true
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.risk-warning-wrapper {
    min-height: 100%;
    padding-bottom: 48px;
    background: #fff;
    color: #393939;
    .van-cell {
        padding: 14px;
    }
    .van-panel,
    .van-panel__header {
        &:after {
            display: none;
        }
    }
    .van-cell__title {
        font-weight: bold;
        font-size: 0.36rem;
        line-height: 22px;
    }
    // 风险提示文本
    .risk-text-box {
        height: 273px;
        margin: 0 14px 14px 14px;
        padding: 14px 10px 14px 14px;
        background: rgba(47, 121, 255, 0.0261);
        h3 {
            margin-bottom: 15px;
            font-size: 0.28rem;
            line-height: 20px;
        }
        p {
            font-size: 0.28rem;
            line-height: 24px;
        }
    }
    // 签名
    .signature-input {
        position: relative;
        z-index: 1;
        height: 51px;
        margin: -5px 14px 0;
        .signature-input__inner {
            width: 100%;
            height: 100%;
            padding-left: 14px;
            border: 1px solid #e1e1e1;
            background-color: #fdfdfd;
            font-size: 0.28rem;
            line-height: 48px;
            border-radius: 4px;
            &::placeholder {
                color: #2e2e3c;
                opacity: 0.4;
            }
        }
    }
    // 声明
    .statement {
        margin: 15px;
        span {
            font-size: 0.24rem;
            line-height: 18px;
            opacity: 0.4;
        }
        a {
            color: #2f79ff;
            font-size: 0.24rem;
            line-height: 20px;
        }
    }
}
</style>
