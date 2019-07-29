<template lang="pug">
    .mine-plan(@click="$router.push('/detail/' + data.planId)")
        .name {{ data.stockName }}
        .code {{ data.stockCode }}
        .data
            .item
                .item__value {{ data.ygMoney | formatMoneyNumberByComma }}
                .item__name {{ $t('common.monthlyMoney') }}({{ moneyUnit }})
            .item
                .item__value {{ data.succeedTime }}
                .item__name {{ $t('other.monthlySuccess') }}{{ $t('mine.times') }}
            .item
                .item__value {{ dateFormat(data) }}
                .item__name {{ $t('other.nextWithhold') }}
        .tag(:class="{pause: data.status === 1, finished: data.status === 2}") {{ data.status | planStatusToText }}
</template>

<script>
import dayjs from 'dayjs'
import {
    planStatusToText,
    formatMoneyNumberByComma,
    moneyTypeToText
} from '../utils/format'
export default {
    name: 'mine-plan',
    props: {
        data: {
            required: true,
            type: Object
        }
    },
    computed: {
        moneyUnit() {
            return moneyTypeToText(this.data.moneyType)
        }
    },
    methods: {
        dateFormat(item) {
            if ([1, 2].includes(item.status)) {
                return '--'
            }
            return dayjs(item.deductMoneyDay).format(
                this.$t('other.dateFormat')
            )
        }
    },
    filters: {
        planStatusToText,
        formatMoneyNumberByComma
    }
}
</script>

<style lang="scss" scoped>
.mine-plan {
    position: relative;
    display: block;
    margin: 20px 18px;
    padding: 14px;
    color: #393939;
    border: 1px solid #ececec;
    border-radius: 8px;
}
.name {
    font-size: 16px;
}
.code {
    font-size: 12px;
    color: rgba(#393939, 0.5);
}
.data {
    margin: 18px 16px 0 0;
    display: flex;
    justify-content: space-between;
    position: relative;
    &:after {
        content: '>';
        position: absolute;
        right: -16px;
        top: 50%;
        transform: translateY(-50%);
    }
}
.item {
    box-sizing: border-box;
    padding-right: 6px;
}
.item__value {
    font-size: 18px;
    margin-bottom: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.item__name {
    font-size: 12px;
    color: rgba(#393939, 0.4);
}
@import '../style/card-tag.less';

/*英文版*/
.is-en-lang {
    .data {
        display: block;
    }
    .item {
        display: inline-block;
        &:first-child {
            display: block;
            margin-bottom: 10px;
        }
        &:last-child {
            margin-left: 40px;
        }
    }
}
</style>
