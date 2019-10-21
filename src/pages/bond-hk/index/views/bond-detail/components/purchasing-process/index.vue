<template lang="pug">
    .detail-purchasing-process-wrapper
        van-steps(direction="vertical" :active="-1")
            van-step
                <h3>下單購買</h3>
            van-step
                <h3>T+1日計息</h3>
            van-step
                <h3>3.22, 9.22為付息日</h3>
                <p>・付息日支付利息，持有中途可賣出</p>
                <p>・持有到期可收息10次，每次收息: 稅後150美元/份</p>
                <p>・到期前合共收息:稅後1,500美元/份</p>
            van-step
                <h3>到期退出</h3>
                <p>・2020.03.22</p>
                <p>・派發最後一期利息</p>
                <p>・返還本金份額: 2000美元/份</p>
</template>
<script>
import purchasingProcessMixin from '@/mixins/bond/bond-detail/purchasing-process.js'
export default {
    mixins: [purchasingProcessMixin]
}
</script>
<style lang="scss" scoped></style>
<style lang="scss">
.detail-purchasing-process-wrapper {
    .van-steps--vertical {
        padding: 6px 0 12px 35px;
    }
    .van-step--vertical {
        padding: 7px 10px 8px 0;
        .van-step__circle-container {
            & > .van-step__circle {
                top: 10px;
                left: -20px;
                width: 12px;
                height: 12px;
                background-color: $hk-primary-color;
            }
        }
        .van-step__line {
            width: 0;
            border-left: 1px dashed rgba($color: $text-color, $alpha: 0.2);
        }
        &:not(:last-child)::after {
            display: none;
        }
    }
    .van-step {
        .van-step__title {
            font-size: 0.24rem;
            line-height: 17px;
            h3 {
                color: $text-color;
            }
            p {
                margin-top: 5px;
                color: $hk-primary-color;
            }
        }
        &:last-child {
            .van-step__line {
                border-left: none;
            }
        }
    }
}
</style>
