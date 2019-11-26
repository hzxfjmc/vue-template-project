<template lang="pug">
    yx-container
        .risk-warning-wrapper(slot="main")
            van-panel.risk-tips(:title="$t('riskWarning')")
                .risk-tips__text-box
                    p(v-for="(textItem, index) in $t('riskTipsList')")
                        span {{ index + 1 }}、
                        span {{ textItem }}
            van-panel.sign-box(:title="$t('signature')")
                van-field(
                    v-model="signName"
                    @blur="handleBlur"
                    :placeholder="signNamePlaceholder"
                    class="sign-box__input"
                )
            .statement
                van-checkbox(v-model="isReadBondInfo")
                    i.iconfont(
                        slot="icon"
                        slot-scope="props"
                        :class="props.checked ? 'icon-xuanzhong2' : 'icon-noconfirm'"
                    )
                .statement-text
                    span {{ $t('bondRisk1') }}
                    a(:href="agreementData && agreementData.protocolUrl") 《{{ agreementData && agreementData.protocolName }}》
                    span {{ $t('bondRisk2') }}
        van-button(
            type="info"
            slot="bottom"
            class="foot-button"
            :text="$t('confirm')"
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
    padding: 29px $hk-global-padding 48px;
    background: #fff;
    color: $hk-text-color;
    .van-panel,
    .van-panel__header {
        &:after {
            display: none;
        }
    }
    .risk-tips {
        .van-panel__header {
            padding: 0 0 10px 0;
        }
        .van-cell__title {
            color: $hk-text-color;
            font-size: 28px;
            line-height: 40px;
        }
        // 风险提示文本
        .risk-tips__text-box {
            overflow-y: auto;
            max-height: 180px;
            padding: 20px 14px;
            background: rgba($hk-primary-color, 0.05);
            box-shadow: 0px 2px 4px 0px rgba($hk-text-color, 0.1);
            p {
                display: flex;
                margin-bottom: 10px;
                color: $hk-text-color;
                font-size: 14px;
                line-height: 20px;
                &:last-child {
                    margin-bottom: 0;
                }
                span {
                    &:nth-child(2) {
                        flex: 1;
                    }
                }
            }
        }
    }
    .sign-box {
        margin-top: 40px;
        .van-panel__header {
            padding: 0 0 2px 0;
        }
        .van-cell__title {
            color: $hk-text-color;
            font-size: 20px;
            line-height: 28px;
        }
    }
    // 声明
    .statement {
        display: flex;
        padding-top: 40px;
        .van-checkbox {
            margin-right: 10px;
            .icon-xuanzhong2,
            .icon-noconfirm {
                font-size: 0.32rem;
                vertical-align: top;
            }
            .icon-noconfirm {
                color: $hk-text-color2;
            }
            .icon-xuanzhong2 {
                color: $hk-primary-color;
            }
        }
        .statement-text {
            flex: 1;
            color: $hk-text-color;
            font-size: 14px;
            line-height: 20px;
            a {
                color: $hk-primary-color;
            }
        }
    }
}
</style>
<style lang="scss">
.risk-warning-wrapper {
    // 签名
    .sign-box {
        .sign-box__input {
            position: relative;
            padding: 0;
            z-index: 1;
            .van-field__control {
                padding: 18px 0;
                border: none;
                border-bottom: 1px solid
                    rgba($color: $hk-text-color, $alpha: 0.0765);
                color: $hk-text-color;
                font-size: 20px;
                line-height: 1;
                &::placeholder {
                    color: $hk-text-color4;
                    font-size: 16px;
                    line-height: 22px;
                }
            }
        }
    }
}
</style>
