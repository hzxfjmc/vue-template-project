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
                    .process-step__title T+1日计息
                    .process-step__circle-container
                        i.process-step__circle
                    .process-step__line
                .process-step
                    .process-step__title {{ paymentDate }}为付息日
                    .process-step__circle-container
                        span.process-step__text 付息日支付利息，持有中途可卖出
                    .process-step__line
                .process-step
                    .process-step__title 到期退出
                        .process-step__title-tips {{ bondUneditableInfo && bondUneditableInfo.dueTime | date-format('YYYY.MM.DD') }}
                    .process-step__circle-container
                        i.process-step__circle
                    .process-step__line
</template>
<script>
import { Step, Steps } from 'vant'
// import { dateFormat } from '@/utils/tool.js'
export default {
    name: 'PurchasingProcess',
    components: {
        [Step.name]: Step,
        [Steps.name]: Steps
    },
    props: {
        bondUneditableInfo: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        // 付息日
        paymentDate() {
            //
            let innerPaymentDate =
                (this.bondUneditableInfo &&
                    this.bondUneditableInfo.paymentDate) ||
                ''
            innerPaymentDate = innerPaymentDate
                .replace(/\|/g, '、')
                .replace(/月/g, '.')
                .replace(/日/g, '')
            return innerPaymentDate
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
            right: 3px;
        }
    }
    .process-step__title {
        position: relative;
        display: inline-block;
        margin-left: 3px;
        font-size: 0.24rem;
        line-height: 20px;
        transform: translate3d(-50%, 0, 0);
        .process-step__title-tips {
            position: absolute;
            right: 0;
            font-size: 0.2rem;
            line-height: 1;
        }
    }
    .process-step__circle-container {
        position: absolute;
        top: 6px;
        left: 0;
        // background-color: #fff;
        z-index: 1;
        .process-step__circle {
            display: block;
            width: 6px;
            height: 6px;
            background: #393939;
            border-radius: 50%;
        }
        .process-step__text {
            position: relative;
            top: 3px;
            display: block;
            padding: 2px 4px 3px;
            background: rgba(235, 235, 235, 1);
            color: #393939;
            font-size: 0.2rem;
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
        height: 2px;
        background-color: #ebebeb;
    }
}
</style>
