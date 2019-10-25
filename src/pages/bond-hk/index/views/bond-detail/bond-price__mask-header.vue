<template lang="pug">
    van-panel.mask-header(:title="title")
        col-msg(
            :colData="colData"
            titleClass="title-class"
            descClass="desc-class"
            :descStyle="descStyle"
        )
</template>

<script>
import bondPriceMaskHeaderMixin from '@/mixins/bond/bond-detail/bond-price__mask-header.js'
export default {
    mixins: [bondPriceMaskHeaderMixin],
    data() {
        return {
            descStyle: {}
        }
    }
}
</script>

<style lang="scss" scoped>
.mask-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding-bottom: 10px;
    background-color: #f4f8ff;
}
.van-panel {
    .van-panel__header {
        padding: 11px 14px;
        background-color: #f4f8ff;
        font-size: 0.28rem;
        line-height: 20px;
        &:after {
            display: none;
        }
    }
    .van-cell__title {
        font-size: 0.32rem;
        line-height: 22px;
    }
    &:after {
        display: none;
    }
}
</style>
