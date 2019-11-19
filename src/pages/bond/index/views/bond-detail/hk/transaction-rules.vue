<template lang="pug">
    .detail-transaction-rules-wrapper
        .yx-cell(style="padding-top:0")
            .yx-cell__header {{ $t('tradingTime') }}：
            .yx-cell__content {{ $t('tradingTimeTips') }}
        .yx-cell
            .yx-cell__header {{ $t('tradingTime') }}：
            .yx-cell__content XXXXXXX

</template>
<script>
export default {
    i18n: {
        zhCHS: {
            tradingTime: '交易时间',
            tradingTimeTips:
                '同美股，北京时间21:30-4:00(夏令时)或22:30-5:00(冬令时)',
            charges: '交易费用'
        },
        zhCHT: {
            tradingTime: '交易時間',
            tradingTimeTips:
                '同美股，北京时間21:30-4:00（夏令時）或22:30-5:00（冬令時）',
            charges: '交易費用'
        },
        en: {
            tradingTime: 'Trading Time',
            tradingTimeTips:
                '同美股，北京时间21:30-4:00(夏令时)或22:30-5:00(冬令时)',
            charges: 'Charges'
        }
    },
    name: 'TransactionRules'
}
</script>
<style lang="scss" scoped>
.detail-transaction-rules-wrapper {
    margin-top: 9px;
    padding-bottom: 7px;
    .yx-cell {
        display: flex;
        padding: 7px 14px;
        color: rgba($color: $hk-text-color, $alpha: 0.6);
        font-size: 0.24rem;
        line-height: 20px;
    }
    .yx-cell__content {
        flex: 1;
    }
    .yx-cell__header {
        width: 65px;
    }
    .yx-cell + .yx-cell {
        padding-top: 0;
    }
}
</style>
