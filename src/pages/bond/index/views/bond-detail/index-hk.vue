<template lang="pug">
    yx-container-better
        van-pull-refresh(
            slot="main"
            v-model="isLoading"
            @refresh="onRefresh"
            success-text="刷新成功"
        )
            .bond-detail-wrapper
                detail-header(
                    :bondEditableInfo="bondEditableInfo"
                    :bondUneditableInfo="bondUneditableInfo",
                    :currentPrice="currentPrice"
                    :paymentAfterTaxPerYear="paymentAfterTaxPerYear"
                )
                van-panel(title="派息資料")
                    purchasing-process(
                        :bondUneditableInfo="bondUneditableInfo"
                        :paymentInfo="paymentInfo"
                    )
                van-panel(title="債劵價格" desc="（每份）" style="position:relative")
                    BondPrice(:chartData="prices" :currentPrice="currentPrice")
                van-panel(title="債劵資料")
                    BondInfo(
                        :bondEditableInfo="bondEditableInfo"
                        :bondUneditableInfo="bondUneditableInfo"
                        :currentPrice="currentPrice"
                    )
                van-panel(title="交易規則")
                    TransactionRules
                .faq
                    a(href="/webapp/market/generator.html?key=bond01" title="債劵常見問題") 債劵常見問題
        .operate-btn-box(slot="bottom")
            van-button(
                type="info"
                text="買入"
                @click="handleBuyOrSell('buy')"
            )
            van-button(
                type="info"
                text="賣出"
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
    padding: 8px $hk-global-padding 48px;
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
    display: flex;
    height: 48px;
    .van-button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        height: 100%;
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
