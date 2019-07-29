<template lang="pug">
.cell-info
    .cell-box
        .cell-item.flex
            .left
                span.cell-title {{conversionForm.stockName}}
            .right {{conversionForm.statusName}}
        .cell-item.flex
            .left  {{$t('可供股數')}}
            .right {{conversionForm.registAmount}}{{$t('share')}}
        .cell-item.flex
            .left {{$t('供股價')}}
            .right {{conversionForm.reinvestmentPrice|formatCurrency}}{{$t('港幣')}}
        .cell-item.flex
            .left {{$t('賬戶可取金額')}}
            .right {{withdrawBalance|formatCurrency}}{{$t('港幣')}}
        .cell-item.flex
            .left {{$t('選择供股數')}}
            .right {{conversionForm.selectionQty}}{{$t('share')}}
        .cell-item.flex
            .left {{$t('手續費')}}
            .right {{conversionForm.fee|formatCurrency}}{{$t('港幣')}}
        .cell-item.flex
            .left {{$t('供股總費用')}}
            .right {{(conversionForm.selectionQty * conversionForm.reinvestmentPrice + conversionForm.fee)|formatCurrency}}{{$t('港幣')}}
</template>

<script>
export default {
    keepalive: true,
    i18n: {
        zhCHS: {
            選择供股數: '选择供股数'
        },
        zhCHT: {
            選择供股數: '選择供股數'
        },
        en: {
            選择供股數: 'Choose the number of shares'
        }
    },
    props: {
        conversionForm: {
            type: Object,
            default: () => {
                return {}
            }
        },
        curName: {
            type: String,
            default: ''
        },
        withdrawBalance: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" scoped>
.cell-info {
    .cell-title {
        font-weight: 500;
        font-size: 16px;
        line-height: 22px;
        color: rgba(53, 53, 71, 1);
    }
    .cell-item {
        padding-top: 10px;
        .left {
            color: $text-color5;
        }
    }
    .speci {
        padding-top: 20px;
        .left {
            font-size: 18px;
            color: rgba(53, 53, 71, 1);
        }
    }

    .van-cell {
        padding: 0;
        font-size: 18px;
        width: 110px;
    }
    .cell-box {
        padding: $global-padding 0;
    }

    .cell-box:last-child {
        border: 0;
    }
    .a-tips {
        display: flex;
        align-items: center;
        padding-left: 5px;
        height: 32px;
        .text-color5 {
            font-size: 12px;
            padding-left: 5px;
        }
    }
}
</style>
