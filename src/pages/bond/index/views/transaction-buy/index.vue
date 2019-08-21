<template lang="pug">
    .transaction-wrapper
        transaction-card(
            btnText="确认买入"
            :direction="1"
            :accountInfo="accountInfo"
        )
</template>

<script>
import transactionBuyMixin from '@/mixins/bond/transaction-buy/index.js'
export default {
    mixins: [transactionBuyMixin]
}
</script>

<style lang="scss" scoped>
.transaction-wrapper {
    padding: 10px 10px 48px;
}
</style>
