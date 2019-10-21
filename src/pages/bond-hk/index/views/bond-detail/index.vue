<template lang="pug">
    .bond-detail-wrapper
        detail-header(
            :bondEditableInfo="bondEditableInfo"
            :bondUneditableInfo="bondUneditableInfo",
            :currentPrice="currentPrice"
        )
        van-panel(title="购买流程")
            purchasing-process(:bondUneditableInfo="bondUneditableInfo")
        van-panel(title="债券价格" style="position:relative")
            BondPrice(:chartData="prices" :currentPrice="currentPrice")
        van-panel(title="债券资料")
            BondInfo(
                :bondEditableInfo="bondEditableInfo"
                :bondUneditableInfo="bondUneditableInfo"
            )
        van-panel(title="交易规则")
            TransactionRules
        .faq
            a(href="/webapp/market/generator.html?key=bond01" title="债券常见问题") 债券常见问题
        .operate-btn-box
            div(@click="handleBuyOrSell('buy')") 买入
            div(@click="handleBuyOrSell('sell')") 卖出

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
        margin: 10px auto 12px;
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
    margin-top: 10px;
    border-radius: 4px;
    .van-panel__header {
        padding: 14px 12px;
        font-size: 0.28rem;
        line-height: 20px;
        &:after {
            display: none;
        }
    }
    .van-cell__title {
        font-size: 0.28rem;
        line-height: 20px;
    }
}
</style>
