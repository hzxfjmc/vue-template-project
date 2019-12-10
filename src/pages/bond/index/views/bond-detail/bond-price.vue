<template lang="pug">
    .detail-bond-price-wrapper
        mask-header(v-show="isShowMask" :maskData="maskData")
        col-msg(
            :colData="colData"
        )
        .bond-tips {{ $t('bondValue') }}{{ minFaceValue | thousand-spilt }}{{ i18nCurrencyName }}{{ $t('contract') }}，{{ $t('tradingAmount') }}{{ minFaceValue | thousand-spilt }}{{ i18nCurrencyName }}{{ $t('spBondPrice') }}
        .chart-wrapper
            canvas#mountNode
</template>
<script>
import MaskHeader from './bond-price__mask-header'
import bondPriceMixin from './mixins/bond-price.js'
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
        padding: 10px $global-padding 0;
        color: $text-color2;
        font-size: 12px;
        line-height: 17px;
    }
    .col-column {
        padding: 0 $global-padding;
        margin-top: -2px;
    }
    .chart-wrapper {
        #mountNode {
            position: relative;
            height: 226px;
            width: 100%;
        }
    }
}
</style>
