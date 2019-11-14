<template lang="pug">
    .transaction-wrapper
        transaction-card(
            btnText="确认卖出"
            :direction="2"
            :positionData="positionData"
        )
</template>

<script>
import transactionSellMixin from './mixins.js'
import TransactionCard from '@/biz-components/transaction-card/index.vue'
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
