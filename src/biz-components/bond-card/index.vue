<template lang="pug">
    .bond-card
        .bond-card__header
            h2(:style="h2Style") {{ issuerName }}
            van-tag(
                v-for="(tagItem, index) in limitTags"
                :key="index"
                color="#2177FF"
                plain
            ) {{ tagItem && tagItem.slice(0, 8) }}
        .bond-card__content
            div
                .bond-card__text(:class="[ buyYtm === '--' ? 'empty' : '', buyYtm.replace(/%/, '') > 0 ? up : down ]") {{ buyYtm }}
                .bond-card__tips 到期年化收益率
            div
                .bond-card__text.sp {{ subscriptionAmount | thousand-spilt }}
                .bond-card__tips 参考认购金额/份
            div
                .bond-card__text.sp {{ paymentAfterTaxPerYear | thousand-spilt }}
                .bond-card__tips 年派息/份
</template>

<script>
import mixin from './mixin'
export default {
    mixins: [mixin]
}
</script>

<style lang="scss" scoped>
.bond-card {
    margin-bottom: 10px;
    padding: 15px 12px 22px;
    background-color: $background-color;
    border-radius: 4px;
    .bond-card__header {
        display: flex;
        align-items: center;
        h2 {
            overflow: hidden;
            margin-right: 6px;
            font-size: 18px;
            color: $title-color;
            line-height: 25px;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .van-tag--plain {
            overflow: hidden;
            min-width: 36px;
            max-width: 110px;
            padding: 4px 6px;
            margin-right: 4px;
            font-size: 10px;
            text-align: center;
            line-height: 14px;
            text-overflow: ellipsis;
            white-space: nowrap;
            &:last-child {
                margin-right: 0;
            }
        }
    }
    .bond-card__content {
        display: flex;
        justify-content: space-between;
        margin-top: 9px;
        padding: 0 2px;
        .bond-card__text {
            margin-bottom: 4px;
            font-size: 24px;
            line-height: 31px;
            &.sp {
                margin-top: 3px;
                margin-bottom: 7px;
                color: $text-color;
                font-size: 17px;
                line-height: 25px;
            }
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
        .bond-card__tips {
            color: $text-color5;
            font-size: 12px;
            line-height: 17px;
        }
    }
}
</style>
