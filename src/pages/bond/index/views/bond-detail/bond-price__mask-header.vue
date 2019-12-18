<template lang="pug">
    van-panel.mask-header(:title="title")
        col-msg(
            :colData="colData"
            :wrapperStyle="wrapperStyle"
        )
</template>

<script>
import bondPriceMaskHeaderMixin from './mixins/bond-price__mask-header.js'
export default {
    mixins: [bondPriceMaskHeaderMixin]
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
        padding: 0.28rem 0.24rem;
        background-color: #f4f8ff;
        font-size: 0.28rem;
        line-height: 20px;
        &:after {
            display: none;
        }
    }
    &:after {
        display: none;
    }
}
.col-column {
    padding: 0 12px;
    margin-top: -2px;
}
</style>
