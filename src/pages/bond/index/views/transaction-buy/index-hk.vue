<template lang="pug">
    .transaction-wrapper
        transaction-card(
            :btnText="$t('buy')"
            :direction="1"
            :accountInfo="accountInfo"
        )
</template>

<script>
import transactionBuyMixin from './mixins.js'
import TransactionCard from '@/biz-components/transaction-card/index-hk.vue'
export default {
    i18n: {
        zhCHS: {
            buy: '确定买入'
        },
        zhCHT: {
            buy: '確定買入'
        },
        en: {
            buy: 'Buy'
        }
    },
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
