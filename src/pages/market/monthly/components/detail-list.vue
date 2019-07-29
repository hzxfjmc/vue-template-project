<template lang="pug">
    .detail-list
        .item(v-if="data.status === 0")
            trade-date(:deduct-money-day="data.deductMoneyDay" :deduct-deal-day="data.dealDay")
        .item(v-for="(item, index) in list" :key="item.planDetailId" :class="itemClass(item, index)")
            .line
                .line__date {{ item.createTime }}
                .line__status(@click="$set(item, 'retract', !item.retract)" :class="{reverse: item.retract}") {{ statusToText(item.status) }}
            .card(v-if="[1,5,6,7,8].includes(item.status)" v-show="!item.retract" @click="enterRecord(item)")
                template(v-if="item.status !== 5")
                    .card-item
                        .card-item__name {{ $t('record.withhold') }}
                        .card-item__value {{ item.deductMoney | formatMoneyNumberByComma }}{{ moneyUnit }}
                    .card-item
                        .card-item__name {{ $t('detail.buyIn') }}
                        // 進行中
                        template(v-if="item.status === 1")
                            .card-item__value(v-if="item.failureReason")
                                | {{ $t('detail.failReason', item.failureReason) }}
                                span(v-if="item.lastDealDay") （{{ $t('detail.noLater', item.lastDealDay) }}）
                            .card-item__value(v-else) {{ item.firstDealTime | formatDate }}{{ $t('detail.startBuyIn') }}
                        // 交易失敗
                        .card-item__value(v-if="item.status === 6") {{ $t('detail.fail') }}{{ item.failureReason ? `(${item.failureReason})` : '' }}
                        // 成功、部分成功
                        .card-item__value(v-if="[7,8].includes(item.status)") {{ item.costAvgPrice }}*{{ item.buyNumber }}{{ $t('record.strands') }}
                // 扣款失敗
                .card-item(v-else)
                    .card-item__value {{ $t('other.withholdFail') }}
                img.arrow(src="../../0-images/arrow-03.png" v-if="item.status !== 1")
</template>

<script>
import dayjs from 'dayjs'
import TradeDate from './trade-date'
import { formatMoneyNumberByComma, moneyTypeToText } from '../utils/format'
import { getOrderDicInfo } from '../../0-service/market'
export default {
    name: 'detail-list',
    components: {
        TradeDate
    },
    data() {
        return {
            statusDic: []
        }
    },
    props: {
        data: {
            type: Object,
            required: true
        },
        list: {
            type: Array,
            default: () => {}
        }
    },
    computed: {
        moneyUnit() {
            return moneyTypeToText(this.data.moneyType)
        }
    },
    async created() {
        // 獲取狀態字典
        this.statusDic = await getOrderDicInfo({
            module: 'ygUserPlanDetailStatus'
        })
    },
    methods: {
        itemClass(item, index) {
            return {
                inprogress: item.status === 1,
                fail: [5, 6].includes(item.status),
                success: [7, 8].includes(item.status),
                'has-card': [1, 5, 6, 7, 8].includes(item.status),
                'item--no-boder': index === this.list.length - 1
            }
        },
        statusToText(status) {
            const mapDic = this.statusDic.map(item => [item.value, item.msg])
            const map = new Map(mapDic)
            return map.get(status) || ''
        },
        enterRecord(item) {
            if (item.status !== 1) {
                this.$router.push('/record/' + item.planDetailId)
            }
        }
    },
    filters: {
        formatMoneyNumberByComma,
        formatDate(date) {
            return dayjs(date).format('MM-DD')
        }
    }
}
</script>

<style lang="less" scoped>
.detail-list {
    margin: 0 18px;
}
.item {
    position: relative;
    padding: 0 0 30px 18px;
    overflow: hidden;
    &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 7px;
        width: 6px;
        height: 6px;
        background: #b0b0b0;
        border-radius: 50%;
    }
    &:after {
        content: '';
        position: absolute;
        left: 2.5px;
        top: 18px;
        height: 100%;
        border-left: 1px dashed #ebebeb;
    }
    &.item--no-boder:last-child:after {
        height: 0;
    }
    &.inprogress {
        .line__status {
            color: #393939;
        }
    }
    &.success {
        .line__status {
            color: #41ca1b;
        }
        .card {
            background: #f4fcf3;
        }
    }
    &.fail {
        .line__status {
            color: #fa6112;
        }
        .card {
            background: #fff7f3;
        }
    }
    &.has-card .line__status {
        position: relative;
        padding-right: 21px;
        &:after {
            content: '';
            position: absolute;
            right: 0;
            top: 8px;
            border-style: solid;
            border-width: 7px 7px 0;
            border-color: #9a9a9a transparent transparent;
        }
        &.reverse:after {
            border-width: 0 7px 7px;
            border-color: transparent transparent #9a9a9a;
        }
    }
}
.line {
    display: flex;
    justify-content: space-between;
}
.line__status {
    color: rgba(#393939, 0.4);
}
.card {
    position: relative;
    display: block;
    margin-top: 12px;
    padding: 14px 30px 14px 14px;
    border-radius: 4px;
    background: #f8f8f8;
    color: #393939;
    font-size: 12px;
    box-sizing: content-box;
    .arrow {
        position: absolute;
        top: 50%;
        right: 14px;
        width: 15px;
        height: 15px;
        transform: rotate(-90deg) translateX(50%);
    }
}
.card-item {
    width: 50%;
    display: inline-block;
    vertical-align: top;
}
.card-item__name {
    color: rgba(#393939, 0.4);
}
.card-item__value {
    span {
        font-size: 10px;
        color: rgba(#393939, 0.4);
    }
}
</style>
