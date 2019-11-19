<template lang="pug">
    .detail-bond-price-wrapper
        mask-header(v-show="isShowMask" :maskData="maskData")
        .bond-tips {{ $t('bondValue') }}{{ minFaceValue | thousand-spilt }}{{ currencySymbol }}/{{ $t('contract') }}，{{ $t('tradingAmount') }}{{ minFaceValue | thousand-spilt }}{{ currencySymbol }} * {{ $t('bondPrice') }}
        col-msg(
            :colData="colData"
            titleClass="title-class"
            descClass="desc-class"
        )
        .chart-wrapper
            canvas#mountNode
</template>
<script>
import MaskHeader from './bond-price__mask-header'
import bondPriceMixin from '../mixins/bond-price.js'
export default {
    mixins: [bondPriceMixin],
    components: {
        MaskHeader
    },
    props: {
        bondUneditableInfo: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
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
        currencySymbol() {
            return (
                (this.bondUneditableInfo &&
                    this.bondUneditableInfo.enumCurrency &&
                    this.bondUneditableInfo.enumCurrency.shortSymbol) ||
                ''
            )
        }
    }
}
</script>
<style lang="scss" scoped>
.detail-bond-price-wrapper {
    user-select: none;
    .bond-tips {
        margin-top: -1px;
        padding: 0 14px 5px;
        color: rgba($color: $hk-text-color, $alpha: 0.6);
        font-size: 0.24rem;
        line-height: 20px;
    }
    .chart-wrapper {
        margin-top: 20px;
        padding-bottom: 5px;
        #mountNode {
            position: relative;
            height: 220px;
            width: 100%;
        }
    }
}
</style>
<style lang="scss">
.detail-bond-price-wrapper {
    .col-column {
        padding: 0 14px;
        margin-top: 13px;
        .title-class {
            color: $hk-text-color;
            font-size: 0.36rem;
            font-weight: 500;
        }
        .desc-class {
            margin-top: 3px;
            color: rgba($color: $hk-text-color, $alpha: 0.6);
            line-height: 20px;
        }
    }
}
</style>
