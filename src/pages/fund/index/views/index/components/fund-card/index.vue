<template lang="pug">
    .fund-card
        .left
            .rate-num(v-if="apy > 0" :class="stockColorType === 1 ? 'color-red' : 'color-green'") +{{ apy }}%
            .rate-num(v-else-if="apy < 0" :class="stockColorType === 1 ? 'color-green' : 'color-red'") {{ apy }}%
            .rate-num(v-else) {{ apy }}%
            .annualized-returns {{ isMonetaryFund ? $t('yieldInLast7d') : $t('annualRateOfReturn') }}
        .right
            h2(:style="h2Style") {{ info.fundName }}
            .labels 
                fund-tag(:title="info.fundRisk")
                fund-tag(:title="info.currency.shortSymbol")
            .feature {{ info.feature }}
</template>

<script>
import fundTag from '@/biz-components/fund-tag/index.vue'
import { getStockColorType } from '@/utils/html-utils.js'
export default {
    i18n: {
        zhCHS: {
            annualRateOfReturn: '近一年收益率',
            yieldInLast7d: '近七日年化'
        },
        zhCHT: {
            annualRateOfReturn: '近一年表現',
            yieldInLast7d: '近七日年化'
        },
        en: {
            annualRateOfReturn: 'Past Year',
            yieldInLast7d: 'Yield in Last 7d'
        }
    },
    name: 'BondCard',
    components: {
        'fund-tag': fundTag
    },
    props: {
        info: {
            type: Object,
            default: () => {}
        },
        assetType: {
            type: String,
            default: ''
        },
        currency: {
            type: [String, Number],
            default: null
        }
    },
    computed: {
        stockColorType() {
            return +getStockColorType()
        },
        isMonetaryFund() {
            return Number(this.info.assetType) === 4 // 货币型基金
        },
        apy() {
            const func = this.info && this.info.apy > 0 ? Math.floor : Math.ceil
            let apyNum =
                this.info.assetType === 4
                    ? (func((this.info.apy - 0) * 1000000) / 10000).toFixed(4)
                    : (func((this.info.apy - 0) * 10000) / 100).toFixed(2)
            return this.info && apyNum
        },
        // fundName() {
        //     return this.info.fundName.length > 12
        //         ? this.info.fundName.slice(0, 12) + '...'
        //         : this.info.fundName
        // },
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
        width: 40%;
        display: flex;
        flex-direction: column;
        .rate-num {
            margin-bottom: 4px;
            color: $text-color;
            font-size: 0.48rem;
            // font-weight: bold;
            font-family: yxFontDINPro-Medium;
            line-height: 31px;
        }
        .color-green {
            color: #04ba60;
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
        width: 65%;
        flex-direction: column;
        h2 {
            overflow: hidden;
            margin-bottom: 6px;
            width: 100%;
            color: $title-color;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .feature {
            color: $text-color5;
            font-size: 0.24rem;
        }
        .labels {
            display: flex;
            justify-content: flex-start;
            margin-bottom: 6px;
        }
    }
}
</style>
