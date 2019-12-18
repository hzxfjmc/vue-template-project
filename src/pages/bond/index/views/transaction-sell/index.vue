<template lang="pug">
    .transaction-wrapper
        van-pull-refresh(
            v-model="isLoading"
            @refresh="onRefresh"
            success-text="刷新成功"
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
                text="确认卖出"
                @click="handleTradeToken"
            )
</template>

<script>
import transactionSellMixin from '../transaction-buy/mixins.js'
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
    padding-top: 10px;
    background-color: $background-bottom-color;
}
</style>
