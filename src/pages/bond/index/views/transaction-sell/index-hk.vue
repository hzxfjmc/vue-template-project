<template lang="pug">
    .transaction-wrapper
        van-pull-refresh(
            v-model="isLoading"
            @refresh="onRefresh"
            :pulling-text="$t('pullingText')"
            :loosing-text="$t('loosingText')"
            :loading-text="$t('loadingText')"
            :success-text="$t('successText')"
        )
            transaction-card(
                ref="transactionCard"
                :direction="2"
                :positionData="positionData"
                :bondEditableInfo="bondEditableInfo"
                :bondUneditableInfo="bondUneditableInfo"
                :currentPrice="currentPrice"
                :interestDays="interestDays"
                :activityFee="activityFee"
                :feeData="feeData"
            )
        .operate-btn-box
            van-button(
                type="info"
                class="foot-button sell"
                :text="$t('sell')"
                @click="handleTradeToken"
            )
</template>

<script>
import transactionSellMixin from '../transaction-buy/mixins.js'
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
