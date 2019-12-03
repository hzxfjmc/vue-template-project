<template lang="pug">
    .transaction-wrapper
        van-pull-refresh(
            v-model="isLoading"
            @refresh="onRefresh"
            success-text="刷新成功"
        )
            transaction-card(
                ref="transactionCard"
                :direction="1"
                :accountInfo="accountInfo"
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
                class="foot-button"
                text="确认买入"
                @click="handleTradeToken"
            )
</template>

<script>
import transactionBuyMixin from './mixins.js'
import TransactionCard from '@/biz-components/transaction-card/index.vue'
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
    padding-top: 10px;
    background-color: $background-bottom-color;
}
</style>
