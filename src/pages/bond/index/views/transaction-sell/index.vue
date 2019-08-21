<template lang="pug">
    .transaction-wrapper
        transaction-card(
            btnText="确认卖出"
            :direction="2"
            :positionData="positionData"
        )
</template>

<script>
import transactionSellMixin from '@/mixins/bond/transaction-sell/index.js'
export default {
    mixins: [transactionSellMixin]
}
</script>

<style lang="scss" scoped>
.transaction-wrapper {
    padding: 10px 10px 48px;
}
</style>
