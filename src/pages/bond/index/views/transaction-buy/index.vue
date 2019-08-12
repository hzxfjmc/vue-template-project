<template lang="pug">
    .transaction-wrapper
        transaction-card(
            btnText="确认买入"
            :direction="1"
        )
</template>

<script>
import TransactionCard from '@/pages/bond/index/biz-components/transaction-card/index.vue'
export default {
    name: 'TransactionBuy',
    components: {
        TransactionCard
    },
    data() {
        return {}
    }
}
</script>

<style lang="scss" scoped>
.transaction-wrapper {
    padding: 10px 10px 48px;
}
</style>
