<template lang="pug">
    .risk-appropriate-result-wrapper(v-show="isShowPage")
        .risk-result__header
            i(:type="riskMatchResult")
            h2 {{ riskMatchResult > 2 ? $t('matching') : $t('noMatching') }}
            p {{$t('yoursAppropriate')}}{{ riskMatchResult > 2 ? $t('suitable') : $t('noSuitable') }} {{$t('buyIt')}}
        .risk-result__content
            .risk-cell
                span {{$t('yoursAppropriate')}}
                strong {{ riskTypeList[userRiskLevel] && riskTypeList[userRiskLevel] || '--'  }}
            .risk-cell
                span {{$t('proRisk')}}
                strong  {{ riskTypeList[bondRiskLevel] && riskTypeList[bondRiskLevel] || '--'  }}
        .risk-result__tips(v-if="riskMatchResult === 1")
            h2
                span {{$t('riskMeans')}}
                i.iconfont.icon-about_icon
            p {{$t('meansInfo')}}
        .risk-agreement(v-if="riskMatchResult === 3")
            van-checkbox(v-model="isReadProductInfo")
                i.iconfont(
                    slot="icon"
                    slot-scope="props"
                    :class="props.checked ? 'icon-selected' : 'icon-unchecked'"
                )
            p
                span {{$t('hadRead')}}
                a(:href="productUrl") 《{{$t('productOverview')}}》
        fixed-operate-btn(
            :text="btnText"
            :disabled="isDisabled"
            @click="handleAction"
        )
</template>

<script>
import riskAppropriateResultMixin from '@/mixins/bond/risk-appropriate-result/index.js'
import { i18nAppropriateData } from './risk-appropriate-result-i18n.js'
export default {
    mixins: [riskAppropriateResultMixin],
    i18n: i18nAppropriateData
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
            color: $text-color5;
            font-size: 0.24rem;
            opacity: 0.4;
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
    .risk-agreement {
        display: flex;
        align-items: baseline;
        position: absolute;
        bottom: 62px;
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
