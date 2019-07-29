<template lang="pug">
    .detail-card
        .card__name {{ data.stockName }}
        .card__code {{ data.stockCode }}
        .data
            .item
                .item__value {{ data.ygMoney | formatMoneyNumberByComma }}
                .item__name {{ $t('common.monthlyMoney') }}({{ moneyUnit }})
            .item
                .item__value {{ $t('edit.daysPerMonth', data.sourceDealDay || '--') }}
                .item__name {{ $t('detail.withholdTime') }}
            .item
                .item__value.item__value--small {{ $t('detail.nextTradeDate') }}
                .item__name {{ $t('detail.buyTime') }}
        p.card__transfer(v-if="data.autoExchange !== 1" @click="showTranser=true") {{ $t('detail.openedTransfer') }} &gt;
        .tag(:class="{pause: data.status === 1, finished: data.status === 2}") {{ data.status | planStatusToText }}
        // 换汇提示
        van-dialog.dialog(v-model="showTranser" :title="$t('common.autoSwap')" :confirm-button-text="$t('edit.confirm')")
            .transfer
                p.main-text {{ $t('edit.autoSwap_2') }}
                p.sub-text {{ $t('edit.autoSwap_3') }}
</template>

<script>
import {
    moneyTypeToText,
    formatMoneyNumberByComma,
    planStatusToText
} from '../utils/format'
export default {
    name: 'detail-card',
    data() {
        return {
            showTranser: false
        }
    },
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
    },
    filters: {
        planStatusToText,
        formatMoneyNumberByComma
    }
}
</script>

<style lang="less" scoped>
.detail-card {
    position: relative;
    margin: 14px 18px 20px;
    padding: 14px 14px 32px;
    color: #fff;
    background: #6e9dff;
    border-radius: 10px;
}
.card__name {
    font-size: 18px;
}
.card__code {
    font-size: 12px;
    color: rgba(#fff, 0.5);
}
.data {
    display: flex;
    justify-content: space-between;
    margin-top: 18px;
}
.item__value {
    font-size: 18px;
    line-height: 22px;
    margin-bottom: 4px;
    &.item__value--small {
        font-size: 12px;
    }
}
.item__name {
    font-size: 12px;
    color: rgba(#fff, 0.4);
}
.card__transfer {
    position: absolute;
    left: 14px;
    bottom: 9px;
    font-size: 12px;
    line-height: 18px;
    height: 20px;
    border: 1px solid rgba(#fff, 0.4);
    border-radius: 4px;
    padding: 0 6px;
}
@import '../style/card-tag.less';
.dialog {
    color: #393939;
}
.transfer {
    padding: 0 24px 16px;
    color: #393939;
    .main-text {
        margin: 10px 0;
    }
    .sub-text {
        opacity: 0.4;
    }
}
/*英文版*/
.is-en-lang {
    .data {
        display: block;
    }
    .item {
        margin-bottom: 10px;
    }
    .item__value {
        &.item__value--small {
            font-size: 18px;
        }
    }
}
</style>
