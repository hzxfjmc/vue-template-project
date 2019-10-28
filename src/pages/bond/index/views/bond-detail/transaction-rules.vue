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
    padding-bottom: 7px;
    .yx-cell {
        display: flex;
        padding: 10px 14px;
        color: $text-color5;
        font-size: 0.24rem;
        line-height: 17px;
    }
    .yx-cell + .yx-cell {
        padding-top: 0;
    }
}
</style>
