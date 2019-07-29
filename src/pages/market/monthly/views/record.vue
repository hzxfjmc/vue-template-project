<template lang="pug">
    .record
        template(v-if="plan")
            .header
                .stock
                    .stock__name {{ stockName }}
                    .stock__code {{ stockCode }}
                .status(:class="{success: [7,8].includes(plan.status), fail: [5,6].includes(plan.status)}")
                    .status__main {{ statusText }}
            // 扣款
            .data(v-if="plan" :class="{fail: plan.status === 5}")
                .data-header
                    .data-header__title {{ $t('record.withhold') }}
                    .data-header__time {{ plan.createTime }}
                .item
                    .item__name {{ $t('record.status') }}
                    .item__value {{ $t('record.deductStatusToText', plan.deductStatus) }}
                .item
                    .item__name {{ $t('record.currency') }}
                    .item__value {{ plan.moneyType | moneyTypeToText }}
                .item
                    .item__name {{ $t('record.method') }}
                    .item__value {{ $t('record.deductCanUsed') }}
                .item
                    .item__name {{ $t('record.sum') }}
                    .item__value {{ plan.deductMoney | formatMoneyNumberByComma }}
                .card(v-if="showTransfer()")
                    .card__item
                        span {{ plan.moneyType | moneyTypeToText }}
                        span {{ currMoney | formatMoneyNumberByComma }}{{ plan.moneyType | moneyTypeToText }}
                    .card__item
                        span {{ exchangeUnit }}({{ $t('common.autoSwap') }})
                        span {{ exchangeMoney | formatMoneyNumberByComma }}{{ exchangeUnit }}
                .card(v-if="plan.failureReason")
                    .card__item
                        span {{ $t('detail.failReason', plan.failureReason) }}（{{ $t('detail.noLater', plan.lastDealDay) }}）
            // 交易
            template(v-if="entrust")
                .data(v-for="item in entrust" :key="item.allotId" :class="{fail: item.dealStatus === 1}")
                    .data-header
                        .data-header__title {{ $t('record.trade') }}
                        .data-header__time {{ item.dealTime }} {{ $t('record.batchBuyIn') }}
                    .item
                        .item__name {{ $t('record.status') }}
                        .item__value {{ $t('record.dealStatusToText', item.dealStatus) }}
                    template(v-if="item.dealStatus === 0")
                        .item
                            .item__name {{ $t('record.dealAvgPrice') }}
                            .item__value {{ item.avgPrice | formatMoneyNumberByComma }}
                        .item
                            .item__name {{ $t('record.dealAccount') }}
                            .item__value {{ item.succeedNumber }}{{ $t('record.strands') }}
                        .item
                            .item__name {{ $t('record.dealMoney') }}
                            .item__value {{ item.succeedMoney | formatMoneyNumberByComma }}
                        .item
                            .item__name {{ $t('record.totalCost') }}
                            .item__value(@click="getFareDetail(item)" :class="{spread: item.spread, retract: !item.spread}") {{ item.feeAmount | formatMoneyNumberByComma }}
                        .card(v-if="item.fareDetail" v-show="item.spread")
                            template(v-if="plan.moneyType === 2")
                                .card__item
                                    span {{ $t('record.fare1_hk') }}
                                    span {{ item.fareDetail.fare1 | formatFare }}
                                .card__item
                                    span {{ $t('record.fare9') }}
                                    span {{ item.fareDetail.fare9 | formatFare }}
                                .card__item
                                    span {{ $t('record.fare2_hk') }}
                                    span {{ item.fareDetail.fare2 | formatFare }}
                                .card__item
                                    span {{ $t('record.fare3_hk') }}
                                    span {{ item.fareDetail.fare3 | formatFare }}
                                .card__item
                                    span {{ $t('record.fare7') }}
                                    span {{ item.fareDetail.fare7 | formatFare }}
                            template(v-else)
                                .card__item
                                    span {{ $t('record.fare2_us') }}
                                    span {{ item.fareDetail.fare2 | formatFare }}
                                .card__item
                                    span {{ $t('record.fare3_us') }}
                                    span {{ item.fareDetail.fare3 | formatFare }}
                                .card__item
                                    span {{ $t('record.fare1_us') }}
                                    span {{ item.fareDetail.fare1 | formatFare }}
                            .card__divider
                            .card__item
                                span {{ $t('record.fare0') }}
                                span {{ item.fareDetail.fare0 | formatFare }}
                            .card__item
                                span {{ $t('record.fare6') }}
                                span {{ item.fareDetail.fare6 | formatFare }}
            // 退款
            .data(v-if="refund")
                .data-header
                    .data-header__title {{ $t('record.refund') }}
                    .data-header__time {{ refund.refundSuccessTime }}
                .item
                    .item__name {{ $t('record.sum') }}
                    .item__value {{ refund.refundMoney }}
                .item
                    .item__name {{ $t('record.status') }}
                    .item__value {{ $t('record.refundStatusToText', refund.refundStatus) }}
        no-data(v-else :text="$t('common.nodata')")
</template>

<script>
import NoData from '../../0-components/no-data'
import { formatMoneyNumberByComma, moneyTypeToText } from '../utils/format'
import {
    getMonthlyStockDealDetail,
    getMonthlyStockEntrust
} from '../../0-service/market'
import { Toast } from 'vant'
export default {
    name: 'record',
    components: {
        NoData
    },
    data() {
        return {
            statusDic: [
                { value: 5, msg: this.$t('record.fail') },
                { value: 6, msg: this.$t('record.fail') },
                { value: 7, msg: this.$t('record.success') },
                { value: 8, msg: this.$t('record.partSuccess') }
            ],
            stockName: '',
            stockCode: '',
            plan: null,
            entrust: null,
            refund: null
        }
    },
    computed: {
        statusText() {
            const status = this.plan ? this.plan.status : null
            const mapDic = this.statusDic.map(item => [item.value, item.msg])
            const map = new Map(mapDic)
            return map.get(status) || ''
        },
        // 换汇前的金额
        currMoney() {
            if (!this.plan || !this.plan.deductResult) {
                return ''
            }
            const res = JSON.parse(this.plan.deductResult)
            return parseFloat(res[this.plan.moneyType])
        },
        // 换汇金额
        exchangeMoney() {
            if (!this.plan || !this.plan.deductResult) {
                return ''
            }
            const res = JSON.parse(this.plan.deductResult)
            const keys = Object.keys(res)
            const key = keys.find(
                item => parseInt(item) !== this.plan.moneyType
            )
            const money = res[key]
            return parseFloat(money)
        },
        // 换汇单位
        exchangeUnit() {
            if (!this.plan || !this.plan.deductResult) {
                return ''
            }
            const res = JSON.parse(this.plan.deductResult)
            const keys = Object.keys(res)
            const key = keys.find(
                item => parseInt(item) !== this.plan.moneyType
            )
            return moneyTypeToText(parseInt(key))
        }
    },
    async mounted() {
        this.init()
    },
    methods: {
        async init() {
            const data = await getMonthlyStockDealDetail({
                planDetailId: this.$route.params.planDetailId
            })
            this.stockName = data.stockName
            this.stockCode = data.stockCode
            this.plan = data.ygPlanDetailResponse
            this.entrust = data.ygPlanEntrustResponses
            this.refund = data.ygRefundResponse
        },
        async getFareDetail(item) {
            if (item.fareDetail) {
                this.$set(item, 'spread', !item.spread)
                return
            }
            try {
                const data = await getMonthlyStockEntrust({
                    allotId: item.allotId,
                    planDetailId: this.$route.params.planDetailId
                })
                this.$set(item, 'fareDetail', data)
                this.$set(item, 'spread', !item.spread)
            } catch (e) {
                Toast(e.msg || this.$t('common.errorTips'))
            }
        },
        // 是否显示换汇
        showTransfer() {
            if (!this.plan.deductResult) {
                return false
            }
            const res = JSON.parse(this.plan.deductResult)
            const len = Object.keys(res).length
            return len === 2
        }
    },
    filters: {
        moneyTypeToText,
        formatMoneyNumberByComma,
        formatFare(fare) {
            return typeof fare === 'number' ? fare.toFixed(2) : '--'
        }
    }
}
</script>

<style lang="less" scoped>
.record {
    margin: 0 18px;
    color: #393939;
}
.header {
    display: flex;
    justify-content: space-between;
    margin: 16px 0 30px;
}
.stock {
    &__name {
        font-size: 22px;
    }
    &__code {
        font-size: 12px;
        color: rgba(#393939, 0.4);
    }
}
.status {
    text-align: right;
    &.success {
        color: #41ca1e;
    }
    &.fail {
        color: #fa6112;
    }
    &__main {
        font-size: 22px;
    }
}
.data {
    margin-bottom: 20px;
    font-size: 14px;
    &.fail {
        .item__value {
            color: rgba(#393939, 0.4);
        }
    }
}
.item__value {
    &.spread:after,
    &.retract:after {
        content: '';
        display: inline-block;
        margin-left: 10px;
        border-style: solid;
    }
    &.spread:after {
        border-width: 0 7px 7px;
        border-color: transparent transparent #c4c4c4;
    }
    &.retract:after {
        border-width: 7px 7px 0;
        border-color: #c4c4c4 transparent transparent;
    }
}
.data-header {
    display: flex;
    justify-content: space-between;
    line-height: 28px;
    margin-bottom: 14px;
}
.data-header__title {
    font-size: 20px;
}
.item {
    display: flex;
    justify-content: space-between;
    margin: 0 0 10px 12px;
}
.item__name {
    color: rgba(#393939, 0.4);
}
.card {
    margin-left: 20px;
    padding: 14px;
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    margin-bottom: 10px;
}
.card__item {
    display: flex;
    justify-content: space-between;
    color: rgba(#393939, 0.4);
    margin-bottom: 10px;
    &:last-child {
        margin-bottom: 0;
    }
}
.card__divider {
    border-bottom: 1px dashed #e6e6e6;
    margin-bottom: 10px;
}
</style>
