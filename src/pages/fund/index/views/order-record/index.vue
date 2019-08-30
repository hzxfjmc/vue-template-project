<template lang="pug">
    .order-record-container
        .fund-introduce
            .fund-name {{fundName}}
            .fund-detail
                .fund-detail-item(v-for="(item) in fundDetailList") {{item}}

        .order-record-container
            .order-record-list(v-for="(item,index) in orderRecordList")
                van-cell(class="van-cell-item" to="order-record-detail")
                    template(slot-scope='scope')
                        .order-item.flex
                            span(class="order-type") {{item.type}}
                            span(class="type-value") {{item.typeValue}}
                        .order-item.flex
                            span(class="left-title") {{item.money}}
                            span(class="money-value") {{item.moneyValue}}
                        .order-item.flex
                            span(class="left-title") {{item.time}}
                            span(class="right-title") {{item.timeValue}}
</template>

<script>
import riskAssessmentMixin from '@/mixins/bond/risk-assessment/index.js'
export default {
    mixins: [riskAssessmentMixin],
    data() {
        return {
            fundName: 'Pimco 亚洲投资级债券基金-A2',
            orderRecordList: [
                {
                    type: '申购',
                    typeValue: '交易进行中',
                    money: '金额',
                    moneyValue: 'USD 100,000.00',
                    time: '时间',
                    timeValue: '2019-07-10 15:55:08'
                },
                {
                    type: '申购',
                    typeValue: '交易进行中',
                    money: '金额',
                    moneyValue: 'USD 100,000.00',
                    time: '时间',
                    timeValue: '2019-07-10 15:55:08'
                },
                {
                    type: '申购',
                    typeValue: '交易进行中',
                    money: '金额',
                    moneyValue: 'USD 100,000.00',
                    time: '时间',
                    timeValue: '2019-07-10 15:55:08'
                },
                {
                    type: '申购',
                    typeValue: '交易进行中',
                    money: '金额',
                    moneyValue: 'USD 100,000.00',
                    time: '时间',
                    timeValue: '2019-07-10 15:55:08'
                },
                {
                    type: '申购',
                    typeValue: '交易进行中',
                    money: '金额',
                    moneyValue: 'USD 100,000.00',
                    time: '时间',
                    timeValue: '2019-07-10 15:55:08'
                },
                {
                    type: '申购',
                    typeValue: '交易进行中',
                    money: '金额',
                    moneyValue: 'USD 100,000.00',
                    time: '时间',
                    timeValue: '2019-07-10 15:55:08'
                }
            ],
            fundDetailList: ['债券型', '风险等级 R5']
        }
    }
}
</script>

<style lang="scss" scoped>
.order-record-container {
    .fund-introduce {
        padding: 0 12px;
        height: 72px;
        background-color: $background-color;
        margin-bottom: 10px;
        .fund-name {
            font-size: 16px;
            line-height: 22px;
            padding-top: 15px;
            margin-bottom: 6px;
        }
        .fund-detail {
            display: flex;
            flex-direction: row;
            .fund-detail-item {
                padding: 0 4px;
                font-size: 10px;
                color: $level-text-color;
                height: 16px;
                line-height: 14px;
                border-radius: 1px;
                opacity: 0.79;
                border: 1px solid $primary-color;
                margin-right: 10px;
            }
        }
    }
    .order-record-container {
        .order-record-list {
            border-bottom: 1px solid rgba($color: $tip-color, $alpha: 0.05);
            .van-cell-item {
                .order-item {
                    span {
                        margin-bottom: 10px;
                        font-size: 14px;
                        color: rgba($color: $text-color, $alpha: 0.5);
                        &.order-type {
                            font-size: 16px;
                            color: $text-color;
                        }
                        &.money-value {
                            color: $text-color;
                        }
                        &.type-value {
                            color: $cell-right-color;
                        }
                    }
                }
            }
        }
    }
}
</style>
