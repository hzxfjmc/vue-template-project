<template lang="pug">
    .transaction-wrapper
        transaction-card(
            :btnText="$t('sell')"
            :direction="2"
            :positionData="positionData"
        )
</template>

<script>
import transactionSellMixin from './mixins.js'
import TransactionCard from '@/biz-components/transaction-card/index-hk.vue'
export default {
    i18n: {
        zhCHS: {
            sell: '确定卖出'
        },
        zhCHT: {
            sell: '確定賣出'
        },
        en: {
            sell: 'Sell'
        }
    },
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
