<template lang="pug">
    .detail-bond-info-wrapper
        .bond-info-header
            a.pdf(
                v-if="bondEditableInfo && bondEditableInfo.productOverview"
                :href="bondEditableInfo && bondEditableInfo.productOverview"
            )
                i.icon
                span 產品概覽書
            a.pdf(
                v-if="bondEditableInfo && bondEditableInfo.raiseManual"
                :href="bondEditableInfo && bondEditableInfo.raiseManual"
            )
                i.icon
                span 募集說明書
        .bond-tips 此債券面值為{{ minFaceValue | thousand-spilt }}{{ currency }}/份，買賣金額為{{ buyPerPrice | thousand-spilt }}
        .con(@click="toggleShowMoreMsg")
            col-msg.hd-col(:colData="colData")
            .more-msg(v-show="showMore")
                col-msg(
                    v-for="(msgItem, index) in moreBondMsg"
                    :key="index"
                    titleClass="title-class"
                    descClass="desc-class"
                    :colData="msgItem"
                )
            i.iconfont(:class="[showMore ? 'icon-iconshouqi' : 'icon-iconxiala' ]")

</template>
<script>
import { calcPaymentDates } from '@/pages/bond/index/tools.js'
import bondInfoMixin from '@/mixins/bond/bond-detail/bond-info.js'
export default {
    mixins: [bondInfoMixin],
    props: {
        currentPrice: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        // 付息日
        paymentDate() {
            return calcPaymentDates(
                this.bondUneditableInfo && this.bondUneditableInfo.paymentDate,
                true,
                '/',
                ',',
                true
            )
        },
        // 最小面额
        minFaceValue() {
            return (
                (this.bondUneditableInfo &&
                    this.bondUneditableInfo.minFaceValue &&
                    this.bondUneditableInfo.minFaceValue - 0) ||
                0
            )
        },
        // 货币单位
        currency() {
            return (
                (this.bondUneditableInfo &&
                    this.bondUneditableInfo.enumCurrency &&
                    this.bondUneditableInfo.enumCurrency.name) ||
                ''
            )
        },
        // 购买价格
        buyPrice() {
            return (
                (this.currentPrice &&
                    this.currentPrice.buyPrice &&
                    this.currentPrice.buyPrice - 0) ||
                0
            )
        },
        // 每份购买金额
        buyPerPrice() {
            let t = this.minFaceValue * this.buyPrice
            return (t && t.toFixed(4)) || ''
        }
    }
}
</script>
<style lang="scss" scoped>
.detail-bond-info-wrapper {
    padding-top: 2px;
    .bond-info-header {
        position: absolute;
        top: 14px;
        right: 14px;
        display: flex;
        .pdf {
            display: flex;
            align-items: center;
            height: 22px;
            padding: 0 6px;
            border-radius: 1px;
            &:first-child {
                margin-right: 15px;
            }
            i {
                display: inline-block;
                width: 15px;
                height: 15px;
                margin-right: 5px;
                background: url('~@/assets/img/bond-hk/icon-pdf.png') center
                    no-repeat;
                background-size: 100% 100%;
            }
            span {
                color: rgba($color: $hk-text-color, $alpha: 0.6);
                font-size: 0.24rem;
                line-height: 17px;
            }
        }
    }
    .bond-tips {
        margin-top: -1px;
        padding: 0 14px 5px;
        color: rgba($color: $hk-text-color, $alpha: 0.6);
        font-size: 0.24rem;
        line-height: 20px;
    }
    .col-column {
        padding-bottom: 20px;
        &:nth-child(1) {
            padding-top: 0;
        }
    }
    .con {
        position: relative;
        .iconfont {
            position: absolute;
            left: 50%;
            bottom: 0;
            transform: translate(-50%);
        }
    }
}
</style>
<style lang="scss">
.detail-bond-info-wrapper {
    .col-column {
        .title-class {
            color: $hk-text-color;
            font-size: 0.36rem;
        }
        .desc-class {
            margin-top: 1px;
            color: rgba($color: $hk-text-color, $alpha: 0.6);
            line-height: 20px;
        }
    }
}
</style>
