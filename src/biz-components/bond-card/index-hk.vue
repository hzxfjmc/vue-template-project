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
                .text {{ buyYtm }}
                .card-tips 到期年化收益率
            div
                .text {{ subscriptionAmount | thousand-spilt }}
                .card-tips 參攷認購金額/份
            div
                .text.interest-num
                    span {{ paymentAfterTaxPerYear | thousand-spilt }}
                .card-tips 年稅後派息/份
</template>

<script>
import mixin from './mixin'
export default {
    mixins: [mixin],
    computed: {
        // 參攷認購金額
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
            font-size: 0.4rem;
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
                font-size: 0.2rem;
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
            font-size: 0.4rem;
            font-weight: 500;
            margin-bottom: 6px;
        }
        .interest-num {
            height: 0.4rem;
            font-size: 0.32rem;
            span {
                vertical-align: sub;
            }
        }
        .card-tips {
            color: rgba($color: $hk-text-color, $alpha: 0.4);
            font-size: 0.24rem;
            line-height: 20px;
        }
    }
}
</style>
