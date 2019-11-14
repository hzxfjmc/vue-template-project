<template lang="pug">
    yx-container-better(v-show="isShowPage")
        .risk-appropriate-result-wrapper(slot="main")
            .risk-result__header
                i(:type="riskMatchResult")
                h2 {{ riskMatchResult > 2 ? '匹配' : '不匹配' }}
                p 您的风评取向{{ riskMatchResult > 2 ? '可以' : '不适合' }}购买该产品
            .risk-result__content
                .risk-cell
                    span 您的风险取向
                    strong {{ riskTypeList[userRiskLevel] && riskTypeList[userRiskLevel] || '--'  }}
                .risk-cell
                    span 产品的风险
                    strong  {{ riskTypeList[bondRiskLevel] && riskTypeList[bondRiskLevel] || '--'  }}
            .risk-result__tips(v-if="riskMatchResult === 1")
                h2
                    span 什么是风险测评？
                    i.iconfont.icon-about_icon
                p 为了给您提供更匹配的金融产品和服务，了解您的风险能力和偏好是非常必要的，通过风险测评可以了解您的风险承受能力和风险偏好。

        .footer-wrapper(
            slot="bottom"
        )
            .risk-agreement(v-if="riskMatchResult === 3")
                van-checkbox(v-model="isReadProductInfo")
                    i.iconfont(
                        slot="icon"
                        slot-scope="props"
                        :class="props.checked ? 'icon-selected' : 'icon-unchecked'"
                    )
                p
                    span 我已阅读并知晓债券相关风险，我已阅读产品资料
                    a(:href="productUrl") 《产品概览书》
            van-button(
                type="info"
                class="foot-button"
                :text="btnText"
                :disabled="isDisabled"
                @click="handleAction"
            )
</template>
<script>
import riskAppropriateResultMixin from './mixins.js'
export default {
    mixins: [riskAppropriateResultMixin]
}
</script>

<style lang="scss" scoped>
.risk-appropriate-result-wrapper {
    padding-bottom: 48px;
    .risk-result__header {
        padding-top: 20px;
        i {
            display: block;
            width: 90px;
            height: 90px;
            margin: 0 auto;
            &[type='1'],
            &[type='2'] {
                background: url('~@/assets/img/bond/icon-cry.png') center
                    no-repeat;
                background-size: 100%;
            }
            &[type='3'] {
                background: url('~@/assets/img/bond/icon-laugh.png') center
                    no-repeat;
                background-size: 100%;
            }
        }
        h2 {
            margin: 14px 0 2px;
            color: $primary-color-line;
            font-size: 0.48rem;
            line-height: 24px;
            text-align: center;
        }
        p {
            color: $primary-color-line;
            font-size: 0.24rem;
            line-height: 24px;
            text-align: center;
        }
    }
    .risk-result__content {
        margin: 14px;
        padding: 20px 0;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 6px 0px rgba(57, 57, 57, 0.05);
        border-radius: 6px;
        .risk-cell {
            display: flex;
            margin-bottom: 20px;
            padding: 0 14px;
            font-size: 0.28rem;
            line-height: 24px;
            &:last-child {
                margin-bottom: 0;
            }
            span {
                color: rgba(#393939, 0.6);
            }
            strong {
                color: $text-color;
                flex: 1;
                text-align: right;
            }
        }
    }
    .risk-result__tips {
        margin: 0 14px;
        color: $text-color3;
        h2 {
            line-height: 1;
            i {
                font-size: 0.3rem;
                vertical-align: middle;
            }
            span {
                font-size: 0.24rem;
                line-height: 24px;
                vertical-align: middle;
            }
        }
        p {
            margin-top: 2px;
            font-size: 0.24rem;
            line-height: 18px;
        }
    }
}
.footer-wrapper {
    .risk-agreement {
        display: flex;
        align-items: baseline;
        margin-bottom: 12px;
        padding-left: 14px;
        .van-checkbox {
            display: inline-block;
            margin-right: 6px;
            vertical-align: text-bottom;
        }
        .icon-selected,
        .icon-unchecked {
            font-size: 0.32rem;
            vertical-align: middle;
        }
        .icon-selected {
            color: $primary-color-line;
        }
        p {
            flex: 1;
            color: $text-color5;
            font-size: 0.24rem;
            line-height: 20px;
            span {
                opacity: 0.4;
            }
            a {
                color: $primary-color-line;
                font-size: 0.24rem;
            }
        }
    }
}
</style>
