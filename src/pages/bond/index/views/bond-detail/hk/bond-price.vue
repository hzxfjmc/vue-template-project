<template lang="pug">
    .detail-bond-price-wrapper
        mask-header(v-show="isShowMask" :maskData="maskData")
        col-msg(
            :colData="colData"
            titleClass="title-class"
            descClass="desc-class"
        )
        .bond-tips {{ $t('bondValue') }}{{ minFaceValue | thousand-spilt }}{{ i18nCurrencyName }}{{ $t('contract') }}，{{ $t('tradingAmount') }}{{ minFaceValue | thousand-spilt }}{{ i18nCurrencyName }}{{ $t('spBondPrice') }}
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
    }
}
</script>
<style lang="scss" scoped>
.detail-bond-price-wrapper {
    user-select: none;
    .bond-tips {
        padding: 9px 14px 0;
        color: $hk-text-color7;
        font-size: 12px;
        line-height: 20px;
    }
    .chart-wrapper {
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
        padding: 6px 14px 0;
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
