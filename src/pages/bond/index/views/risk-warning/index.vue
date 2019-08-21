<template lang="pug">
    .risk-warning-wrapper
        van-panel(title="债券购买风险提示")
            .risk-text-box
                p 1、由于企业违约等XXXXXXX可能，债券可能违约，损失部分或全部本金和利息。XXXXXX
                p 2、债券市场流动性差，友信提供流动性XXXXXXXXXX，价格点差XXXX。友信尽力撮合订单，但不保证订单一定能够成交。
                p 3、成交价格公司可能有损益。
        van-panel(title="确认签名" style="margin-top: -0.28rem")
            .signature-input
                input.signature-input__inner(v-model="signName" :placeholder="signNamePlaceholder")
        .statement
            van-checkbox(v-model="isReadBondInfo")
                i.iconfont(
                    slot="icon"
                    slot-scope="props"
                    :class="props.checked ? 'icon-selected' : 'icon-unchecked'"
                )
            .text
                span 我已阅读并知晓债券相关风险。本人已阅读
                a(:href="agreementData && agreementData.protocolUrl") 《{{ agreementData && agreementData.protocolName }}》
                span ；本人电子签名代表对上述说明的同意，与本人手写签名具有相同的法律效力
        fixed-operate-btn(
            text="确认"
            :disabled="submitBtnDisabled"
            @click="handleSubmitAutograph"
        )
</template>
<script>
import { Panel, Checkbox } from 'vant'
import FixedOperateBtn from '@/pages/bond/index/biz-components/fix-operate-button/index.vue'
import { bondRiskAutograph } from '@/service/user-server.js'
import { selectProtocolInfo } from '@/service/config-manager.js'
import { mapState } from 'vuex'
export default {
    name: 'RiskWarning',
    components: {
        [Checkbox.name]: Checkbox,
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
            id: 0,
            bondName: '',
            isReadBondInfo: false
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
        },
        submitBtnDisabled() {
            if (this.signName && this.isReadBondInfo) {
                return false
            } else {
                return true
            }
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
        color: #2e2e3c !important;
        font-size: 0.36rem;
        line-height: 22px;
    }
    // 风险提示文本
    .risk-text-box {
        max-height: 273px;
        margin: 0 12px 14px 12px;
        padding: 14px 12px 21px 12px;
        background: rgba(47, 121, 255, 0.0261);
        box-sizing: border-box;
        p {
            color: $text-color5;
            font-size: 0.28rem;
            line-height: 24px;
        }
    }
    // 签名
    .signature-input {
        position: relative;
        z-index: 1;
        height: 51px;
        margin: -2px 12px 0;
        .signature-input__inner {
            width: 100%;
            height: 100%;
            padding-left: 14px;
            border: 1px solid rgba($color: $text-color, $alpha: 0.05);
            color: #2e2e3c;
            font-size: 0.28rem;
            line-height: 48px;
            border-radius: 4px;
            &::placeholder {
                color: $text-color2;
            }
        }
    }
    // 声明
    .statement {
        display: flex;
        margin: 15px;
        .van-checkbox {
            margin-right: 6px;
            .icon-selected,
            .icon-unchecked {
                font-size: 0.32rem;
                vertical-align: middle;
            }
            .icon-selected {
                color: #2f79ff;
            }
        }
        .text {
            flex: 1;
            color: $text-color3;
            span {
                font-size: 0.24rem;
                line-height: 18px;
                opacity: 0.4;
            }
            a {
                color: $primary-color-line;
                font-size: 0.24rem;
                line-height: 20px;
            }
        }
    }
}
</style>
