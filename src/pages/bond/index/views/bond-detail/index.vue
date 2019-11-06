<template lang="pug">
    van-pull-refresh(
        v-model="isLoading"
        @refresh="onRefresh"
        success-text="刷新成功"
    )
        yx-container-better
            .bond-detail-wrapper(slot="main")
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
            .operate-btn-box(slot="bottom")
                van-button(
                    type="info"
                    text="买入"
                    @click="handleBuyOrSell('buy')"
                )
                van-button(
                    type="info"
                    text="卖出"
                    @click="handleBuyOrSell('sell')"
                )

</template>
<script>
import DetailHeader from './detail-header.vue'
import PurchasingProcess from './purchasing-process.vue'
import BondPrice from './bond-price.vue'
import BondInfo from './bond-info.vue'
import TransactionRules from './transaction-rules.vue'

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
.yx-container {
    background-color: transparent;
}
.bond-detail-wrapper {
    padding: 10px 10px 48px;
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
}
// 买入卖出按钮
.operate-btn-box {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 48px;
    display: flex;
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
