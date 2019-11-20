<template lang="pug">
    .bond-detail-wrapper
        van-pull-refresh(
            v-model="isLoading"
            @refresh="onRefresh"
            :success-text="$t('refreshSuccess')"
        )
            detail-header(
                :bondEditableInfo="bondEditableInfo"
                :bondUneditableInfo="bondUneditableInfo",
                :currentPrice="currentPrice"
                :bindStock="bindStock"
                :paymentAfterTaxPerYear="paymentAfterTaxPerYear"
            )
            van-panel(:title="$t('interest')")
                purchasing-process(
                    :bondUneditableInfo="bondUneditableInfo"
                    :paymentInfo="paymentInfo"
                )
            van-panel(:title="$t('bondPrice')" :desc="$t('perContract')" style="position:relative")
                BondPrice(
                    :chartData="prices"
                    :currentPrice="currentPrice"
                    :bondUneditableInfo="bondUneditableInfo"
                )
            van-panel(:title="$t('bondInformation')")
                BondInfo(
                    :bondEditableInfo="bondEditableInfo"
                    :bondUneditableInfo="bondUneditableInfo"
                    :currentPrice="currentPrice"
                )
            van-panel(:title="$t('tradingRules')")
                TransactionRules
            .faq
                a(href="/webapp/market/generator.html?key=bond01" :title="$t('bondFAQ')") {{ $t('bondFAQ') }}
        .operate-btn-box
            van-button(
                type="info"
                :text="$t('buy')"
                @click="handleBuyOrSell('buy')"
            )
            van-button(
                type="info"
                :text="$t('sell')"
                @click="handleBuyOrSell('sell')"
            )

</template>
<script>
import DetailHeader from './hk/detail-header.vue'
import PurchasingProcess from './hk/purchasing-process.vue'
import BondPrice from './hk/bond-price.vue'
import BondInfo from './hk/bond-info.vue'
import TransactionRules from './hk/transaction-rules.vue'

import bondDetailMixin from './mixins'
export default {
    i18n: {
        zhCHS: {
            interest: '派息资料',
            bondPrice: '债券价格',
            perContract: '（每份）',
            bondInformation: '债券资料',
            tradingRules: '交易規則',
            buy: '买入',
            sell: '卖出',
            bondFAQ: '债券常见问题',
            refreshSuccess: '刷新成功',
            viewStocks: '查看股票'
        },
        zhCHT: {
            interest: '派息資料',
            bondPrice: '債券價格',
            perContract: '（每份）',
            bondInformation: '債券資料',
            tradingRules: '交易規則',
            buy: '買入',
            sell: '賣出',
            bondFAQ: '債券常見問題',
            refreshSuccess: '重繪成功',
            viewStocks: '查看股票'
        },
        en: {
            interest: 'Interest',
            bondPrice: 'Bond Price',
            perContract: '（Per Contract）',
            bondInformation: 'Bond Information',
            tradingRules: 'Trading Rules',
            buy: 'Buy',
            sell: 'Sell',
            bondFAQ: 'Bond FAQ',
            refreshSuccess: 'Refresh Success',
            viewStocks: 'View Stocks'
        }
    },
    mixins: [bondDetailMixin],
    components: {
        DetailHeader,
        PurchasingProcess,
        BondPrice,
        BondInfo,
        TransactionRules
    }
}
</script>
<style lang="scss" scoped>
.bond-detail-wrapper {
    padding: 8px $hk-global-padding 96px;
    color: #393939;
    // 常见问题
    .faq {
        text-align: center;
        margin: 30px auto;
        a {
            color: $primary-color-line;
            font-size: 0.24rem;
            line-height: 17px;
        }
    }
}
// 买入卖出按钮
.operate-btn-box {
    position: fixed;
    bottom: 0;
    bottom: constant(safe-area-inset-bottom);
    bottom: env(safe-area-inset-bottom);
    left: 0;
    right: 0;
    display: flex;
    height: 48px;
    .van-button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        height: 100%;
        margin: 0;
        border-color: transparent;
        background-color: $primary-color-line;
        color: #fff;
        font-size: 0.32rem;
        border-radius: 0 !important;
        &:last-child {
            background-color: $sell-color;
        }
    }
}
// 微调 vant panel 样式
.van-panel {
    overflow: hidden;
    margin-top: 14px;
    border-radius: 10px;
    .van-panel__header {
        padding: 11px 14px;
        font-size: 0.28rem;
        line-height: 20px;
        &:after {
            content: '';
            position: absolute;
            top: 15px;
            left: 0;
            width: 4px;
            height: 14px;
            background-color: $hk-primary-color;
            transform: none;
            // display: none;
        }
    }
    .van-cell__title {
        font-size: 0.32rem;
        line-height: 22px;
        .van-cell__label {
            display: inline-block;
            color: rgba($color: $hk-text-color, $alpha: 0.4);
            font-size: 0.24rem;
        }
    }
}
</style>
