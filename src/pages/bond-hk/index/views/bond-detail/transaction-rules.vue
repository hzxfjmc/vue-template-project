<template lang="pug">
    .detail-transaction-rules-wrapper
        .yx-cell(style="padding-top:0")
            .yx-cell__header 交易时间：
            .yx-cell__content XXXXXXX
        .yx-cell
            .yx-cell__header 交易费用：
            .yx-cell__content XXXXXXX

</template>
<script>
export default {
    name: 'TransactionRules'
}
</script>
<style lang="scss" scoped>
.detail-transaction-rules-wrapper {
    margin-top: 9px;
    padding-bottom: 7px;
    .yx-cell {
        display: flex;
        padding: 7px 14px;
        color: rgba($color: $hk-text-color, $alpha: 0.6);
        font-size: 0.24rem;
        line-height: 20px;
    }
    .yx-cell + .yx-cell {
        padding-top: 0;
    }
}
</style>
