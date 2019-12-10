<template lang="pug">
    .bond-detail-wrapper
        van-pull-refresh(
            v-model="isLoading"
            @refresh="onRefresh"
            success-text="刷新成功"
        )
            detail-header(
                :bondEditableInfo="bondEditableInfo"
                :bondUneditableInfo="bondUneditableInfo",
                :paymentAfterTaxPerYear="paymentAfterTaxPerYear"
                :currentPrice="currentPrice"
            )
            van-panel(title="购买流程")
                purchasing-process(
                    :bondUneditableInfo="bondUneditableInfo"
                    :paymentInfo="paymentInfo"
                )
            van-panel(title="债券价格" desc="（每份）" style="position:relative")
                BondPrice(
                    :chartData="prices"
                    :currentPrice="currentPrice"
                    :bondUneditableInfo="bondUneditableInfo"
                )
            van-panel(title="债券资料")
                BondInfo(
                    :bondEditableInfo="bondEditableInfo"
                    :bondUneditableInfo="bondUneditableInfo"
                )
            van-panel(title="交易规则")
                TransactionRules
            .faq
                a(
                    @click="jumpFaq"
                    title="债券常见问题"
                ) 债券常见问题
        .operate-btn-box
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
.bond-detail-wrapper {
    padding: 10px 10px 96px;
    background-color: $background-bottom-color;
    font-family: DINPro-Regular, DINPro, PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    // 常见问题
    .faq {
        text-align: center;
        margin: 10px auto 12px;
        a {
            color: $primary-color-line;
            font-size: 12px;
            line-height: 17px;
        }
    }
    // 买入卖出按钮
    .operate-btn-box {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #fff;
        display: flex;
        .van-button {
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1;
            height: 48px;
            margin: 0;
            margin-bottom: constant(safe-area-inset-bottom);
            margin-bottom: env(safe-area-inset-bottom);
            border-color: transparent;
            background-color: $primary-color-line;
            color: #fff;
            font-size: 16px;
            border-radius: 0 !important;
            &:last-child {
                background-color: $sell-color;
            }
        }
    }
    // 微调 vant panel 样式
    .van-panel {
        overflow: hidden;
        margin-top: 10px;
        border-radius: 4px;
        .van-panel__header {
            padding: 14px 12px;
            font-size: 14px;
            line-height: 20px;
            &:after {
                display: none;
            }
        }
        .van-cell__title {
            font-size: 14px;
            line-height: 20px;
            .van-cell__label {
                display: inline-block;
                margin-top: 0;
                color: rgba($color: $text-color, $alpha: 0.4);
                font-size: 12px;
            }
        }
    }
}
</style>
