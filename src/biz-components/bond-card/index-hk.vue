<template lang="pug">
    .bond-card
        .bond-card__header
            h2(:style="h2Style") {{ issuerName }}
            .bond-card__tag-box(class="flex")
                van-tag(
                    v-for="(tagItem, index) in limitTags"
                    :key="index"
                    color="#2177FF"
                    plain
                ) {{ tagItem && tagItem.slice(0, 8) }}
        .bond-card__content
            div
                .bond-card__text(:class="[ buyYtm === '--' ? 'empty' : '', buyYtm.replace(/%/, '') > 0 ? up : down ]") {{ buyYtm }}
                .bond-card__tips {{ $t('yieldToMaturity') }}
            div
                .bond-card__text.sp
                    span {{ subscriptionAmount | thousand-spilt }}
                .bond-card__tips {{ $t('refAmountContract') }}
            div
                .bond-card__text.sp
                    span {{ paymentAfterTaxPerYear | thousand-spilt }}
                .bond-card__tips {{ $t('annualInterestContract') }}
</template>

<script>
import mixin from './mixin'
export default {
    mixins: [mixin]
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
            margin-right: 10px;
            font-size: 20px;
            line-height: 24px;
            color: $hk-text-color;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .bond-card__tag-box {
            margin-right: 0px;
            .van-tag--plain {
                overflow: hidden;
                min-width: 45px;
                max-width: 100px;
                padding: 4px 6px;
                margin-right: 0px;
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
        margin-top: 24px;
        justify-content: space-between;
        .bond-card__text {
            color: $hk-text-color;
            font-size: 20px;
            font-weight: 500;
            font-family: DINPro-Medium, DINPro, PingFangHK-Medium, PingFangHK;
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
            &.sp {
                height: 20px;
                font-size: 16px;
                span {
                    vertical-align: sub;
                }
            }
        }
        .bond-card__tips {
            color: rgba($color: $hk-text-color, $alpha: 0.4);
            font-size: 12px;
            line-height: 20px;
        }
    }
}
</style>
