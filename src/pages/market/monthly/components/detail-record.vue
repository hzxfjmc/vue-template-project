<template lang="pug">
    .detail-record
        .title {{ $t('detail.ygRecord') }}
        .data
            .item
                .item__value
                    | {{ data.succeedTime }}
                    span {{ $t('other.times') }}
                .item__name {{ $t('other.monthlySuccess') }}
            .item
                .item__value
                    | {{ data.succeedNumber }}
                    span {{ $t('record.strands') }}
                .item__name {{ $t('detail.accBuyCount') }}
            .item
                .item__value
                    | {{ data.costAvgPrice }}
                    span {{ moneyUnit }}
                .item__name {{ $t('detail.avgBuyPrice') }}
</template>

<script>
import { moneyTypeToText } from '../utils/format'
export default {
    name: 'detail-record',
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    computed: {
        moneyUnit() {
            return moneyTypeToText(this.data.moneyType)
        }
    }
}
</script>

<style lang="less" scoped>
.detail-record {
    margin: 0 18px 30px;
}
.title {
    font-size: 20px;
    margin-bottom: 14px;
}
.data {
    display: flex;
    justify-content: space-between;
}
.item {
    text-align: center;
}
.item__value {
    font-size: 20px;
    margin-bottom: 2px;
    span {
        font-size: 10px;
        color: rgba(#393939, 0.4);
    }
}
.item__name {
    font-size: 12px;
    color: rgba(#393939, 0.4);
}
/*英文版*/
.is-en-lang {
    .item {
        width: 33.33%;
    }
}
</style>
