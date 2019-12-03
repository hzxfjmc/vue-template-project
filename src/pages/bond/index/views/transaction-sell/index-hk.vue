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
.operate-btn-box {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    .foot-button {
        height: 48px;
        margin: 0;
        margin-bottom: constant(safe-area-inset-bottom);
        margin-bottom: env(safe-area-inset-bottom);
        &.sell {
            background: #ffbf32;
            border-color: #ffbf32;
        }
    }
}
</style>
