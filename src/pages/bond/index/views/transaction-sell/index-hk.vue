<template lang="pug">
    .transaction-wrapper
        transaction-card(
            btnText="確定賣出"
            :direction="2"
            :positionData="positionData"
        )
</template>

<script>
import transactionSellMixin from '@/mixins/bond/transaction-sell/index.js'
import TransactionCard from '@/biz-components/transaction-card/index-hk.vue'
export default {
    mixins: [transactionSellMixin],
    components: {
        TransactionCard
    }
}
</script>

<style lang="scss" scoped>
.transaction-wrapper {
    height: 100%;
}
</style>
