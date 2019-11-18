<template lang="pug">
    .transaction-wrapper
        transaction-card(
            btnText="確定買入"
            :direction="1"
            :accountInfo="accountInfo"
        )
</template>

<script>
import transactionBuyMixin from './mixins.js'
import TransactionCard from '@/biz-components/transaction-card/index-hk.vue'
export default {
    mixins: [transactionBuyMixin],
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
