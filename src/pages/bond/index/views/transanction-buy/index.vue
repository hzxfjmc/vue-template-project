<template lang="pug">
    .transaction-wrapper
        transacntion-card(
            btnText="确认买入"
            :direction="1"
        )
</template>

<script>
import TransacntionCard from '@/pages/bond/index/biz-components/transaction-card/index.vue'
export default {
    name: 'TransanctionBuy',
    components: {
        TransacntionCard
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
