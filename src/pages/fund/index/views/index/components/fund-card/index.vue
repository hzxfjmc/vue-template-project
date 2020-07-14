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
                fund-tag(:title="$t(info.currency.name)" v-if="$t(info.currency.name)")
                fund-tag(:title="fundSizeStr" v-if="+info.fundSize")
            .feature {{ info.feature }}
</template>

<script>
import fundTag from '@/biz-components/fund-tag/index.vue'
import { getStockColorType } from '@/utils/html-utils.js'
import {
    parseThousands,
    transNumToThousandMark
} from '../../../../../../../utils/tools'
import { CURRENCY_NAME } from '../../../../map'
// import fundCommonMethods from '../../../../mixins/fund-common-methods'

export default {
    // mixins: [fundCommonMethods],
    i18n: {
        zhCHS: {
            annualRateOfReturn: '近一年涨跌幅',
            yieldInLast7d: '近七日年化',
            HKD: '港币',
            USD: '美元',
            fundSize: (size, unit, currency) => `${size}${unit}${currency}规模`
        },
        zhCHT: {
            annualRateOfReturn: '近一年漲跌幅',
            yieldInLast7d: '近七日年化',
            HKD: '港幣',
            USD: '美元',
            fundSize: (size, unit, currency) => `${size}${unit}${currency}規模`
        },
        en: {
            annualRateOfReturn: '1-Year Rtn(Cum)',
            yieldInLast7d: 'Yield in Last 7d',
            HKD: 'HKD',
            USD: 'USD',
            fundSize: (size, unit, currency) => `AUM ${size}${unit} ${currency}`
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
        },
        // 规模
        fundSizeStr() {
            // return this.changeFundSizeLang(
            //     this.info.fundSize,
            //     this.info.currency.type
            // )
            let currency =
                CURRENCY_NAME[this.$i18n.lang][
                    this.info.fundSizeCurrency.type
                ] || ''
            let arr = this.info.fundSize.split('.')
            let size, unit
            let isEnLang = this.$i18n.lang === 'en'
            if (arr[0].length < 5) {
                size = parseThousands(arr[0])
                return this.$t('fundSize', size, currency)
            }
            if (isEnLang) {
                if (arr[0].length === 5) {
                    size = transNumToThousandMark(arr[0] / 1000, 2)
                    unit = 'K'
                } else if (arr[0].length < 9) {
                    size = transNumToThousandMark(arr[0] / 1000000, 2)
                    unit = 'M'
                } else {
                    size = transNumToThousandMark(arr[0] / Math.pow(10, 9), 2)
                    unit = 'B'
                }
            } else {
                if (arr[0].length === 5) {
                    size = transNumToThousandMark(arr[0] / 10000, 2)
                    unit = this.$t(['万', '萬', ''])
                } else if (arr[0].length < 8) {
                    size = transNumToThousandMark(arr[0] / 10000, 2)
                    unit = this.$t(['万', '萬', ''])
                } else {
                    size = transNumToThousandMark(arr[0] / Math.pow(10, 8), 2)
                    unit = this.$t(['亿', '億', ''])
                }
            }
            return this.$t('fundSize', size, unit, currency)
            // if (arr[0].length === 5) {
            //     if (isEnLang) {
            //         size = transNumToThousandMark(arr[0] / 1000, 2)
            //         unit = 'K'
            //     } else {
            //         size = transNumToThousandMark(arr[0] / 10000, 2)
            //         unit = this.$t(['万', '萬', ''])
            //     }
            //     return this.$t('fundSize', size, unit, currency)
            // }
            // if (arr[0].length < 9) {
            //     if (isEnLang) {
            //         size = transNumToThousandMark(arr[0] / 1000000, 2)
            //         unit = 'M'
            //     } else {
            //         size = transNumToThousandMark(arr[0] / 10000, 2)
            //         unit = this.$t(['万', '萬', ''])
            //     }
            //     return this.$t('fundSize', size, unit, currency)
            // }
            // if (isEnLang) {
            //     size = transNumToThousandMark(arr[0] / Math.pow(10, 9), 2)
            //     unit = 'B'
            // } else {
            //     size = transNumToThousandMark(arr[0] / Math.pow(10, 8), 2)
            //     unit = this.$t(['亿', '億', ''])
            // }
            // return this.$t('fundSize', size, unit, currency)
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
        width: 60%;
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
            flex-wrap: wrap;
        }
    }
}
</style>
