<template lang="pug">
    .detail-purchasing-process-wrapper
        .process-steps
            .process-steps__items
                .process-step
                    .process-step__title 下单购买
                    .process-step__circle-container
                        i.process-step__circle
                    .process-step__line
                .process-step
                    .process-step__title {{ enumDelivery }}日计息
                    .process-step__circle-container
                        i.process-step__circle
                    .process-step__line
                .process-step
                    .process-step__title.sp 每次收息{{ paymentPerTime }}{{ currency }}/份
                    .process-step__circle-container
                        span.process-step__text 付息日支付利息，持有中途可卖出
                    .process-step__line
                .process-step
                    .process-step__title 到期退出
                        .process-step__title-tips {{ dueTime | date-format('YYYY.MM.DD') }}
                    .process-step__circle-container
                        i.process-step__circle
                    .process-step__line
</template>
<script>
import purchasingProcessMixin from './mixins/purchasing-process.js'
export default {
    mixins: [purchasingProcessMixin],
    props: {
        paymentInfo: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        paymentPerTime() {
            return this.paymentInfo.paymentPerTime || 0
        }
    }
}
</script>
<style lang="scss" scoped>
.process-steps {
    overflow: hidden;
    padding: 0 10px 0 13px;
    background-color: #fff;
}
.process-steps__items {
    display: flex;
    overflow: hidden;
    position: relative;
}
.process-step {
    position: relative;
    flex: 1;
    padding: 23px 0 26px;
    color: #969799;
    font-size: 0.28rem;
    &:first-child {
        .process-step__title {
            transform: none;
            margin-left: 0;
        }
    }
    &:nth-child(2) {
        left: -26px;
    }
    &:nth-child(3) {
        left: -8px;
    }
    &:last-child {
        position: absolute;
        right: 0;
        width: auto;
        .process-step__title {
            transform: none;
            margin-left: 0;
            text-align: right;
        }
        .process-step__circle-container {
            left: auto;
            right: 0;
        }
    }
    .process-step__title {
        position: relative;
        display: inline-block;
        color: $text-color;
        font-size: 0.24rem;
        line-height: 20px;
        transform: translate3d(-50%, 0, 0);
        &.sp {
            margin-left: -12px;
            white-space: nowrap;
        }
        .process-step__title-tips {
            position: absolute;
            right: 0;
            color: $text-color5;
            font-size: 0.2rem;
            line-height: 1;
        }
    }
    .process-step__circle-container {
        position: absolute;
        top: 6px;
        left: 0;
        z-index: 1;
        .process-step__circle {
            display: block;
            width: 6px;
            height: 6px;
            background: #d1d1d1;
            border-radius: 50%;
        }
        .process-step__text {
            position: relative;
            top: 3px;
            display: block;
            padding: 3px 4px;
            background: rgba(235, 235, 235, 1);
            color: $text-color5;
            font-size: 10px;
            line-height: 14px;
            white-space: nowrap;
            transform: translate3d(-50%, -50%, 0);
        }
    }
    .process-step__line {
        position: absolute;
        top: 8px;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: #ebebeb;
    }
}
</style>
