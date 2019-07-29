<template lang="pug">
    .trade-date
        .card
            p.card__label {{ $t('other.nextWithholdTime') }}
            p.card__value {{ deductMoneyDay }}
        .card
            p.card__label {{ $t('other.startTradeTime') }}
            p.card__value.card__value--small
                | {{ deductDealDay }}
                br(v-if="$root.isLangEn")
                | {{ $t('other.allDayBatchBuyIn') }}
</template>

<script>
export default {
    name: 'trade-date',
    props: {
        deductMoneyDay: {
            type: String,
            required: true
        },
        deductDealDay: {
            type: String,
            required: true
        }
    }
}
</script>

<style lang="scss" scoped>
.trade-date {
    display: flex;
    justify-content: space-between;
}
.card {
    width: 49%;
    border: 1px solid #ececec;
    border-radius: 8px;
    padding: 8px 2px 8px 9px;
    font-size: 12px;
    line-height: 18px;
    &:last-child {
        .card__label:after {
            background: #00c087;
        }
    }
}
.card__label {
    position: relative;
    color: rgba(#393939, 0.4);
    margin-bottom: 4px;
    line-height: 18px;
    &:after {
        content: '';
        position: absolute;
        left: -9px;
        top: 3px;
        width: 3px;
        height: 12px;
        background: #0055ff;
    }
}
.card__value--small {
    font-size: 11px;
}
</style>
