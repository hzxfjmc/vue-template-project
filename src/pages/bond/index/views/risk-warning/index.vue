<template lang="pug">
    yx-container-better
        .risk-warning-wrapper(slot="main")
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
        font-size: 0.36rem;
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
