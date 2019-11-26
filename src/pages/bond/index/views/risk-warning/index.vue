<template lang="pug">
    yx-container
        .risk-warning-wrapper(slot="main")
            van-panel(title="债券购买风险提示")
                .risk-text-box
                    p(v-for="(textItem, index) in $t('riskTipsList')")
                        span {{ index + 1 }}、
                        span {{ textItem }}
            van-panel(title="确认签名" style="margin-top: -0.28rem")
                .signature-input
                    input.signature-input__inner(
                        v-model="signName"
                        @blur="handleBlur"
                        :placeholder="signNamePlaceholder"
                    )
            .statement
                van-checkbox(v-model="isReadBondInfo")
                    i.iconfont(
                        slot="icon"
                        slot-scope="props"
                        :class="props.checked ? 'icon-selected' : 'icon-unchecked'"
                    )
                .text
                    span 我已阅读并知晓债券购买风险提示，及
                    a(:href="agreementData && agreementData.protocolUrl") 《{{ agreementData && agreementData.protocolName }}》
                    span 中有关债券交易、场外交易、及在香港以外地方收取或持有的客户资产的相关条款及风险；本人电子签名代表对上述说明的同意，与本人手写签名具有相同的法律效力
        van-button(
            type="info"
            slot="bottom"
            class="foot-button"
            text="确认"
            :disabled="submitBtnDisabled"
            @click="handleSubmitAutograph"
        )
</template>
<script>
import riskWarningMixin from './mixins.js'
export default {
    mixins: [riskWarningMixin]
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
        font-size: 18px;
        line-height: 22px;
    }
    // 风险提示文本
    .risk-text-box {
        overflow-y: auto;
        max-height: 273px;
        margin: 0 12px 14px 12px;
        padding: 14px 12px 21px 12px;
        background: rgba(47, 121, 255, 0.0261);
        box-sizing: border-box;
        p {
            display: flex;
            color: $text-color5;
            font-size: 14px;
            line-height: 24px;
            span {
                &:nth-child(2) {
                    flex: 1;
                }
            }
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
            padding: 14px 0 13px 14px;
            border: 1px solid rgba($color: $text-color, $alpha: 0.05);
            color: #2e2e3c;
            font-size: 14px;
            line-height: 24px;
            border-radius: 4px;
            appearance: none;
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
                font-size: 16px;
                vertical-align: middle;
            }
            .icon-selected {
                color: $primary-color-line;
            }
        }
        .text {
            flex: 1;
            color: $text-color3;
            span {
                font-size: 12px;
                line-height: 18px;
            }
            a {
                color: $primary-color-line;
                font-size: 12px;
                line-height: 20px;
            }
        }
    }
}
</style>
