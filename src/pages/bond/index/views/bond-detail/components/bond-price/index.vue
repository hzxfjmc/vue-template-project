<template lang="pug">
    .detail-bond-price-wrapper
        mask-header(v-show="isShowMask" :maskData="maskData")
        col-msg(
            :colData="colData"
        )
        .chart-wrapper
            canvas#mountNode
</template>
<script>
import MaskHeader from './mask-header'
import bondPriceMixin from '@/mixins/bond/bond-detail/bond-price.js'
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
    .col-column {
        padding: 0 12px;
        margin-top: -2px;
    }
    .chart-wrapper {
        margin-top: 14px;
        #mountNode {
            position: relative;
            height: 226px;
            width: 100%;
        }
    }
}
</style>
