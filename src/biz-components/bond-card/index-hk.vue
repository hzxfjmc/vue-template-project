<template lang="pug">
    .bond-card
        .bond-card__header
            h2(:style="h2Style") {{ issuerName }}
            div(class="tag-box flex")
                van-tag(
                    v-for="(tagItem, index) in limitTags"
                    :key="index"
                    color="#2177FF"
                    plain
                ) {{ tagItem }}
        .bond-card__content
            div
                .text(:class="[ buyYtm === '--' ? 'empty' : '', buyYtm.replace(/%/, '') > 0 ? up : down ]") {{ buyYtm }}
                .card-tips {{ $t('yieldToMaturity') }}
            div
                .text {{ subscriptionAmount | thousand-spilt }}
                .card-tips {{ $t('refAmountContract') }}
            div
                .text.interest-num
                    span {{ paymentAfterTaxPerYear | thousand-spilt }}
                .card-tips {{ $t('annualInterestContract') }}
</template>

<script>
import mixin from './mixin'
export default {
    i18n: {
        zhCHS: {
            yieldToMaturity: '到期年化收益率',
            refAmountContract: '参考认购金额/份',
            annualInterestContract: '年税后派息/份'
        },
        zhCHT: {
            yieldToMaturity: '到期年化收益率',
            refAmountContract: '參考認購金額/份',
            annualInterestContract: '年稅後派息/份'
        },
        en: {
            yieldToMaturity: 'Yield-to-Maturity',
            refAmountContract: 'Ref. Amount / Contract',
            annualInterestContract: 'Annual Interest / Contract'
        }
    },
    mixins: [mixin],
    computed: {
        // 參考認購金額
        subscriptionAmount() {
            return (
                (this.minFaceValue * this.buyPrice &&
                    `${this.currency}${(
                        this.minFaceValue * this.buyPrice
                    ).toFixed(3)}`) ||
                '--'
            )
        },
        // 最小面额
        minFaceValue() {
            return (this.bondInfo && this.bondInfo.minFaceValue - 0) || 0
        },
        // 购买价格
        buyPrice() {
            return (
                (this.bondInfo &&
                    this.bondInfo.price &&
                    this.bondInfo.price.buyPrice &&
                    this.bondInfo.price.buyPrice - 0) ||
                0
            )
        },
        // 货币单位
        currency() {
            return (
                (this.bondInfo &&
                    this.bondInfo.enumCurrency &&
                    this.bondInfo.enumCurrency.symbol) ||
                ''
            )
        },
        // 年稅後派息
        paymentAfterTaxPerYear() {
            return (
                (this.bondInfo &&
                    this.bondInfo.paymentAfterTaxPerYear &&
                    `${this.currency}${(
                        this.bondInfo.paymentAfterTaxPerYear - 0
                    ).toFixed(3)}`) ||
                '--'
            )
        }
    }
}
</script>

<style lang="scss" scoped>
.bond-card {
    margin-bottom: 14px;
    padding: 20px 14px 19px;
    border: 1px solid #f7f7f7;
    background-color: #fff;
    line-height: 1;
    border-radius: 10px;
    box-shadow: 0px 2px 4px 0px rgba($color: $hk-text-color, $alpha: 0.05);
    .bond-card__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        h2 {
            overflow: hidden;
            margin-right: 20px;
            font-size: 20px;
            color: $hk-text-color;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .tag-box {
            margin-right: 8px;
            .van-tag--plain {
                overflow: hidden;
                min-width: 45px;
                max-width: 115px;
                padding: 4px 7px;
                margin-right: 5px;
                font-size: 10px;
                text-align: center;
                line-height: 18px;
                text-overflow: ellipsis;
                white-space: nowrap;
                border-radius: 4px;
                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }
    .bond-card__content {
        display: flex;
        margin-top: 25px;
        justify-content: space-between;
        .text {
            color: $hk-text-color;
            font-size: 20px;
            font-weight: 500;
            margin-bottom: 6px;
            &.red {
                color: #ea3d3d;
            }
            &.green {
                color: $green-text-color;
            }
            &.empty {
                color: $text-color;
            }
        }
        .interest-num {
            height: 20px;
            font-size: 16px;
            span {
                vertical-align: sub;
            }
        }
        .card-tips {
            color: rgba($color: $hk-text-color, $alpha: 0.4);
            font-size: 12px;
            line-height: 20px;
        }
    }
}
</style>
