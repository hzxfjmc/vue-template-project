<template lang="pug">
    .bond-card
        .bond-card__header
            h2(:style="h2Style") {{ issuerName }}
            van-tag(
                v-for="(tagItem, index) in limitTags"
                :key="index"
                color="#2177FF"
                plain
            ) {{ tagItem }}
        .bond-card__content
            .flex-fixed-container
                .rate-num(:class="{ empty: buyYtm === '--' }") {{ buyYtm }}
                .card-tips 到期年化收益率
            .flex-fixed-container
                .interest-num {{ paymentDates }}
                .card-tips {{ paymentFrequency }}
</template>

<script>
import mixin from './mixin'
import { calcPaymentDates } from '@/pages/bond/index/tools.js'
export default {
    mixins: [mixin],
    computed: {
        // 付息频率
        paymentFrequency() {
            return (
                (this.bondInfo &&
                    this.bondInfo.paymentFrequency &&
                    this.bondInfo.paymentFrequency.name &&
                    this.bondInfo.paymentFrequency.name + '付息') ||
                '--'
            )
        },
        // 付息日
        paymentDates() {
            return calcPaymentDates(this.bondInfo && this.bondInfo.paymentDates)
        }
    }
}
</script>

<style lang="scss" scoped>
.bond-card {
    margin-top: 10px;
    padding: 15px 12px 22px;
    background-color: $background-color;
    border-radius: 4px;
    .bond-card__header {
        display: flex;
        align-items: center;
        h2 {
            overflow: hidden;
            margin-right: 6px;
            font-size: 0.36rem;
            color: $title-color;
            line-height: 25px;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .van-tag--plain {
            overflow: hidden;
            min-width: 36px;
            max-width: 89px;
            padding: 1px 4px 1px 5px;
            margin-right: 6px;
            font-size: 0.2rem;
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
        margin-top: 9px;
        padding: 0 2px;
        .rate-num {
            margin-bottom: 4px;
            color: #ea3d3d;
            font-size: 0.48rem;
            line-height: 31px;
            &.empty {
                color: $text-color;
            }
        }
        .interest-num {
            margin-top: 3px;
            margin-bottom: 7px;
            color: $text-color;
            font-size: 0.34rem;
            line-height: 25px;
        }
        .card-tips {
            color: $text-color5;
            font-size: 0.24rem;
            line-height: 17px;
        }
    }
}
</style>
