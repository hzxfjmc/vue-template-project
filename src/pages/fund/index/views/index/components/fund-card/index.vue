<template lang="pug">
    .fund-card
        .left
            .rate-num.color-red(v-if="apy > 0") +{{ apy }}%
            .rate-num.color-green(v-else-if="apy < 0") {{ apy }}%
            .rate-num(v-else) {{ apy }}%
            .annualized-returns {{ $t('annualRateOfReturn') }}
        .right
            h2(:style="h2Style") {{ fundName }}
            .labels 
                .label {{ info.assetType }}
                .label {{ info.fundRisk  }}
            .feature {{ info.feature }}
</template>

<script>
import { Tag } from 'vant'
export default {
    i18n: {
        zhCHS: {
            annualRateOfReturn: '近一年收益'
        },
        zhCHT: { annualRateOfReturn: '近一年表現' },
        en: { annualRateOfReturn: 'Past Year' }
    },
    name: 'BondCard',
    components: {
        [Tag.name]: Tag
    },
    props: {
        info: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        apy() {
            return this.info && ((this.info.apy - 0) * 100).toFixed(2)
        },
        fundName() {
            return this.info.fundName.length > 12
                ? this.info.fundName.slice(0, 12) + '...'
                : this.info.fundName
        },
        h2Style() {
            // 名称字体变化策略
            let fundName = this.info.fundName || ''
            if (fundName.length > 12) {
                return {
                    fontSize: '0.28rem'
                }
            }
            return {
                fontSize: '0.32rem'
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.fund-card {
    height: 110px;
    margin-top: 10px;
    padding: 15px 12px 22px;
    background-color: $background-color;
    border-radius: 4px;
    display: flex;
    align-items: center;
    .left {
        width: 143px;
        display: flex;
        flex-direction: column;
        .rate-num {
            margin-bottom: 4px;
            color: $text-color;
            font-size: 0.48rem;
            line-height: 31px;
        }
        .color-green {
            color: #04be02;
        }
        .color-red {
            color: #ea3d3d;
        }
        .annualized-returns {
            font-size: 0.24rem;
            color: $text-color3;
        }
    }
    .right {
        display: flex;
        flex-direction: column;
        h2 {
            overflow: hidden;
            margin-bottom: 6px;
            color: $title-color;
        }
        .feature {
            color: $text-color5;
            font-size: 0.24rem;
        }
        .labels {
            display: flex;
            justify-content: flex-start;
            margin-bottom: 6px;
            .label {
                overflow: hidden;
                color: $hk-text-line-color;
                font-size: 0.2rem;
                line-height: 0.2rem;
                border: 1px solid $hk-text-line-color;
                margin-right: 5px;
                padding: 2px 2px;
                border-radius: 1px;
            }
        }
    }
}
</style>
