<template lang="pug">
yx-container-better.risk-disclosure
    .risk-disclosure-top(slot="top")
        open-process(:process="60")
        van-dialog(
            title="就风险提示征求独立的意见"
            message="您可联系其他独立人士，如独立持牌的投资顾问等，就风险提示征求独立的意见"
            v-model="showRiskTip"
            :confirm-button-text="$t('okToSure')"
            @confirm="showRiskTip = false")
        yx-hk-popup(
                v-model="showHaveQuestion"
                position="bottom"
                :list="selectList"
                title="您可以通过以下方式寻求帮助"
                @checkedHandle="checkedInvestTarget")
    .risk-disclosure-container(slot="main")
        .risk-disclosure-fixed
            .sc-title 风险披露
            .info
                .img(style="background-image: url(/webapp/open-account/head.png)")
                .info-container
                    p 持牌代表：NG Wing Hoi 吴泳恺
                    p 牌照号：ASH955
        .content.flex-fixed-container.scroll-able(ref="scrollContent")
            p.title 为了降低您的风险，请您完整阅读风险披露内容
            p.text-color7.justify {{content}}
        .primary-color(@click="hasQuestion") 我有疑问？
    van-button(
        slot="bottom"
        size="large"
        type="primary"
        @click="submitHandler"
        class="bottom-button" ) 我已清楚明白全部风险
</template>

<script>
import { Checkbox, CheckboxGroup } from 'vant'
import { customerStatusSelect } from '@/service/config-manager.js'
export default {
    mixins: [require('../../mixins/mix-router.js').default],
    data() {
        return {
            showRiskTip: false,
            showHaveQuestion: false,
            customerServiceInfo: {},
            disabled: true,
            content: `正文：证券价格有时可能会非常波动。证券价格可升可跌，甚至变成毫无价值。买卖证券未必一定能够赚取利润，反而可能会招致损失。在作出投资决定前，阁下应仔细考虑投资产品是否适合您的财务状况，投资目标和经验，风险承受能力，以及其他有关情况，亦应了解投资产品所涉及的相关风险。阁下必须详阅载于证券交易协议书中的风险披露声明。友信证券并不是亦不能被视为阁下的财务顾问。阁下在进行任何交易前如有需要应咨询阁下自己的独立法律、税务或财务顾问。`
        }
    },
    async created() {
        try {
            this.customerServiceInfo = await customerStatusSelect()
        } catch (e) {
            this.$toast(e.msg)
        }
    },
    components: {
        [Checkbox.name]: Checkbox,
        [CheckboxGroup.name]: CheckboxGroup
    },
    methods: {
        checkedInvestTarget(item) {
            if (item.value.type === 2) {
                // 征求第三方意见
                this.showHaveQuestion = false
                this.showRiskTip = true
            } else if (item.value.type === 0) {
                window.location.href =
                    'tel:' + this.customerServiceInfo.customerTel
            } else {
                this.$jsBridge.gotoNativeModule('yxzq_goto://customer_service')
                // 联系在线客服
            }
        },
        hasQuestion() {
            this.showHaveQuestion = true
        },
        async submitHandler() {
            try {
                await this.$accountService.finishRiskDisclosure()
                this.goApplyStep()
            } catch (e) {
                this.$toast(e.msg)
            }
        }
    },
    computed: {
        selectList() {
            return [
                {
                    text: '拨打客服电话',
                    tip: this.customerServiceInfo.telTime,
                    hide: [1, 3].indexOf(this.customerServiceInfo.showType) < 0,
                    type: 0
                },
                {
                    text: '联系在线客服',
                    tip: this.customerServiceInfo.onlineTime,
                    hide: [2, 3].indexOf(this.customerServiceInfo.showType) < 0,
                    type: 1
                },
                {
                    text: '征求第三方的独立意见',
                    type: 2
                }
            ]
        },
        canSubmit() {
            return !this.disabled || this.submited
        }
    }
}
</script>

<style lang="scss" scoped>
.content {
    line-height: 24px;
}

.risk-disclosure {
    .risk-disclosure-container {
        padding: $global-padding $global-padding 39px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .primary-color {
            color: $primary-color;
        }
        .risk-disclosure-fixed {
            .sc-title {
                height: 22px;
                font-size: 18px;
                font-weight: 500;
                line-height: 22px;
            }
            .info {
                padding: 14px 0 20px;
                display: flex;
                .img {
                    margin-right: 20px;
                    width: 70px;
                    height: 70px;
                    border-radius: 2px;
                    background-size: cover;
                    line-height: 20px;
                    background-repeat: no-repeat;
                }
            }
        }
        .content {
            width: 347px;
            background: rgba(60, 120, 250, 0.02);
            padding: 15px;
            flex: 1;
            overflow: hidden;
            overflow-y: auto;
            .title {
                padding-bottom: 15px;
            }
            .justify {
                text-align: justify;
            }
        }
    }
}
</style>
