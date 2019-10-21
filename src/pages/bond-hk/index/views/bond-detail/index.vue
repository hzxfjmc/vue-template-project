<template lang="pug">
    .bond-detail-wrapper
        detail-header(
            :bondEditableInfo="bondEditableInfo"
            :bondUneditableInfo="bondUneditableInfo",
            :currentPrice="currentPrice"
        )
        van-panel(title="購買流程")
            purchasing-process(:bondUneditableInfo="bondUneditableInfo")
        van-panel(title="債劵價格" desc="（每份）" style="position:relative")
            BondPrice(:chartData="prices" :currentPrice="currentPrice")
        van-panel(title="債劵資料")
            BondInfo(
                :bondEditableInfo="bondEditableInfo"
                :bondUneditableInfo="bondUneditableInfo"
            )
        van-panel(title="交易規則")
            TransactionRules
        .faq
            a(href="/webapp/market/generator.html?key=bond01" title="債劵常見問題") 債劵常見問題
        .operate-btn-box
            div(@click="handleBuyOrSell('buy')") 買入
            div(@click="handleBuyOrSell('sell')") 賣出

</template>
<script>
import DetailHeader from './components/detail-header/index.vue'
import PurchasingProcess from './components/purchasing-process/index.vue'
import BondPrice from './components/bond-price/index.vue'
import BondInfo from './components/bond-info/index.vue'
import TransactionRules from './components/transaction-rules/index.vue'

import bondDetailMixin from '@/mixins/bond/bond-detail/index.js'
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
    // 买入卖出按钮
    .operate-btn-box {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 48px;
        display: flex;
        div {
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1;
            height: 100%;
            background-color: $primary-color-line;
            color: #fff;
            font-size: 0.32rem;
            &:last-child {
                background-color: $sell-color;
            }
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
